import { AppShell } from "@/components/app-shell";
import { StatusPill } from "@/components/status-pill";
import { getProperties, getTransactions } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/format";

export default async function TransactionsPage() {
  const [transactions, properties] = await Promise.all([getTransactions(), getProperties()]);
  const propertyById = new Map(properties.map((property) => [property.id, property.name]));

  return (
    <AppShell title="Transactions" subtitle="Les revenus et dépenses classés automatiquement à partir de la banque et des factures.">
      <section className="overflow-hidden rounded-lg border border-line bg-white shadow-soft">
        <div className="grid grid-cols-[1fr_auto] gap-3 border-b border-line bg-cloud p-4 sm:grid-cols-[140px_1fr_170px_140px_130px]">
          <span className="text-sm font-bold text-ink/65">Date</span>
          <span className="hidden text-sm font-bold text-ink/65 sm:block">Libellé</span>
          <span className="hidden text-sm font-bold text-ink/65 sm:block">Bien</span>
          <span className="hidden text-sm font-bold text-ink/65 sm:block">Catégorie</span>
          <span className="text-right text-sm font-bold text-ink/65">Montant</span>
        </div>
        {transactions.map((item) => (
          <div key={item.id} className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-line p-4 last:border-b-0 sm:grid-cols-[140px_1fr_170px_140px_130px]">
            <span className="text-sm text-ink/65">{formatDate(item.occurred_on)}</span>
            <div>
              <p className="font-semibold text-ink">{item.label}</p>
              <p className="mt-1 text-sm text-ink/55 sm:hidden">{propertyById.get(item.property_id ?? "") ?? "Non lié"} · {item.category}</p>
            </div>
            <span className="hidden text-sm text-ink/65 sm:block">{propertyById.get(item.property_id ?? "") ?? "Non lié"}</span>
            <span className="hidden sm:block"><StatusPill status={item.category} /></span>
            <span className={item.kind === "revenu" ? "text-right font-bold text-pine" : "text-right font-bold text-rose"}>
              {item.kind === "revenu" ? "+" : "-"}{formatCurrency(Math.abs(item.amount))}
            </span>
          </div>
        ))}
      </section>
    </AppShell>
  );
}
