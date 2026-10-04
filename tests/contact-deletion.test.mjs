import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { PGlite } from '@electric-sql/pglite';
import { createDemoStore } from '../server/admin-store.mjs';
import { createAdminHandler } from '../server/admin.mjs';
const owner = '11111111-1111-4111-8111-111111111111';
const stranger = '22222222-2222-4222-8222-222222222222';
test('only the owner can delete a contact; cascade removes every note and activity', async () => {
  const db = new PGlite();
  try {
    await db.exec(
      `create role anon;create role authenticated;create role service_role;create schema auth;create table auth.users(id uuid primary key);insert into auth.users values('${owner}'),('${stranger}');create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;grant usage on schema auth to anon,authenticated,service_role;`,
    );
    for (const file of [
      '202610040001_customer_pipeline.sql',
      '202610040002_enquiry_retention.sql',
      '202610040003_social_media_and_contact_deletion.sql',
    ])
      await db.exec(await fs.readFile('supabase/migrations/' + file, 'utf8'));
    await db.exec(
      `insert into private.admin_users values('${owner}');insert into public.enquiries(id,name,email,message,service) values('${owner}','Delete test','test@example.com','A social media enquiry','social-media'),('${stranger}','Keep test','keep@example.com','Another enquiry','seo');insert into public.enquiry_activity(enquiry_id,type,body) values('${owner}','note_added','A private note');set role authenticated;set "request.jwt.claim.sub"='${stranger}';`,
    );
    assert.equal(
      (await db.query(`delete from public.enquiries where id='${owner}' returning id`)).rows.length,
      0,
    );
    await db.exec(`set "request.jwt.claim.sub"='${owner}'`);
    await assert.rejects(
      db.query(`delete from public.enquiry_activity where enquiry_id='${owner}'`),
      /permission denied/,
    );
    assert.equal(
      (
        await db.query(
          `delete from public.enquiries where id='${owner}' and version=999 returning id`,
        )
      ).rows.length,
      0,
    );
    assert.equal(
      (
        await db.query(
          `delete from public.enquiries where id='${owner}' and version=1 returning id`,
        )
      ).rows.length,
      1,
    );
    assert.equal(
      (await db.query(`select * from public.enquiry_activity where enquiry_id='${owner}'`)).rows
        .length,
      0,
    );
    assert.equal(
      (await db.query(`select * from public.enquiries where id='${stranger}'`)).rows.length,
      1,
    );
  } finally {
    await db.close();
  }
});
test('delete API requires authentication, confirmation, matching version and correct origin', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'efiops-delete-'));
  try {
    const store = createDemoStore(path.join(dir, 'demo.json'));
    const handler = createAdminHandler({
      env: { ADMIN_MODE: 'demo', ADMIN_ALLOWED_ORIGIN: 'http://localhost:4321' },
      allowDemo: true,
      store,
    });
    const request = (route, method, body, cookie = '', origin = 'http://localhost:4321') =>
      new Request('http://localhost:4321/api/admin/' + route, {
        method,
        headers: { 'Content-Type': 'application/json', origin, cookie },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
    const sign = await handler(request('demo', 'POST', {}));
    const cookie = sign.headers.get('set-cookie').split(';')[0];
    const contact = await store.create({
      name: 'Delete test',
      email: 'test@example.com',
      message: 'An enquiry for deletion',
      stage: 'opportunity',
      status: 'active',
    });
    await store.note(contact.id, 'Remove this note too');
    const route = 'enquiries/' + contact.id;
    assert.equal(
      (await handler(request(route, 'DELETE', { version: 1, confirmed: true }))).status,
      401,
    );
    assert.equal((await handler(request(route, 'DELETE', { version: 1 }, cookie))).status, 400);
    assert.equal(
      (await handler(request(route, 'DELETE', { version: 999, confirmed: true }, cookie))).status,
      409,
    );
    assert.equal(
      (
        await handler(
          request(
            route,
            'DELETE',
            { version: 1, confirmed: true },
            cookie,
            'https://attacker.example',
          ),
        )
      ).status,
      403,
    );
    assert.equal(
      (await handler(request(route, 'DELETE', { version: 1, confirmed: true }, cookie))).status,
      200,
    );
    assert.equal(await store.detail(contact.id), null);
    const persisted = JSON.parse(await fs.readFile(path.join(dir, 'demo.json'), 'utf8'));
    assert.ok(!persisted.enquiries.some((e) => e.id === contact.id));
    assert.ok(!persisted.activity.some((e) => e.enquiry_id === contact.id));
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
});
