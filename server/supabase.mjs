export function supabaseConfig(env) {
  const url = env.SUPABASE_URL?.replace(/\/$/, '');
  const publicKey = env.SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_ANON_KEY;
  const secretKey = env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !publicKey) return null;
  if (publicKey.startsWith('sb_secret_'))
    throw Error('Use a publishable key for admin authentication.');
  if (publicKey.startsWith('eyJ')) {
    try {
      if (
        JSON.parse(Buffer.from(publicKey.split('.')[1], 'base64url').toString()).role ===
        'service_role'
      )
        throw Error('A service-role key cannot be used as the public key.');
    } catch (error) {
      throw Error('Invalid public key configuration.');
    }
  }
  const parsed = new URL(url);
  if (
    parsed.protocol !== 'https:' ||
    parsed.pathname !== '/' ||
    parsed.username ||
    parsed.password ||
    parsed.search ||
    parsed.hash
  )
    throw Error('SUPABASE_URL must be an HTTPS project origin.');
  return { url, publicKey, secretKey };
}
export async function supabaseRequest(
  config,
  route,
  { token, secret = false, method = 'GET', body, headers = {}, fetchImpl = fetch } = {},
) {
  const key = secret ? config.secretKey : config.publicKey;
  if (!key) throw Error('Supabase server key is missing.');
  const response = await fetchImpl(config.url + route, {
    method,
    headers: {
      apikey: key,
      ...(token
        ? { Authorization: `Bearer ${token}` }
        : /^eyJ/.test(key)
          ? { Authorization: `Bearer ${key}` }
          : {}),
      'Content-Type': 'application/json',
      ...headers,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    signal: AbortSignal.timeout(10000),
  });
  let data = null;
  try {
    data = await response.json();
  } catch {}
  return { ok: response.ok, status: response.status, data };
}
export async function saveContactToSupabase(env, data, requestKey, fingerprint, fetchImpl = fetch) {
  const config = supabaseConfig(env);
  if (!config?.secretKey) throw Error('Enquiry database is not configured.');
  const result = await supabaseRequest(config, '/rest/v1/rpc/intake_enquiry', {
    secret: true,
    method: 'POST',
    body: { payload: data, submission_key: requestKey, submission_fingerprint: fingerprint },
    fetchImpl,
  });
  if (result.status === 409 || result.data?.code === '23505') return { conflict: true };
  if (!result.ok || !result.data?.id) throw Error('Enquiry storage did not confirm acceptance.');
  return result.data;
}
