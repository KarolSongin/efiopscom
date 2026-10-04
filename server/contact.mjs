import { createHash } from 'node:crypto';
import { saveContactToSupabase } from './supabase.mjs';
import { contactRecord } from './admin-model.mjs';
export const serviceSlugs = [
  'power-bi',
  'power-automate',
  'ai-assistants',
  'jev-ai-integration',
  'custom-business-apps',
  'system-integrations',
  'web-design-development',
  'website-optimisation',
  'seo',
  'computer-vision',
];
const escape = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
export function validateInput(input) {
  const data = {};
  const errors = {};
  for (const [key, max] of Object.entries({
    name: 120,
    email: 254,
    organisation: 160,
    service: 80,
    website: 500,
    message: 5000,
    companyfax: 120,
    requestId: 80,
  })) {
    if (input[key] !== undefined && typeof input[key] !== 'string') {
      errors[key] = 'Please enter text.';
      continue;
    }
    data[key] = (input[key] || '').trim();
    if (data[key].length > max) errors[key] = `Please use no more than ${max} characters.`;
  }
  if (!data.name) errors.name = 'Please enter your name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || ''))
    errors.email = 'Please enter a valid email address.';
  if ((data.message || '').length < 10)
    errors.message = 'Please describe the problem in at least 10 characters.';
  if (data.service && !serviceSlugs.includes(data.service))
    errors.service = 'Please choose a listed service.';
  if (data.website) {
    try {
      if (!['https:', 'http:'].includes(new URL(data.website).protocol)) throw Error();
    } catch {
      errors.website = 'Please enter a full HTTP or HTTPS website address.';
    }
  }
  if (data.requestId && !/^[a-zA-Z0-9-]{16,80}$/.test(data.requestId))
    errors.requestId = 'Please reload the form.';
  return { data, errors };
}
export function createContactHandler({
  env = process.env,
  fetchImpl = fetch,
  now = Date.now,
  demoStore,
} = {}) {
  const requests = new Map();
  const rates = new Map();
  return async function handle(request, { clientAddress = 'unknown' } = {}) {
    const json = (status, body) =>
      Response.json(body, {
        status,
        headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
      });
    if (request.method !== 'POST')
      return json(405, { message: 'Use the enquiry form to submit a request.' });
    const origin = request.headers.get('origin');
    const expected = env.CONTACT_ALLOWED_ORIGIN || 'http://localhost:4321';
    if (origin !== expected)
      return json(403, { message: 'This enquiry could not be accepted from this origin.' });
    const t = now();
    for (const [key, value] of rates) if (value.until <= t) rates.delete(key);
    for (const [key, value] of requests) if (value.until <= t) requests.delete(key);
    const rate = rates.get(clientAddress) || { count: 0, until: t + 60000 };
    rate.count++;
    rates.set(clientAddress, rate);
    if (rate.count > 10)
      return json(429, { message: 'Too many requests. Please wait a minute before trying again.' });
    if (Number(request.headers.get('content-length')) > 16000)
      return json(413, { message: 'The enquiry is too long.' });
    const type = request.headers.get('content-type') || '';
    let input;
    try {
      let raw = '';
      const reader = request.body?.getReader();
      if (!reader) throw Error();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        raw += decoder.decode(value, { stream: true });
        if (Buffer.byteLength(raw) > 16000) {
          await reader.cancel();
          return json(413, { message: 'The enquiry is too long.' });
        }
      }
      input = type.includes('application/json')
        ? JSON.parse(raw)
        : Object.fromEntries(new URLSearchParams(raw));
      if (!input || Array.isArray(input) || typeof input !== 'object') throw Error();
    } catch {
      return json(400, { message: 'Please check the enquiry and try again.' });
    }
    const { data, errors } = validateInput(input);
    const respond = (status, body) => {
      if (type.includes('application/json')) return json(status, body);
      if (body.accepted === true && body.preview !== true) {
        return new Response(
          '<!doctype html><html lang="en-GB"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Thanks for getting in touch | EFIops</title><body style="font-family:Arial;max-width:700px;margin:40px auto;padding:20px;color:#082f49"><h1>Thanks for getting in touch.</h1><p>Your enquiry has been received. In the meantime, you can explore the services or read more about how projects work.</p><p><a href="/services/">Explore the services</a> · <a href="/how-it-works/">How projects work</a></p></body></html>',
          {
            status: 200,
            headers: {
              'Content-Type': 'text/html; charset=utf-8',
              'Cache-Control': 'no-store',
              'X-Robots-Tag': 'noindex, nofollow',
            },
          },
        );
      }

      const fields = ['name', 'email', 'organisation', 'service', 'website', 'message'];
      const html = `<!doctype html><html lang="en-GB"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Enquiry status | EFIops</title><body style="font-family:Arial;max-width:700px;margin:40px auto;padding:20px;color:#082f49"><h1>${escape(body.message)}</h1><p>Your details are retained below. <a href="mailto:karol@efiops.com">Prefer email?</a></p><form action="/api/contact" method="post">${fields.map((key) => `<p><label for="${key}">${escape({ name: 'Your name', email: 'Email address', organisation: 'Business or organisation', service: 'Service', website: 'Website or relevant link', message: 'What would you like to improve?' }[key])}</label><br>${key === 'message' ? `<textarea id="${key}" aria-describedby="${key}-error" name="${key}" rows="8" cols="40">${escape(data[key] || '')}</textarea>` : `<input id="${key}" aria-describedby="${key}-error" name="${key}" value="${escape(data[key] || '')}" ${key === 'email' ? 'type="email"' : ''}>`}${errors[key] ? `<br><span id="${key}-error">${escape(errors[key])}</span>` : ''}</p>`).join('')}<input type="hidden" name="requestId" value="${escape(data.requestId || '')}"><button>Send your enquiry</button></form><p><a href="/contact/">Return to the contact page</a></p></body></html>`;
      return new Response(html, {
        status,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-store',
          'X-Robots-Tag': 'noindex, nofollow',
        },
      });
    };
    if (Object.keys(errors).length)
      return respond(400, { message: 'Please check the highlighted fields.', errors });
    if (data.companyfax) return respond(400, { message: 'This enquiry could not be accepted.' });
    const production = env.BUILD_MODE === 'production';
    const mock = !production ? env.PREVIEW_CONTACT_MODE : undefined;
    if (!production && !mock)
      return respond(503, {
        message: 'This preview cannot send enquiries. Please use the email link below.',
      });
    if (mock === 'failure')
      return respond(502, {
        message: 'Preview test: the simulated provider rejected this enquiry. No enquiry was sent.',
      });
    if (mock === 'success')
      return respond(200, {
        accepted: true,
        preview: true,
        message: 'Preview test only: the simulated enquiry was accepted. No enquiry was sent.',
      });
    const database = production && env.CONTACT_STORAGE === 'supabase';
    const demoDatabase = !production && env.PREVIEW_CONTACT_MODE === 'dashboard' && demoStore;
    if (
      !database &&
      !demoDatabase &&
      (!production || !env.RESEND_API_KEY || !env.CONTACT_FROM || !env.CONTACT_TO)
    )
      return respond(503, {
        message: 'The enquiry service is unavailable. Please use the email link below.',
      });
    const fingerprint = createHash('sha256')
      .update(JSON.stringify({ ...data, requestId: '' }))
      .digest('hex');
    const key = data.requestId || fingerprint;
    const cached = requests.get(key);
    if (cached) {
      if (cached.fingerprint !== fingerprint)
        return respond(409, {
          message: 'This request identifier has already been used. Please reload the form.',
        });
      return respond(...(await cached.promise));
    }
    const promise = (async () => {
      try {
        if (database || demoDatabase) {
          const saved = demoDatabase
            ? await demoStore.intake(contactRecord(data), key, fingerprint)
            : await saveContactToSupabase(env, contactRecord(data), key, fingerprint, fetchImpl);
          if (saved.conflict)
            return [
              409,
              { message: 'This request identifier has already been used. Please reload the form.' },
            ];
          return [
            200,
            {
              accepted: true,
              ...(demoDatabase ? { preview: true, savedToDashboard: true } : {}),
              message: demoDatabase
                ? 'Demo enquiry saved to the local dashboard. No email was sent.'
                : 'Thank you. Your enquiry has been received.',
            },
          ];
        }
        const response = await fetchImpl('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
            'Idempotency-Key': `efiops-${key}`,
          },
          signal: AbortSignal.timeout(10000),
          body: JSON.stringify({
            from: env.CONTACT_FROM,
            to: [env.CONTACT_TO],
            reply_to: data.email,
            subject: `EFIops enquiry: ${data.service || 'Not sure yet'}`,
            text: [
              `Name: ${data.name}`,
              `Email: ${data.email}`,
              `Organisation: ${data.organisation}`,
              `Service: ${data.service}`,
              `Website: ${data.website}`,
              '',
              data.message,
            ].join('\n'),
          }),
        });
        if (!response.ok)
          return [
            502,
            {
              message:
                'Your enquiry could not be sent. Please try again or use the email link below.',
            },
          ];
        const result = await response.json();
        if (typeof result.id !== 'string' || !result.id)
          return [
            502,
            {
              message:
                'The enquiry provider did not confirm acceptance. Please use the email link below.',
            },
          ];
        return [200, { accepted: true, message: 'Thank you. Your enquiry has been received.' }];
      } catch {
        return [
          502,
          {
            message:
              'Your enquiry could not be sent. Please try again or use the email link below.',
          },
        ];
      }
    })();
    requests.set(key, { fingerprint, promise, until: t + 86400000 });
    const result = await promise;
    if (result[0] !== 200) requests.delete(key);
    return respond(...result);
  };
}
