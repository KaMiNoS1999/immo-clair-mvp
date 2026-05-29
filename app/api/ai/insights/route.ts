import { NextResponse } from "next/server";
import { createOpenAIClient } from "@/lib/openai";
import { demoResponse, errorResponse, getRouteUser } from "@/lib/api";
import { createRouteSupabaseClient } from "@/lib/supabase/server";

export async function POST() {
  const user = await getRouteUser();
  if (!user) return demoResponse("Mode démo: l’assistant générera les alertes après connexion.");
  if (!process.env.OPENAI_API_KEY) return errorResponse("OPENAI_API_KEY est manquante.");

  const supabase = createRouteSupabaseClient();
  const [transactions, rents, invoices] = await Promise.all([
    supabase.from("transactions").select("*").order("occurred_on", { ascending: false }).limit(80),
    supabase.from("rent_payments").select("*").order("month", { ascending: false }).limit(30),
    supabase.from("invoices").select("*").neq("status", "archivee").limit(30)
  ]);

  const openai = createOpenAIClient();
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: "Tu es un assistant de gestion locative. Retourne JSON: {insights:[{title,severity,body,action_label,action_href}]}."
      },
      {
        role: "user",
        content: JSON.stringify({
          transactions: transactions.data ?? [],
          rents: rents.data ?? [],
          invoices: invoices.data ?? []
        })
      }
    ]
  });

  const parsed = JSON.parse(completion.choices[0]?.message.content ?? "{\"insights\":[]}") as {
    insights: Array<{ title: string; severity: string; body: string; action_label?: string; action_href?: string }>;
  };

  const rows = parsed.insights.map((insight) => ({
    owner_id: user.id,
    title: insight.title,
    severity: insight.severity,
    body: insight.body,
    action_label: insight.action_label ?? null,
    action_href: insight.action_href ?? null
  }));

  if (rows.length) {
    const { error } = await supabase.from("ai_insights").insert(rows);
    if (error) return errorResponse(error.message);
  }

  return NextResponse.json({ ok: true, message: `${rows.length} alerte(s) générée(s).`, insights: rows });
}
