import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createContactHandler } from '../server/contact.mjs';
const origin = 'http://localhost:4321';
const input = {
  name: 'Example Person',
  email: 'example@example.com',
  organisation: 'Fictional company',
  service: 'power-bi',
  website: 'https://example.com',
  message: 'A fictional reporting question for a test.',
  requestId: '12345678-1234-4321-aaaa-123456789abc',
};
const request = (body = input, headers = {}) =>
  new Request(origin + '/api/contact', {
    method: 'POST',
    headers: { origin, 'content-type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
const production = {
  BUILD_MODE: 'production',
  CONTACT_ALLOWED_ORIGIN: origin,
  RESEND_API_KEY: 'test-only-not-a-credential',
  CONTACT_FROM: 'Test <test@example.com>',
  CONTACT_TO: 'owner@example.com',
};
test('invalid fields produce associated errors before any provider call', async () => {
  let calls = 0;
  const h = createContactHandler({
    env: production,
    fetchImpl: async () => {
      calls++;
      throw Error();
    },
  });
  const r = await h(
    request({
      ...input,
      email: 'wrong',
      message: 'short',
      service: 'unlisted',
      website: 'javascript:alert(1)',
    }),
  );
  assert.equal(r.status, 400);
  const b = await r.json();
  assert.deepEqual(Object.keys(b.errors).sort(), ['email', 'message', 'service', 'website']);
  assert.equal(calls, 0);
});
test('unconfigured preview never accepts a lead', async () => {
  const h = createContactHandler({ env: { CONTACT_ALLOWED_ORIGIN: origin } });
  const r = await h(request());
  assert.equal(r.status, 503);
  assert.equal((await r.json()).accepted, undefined);
});
test('cross-origin requests, honeypot and oversized input rejected', async () => {
  const h = createContactHandler({ env: production });
  assert.equal((await h(request(input, { origin: 'https://attacker.example' }))).status, 403);
  assert.equal((await h(request({ ...input, companyfax: 'bot' }))).status, 400);
  assert.equal((await h(request({ ...input, message: 'x'.repeat(17000) }))).status, 413);
});
test('successful simulated preview is explicitly labelled', async () => {
  const h = createContactHandler({
    env: { PREVIEW_CONTACT_MODE: 'success', CONTACT_ALLOWED_ORIGIN: origin },
  });
  const r = await h(request());
  assert.equal(r.status, 200);
  assert.equal((await r.json()).preview, true);
});
test('preview provider failure is honest', async () => {
  const h = createContactHandler({
    env: { PREVIEW_CONTACT_MODE: 'failure', CONTACT_ALLOWED_ORIGIN: origin },
  });
  assert.equal((await h(request())).status, 502);
});
test('production ignores preview mock and requires provider configuration', async () => {
  const h = createContactHandler({
    env: {
      BUILD_MODE: 'production',
      PREVIEW_CONTACT_MODE: 'success',
      CONTACT_ALLOWED_ORIGIN: origin,
    },
  });
  assert.equal((await h(request())).status, 503);
});
test('provider acceptance requires an id; repeated concurrent submission uses one request', async () => {
  let calls = 0;
  let sent;
  const h = createContactHandler({
    env: production,
    fetchImpl: async (url, options) => {
      calls++;
      sent = { url, options };
      await new Promise((r) => setTimeout(r, 5));
      return Response.json({ id: 'test-message' });
    },
  });
  const results = await Promise.all([h(request()), h(request())]);
  assert.equal(calls, 1);
  for (const r of results) {
    assert.equal(r.status, 200);
    assert.equal((await r.json()).accepted, true);
  }
  assert.equal(sent.url, 'https://api.resend.com/emails');
  assert.equal(sent.options.headers['Idempotency-Key'], 'efiops-' + input.requestId);
  assert.equal(JSON.parse(sent.options.body).reply_to, input.email);
  assert.equal((await h(request({ ...input, message: 'Changed request text.' }))).status, 409);
});
test('provider rejection, missing acceptance and timeout never become success', async () => {
  for (const fn of [
    async () => Response.json({ error: 'rejected' }, { status: 422 }),
    async () => Response.json({}),
    async () => {
      throw new DOMException('Timeout', 'TimeoutError');
    },
  ]) {
    const h = createContactHandler({ env: production, fetchImpl: fn });
    const r = await h(request());
    assert.equal(r.status, 502);
    assert.equal((await r.json()).accepted, undefined);
  }
});
test('failed provider request can be retried with the same id', async () => {
  let calls = 0;
  const h = createContactHandler({
    env: production,
    fetchImpl: async () =>
      ++calls === 1 ? new Response('', { status: 500 }) : Response.json({ id: 'accepted' }),
  });
  assert.equal((await h(request())).status, 502);
  assert.equal((await h(request())).status, 200);
  assert.equal(calls, 2);
});
test('rate limit expires and does not silently accept blocked submissions', async () => {
  let time = 0;
  const h = createContactHandler({ env: { CONTACT_ALLOWED_ORIGIN: origin }, now: () => time });
  for (let i = 0; i < 10; i++) assert.equal((await h(request())).status, 503);
  assert.equal((await h(request())).status, 429);
  time = 60001;
  assert.equal((await h(request())).status, 503);
});
test('non-JavaScript failure retains escaped input without sending it', async () => {
  const h = createContactHandler({ env: { CONTACT_ALLOWED_ORIGIN: origin } });
  const r = await h(
    new Request(origin + '/api/contact', {
      method: 'POST',
      headers: { origin, 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ ...input, message: '<script>alert(1)</script>' }),
    }),
  );
  assert.equal(r.status, 503);
  const html = await r.text();
  assert.match(html, /&lt;script&gt;/);
  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /example@example.com/);
});
