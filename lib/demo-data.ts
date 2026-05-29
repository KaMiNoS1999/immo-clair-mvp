import type { AiInsight, DocumentItem, Invoice, Property, RentPayment, Transaction } from "@/lib/types";

export const demoProperties: Property[] = [
  {
    id: "p-1",
    name: "Appartement Louise",
    kind: "appartement",
    address: "Avenue Louise 221, Bruxelles",
    tenant_name: "Claire Martin",
    tenant_email: "claire@example.com",
    monthly_rent: 1250,
    monthly_charges: 140,
    notes: "Bail renouvelé en janvier. Indexation à vérifier en septembre.",
    photo_url: null
  },
  {
    id: "p-2",
    name: "Maison Waterloo",
    kind: "maison",
    address: "Chaussée de Bruxelles 88, Waterloo",
    tenant_name: "Famille Dubois",
    tenant_email: "dubois@example.com",
    monthly_rent: 1780,
    monthly_charges: 0,
    notes: "Entretien chaudière prévu avant l’hiver.",
    photo_url: null
  }
];

export const demoTransactions: Transaction[] = [
  { id: "t-1", property_id: "p-1", occurred_on: "2026-05-03", label: "Loyer Claire Martin", amount: 1390, kind: "revenu", category: "loyer", counterparty: "Claire Martin", confidence: 0.98, source: "banque" },
  { id: "t-2", property_id: "p-2", occurred_on: "2026-05-05", label: "Assurance habitation", amount: -312, kind: "depense", category: "assurance", counterparty: "AG Insurance", confidence: 0.91, source: "banque" },
  { id: "t-3", property_id: "p-1", occurred_on: "2026-05-12", label: "Réparation plomberie", amount: -285, kind: "depense", category: "travaux", counterparty: "Plomberie Express", confidence: 0.87, source: "facture" },
  { id: "t-4", property_id: "p-2", occurred_on: "2026-05-15", label: "Précompte immobilier", amount: -620, kind: "depense", category: "taxes", counterparty: "SPF Finances", confidence: 0.79, source: "document" }
];

export const demoRentPayments: RentPayment[] = [
  { id: "r-1", property_id: "p-1", month: "2026-05-01", expected_amount: 1390, received_amount: 1390, status: "recu", due_on: "2026-05-05", received_on: "2026-05-03" },
  { id: "r-2", property_id: "p-2", month: "2026-05-01", expected_amount: 1780, received_amount: 0, status: "retard", due_on: "2026-05-05", received_on: null }
];

export const demoInvoices: Invoice[] = [
  { id: "i-1", company: "Plomberie Express", amount: 285, due_on: "2026-06-02", status: "a_payer", category: "travaux" },
  { id: "i-2", company: "AG Insurance", amount: 312, due_on: "2026-05-30", status: "en_retard", category: "assurance" }
];

export const demoDocuments: DocumentItem[] = [
  { id: "d-1", property_id: "p-1", title: "Facture plomberie mai", file_path: "demo/facture-plomberie.pdf", status: "classe", extracted_amount: 285, extracted_date: "2026-05-12", extracted_company: "Plomberie Express", extracted_category: "travaux", ai_summary: "Réparation évier cuisine, facture à payer avant le 2 juin." },
  { id: "d-2", property_id: "p-2", title: "Assurance habitation", file_path: "demo/assurance.pdf", status: "analyse", extracted_amount: 312, extracted_date: "2026-05-05", extracted_company: "AG Insurance", extracted_category: "assurance", ai_summary: "Assurance annuelle détectée, à rapprocher du paiement bancaire." }
];

export const demoInsights: AiInsight[] = [
  { id: "a-1", title: "Un loyer semble manquant", severity: "critical", body: "Le loyer de la Maison Waterloo n’apparaît pas dans les paiements reçus de mai.", action_label: "Voir les loyers", action_href: "/transactions" },
  { id: "a-2", title: "Dépense importante détectée", severity: "warning", body: "Le précompte immobilier de 620 € a été classé en taxes. Vérifiez le bien concerné.", action_label: "Contrôler", action_href: "/transactions" },
  { id: "a-3", title: "Document à terminer", severity: "info", body: "La facture d’assurance est analysée, mais elle doit encore être validée.", action_label: "Documents", action_href: "/documents" }
];

export const demoMailSummaries = [
  { id: "m-1", subject: "Rappel facture assurance", ai_summary: "Échéance proche pour AG Insurance. Montant probable: 312 €." },
  { id: "m-2", subject: "Intervention plomberie terminée", ai_summary: "La facture est jointe et concerne l’Appartement Louise." }
];
