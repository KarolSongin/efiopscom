import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
test('unsuccessful enquiry retention uses closure time and preserves other customers', async () => {
  const db = new PGlite();
  try {
    await db.exec(
      'create role anon;create role authenticated;create role service_role;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$select null::uuid$$;',
    );
    await db.exec(
      fs.readFileSync('supabase/migrations/202610040001_customer_pipeline.sql', 'utf8'),
    );
    await db.exec(
      fs.readFileSync('supabase/migrations/202610040002_enquiry_retention.sql', 'utf8'),
    );
    await db.exec(
      "insert into public.enquiries(name,email,message,status) values ('Closed','test@example.com','A test enquiry','not_proceeding'),('Active','test@example.com','A test enquiry','active'),('Complete','test@example.com','A test enquiry','completed'),('Reopened','test@example.com','A test enquiry','not_proceeding');",
    );
    const stamp = (
      await db.query("select not_proceeding_at from public.enquiries where name='Closed'")
    ).rows[0].not_proceeding_at;
    await db.exec(
      "update public.enquiries set next_action='A detail change' where name='Closed';update public.enquiries set status='active' where name='Reopened';",
    );
    assert.deepEqual(
      (await db.query("select not_proceeding_at from public.enquiries where name='Closed'")).rows[0]
        .not_proceeding_at,
      stamp,
    );
    assert.equal(
      (await db.query("select not_proceeding_at from public.enquiries where name='Reopened'"))
        .rows[0].not_proceeding_at,
      null,
    );
    assert.equal(
      (await db.query('select private.purge_unsuccessful_enquiries() as count')).rows[0].count,
      0,
    );
    await db.exec(
      "alter table public.enquiries disable trigger enquiry_retention_stamp;update public.enquiries set not_proceeding_at=now()-interval '31 days' where name='Closed';alter table public.enquiries enable trigger enquiry_retention_stamp;",
    );
    assert.equal(
      (await db.query('select private.purge_unsuccessful_enquiries() as count')).rows[0].count,
      1,
    );
    assert.equal(
      (await db.query('select count(*)::integer as count from public.enquiries')).rows[0].count,
      3,
    );
    assert.equal(
      (
        await db.query(
          'select count(*)::integer as count from public.enquiry_activity a left join public.enquiries e on e.id=a.enquiry_id where e.id is null',
        )
      ).rows[0].count,
      0,
    );
    await db.exec('set role authenticated');
    await assert.rejects(
      db.query('select private.purge_unsuccessful_enquiries()'),
      /permission denied/,
    );
  } finally {
    await db.close();
  }
});
