import test from 'node:test';
import assert from 'node:assert/strict';
import { saveContactToSupabase } from '../server/supabase.mjs';
const env = {
  SUPABASE_URL: 'https://test.supabase.co',
  SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test',
  SUPABASE_SECRET_KEY: 'sb_secret_private',
};
test('intake diagnostics expose only safe status/code and distinguish missing configuration', async () => {
  await assert.rejects(
    saveContactToSupabase({}, {}, 'request-id', 'fingerprint'),
    (error) => error.intakeDiagnostic.reason === 'missing_configuration',
  );
  const fetchImpl = async () =>
    Response.json(
      {
        code: '42501',
        message: 'sensitive provider message',
        details: 'customer@example.com sb_secret_private',
      },
      { status: 403 },
    );
  await assert.rejects(
    saveContactToSupabase(
      env,
      { email: 'customer@example.com' },
      'request-id',
      'fingerprint',
      fetchImpl,
    ),
    (error) => {
      assert.deepEqual(error.intakeDiagnostic, {
        event: 'efiops_contact_storage_failed',
        reason: 'provider_rejected_or_unconfirmed',
        status: 403,
        code: '42501',
      });
      assert.doesNotMatch(JSON.stringify(error), /customer@example|sb_secret|sensitive provider/);
      return true;
    },
  );
});

test('publishable and anon keys cannot be used for server intake', async () => {
  const anon =
    'eyJ0eXAiOiJKV1QifQ.' +
    Buffer.from(JSON.stringify({ role: 'anon' })).toString('base64url') +
    '.test';
  for (const key of ['sb_publishable_wrong', anon]) {
    await assert.rejects(
      saveContactToSupabase(
        { ...env, SUPABASE_SECRET_KEY: key },
        {},
        'request-id',
        'fingerprint',
        () => {
          throw Error('Must not call provider');
        },
      ),
      (error) => error.intakeDiagnostic.reason === 'wrong_server_key_type',
    );
  }
});
