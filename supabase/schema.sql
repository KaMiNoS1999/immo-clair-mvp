create extension if not exists "uuid-ossp";

create type property_kind as enum ('maison', 'appartement', 'garage', 'commerce', 'autre');
create type document_status as enum ('a_traiter', 'analyse', 'classe', 'erreur');
create type transaction_kind as enum ('revenu', 'depense');
create type payment_status as enum ('recu', 'attendu', 'retard', 'partiel');
create type invoice_status as enum ('a_payer', 'payee', 'en_retard', 'archivee');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table public.properties (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  kind property_kind not null default 'appartement',
  address text not null,
  tenant_name text,
  tenant_email text,
  monthly_rent numeric(12,2) not null default 0,
  monthly_charges numeric(12,2) not null default 0,
  notes text,
  photo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.documents (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  property_id uuid references public.properties(id) on delete set null,
  title text not null,
  file_path text not null,
  file_type text,
  status document_status not null default 'a_traiter',
  extracted_amount numeric(12,2),
  extracted_date date,
  extracted_company text,
  extracted_category text,
  ai_summary text,
  created_at timestamptz not null default now()
);

create table public.transactions (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  property_id uuid references public.properties(id) on delete set null,
  document_id uuid references public.documents(id) on delete set null,
  occurred_on date not null,
  label text not null,
  amount numeric(12,2) not null,
  kind transaction_kind not null,
  category text not null default 'non_classe',
  counterparty text,
  confidence numeric(4,3) not null default 0,
  source text not null default 'manuel',
  created_at timestamptz not null default now()
);

create table public.rent_payments (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  month date not null,
  expected_amount numeric(12,2) not null,
  received_amount numeric(12,2) not null default 0,
  status payment_status not null default 'attendu',
  due_on date,
  received_on date,
  notes text,
  unique(property_id, month)
);

create table public.invoices (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  property_id uuid references public.properties(id) on delete set null,
  document_id uuid references public.documents(id) on delete set null,
  company text not null,
  amount numeric(12,2) not null,
  due_on date,
  status invoice_status not null default 'a_payer',
  category text not null default 'facture',
  created_at timestamptz not null default now()
);

create table public.ai_insights (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  severity text not null default 'info',
  body text not null,
  action_label text,
  action_href text,
  created_at timestamptz not null default now(),
  dismissed_at timestamptz
);

create table public.mail_items (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  gmail_message_id text not null,
  subject text not null,
  sender text,
  received_at timestamptz,
  detected_amount numeric(12,2),
  detected_due_on date,
  detected_category text,
  ai_summary text,
  created_at timestamptz not null default now(),
  unique(owner_id, gmail_message_id)
);

create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger properties_touch_updated_at
before update on public.properties
for each row execute procedure public.touch_updated_at();

alter table public.profiles enable row level security;
alter table public.properties enable row level security;
alter table public.documents enable row level security;
alter table public.transactions enable row level security;
alter table public.rent_payments enable row level security;
alter table public.invoices enable row level security;
alter table public.ai_insights enable row level security;
alter table public.mail_items enable row level security;

create policy "profiles are private" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "properties are private" on public.properties for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "documents are private" on public.documents for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "transactions are private" on public.transactions for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "rent payments are private" on public.rent_payments for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "invoices are private" on public.invoices for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "ai insights are private" on public.ai_insights for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "mail items are private" on public.mail_items for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

insert into storage.buckets (id, name, public)
values ('property-documents', 'property-documents', false)
on conflict (id) do nothing;

create policy "users read their storage folder"
on storage.objects for select
using (bucket_id = 'property-documents' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "users upload to their storage folder"
on storage.objects for insert
with check (bucket_id = 'property-documents' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "users update their storage folder"
on storage.objects for update
using (bucket_id = 'property-documents' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "users delete their storage folder"
on storage.objects for delete
using (bucket_id = 'property-documents' and auth.uid()::text = (storage.foldername(name))[1]);
