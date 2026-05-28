import Link from "next/link";
import { AlertTriangle, ArrowRight, Building2, FileText, Mail, ReceiptText, WalletCards } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { MetricCard } from "@/components/metric-card";
import { StatusPill } from "@/components/status-pill";
import { UploadPanel } from "@/components/upload-panel";
import { getDashboardData } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/format";

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <AppShell title="Tableau de bord" subtitle="Une vue claire de vos loyers, factures et documents.">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Revenus du mois" value={formatCurrency(data.monthlyIncome)} icon={WalletCards} tone="green" />
        <MetricCard label="Dépenses du mois" value={formatCurrency(data.monthlyExpenses)} icon={ReceiptText} tone="amber" />
        <MetricCard label="Loyers reçus" value={`${data.receivedRents}/${data.expectedRents}`} icon={Building2} tone="green" />
        <MetricCard label="Paiements en retard" value={String(data.latePayments)} icon={AlertTriangle} tone="red" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-lg border border-line bg-white p-5 shadow-soft">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-ink">Priorités</h2>
              <p className="mt-1 text-sm text-ink/60">Ce qui mérite votre attention aujourd’hui.</p>
            </div>
            <Link href="/assistant" className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-pine px-4 text-sm font-semibold text-white">
              Voir l’assistant <ArrowRight size={18} />
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {data.insights.map((item) => (
              <article key={item.id} className="rounded-lg border border-line bg-cloud p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-ink">{item.title}</h3>
                      <StatusPill status={item.severity} />
                    </div>
                    <p className="mt-2 text-sm leading-6 text-ink/70">{item.body}</p>
                  </div>
                  {item.action_href && item.action_label ? (
                    <Link href={item.action_href} className="text-sm font-semibold text-pine">
                      {item.action_label}
                    </Link>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>

        <UploadPanel />
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-lg border border-line bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-ink">Factures à payer</h2>
            <FileText className="text-sage" />
          </div>
          <div className="mt-4 divide-y divide-line">
            {data.invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="font-medium text-ink">{invoice.company}</p>
                  <p className="text-sm text-ink/60">Échéance: {formatDate(invoice.due_on)}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-ink">{formatCurrency(invoice.amount)}</p>
                  <StatusPill status={invoice.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-line bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-ink">Mails administratifs</h2>
            <Mail className="text-sage" />
          </div>
          <div className="mt-4 space-y-3">
            {data.mailSummaries.map((mail) => (
              <div key={mail.id} className="rounded-lg border border-line p-4">
                <p className="font-medium text-ink">{mail.subject}</p>
                <p className="mt-1 text-sm leading-6 text-ink/65">{mail.ai_summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
