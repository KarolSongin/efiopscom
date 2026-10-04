import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
const owner = '11111111-1111-4111-8111-111111111111';
const stranger = '22222222-2222-4222-8222-222222222222';
test('PostgreSQL migration enforces private access, durable intake and immutable activity', async () => {
  const db = new PGlite();
  try {
    await db.exec(
      `create role anon;create role authenticated;create role service_role;create schema auth;create table auth.users(id uuid primary key);insert into auth.users values('${owner}'),('${stranger}');create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;grant usage on schema auth to anon,authenticated,service_role;`,
    );
    await db.exec(
      fs.readFileSync('supabase/migrations/202610040001_customer_pipeline.sql', 'utf8'),
    );
    await db.exec(`insert into private.admin_users values('${owner}')`);
    await db.exec('set role anon');
    await assert.rejects(db.query('select * from public.enquiries'), /permission denied/);
    await assert.rejects(
      db.query("select public.intake_enquiry('{}','abcdefghijklmnop',repeat('a',64))"),
      /permission denied/,
    );
    await db.exec(`reset role;set role authenticated;set "request.jwt.claim.sub"='${stranger}'`);
    assert.equal(
      (await db.query('select public.efiops_is_admin() as allowed')).rows[0].allowed,
      false,
    );
    assert.equal((await db.query('select * from public.enquiries')).rows.length, 0);
    await assert.rejects(
      db.query(
        "insert into public.enquiries(name,email,message)values('Stranger','x@example.com','A customer question')",
      ),
      /row-level security/,
    );
    await assert.rejects(db.query('select * from private.admin_users'), /permission denied/);
    await db.exec(`reset role;set role service_role;set "request.jwt.claim.sub"=''`);
    const payload = JSON.stringify({
      name: 'Customer',
      email: 'customer@example.com',
      message: 'I need a clearer report.',
      service: 'power-bi',
    });
    const first = await db.query('select public.intake_enquiry($1::jsonb,$2,$3) as result', [
      payload,
      'test-request-123456789',
      'a'.repeat(64),
    ]);
    const again = await db.query('select public.intake_enquiry($1::jsonb,$2,$3) as result', [
      payload,
      'test-request-123456789',
      'a'.repeat(64),
    ]);
    const id = first.rows[0].result.id;
    assert.equal(id, again.rows[0].result.id);
    await assert.rejects(
      db.query('select public.intake_enquiry($1::jsonb,$2,$3)', [
        payload,
        'test-request-123456789',
        'b'.repeat(64),
      ]),
      /identifier reused/,
    );
    await db.exec(`reset role;set role authenticated;set "request.jwt.claim.sub"='${owner}'`);
    assert.equal((await db.query('select * from public.enquiries')).rows.length, 1);
    const record = (await db.query('select * from public.enquiries')).rows[0];
    assert.equal(record.stage, 'opportunity');
    assert.equal(record.version, 1);
    await db.query("update public.enquiries set stage='understand' where id=$1 and version=1", [
      id,
    ]);
    assert.equal((await db.query('select version from public.enquiries')).rows[0].version, 2);
    assert.equal(
      (await db.query("select * from public.enquiry_activity where type='stage_changed'")).rows
        .length,
      1,
    );
    assert.equal(
      (
        await db.query(
          "update public.enquiries set stage='agree' where id=$1 and version=1 returning id",
          [id],
        )
      ).rows.length,
      0,
    );
    await assert.rejects(
      db.query("update public.enquiries set source='manual'"),
      /permission denied/,
    );
    await assert.rejects(
      db.query(
        "insert into public.enquiry_activity(enquiry_id,type,body,actor_id) values($1,'stage_changed','Fake history',$2)",
        [id, owner],
      ),
      /row-level security/,
    );
    await db.query(
      "insert into public.enquiry_activity(enquiry_id,type,body,actor_id)values($1,'note_added','A private note',$2)",
      [id, owner],
    );
    await assert.rejects(db.query('delete from public.enquiry_activity'), /permission denied/);
    await db.exec(`set "request.jwt.claim.sub"='${stranger}'`);
    assert.equal((await db.query('select * from public.enquiries')).rows.length, 0);
    assert.equal((await db.query('select * from public.enquiry_activity')).rows.length, 0);
  } finally {
    await db.close();
  }
});
