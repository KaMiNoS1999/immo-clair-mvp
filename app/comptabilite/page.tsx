import { Download, PieChart } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { getTransactions } from "@/lib/data";
import { formatCurrency } from "@/lib/format";

export default async function AccountingPage() {
  const transactions = await getTransactions();
  const income = transactions.filter((item) => item.kind === "revenu").reduce((sum, item) => sum + Math.abs(item.amount), 0);
  const expenses = transactions.filter((item) => item.kind === "depense").reduce((sum, item) => sum + Math.abs(item.amount), 0);

  return (
    <AppShell title="Comptabilité" subtitle="Un résumé mensuel lisible, prêt pour l’export Excel ou PDF.">
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-line bg-white p-5 shadow-soft">
          <p className="text-sm text-ink/55">Revenus</p>
          <p className="mt-2 text-3xl font-bold text-pine">{formatCurrency(income)}</p>
        </div>
        <div className="rounded-lg border border-line bg-white p-5 shadow-soft">
          <p className="text-sm text-ink/55">Dépenses</p>
          <p className="mt-2 text-3xl font-bold text-rose">{formatCurrency(expenses)}</p>
        </div>
        <div className="rounded-lg border border-line bg-white p-5 shadow-soft">
          <p className="text-sm text-ink/55">Résultat</p>
          <p className="mt-2 text-3xl font-bold text-ink">{formatCurrency(income - expenses)}</p>
        </div>
      </section>

      <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-ink">
            <PieChart className="text-sage" /> Export simplifié
          </h2>
          <a href="/api/export/monthly" className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-pine px-5 text-sm font-semibold text-white">
            <Download size={18} /> Export CSV
          </a>
        </div>
      </section>
    </AppShell>
  );
}
