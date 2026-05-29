import { currentMonthRange } from "@/lib/format";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { demoDocuments, demoInsights, demoInvoices, demoMailSummaries, demoProperties, demoRentPayments, demoTransactions } from "@/lib/demo-data";
import type { AiInsight, DocumentItem, Invoice, Property, RentPayment, Transaction } from "@/lib/types";

function hasSupabaseEnv() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function getUserId() {
  if (!hasSupabaseEnv()) return null;
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export async function getProperties(): Promise<Property[]> {
  const userId = await getUserId();
  if (!userId) return demoProperties;

  const supabase = createServerSupabaseClient();
  const { data } = await supabase.from("properties").select("*").order("created_at", { ascending: false });
  return (data ?? []) as Property[];
}

export async function getTransactions(): Promise<Transaction[]> {
  const userId = await getUserId();
  if (!userId) return demoTransactions;

  const supabase = createServerSupabaseClient();
  const { data } = await supabase.from("transactions").select("*").order("occurred_on", { ascending: false }).limit(100);
  return (data ?? []) as Transaction[];
}

export async function getDocuments(): Promise<DocumentItem[]> {
  const userId = await getUserId();
  if (!userId) return demoDocuments;

  const supabase = createServerSupabaseClient();
  const { data } = await supabase.from("documents").select("*").order("created_at", { ascending: false }).limit(100);
  return (data ?? []) as DocumentItem[];
}

export async function getRentPayments(): Promise<RentPayment[]> {
  const userId = await getUserId();
  if (!userId) return demoRentPayments;

  const supabase = createServerSupabaseClient();
  const { data } = await supabase.from("rent_payments").select("*").order("month", { ascending: false }).limit(100);
  return (data ?? []) as RentPayment[];
}

export async function getInvoices(): Promise<Invoice[]> {
  const userId = await getUserId();
  if (!userId) return demoInvoices;

  const supabase = createServerSupabaseClient();
  const { data } = await supabase.from("invoices").select("*").neq("status", "archivee").order("due_on", { ascending: true }).limit(100);
  return (data ?? []) as Invoice[];
}

export async function getDashboardData() {
  const userId = await getUserId();
  if (!userId) {
    return buildDashboard(demoTransactions, demoRentPayments, demoInvoices, demoInsights, demoMailSummaries);
  }

  const supabase = createServerSupabaseClient();
  const { start, end } = currentMonthRange();

  const [transactions, rents, invoices, insights, mails] = await Promise.all([
    supabase.from("transactions").select("*").gte("occurred_on", start).lte("occurred_on", end),
    supabase.from("rent_payments").select("*").gte("month", start).lte("month", end),
    supabase.from("invoices").select("*").neq("status", "archivee").order("due_on", { ascending: true }).limit(5),
    supabase.from("ai_insights").select("*").is("dismissed_at", null).order("created_at", { ascending: false }).limit(5),
    supabase.from("mail_items").select("id, subject, ai_summary").order("received_at", { ascending: false }).limit(3)
  ]);

  return buildDashboard(
    (transactions.data ?? []) as Transaction[],
    (rents.data ?? []) as RentPayment[],
    (invoices.data ?? []) as Invoice[],
    (insights.data ?? []) as AiInsight[],
    mails.data?.map((mail) => ({ id: mail.id, subject: mail.subject, ai_summary: mail.ai_summary ?? "Information administrative détectée." })) ?? []
  );
}

function buildDashboard(
  transactions: Transaction[],
  rents: RentPayment[],
  invoices: Invoice[],
  insights: AiInsight[],
  mailSummaries: Array<{ id: string; subject: string; ai_summary: string }>
) {
  const monthlyIncome = transactions.filter((item) => item.kind === "revenu").reduce((sum, item) => sum + Math.abs(item.amount), 0);
  const monthlyExpenses = transactions.filter((item) => item.kind === "depense").reduce((sum, item) => sum + Math.abs(item.amount), 0);
  const receivedRents = rents.filter((item) => item.status === "recu").length;
  const expectedRents = rents.length || demoRentPayments.length;
  const latePayments = rents.filter((item) => item.status === "retard").length;

  return {
    monthlyIncome,
    monthlyExpenses,
    receivedRents,
    expectedRents,
    latePayments,
    invoices: invoices.length ? invoices : demoInvoices,
    insights: insights.length ? insights : demoInsights,
    mailSummaries: mailSummaries.length ? mailSummaries : demoMailSummaries
  };
}
