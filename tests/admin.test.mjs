import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { supabaseConfig } from '../server/supabase.mjs';
import { createAdminHandler } from '../server/admin.mjs';
import { createDemoStore } from '../server/admin-store.mjs';
import { createContactHandler } from '../server/contact.mjs';
const origin = 'http://localhost:4321';
const request = (route, method = 'GET', body, cookie = '', customOrigin = origin) =>
  new Request(origin + '/api/admin/' + route, {
    method,
    headers: { origin: customOrigin, cookie, 'content-type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
const input = {
  name: 'Test customer',
  email: 'test@example.com',
  message: 'We would like a clearer reporting view.',
  service: 'power-bi',
};
const cookies = (response) =>
  response.headers
    .getSetCookie()
    .map((s) => s.split(';')[0])
    .join('; ');
test('demo authentication, persistent records, conflict checks and safe inputs', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'efiops-admin-'));
  try {
    const store = createDemoStore(path.join(dir, 'demo.json'));
    const handler = createAdminHandler({ env: {}, allowDemo: true, store });
    assert.equal((await handler(request('enquiries'))).status, 401);
    assert.equal(
      (await handler(request('demo', 'POST', {}, '', 'https://attacker.example'))).status,
      403,
    );
    const signed = await handler(request('demo', 'POST', {}));
    const cookie = cookies(signed);
    assert.match(signed.headers.get('set-cookie'), /HttpOnly/);
    assert.match(signed.headers.get('set-cookie'), /SameSite=Strict/);
    const created = await handler(request('enquiries', 'POST', input, cookie));
    assert.equal(created.status, 201);
    const { enquiry } = await created.json();
    assert.equal(enquiry.stage, 'opportunity');
    const moved = await handler(
      request('enquiries/' + enquiry.id, 'PATCH', { stage: 'understand', version: 1 }, cookie),
    );
    assert.equal(moved.status, 200);
    assert.equal(
      (
        await handler(
          request('enquiries/' + enquiry.id, 'PATCH', { stage: 'agree', version: 1 }, cookie),
        )
      ).status,
      409,
    );
    assert.equal(
      (
        await handler(
          request('enquiries/' + enquiry.id, 'PATCH', { stage: 'invented', version: 2 }, cookie),
        )
      ).status,
      400,
    );
    assert.equal(
      (
        await handler(
          request('enquiries/' + enquiry.id, 'PATCH', { source: 'website', version: 2 }, cookie),
        )
      ).status,
      400,
    );
    assert.equal(
      (
        await handler(
          request('enquiries', 'POST', { ...input, website: 'javascript:alert(1)' }, cookie),
        )
      ).status,
      400,
    );
    await handler(
      request('enquiries/' + enquiry.id + '/notes', 'POST', { body: 'A private note' }, cookie),
    );
    const reloaded = createDemoStore(path.join(dir, 'demo.json'));
    const record = await reloaded.detail(enquiry.id);
    assert.equal(record.enquiry.stage, 'understand');
    assert.equal(record.enquiry.service, 'power-bi');
    assert.equal(record.enquiry.follow_up_date, null);
    assert.equal(
      record.activity.some((a) => a.body === 'A private note'),
      true,
    );
    await handler(request('logout', 'POST', {}, cookie));
    assert.equal((await handler(request('enquiries', 'GET', undefined, cookie))).status, 401);
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
});
test('deployed handler never permits demo access or accepts a forged session', async () => {
  const h = createAdminHandler({
    env: { BUILD_MODE: 'production', ADMIN_MODE: 'demo' },
    allowDemo: true,
  });
  assert.equal((await h(request('demo', 'POST', {}))).status, 403);
  assert.equal((await h(request('enquiries', 'GET', undefined, 'efiops_demo=forged'))).status, 503);
});
test('Supabase sign-in checks confirmed email and database membership; customer requests use user token', async () => {
  const env = {
    BUILD_MODE: 'preview',
    ADMIN_MODE: 'supabase',
    ADMIN_ALLOWED_ORIGIN: origin,
    ADMIN_EMAIL: 'owner@example.com',
    SUPABASE_URL: 'https://project.supabase.co',
    SUPABASE_PUBLISHABLE_KEY: 'public-test-key',
    SUPABASE_SECRET_KEY: 'secret-never-use-for-admin',
  };
  const user = {
    id: '11111111-1111-4111-8111-111111111111',
    email: 'owner@example.com',
    email_confirmed_at: '2026-10-04',
  };
  let allowed = true;
  const calls = [];
  const fetchImpl = async (url, opts) => {
    calls.push({ url, opts });
    assert.notEqual(opts.headers.apikey, env.SUPABASE_SECRET_KEY);
    if (url.includes('/token?'))
      return Response.json({
        access_token: 'user-access-token',
        refresh_token: 'user-refresh-token',
        user,
        expires_in: 3600,
      });
    if (url.endsWith('/user')) return Response.json(user);
    if (url.includes('/rpc/efiops_is_admin')) return Response.json(allowed);
    if (url.includes('/enquiries?')) return Response.json([]);
    return Response.json({});
  };
  const h = createAdminHandler({ env, fetchImpl });
  assert.equal((await h(request('enquiries'))).status, 401);
  const signed = await h(
    request('login', 'POST', { email: user.email, password: 'test-password' }),
  );
  assert.equal(signed.status, 200);
  const cookie = cookies(signed);
  assert.equal((await h(request('enquiries', 'GET', undefined, cookie))).status, 200);
  assert.equal(
    calls.find((c) => c.url.includes('/enquiries?')).opts.headers.Authorization,
    'Bearer user-access-token',
  );
  allowed = false;
  assert.equal((await h(request('enquiries', 'GET', undefined, cookie))).status, 403);
  assert.equal(
    (await h(request('login', 'POST', { email: user.email, password: 'test-password' }))).status,
    403,
  );
});
test('database intake starts at Opportunity and acknowledges only a confirmed save', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'efiops-intake-'));
  try {
    const store = createDemoStore(path.join(dir, 'demo.json'));
    const h = createContactHandler({
      env: { PREVIEW_CONTACT_MODE: 'dashboard', CONTACT_ALLOWED_ORIGIN: origin },
      demoStore: store,
    });
    const contact = () =>
      new Request(origin + '/api/contact', {
        method: 'POST',
        headers: { origin, 'content-type': 'application/json' },
        body: JSON.stringify({ ...input, requestId: '12345678-1234-4321-aaaa-123456789abc' }),
      });
    const response = await h(contact());
    assert.equal(response.status, 200);
    assert.equal((await response.json()).savedToDashboard, true);
    await h(contact());
    const items = (await store.list()).items.filter((e) => e.email === input.email);
    assert.equal(items.length, 1);
    assert.equal(items[0].stage, 'opportunity');
    const restarted = createContactHandler({
      env: { PREVIEW_CONTACT_MODE: 'dashboard', CONTACT_ALLOWED_ORIGIN: origin },
      demoStore: createDemoStore(path.join(dir, 'demo.json')),
    });
    await restarted(contact());
    assert.equal((await store.list()).items.filter((e) => e.email === input.email).length, 1);
    const prod = createContactHandler({
      env: {
        BUILD_MODE: 'production',
        CONTACT_STORAGE: 'supabase',
        CONTACT_ALLOWED_ORIGIN: origin,
        SUPABASE_URL: 'https://project.supabase.co',
        SUPABASE_PUBLISHABLE_KEY: 'public-test-key',
        SUPABASE_SECRET_KEY: 'secret-test-key',
      },
      fetchImpl: async () => Response.json({ message: 'Database unavailable' }, { status: 503 }),
    });
    assert.equal((await prod(contact())).status, 502);
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
});

