import { AlertTriangle, CheckCircle2, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { StatusPill } from "@/components/status-pill";
import { getDashboardData, getTransactions } from "@/lib/data";
import { formatCurrency } from "@/lib/format";

export default async function AssistantPage() {
  const [dashboard, transactions] = await Promise.all([getDashboardData(), getTransactions()]);
  const largestExpenses = transactions
    .filter((item) => item.kind === "depense")
    .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
    .slice(0, 3);

  return (
    <AppShell title="Assistant IA" subtitle="Un résumé simple des dépenses, retards, anomalies et actions utiles.">
      <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
        <div className="flex items-start gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-pine text-white">
            <Sparkles size={26} />
          </span>
          <div>
            <h2 className="text-xl font-semibold text-ink">Résumé du mois</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-ink/68">
              Les revenus détectés sont de {formatCurrency(dashboard.monthlyIncome)} et les dépenses de {formatCurrency(dashboard.monthlyExpenses)}.
              L’assistant surveille les loyers manquants, les grosses factures et les documents non classés.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-line bg-white p-5 shadow-soft">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-ink">
            <AlertTriangle className="text-amber" /> Points à vérifier
          </h2>
          <div className="mt-4 space-y-3">
            {dashboard.insights.map((item) => (
              <article key={item.id} className="rounded-lg border border-line p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-ink">{item.title}</h3>
                  <StatusPill status={item.severity} />
                </div>
                <p className="mt-2 text-sm leading-6 text-ink/65">{item.body}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-line bg-white p-5 shadow-soft">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-ink">
            <CheckCircle2 className="text-pine" /> Dépenses importantes
          </h2>
          <div className="mt-4 space-y-3">
            {largestExpenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between gap-4 rounded-lg bg-cloud p-4">
                <div>
                  <p className="font-semibold text-ink">{expense.label}</p>
                  <p className="mt-1 text-sm text-ink/55">{expense.category}</p>
                </div>
                <p className="font-bold text-rose">{formatCurrency(Math.abs(expense.amount))}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
