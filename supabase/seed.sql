-- Optionnel: à exécuter après création d’un utilisateur Google.
-- Remplacez OWNER_ID par l’UUID de auth.users.id.

insert into public.properties (owner_id, name, kind, address, tenant_name, tenant_email, monthly_rent, monthly_charges, notes)
values
  ('OWNER_ID', 'Appartement Louise', 'appartement', 'Avenue Louise 221, Bruxelles', 'Claire Martin', 'claire@example.com', 1250, 140, 'Indexation à vérifier en septembre.'),
  ('OWNER_ID', 'Maison Waterloo', 'maison', 'Chaussée de Bruxelles 88, Waterloo', 'Famille Dubois', 'dubois@example.com', 1780, 0, 'Entretien chaudière avant l’hiver.');

insert into public.rent_payments (owner_id, property_id, month, expected_amount, received_amount, status, due_on, received_on)
select owner_id, id, date '2026-05-01', monthly_rent + monthly_charges, 0, 'attendu', date '2026-05-05', null
from public.properties
where owner_id = 'OWNER_ID';
