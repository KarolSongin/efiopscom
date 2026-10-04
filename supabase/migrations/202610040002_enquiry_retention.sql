-- Apply after 202610040001. Adds the 30-day unsuccessful-enquiry policy.
begin;
alter table public.enquiries add column not_proceeding_at timestamptz;
update public.enquiries set not_proceeding_at=updated_at where status='not_proceeding';
create function private.stamp_unsuccessful_enquiry() returns trigger language plpgsql set search_path='' as $$
begin
 if tg_op='INSERT' then
  new.not_proceeding_at:=case when new.status='not_proceeding' then now() else null end;
 elsif new.status is distinct from old.status then
  new.not_proceeding_at:=case when new.status='not_proceeding' then now() else null end;
 else
  new.not_proceeding_at:=old.not_proceeding_at;
 end if;
 return new;
end;$$;
create trigger enquiry_retention_stamp before insert or update on public.enquiries for each row execute function private.stamp_unsuccessful_enquiry();
create function private.purge_unsuccessful_enquiries() returns integer language plpgsql security definer set search_path='' as $$
declare removed integer;
begin
 delete from public.enquiries where status='not_proceeding' and not_proceeding_at <= now()-interval '30 days';
 get diagnostics removed=row_count;
 return removed;
end;$$;
revoke all on function private.purge_unsuccessful_enquiries() from public,anon,authenticated,service_role;
commit;
-- Scheduling is a separate step in Supabase; see docs/production-launch.md.
