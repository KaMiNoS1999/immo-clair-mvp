import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { StatusPill } from "@/components/status-pill";
import { requireUserOrDemo } from "@/lib/auth";
import { getProperties, getRentPayments } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/format";

export default async function RentsPage() {
  await requireUserOrDemo();
  const [payments, properties] = await Promise.all([getRentPayments(), getProperties()]);
  const propertyById = new Map(properties.map((property) => [property.id, property.name]));
  const latePayments = payments.filter((payment) => payment.status === "retard" || payment.status === "partiel");

  return (
    <AppShell title="Loyers" subtitle="Les loyers reçus, attendus et en retard.">
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-line bg-white p-5 shadow-soft">
          <p className="flex items-center gap-2 text-sm font-bold text-sage">
            <CheckCircle2 size={18} />
            Loyers reçus
          </p>
          <p className="mt-2 text-3xl font-bold text-pine">
            {payments.filter((payment) => payment.status === "recu").length}/{payments.length}
          </p>
        </div>
        <div className="rounded-lg border border-line bg-white p-5 shadow-soft">
          <p className="flex items-center gap-2 text-sm font-bold text-rose">
            <AlertTriangle size={18} />
            Retards à vérifier
          </p>
          <p className="mt-2 text-3xl font-bold text-ink">{latePayments.length}</p>
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-line bg-white shadow-soft">
        {payments.map((payment) => (
          <div key={payment.id} className="grid gap-3 border-b border-line p-4 last:border-b-0 sm:grid-cols-[1fr_150px_150px_120px] sm:items-center">
            <div>
              <p className="font-bold text-ink">{propertyById.get(payment.property_id) ?? "Bien non lié"}</p>
              <p className="mt-1 text-sm text-ink/60">Échéance: {formatDate(payment.due_on)}</p>
            </div>
            <p className="text-sm text-ink/65">Prévu: {formatCurrency(payment.expected_amount)}</p>
            <p className="text-sm text-ink/65">Reçu: {formatCurrency(payment.received_amount)}</p>
            <StatusPill status={payment.status} />
          </div>
        ))}
      </section>
    </AppShell>
  );
}
