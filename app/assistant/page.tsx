import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AssistantAnalyzer } from "@/components/assistant-analyzer";
import { StatusPill } from "@/components/status-pill";
import { requireUserOrDemo } from "@/lib/auth";
import { getDashboardData, getTransactions } from "@/lib/data";
import { formatCurrency } from "@/lib/format";

export default async function AssistantPage() {
  await requireUserOrDemo();
  const [dashboard, transactions] = await Promise.all([getDashboardData(), getTransactions()]);
  const largestExpenses = transactions
    .filter((item) => item.kind === "depense")
    .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
    .slice(0, 3);

  return (
    <AppShell title="Assistant" subtitle="Posez une question, l’application vous répond simplement.">
      <AssistantAnalyzer monthlyIncome={dashboard.monthlyIncome} monthlyExpenses={dashboard.monthlyExpenses} latePayments={dashboard.latePayments} />

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-line bg-white p-5 shadow-soft">
          <h2 className="flex items-center gap-2 text-xl font-bold text-ink">
            <AlertTriangle className="text-amber" /> Points à vérifier
          </h2>
          <div className="mt-4 space-y-3">
            {dashboard.insights.map((item) => (
              <article key={item.id} className="rounded-lg border border-line p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-ink">{item.title}</h3>
                  <StatusPill status={item.severity} />
                </div>
                <p className="mt-2 text-sm leading-6 text-ink/65">{item.body}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-line bg-white p-5 shadow-soft">
          <h2 className="flex items-center gap-2 text-xl font-bold text-ink">
            <CheckCircle2 className="text-pine" /> Dépenses importantes
          </h2>
          <div className="mt-4 space-y-3">
            {largestExpenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between gap-4 rounded-lg bg-cloud p-4">
                <div>
                  <p className="font-bold text-ink">{expense.label}</p>
                  <p className="mt-1 text-sm text-ink/55">{expense.category}</p>
                </div>
                <p className="font-bold text-rose">{formatCurrency(Math.abs(expense.amount))}</p>
              </div>
            ))}
          </div>
          <Link href="/charges" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-pine">
            Voir les charges <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
