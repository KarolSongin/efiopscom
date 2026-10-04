import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { enquirySchema, patchSchema, noteSchema } from './admin-model.mjs';
import { supabaseConfig, supabaseRequest } from './supabase.mjs';
const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
const fields =
  'id,name,email,organisation,phone,website,service,message,stage,status,priority,next_action,follow_up_date,source,version,created_at,updated_at';
export function createAdminHandler({
  env = process.env,
  allowDemo = false,
  store,
  fetchImpl = fetch,
  now = Date.now,
} = {}) {
  const sessions = new Map(),
    attempts = new Map();
  const demo =
    allowDemo &&
    env.BUILD_MODE !== 'production' &&
    env.NODE_ENV !== 'production' &&
    (env.ADMIN_MODE || 'demo') === 'demo';
  const origin = env.ADMIN_ALLOWED_ORIGIN || env.CONTACT_ALLOWED_ORIGIN || 'http://localhost:4321';
  let config = null;
  try {
    config = supabaseConfig(env);
  } catch {}
  const requiresHTTPS = env.BUILD_MODE === 'production' || env.NODE_ENV === 'production';
  const live =
    !demo && config && env.ADMIN_EMAIL && (!requiresHTTPS || origin.startsWith('https://'));
  const cookie = (name, value, age = 3600) =>
    `${name}=${encodeURIComponent(value)}; Path=/api/admin; HttpOnly; SameSite=Strict; Max-Age=${age}${origin.startsWith('https:') ? '; Secure' : ''}`;
  return async function handle(request, { clientAddress = 'unknown' } = {}) {
    const headers = new Headers({
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'X-Robots-Tag': 'noindex, nofollow',
    });
    const json = (status, data) => Response.json(data, { status, headers });
    const clear = () => {
      for (const key of ['efiops_access', 'efiops_refresh', 'efiops_demo'])
        headers.append('Set-Cookie', cookie(key, '', 0));
    };
    const path = new URL(request.url).pathname.replace(/^\/api\/admin\/?/, '');
    if (!['GET', 'POST', 'PATCH'].includes(request.method))
      return json(405, { message: 'Method not allowed.' });
    if (request.method !== 'GET' && request.headers.get('origin') !== origin)
      return json(403, { message: 'This request origin is not allowed.' });
    const parse = async () => {
      const reader = request.body?.getReader();
      if (!reader) throw Error('Invalid request');
      let raw = '';
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        raw += decoder.decode(value, { stream: true });
        if (Buffer.byteLength(raw) > 30000) {
          await reader.cancel();
          throw Error('Request too large');
        }
      }
      raw += decoder.decode();
      return JSON.parse(raw);
    };
    const authCookies = Object.fromEntries(
      (request.headers.get('cookie') || '')
        .split(';')
        .map((s) => s.trim().split('='))
        .filter((s) => s.length === 2)
        .map(([k, v]) => {
          try {
            return [k, decodeURIComponent(v)];
          } catch {
            return [k, ''];
          }
        }),
    );
    const call = (route, opts = {}) => supabaseRequest(config, route, { ...opts, fetchImpl });
    const setTokens = (data) => {
      headers.append(
        'Set-Cookie',
        cookie('efiops_access', data.access_token, Math.min(data.expires_in || 3600, 3600)),
      );
      headers.append('Set-Cookie', cookie('efiops_refresh', data.refresh_token, 604800));
    };
    let token = authCookies.efiops_access,
      user = null;
    try {
      if (path === 'config' && request.method === 'GET')
        return json(200, { mode: demo ? 'demo' : live ? 'supabase' : 'unconfigured' });
      if (path === 'logout' && request.method === 'POST') {
        sessions.delete(authCookies.efiops_demo);
        clear();
        if (live && token) {
          try {
            await call('/auth/v1/logout', { method: 'POST', token });
          } catch {}
        }
        return json(200, { ok: true });
      }
      if (path === 'demo' && request.method === 'POST') {
        if (!demo) return json(403, { message: 'Demo access is disabled.' });
        const id = randomUUID();
        sessions.set(id, now() + 28800000);
        headers.append('Set-Cookie', cookie('efiops_demo', id, 28800));
        return json(200, { mode: 'demo', email: 'Local demo' });
      }
      if (path === 'login' && request.method === 'POST') {
        if (!live) return json(503, { message: 'Supabase sign-in is not configured.' });
        for (const [k, v] of attempts) if (v.until < now()) attempts.delete(k);
        const rate = attempts.get(clientAddress) || { count: 0, until: now() + 900000 };
        rate.count++;
        attempts.set(clientAddress, rate);
        if (rate.count > 10)
          return json(429, { message: 'Too many sign-in attempts. Try again later.' });
        const input = await parse();
        if (!input || typeof input !== 'object')
          return json(400, { message: 'Check your email and password.' });
        if (
          typeof input.email !== 'string' ||
          typeof input.password !== 'string' ||
          input.email.length > 254 ||
          input.password.length > 1024
        )
          return json(400, { message: 'Check your email and password.' });
        const result = await call('/auth/v1/token?grant_type=password', {
          method: 'POST',
          body: { email: input.email, password: input.password },
        });
        if (!result.ok || !result.data?.access_token)
          return json(401, { message: 'Unable to sign in with these details.' });
        const member = await call('/rest/v1/rpc/efiops_is_admin', {
          method: 'POST',
          body: {},
          token: result.data.access_token,
        });
        if (
          result.data.user?.email?.toLowerCase() !== env.ADMIN_EMAIL.toLowerCase() ||
          !result.data.user?.email_confirmed_at ||
          !member.ok ||
          member.data !== true
        ) {
          await call('/auth/v1/logout', { method: 'POST', token: result.data.access_token });
          return json(403, { message: 'This account does not have dashboard access.' });
        }
        setTokens(result.data);
        attempts.delete(clientAddress);
        return json(200, { mode: 'supabase', email: result.data.user.email });
      }
      if (demo) {
        if ((sessions.get(authCookies.efiops_demo) || 0) < now())
          return json(401, { message: 'Open the demo dashboard to continue.' });
        user = { email: 'Local demo' };
      } else {
        if (!live) return json(503, { message: 'The dashboard backend is not configured.' });
        let result = token ? await call('/auth/v1/user', { token }) : { status: 401 };
        if (result.status === 401 && authCookies.efiops_refresh) {
          const refreshed = await call('/auth/v1/token?grant_type=refresh_token', {
            method: 'POST',
            body: { refresh_token: authCookies.efiops_refresh },
          });
          if (refreshed.ok && refreshed.data?.access_token) {
            token = refreshed.data.access_token;
            setTokens(refreshed.data);
            result = await call('/auth/v1/user', { token });
          }
        }
        if (!result.ok || !result.data?.id) {
          clear();
          return json(401, { message: 'Please sign in again.' });
        }
        user = result.data;
        const member = await call('/rest/v1/rpc/efiops_is_admin', {
          method: 'POST',
          body: {},
          token,
        });
        if (
          user.email?.toLowerCase() !== env.ADMIN_EMAIL.toLowerCase() ||
          !user.email_confirmed_at ||
          !member.ok ||
          member.data !== true
        )
          return json(403, { message: 'This account does not have dashboard access.' });
      }
      if (path === 'session' && request.method === 'GET')
        return json(200, { mode: demo ? 'demo' : 'supabase', email: user.email });
      if (path === 'enquiries' && request.method === 'GET') {
        const offset = Number(new URL(request.url).searchParams.get('offset') || 0);
        if (!Number.isInteger(offset) || offset < 0 || offset > 100000)
          return json(400, { message: 'Invalid page.' });
        if (demo) return json(200, await store.list(offset));
        const result = await call(
          `/rest/v1/enquiries?select=${fields}&order=created_at.desc,id.desc&offset=${offset}&limit=101`,
          { token },
        );
        if (!result.ok) throw Error();
        return json(200, { items: result.data.slice(0, 100), hasMore: result.data.length > 100 });
      }
      if (path === 'enquiries' && request.method === 'POST') {
        const parsed = enquirySchema.safeParse(await parse());
        if (!parsed.success)
          return json(400, {
            message: 'Please check the enquiry fields.',
            errors: z.flattenError(parsed.error).fieldErrors,
          });
        if (demo) return json(201, { enquiry: await store.create(parsed.data) });
        const result = await call('/rest/v1/enquiries', {
          token,
          method: 'POST',
          body: parsed.data,
          headers: { Prefer: 'return=representation' },
        });
        if (!result.ok || !result.data?.[0]) throw Error();
        return json(201, { enquiry: result.data[0] });
      }
      const [id, action] = path.replace(/^enquiries\//, '').split('/');
      if (!path.startsWith('enquiries/') || !uuid.test(id) || (action && action !== 'notes'))
        return json(404, { message: 'Not found.' });
      if (!action && request.method === 'GET') {
        if (demo) {
          const result = await store.detail(id);
          return result ? json(200, result) : json(404, { message: 'Enquiry not found.' });
        }
        const record = await call(`/rest/v1/enquiries?id=eq.${id}&select=${fields}`, { token });
        if (!record.ok) throw Error();
        if (!record.data[0]) return json(404, { message: 'Enquiry not found.' });
        const activity = await call(
          `/rest/v1/enquiry_activity?enquiry_id=eq.${id}&order=created_at.desc&limit=500`,
          { token },
        );
        if (!activity.ok) throw Error();
        return json(200, { enquiry: record.data[0], activity: activity.data });
      }
      if (!action && request.method === 'PATCH') {
        const parsed = patchSchema.safeParse(await parse());
        if (!parsed.success)
          return json(400, {
            message: 'Check the enquiry fields.',
            errors: z.flattenError(parsed.error).fieldErrors,
          });
        if (demo) {
          const result = await store.update(id, parsed.data);
          return !result
            ? json(404, { message: 'Enquiry not found.' })
            : result.conflict
              ? json(409, {
                  message: 'This enquiry changed in another session. Reload it before saving.',
                })
              : json(200, { enquiry: result });
        }
        const { version, ...body } = parsed.data;
        const result = await call(`/rest/v1/enquiries?id=eq.${id}&version=eq.${version}`, {
          token,
          method: 'PATCH',
          body,
          headers: { Prefer: 'return=representation' },
        });
        if (!result.ok) throw Error();
        if (!result.data[0])
          return json(409, {
            message: 'This enquiry changed or is no longer available. Reload it before saving.',
          });
        return json(200, { enquiry: result.data[0] });
      }
      if (action === 'notes' && request.method === 'POST') {
        const parsed = noteSchema.safeParse(await parse());
        if (!parsed.success) return json(400, { message: 'Write a note of 1–5,000 characters.' });
        if (demo) {
          const note = await store.note(id, parsed.data.body);
          return note ? json(201, { note }) : json(404, { message: 'Enquiry not found.' });
        }
        const result = await call('/rest/v1/enquiry_activity', {
          token,
          method: 'POST',
          body: { enquiry_id: id, type: 'note_added', body: parsed.data.body, actor_id: user.id },
          headers: { Prefer: 'return=representation' },
        });
        if (!result.ok || !result.data[0]) throw Error();
        return json(201, { note: result.data[0] });
      }
      return json(405, { message: 'Method not allowed.' });
    } catch (error) {
      return json(error instanceof SyntaxError ? 400 : 502, {
        message:
          error instanceof SyntaxError
            ? 'Invalid request.'
            : 'The dashboard request could not be completed. Your changes have not been confirmed; please retry.',
      });
    }
  };
}
