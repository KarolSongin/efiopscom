-- Apply once in the Supabase SQL editor or with supabase db push.
begin;
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
create table private.admin_users (user_id uuid primary key references auth.users(id) on delete cascade);
revoke all on private.admin_users from public, anon, authenticated;
create function public.efiops_is_admin() returns boolean language sql stable security definer set search_path = '' as $$
 select exists(select 1 from private.admin_users where user_id = (select auth.uid()));
$$;
revoke all on function public.efiops_is_admin() from public, anon;
grant execute on function public.efiops_is_admin() to authenticated;
create table public.enquiries (
 id uuid primary key default gen_random_uuid(),
 name text not null check(length(name) between 1 and 120),
 email text not null check(length(email) between 3 and 254),
 organisation text not null default '' check(length(organisation)<=160),
 phone text not null default '' check(length(phone)<=50),
 website text not null default '' check(length(website)<=500),
 service text not null default '' check(service in ('','power-bi','power-automate','ai-assistants','jev-ai-integration','custom-business-apps','system-integrations','web-design-development','website-optimisation','seo','computer-vision')),
 message text not null check(length(message) between 10 and 5000),
 stage text not null default 'opportunity' check(stage in ('opportunity','understand','agree','build','test','handover')),
 status text not null default 'active' check(status in ('active','on_hold','completed','not_proceeding')),
 priority text not null default 'normal' check(priority in ('low','normal','high')),
 next_action text not null default '' check(length(next_action)<=500),
 follow_up_date date,
 source text not null default 'manual' check(source in ('manual','website')),
 submission_key text unique,
 submission_fingerprint text,
 version integer not null default 1,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index enquiries_created_at_idx on public.enquiries(created_at desc);
create index enquiries_follow_up_idx on public.enquiries(follow_up_date) where status='active';
create table public.enquiry_activity (
 id uuid primary key default gen_random_uuid(),
 enquiry_id uuid not null references public.enquiries(id) on delete cascade,
 type text not null check(type in ('created','stage_changed','status_changed','details_updated','note_added')),
 body text not null check(length(body) between 1 and 5000),
 actor_id uuid references auth.users(id),
 created_at timestamptz not null default now()
);
create index enquiry_activity_parent_idx on public.enquiry_activity(enquiry_id,created_at desc);
alter table public.enquiries enable row level security;
alter table public.enquiry_activity enable row level security;
revoke all on public.enquiries,public.enquiry_activity from public,anon,authenticated;
grant select,insert on public.enquiries to authenticated;
grant update(name,email,organisation,phone,website,service,message,stage,status,priority,next_action,follow_up_date) on public.enquiries to authenticated;
grant select on public.enquiry_activity to authenticated;
grant insert(enquiry_id,type,body,actor_id) on public.enquiry_activity to authenticated;
grant all on public.enquiries,public.enquiry_activity to service_role;
create policy admin_read on public.enquiries for select to authenticated using ((select public.efiops_is_admin()));
create policy admin_create on public.enquiries for insert to authenticated with check ((select public.efiops_is_admin()) and source='manual' and submission_key is null and submission_fingerprint is null and version=1);
create policy admin_update on public.enquiries for update to authenticated using ((select public.efiops_is_admin())) with check ((select public.efiops_is_admin()));
create policy admin_activity_read on public.enquiry_activity for select to authenticated using ((select public.efiops_is_admin()));
create policy admin_note on public.enquiry_activity for insert to authenticated with check ((select public.efiops_is_admin()) and type='note_added' and actor_id=(select auth.uid()));
create function private.stamp_enquiry() returns trigger language plpgsql set search_path='' as $$
begin
 if new.id<>old.id or new.created_at<>old.created_at or new.source<>old.source or new.submission_key is distinct from old.submission_key or new.submission_fingerprint is distinct from old.submission_fingerprint then raise exception 'Immutable enquiry fields'; end if;
 new.version:=old.version+1;new.updated_at:=now();return new;
end;$$;
create trigger enquiry_stamp before update on public.enquiries for each row execute function private.stamp_enquiry();
create function private.audit_enquiry() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if tg_op='INSERT' then
  insert into public.enquiry_activity(enquiry_id,type,body,actor_id) values(new.id,'created',case when new.source='website' then 'Website enquiry received.' else 'Enquiry added.' end,auth.uid());
 else
  if old.stage<>new.stage then insert into public.enquiry_activity(enquiry_id,type,body,actor_id) values(new.id,'stage_changed','Stage: '||old.stage||' → '||new.stage,auth.uid());end if;
  if old.status<>new.status then insert into public.enquiry_activity(enquiry_id,type,body,actor_id) values(new.id,'status_changed','Status: '||old.status||' → '||new.status,auth.uid());end if;
  if (to_jsonb(old)-array['stage','status','version','updated_at']) is distinct from (to_jsonb(new)-array['stage','status','version','updated_at']) then insert into public.enquiry_activity(enquiry_id,type,body,actor_id) values(new.id,'details_updated','Enquiry details updated.',auth.uid());end if;
 end if;return new;
end;$$;
create trigger enquiry_audit after insert or update on public.enquiries for each row execute function private.audit_enquiry();
create function public.intake_enquiry(payload jsonb, submission_key text, submission_fingerprint text) returns jsonb language plpgsql security definer set search_path='' as $$
declare existing public.enquiries; created_id uuid;
begin
 if length(submission_key) not between 16 and 80 or submission_fingerprint !~ '^[a-f0-9]{64}$' then raise exception 'Invalid submission identifier';end if;
 select * into existing from public.enquiries e where e.submission_key=intake_enquiry.submission_key;
 if found then
  if existing.submission_fingerprint<>intake_enquiry.submission_fingerprint then raise unique_violation using message='Submission identifier reused';end if;
  return jsonb_build_object('id',existing.id);
 end if;
 begin
  insert into public.enquiries(name,email,organisation,service,website,message,source,next_action,submission_key,submission_fingerprint)
  values(payload->>'name',payload->>'email',coalesce(payload->>'organisation',''),coalesce(payload->>'service',''),coalesce(payload->>'website',''),payload->>'message','website','Review the enquiry and arrange the first conversation.',intake_enquiry.submission_key,intake_enquiry.submission_fingerprint) returning id into created_id;
 exception when unique_violation then
  select * into existing from public.enquiries e where e.submission_key=intake_enquiry.submission_key;
  if not found or existing.submission_fingerprint<>intake_enquiry.submission_fingerprint then raise;end if;
  created_id:=existing.id;
 end;
 return jsonb_build_object('id',created_id);
end;$$;
revoke all on function public.intake_enquiry(jsonb,text,text) from public,anon,authenticated;
grant execute on function public.intake_enquiry(jsonb,text,text) to service_role;
commit;
-- After creating your confirmed Auth user, register its UUID separately:
-- insert into private.admin_users(user_id) values ('YOUR-AUTH-USER-UUID');
