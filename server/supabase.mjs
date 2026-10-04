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
function intakeFailure(reason, status, code) {
  const error = new Error('Enquiry storage did not confirm acceptance.');
  error.intakeDiagnostic = {
    event: 'efiops_contact_storage_failed',
    reason,
    ...(Number.isInteger(status) ? { status } : {}),
    ...(typeof code === 'string' && /^[A-Z0-9]{3,16}$/.test(code) ? { code } : {}),
  };
  return error;
}
export async function saveContactToSupabase(env, data, requestKey, fingerprint, fetchImpl = fetch) {
  let config;
  try {
    config = supabaseConfig(env);
  } catch {
    throw intakeFailure('invalid_configuration');
  }
  if (!config?.secretKey) throw intakeFailure('missing_configuration');
  // Intake must use a server key; a publishable/anon key authenticates as anon.
  // Validate locally so permission failures cannot obscure this configuration mistake.
  if (!config.secretKey.startsWith('sb_secret_')) {
    let role;
    try {
      role = JSON.parse(Buffer.from(config.secretKey.split('.')[1], 'base64url').toString()).role;
    } catch {}
    if (!config.secretKey.startsWith('eyJ') || role !== 'service_role')
      throw intakeFailure('wrong_server_key_type');
  }
  let result;
  try {
    result = await supabaseRequest(config, '/rest/v1/rpc/intake_enquiry', {
      secret: true,
      method: 'POST',
      body: { payload: data, submission_key: requestKey, submission_fingerprint: fingerprint },
      fetchImpl,
    });
  } catch {
    throw intakeFailure('network_or_timeout');
  }
  if (result.status === 409 || result.data?.code === '23505') return { conflict: true };
  if (!result.ok || !result.data?.id)
    throw intakeFailure('provider_rejected_or_unconfirmed', result.status, result.data?.code);
  return result.data;
}
