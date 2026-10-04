-- Apply once after migrations 001 and 002. No existing customer is deleted.
begin;
alter table public.enquiries drop constraint if exists enquiries_service_check;
alter table public.enquiries add constraint enquiries_service_check check(service in ('','power-bi','power-automate','ai-assistants','jev-ai-integration','custom-business-apps','system-integrations','web-design-development','website-optimisation','seo','computer-vision','social-media'));
-- Deletion uses the owner's JWT and RLS, never the intake server secret.
grant delete on public.enquiries to authenticated;
create policy admin_delete on public.enquiries for delete to authenticated using ((select public.efiops_is_admin()));
-- Existing enquiry_activity.enquiry_id ON DELETE CASCADE removes notes/history.
-- Direct activity deletion remains unavailable to authenticated users.
commit;
