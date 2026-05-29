import Link from "next/link";
import { AlertTriangle, ArrowRight, FileUp, Landmark, ReceiptText, WalletCards } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { MetricCard } from "@/components/metric-card";
import { StatusPill } from "@/components/status-pill";
import { requireUserOrDemo } from "@/lib/auth";
import { getDashboardData } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/format";

const quickActions = [
  { href: "/documents#releve-bancaire", label: "Ajouter un relevé bancaire", icon: Landmark },
  { href: "/documents#facture", label: "Ajouter une facture", icon: FileUp },
  { href: "/loyers", label: "Voir les retards", icon: ReceiptText }
];

export default async function DashboardPage() {
  await requireUserOrDemo();
  const data = await getDashboardData();

  return (
    <AppShell title="Tableau de bord" subtitle="L’essentiel à vérifier, sans jargon.">
      <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-ink">À faire aujourd’hui</h2>
            <p className="mt-1 text-sm leading-6 text-ink/62">Commencez par ces trois actions. Le reste peut attendre.</p>
          </div>
          <Link href="/documents" className="focus-ring inline-flex min-h-14 items-center justify-center gap-2 rounded-lg bg-pine px-6 text-base font-bold text-white">
            <FileUp size={21} />
            Ajouter un document
          </Link>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href} className="focus-ring flex min-h-20 items-center gap-3 rounded-lg border border-line bg-cloud p-4 font-bold text-ink hover:border-sage hover:bg-mint">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-white text-pine">
                <action.icon size={22} />
              </span>
              {action.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Argent reçu ce mois-ci" value={formatCurrency(data.monthlyIncome)} icon={WalletCards} tone="green" />
        <MetricCard label="Factures et frais" value={formatCurrency(data.monthlyExpenses)} icon={ReceiptText} tone="amber" />
        <MetricCard label="Loyers en retard" value={String(data.latePayments)} icon={AlertTriangle} tone="red" />
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border border-line bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-ink">Alertes simples</h2>
            <Link href="/assistant" className="inline-flex items-center gap-2 text-sm font-bold text-pine">
              Assistant <ArrowRight size={17} />
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {data.insights.slice(0, 3).map((item) => (
              <article key={item.id} className="rounded-lg border border-line p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-ink">{item.title}</h3>
                  <StatusPill status={item.severity} />
                </div>
                <p className="mt-2 text-sm leading-6 text-ink/68">{item.body}</p>
                {item.action_href && item.action_label ? (
                  <Link href={item.action_href} className="mt-3 inline-flex text-sm font-bold text-pine">
                    {item.action_label}
                  </Link>
                ) : null}
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-line bg-white p-5 shadow-soft">
          <h2 className="text-xl font-bold text-ink">Factures à payer</h2>
          <div className="mt-4 divide-y divide-line">
            {data.invoices.slice(0, 3).map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="font-bold text-ink">{invoice.company}</p>
                  <p className="mt-1 text-sm text-ink/60">À payer avant le {formatDate(invoice.due_on)}</p>
                </div>
                <p className="text-right font-bold text-ink">{formatCurrency(invoice.amount)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