test('production sign-in requires HTTPS, confirmed owner identity and Secure cookies', async () => {
  const secureOrigin = 'https://efiops.com';
  const user = {
    id: '11111111-1111-4111-8111-111111111111',
    email: 'owner@example.com',
    email_confirmed_at: '2026-10-04',
  };
  const env = {
    BUILD_MODE: 'production',
    ADMIN_MODE: 'supabase',
    ADMIN_ALLOWED_ORIGIN: secureOrigin,
    ADMIN_EMAIL: user.email,
    SUPABASE_URL: 'https://project.supabase.co',
    SUPABASE_PUBLISHABLE_KEY: 'public-test-key',
  };
  const fetchImpl = async (url) =>
    url.includes('/token?')
      ? Response.json({
          access_token: 'owner-token',
          refresh_token: 'refresh',
          expires_in: 3600,
          user,
        })
      : url.includes('/efiops_is_admin')
        ? Response.json(true)
        : Response.json({});
  const h = createAdminHandler({ env, fetchImpl });
  let result = await h(
    request('login', 'POST', { email: user.email, password: 'test' }, '', secureOrigin),
  );
  assert.equal(result.status, 200);
  assert.equal(
    result.headers.getSetCookie().every((c) => c.includes('; Secure')),
    true,
  );
  user.email_confirmed_at = null;
  assert.equal(
    (await h(request('login', 'POST', { email: user.email, password: 'test' }, '', secureOrigin)))
      .status,
    403,
  );
  user.email_confirmed_at = '2026-10-04';
  user.email = 'someone-else@example.com';
  assert.equal(
    (await h(request('login', 'POST', { email: user.email, password: 'test' }, '', secureOrigin)))
      .status,
    403,
  );
  const insecure = createAdminHandler({ env: { ...env, ADMIN_ALLOWED_ORIGIN: origin }, fetchImpl });
  assert.equal(
    (await insecure(request('login', 'POST', { email: 'owner@example.com', password: 'test' })))
      .status,
    503,
  );
});
test('invalid Supabase session is not trusted and logout clears cookies during a provider outage', async () => {
  const env = {
    BUILD_MODE: 'preview',
    ADMIN_MODE: 'supabase',
    ADMIN_ALLOWED_ORIGIN: origin,
    ADMIN_EMAIL: 'owner@example.com',
    SUPABASE_URL: 'https://project.supabase.co',
    SUPABASE_PUBLISHABLE_KEY: 'public-test-key',
  };
  const h = createAdminHandler({
    env,
    fetchImpl: async () => Response.json({ message: 'Invalid token' }, { status: 401 }),
  });
  const rejected = await h(
    request('enquiries', 'GET', undefined, 'efiops_access=forged; efiops_refresh=forged'),
  );
  assert.equal(rejected.status, 401);
  assert.match(rejected.headers.get('set-cookie'), /Max-Age=0/);
  const failed = createAdminHandler({
    env,
    fetchImpl: async () => {
      throw Error('Provider unavailable');
    },
  });
  const logout = await failed(request('logout', 'POST', {}, 'efiops_access=expired'));
  assert.equal(logout.status, 200);
  assert.match(logout.headers.get('set-cookie'), /Max-Age=0/);
});
test('Supabase contact acceptance requires the protected intake acknowledgement and preserves deduplication', async () => {
  let calls = 0;
  const env = {
    BUILD_MODE: 'production',
    CONTACT_STORAGE: 'supabase',
    CONTACT_ALLOWED_ORIGIN: origin,
    SUPABASE_URL: 'https://project.supabase.co',
    SUPABASE_PUBLISHABLE_KEY: 'public-test-key',
    SUPABASE_SECRET_KEY: 'sb_secret_test-only',
  };
  const h = createContactHandler({
    env,
    fetchImpl: async (url, opts) => {
      calls++;
      assert.match(url, /\/rpc\/intake_enquiry$/);
      assert.equal(opts.headers.apikey, env.SUPABASE_SECRET_KEY);
      const body = JSON.parse(opts.body);
      assert.equal(body.payload.stage, 'opportunity');
      assert.match(body.submission_fingerprint, /^[a-f0-9]{64}$/);
      return Response.json({ id: '11111111-1111-4111-8111-111111111111' });
    },
  });
  const contact = () =>
    new Request(origin + '/api/contact', {
      method: 'POST',
      headers: { origin, 'content-type': 'application/json' },
      body: JSON.stringify({ ...input, requestId: '12345678-1234-4321-aaaa-123456789abc' }),
    });
  assert.equal((await (await h(contact())).json()).accepted, true);
  assert.equal((await (await h(contact())).json()).accepted, true);
  assert.equal(calls, 1);
});

test('a server-secret key cannot be misconfigured as the admin public key', () => {
  const base = { SUPABASE_URL: 'https://project.supabase.co' };
  assert.throws(() => supabaseConfig({ ...base, SUPABASE_PUBLISHABLE_KEY: 'sb_secret_test-only' }));
  const serviceJWT =
    'eyJ0eXAiOiJKV1QifQ.' +
    Buffer.from(JSON.stringify({ role: 'service_role' })).toString('base64url') +
    '.test';
  assert.throws(() => supabaseConfig({ ...base, SUPABASE_ANON_KEY: serviceJWT }));
});
