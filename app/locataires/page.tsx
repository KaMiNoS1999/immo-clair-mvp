import { Mail, UserRound } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { requireUserOrDemo } from "@/lib/auth";
import { getProperties } from "@/lib/data";
import { formatCurrency } from "@/lib/format";

export default async function TenantsPage() {
  await requireUserOrDemo();
  const properties = await getProperties();

  return (
    <AppShell title="Locataires" subtitle="Les personnes qui occupent vos biens, avec le loyer associé.">
      <section className="grid gap-4 lg:grid-cols-2">
        {properties.map((property) => (
          <article key={property.id} className="rounded-lg border border-line bg-white p-5 shadow-soft">
            <div className="flex items-start gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-mint text-pine">
                <UserRound size={24} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-sage">{property.name}</p>
                <h2 className="mt-1 text-xl font-bold text-ink">{property.tenant_name ?? "Aucun locataire indiqué"}</h2>
                {property.tenant_email ? (
                  <p className="mt-2 flex items-center gap-2 text-sm text-ink/65">
                    <Mail size={16} />
                    {property.tenant_email}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="mt-5 rounded-lg bg-cloud p-4">
              <p className="text-sm text-ink/60">Loyer mensuel avec charges</p>
              <p className="mt-1 text-2xl font-bold text-ink">{formatCurrency(property.monthly_rent + property.monthly_charges)}</p>
            </div>
          </article>
        ))}
      </section>
    </AppShell>
  );
}
