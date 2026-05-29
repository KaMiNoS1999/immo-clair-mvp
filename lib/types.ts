export type Money = number;

export type Property = {
  id: string;
  name: string;
  kind: "maison" | "appartement" | "garage" | "commerce" | "autre";
  address: string;
  tenant_name: string | null;
  tenant_email: string | null;
  monthly_rent: Money;
  monthly_charges: Money;
  notes: string | null;
  photo_url: string | null;
};

export type Transaction = {
  id: string;
  property_id: string | null;
  occurred_on: string;
  label: string;
  amount: Money;
  kind: "revenu" | "depense";
  category: string;
  counterparty: string | null;
  confidence: number;
  source: string;
};

export type DocumentItem = {
  id: string;
  property_id: string | null;
  title: string;
  file_path: string;
  status: "a_traiter" | "analyse" | "classe" | "erreur";
  extracted_amount: Money | null;
  extracted_date: string | null;
  extracted_company: string | null;
  extracted_category: string | null;
  ai_summary: string | null;
};

export type RentPayment = {
  id: string;
  property_id: string;
  month: string;
  expected_amount: Money;
  received_amount: Money;
  status: "recu" | "attendu" | "retard" | "partiel";
  due_on: string | null;
  received_on: string | null;
};

export type Invoice = {
  id: string;
  company: string;
  amount: Money;
  due_on: string | null;
  status: "a_payer" | "payee" | "en_retard" | "archivee";
  category: string;
};

export type AiInsight = {
  id: string;
  title: string;
  severity: "info" | "warning" | "critical" | string;
  body: string;
  action_label: string | null;
  action_href: string | null;
};
