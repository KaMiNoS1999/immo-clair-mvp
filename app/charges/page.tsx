import { Receipt, Wrench } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { StatusPill } from "@/components/status-pill";
import { requireUserOrDemo } from "@/lib/auth";
import { getProperties, getTransactions } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/format";

export default async function ExpensesPage() {
  await requireUserOrDemo();
  const [transactions, properties] = await Promise.all([getTransactions(), getProperties()]);
  const propertyById = new Map(properties.map((property) => [property.id, property.name]));
  const expenses = transactions.filter((item) => item.kind === "depense");
  const total = expenses.reduce((sum, item) => sum + Math.abs(item.amount), 0);
  const works = expenses.filter((item) => item.category === "travaux").reduce((sum, item) => sum + Math.abs(item.amount), 0);

  return (
    <AppShell title="Charges" subtitle="Les frais importants à suivre simplement.">
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-line bg-white p-5 shadow-soft">
          <p className="flex items-center gap-2 text-sm font-bold text-sage">
            <Receipt size={18} />
            Charges détectées
          </p>
          <p className="mt-2 text-3xl font-bold text-ink">{formatCurrency(total)}</p>
        </div>
        <div className="rounded-lg border border-line bg-white p-5 shadow-soft">
          <p className="flex items-center gap-2 text-sm font-bold text-sage">
            <Wrench size={18} />
            Travaux ce mois-ci
          </p>
          <p className="mt-2 text-3xl font-bold text-ink">{formatCurrency(works)}</p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {expenses.map((expense) => (
          <article key={expense.id} className="rounded-lg border border-line bg-white p-5 shadow-soft">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-ink">{expense.label}</h2>
                <p className="mt-1 text-sm text-ink/60">{propertyById.get(expense.property_id ?? "") ?? "Non lié"} · {formatDate(expense.occurred_on)}</p>
              </div>
              <p className="text-right text-xl font-bold text-rose">{formatCurrency(Math.abs(expense.amount))}</p>
            </div>
            <div className="mt-4">
              <StatusPill status={expense.category} />
            </div>
          </article>
        ))}
      </section>
    </AppShell>
  );
}
