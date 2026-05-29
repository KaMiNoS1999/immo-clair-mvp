import { Building2, Mail, MapPin } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PropertyForm } from "@/components/property-form";
import { getProperties } from "@/lib/data";
import { formatCurrency } from "@/lib/format";

export default async function PropertiesPage() {
  const properties = await getProperties();

  return (
    <AppShell title="Biens immobiliers" subtitle="Chaque maison ou appartement avec son locataire, son loyer et ses documents.">
      <PropertyForm />

      <section className="grid gap-4 lg:grid-cols-2">
        {properties.map((property) => (
          <article key={property.id} className="rounded-lg border border-line bg-white p-5 shadow-soft">
            <div className="flex items-start gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-mint text-pine">
                <Building2 size={26} />
              </span>
              <div className="min-w-0">
                <h2 className="text-xl font-semibold text-ink">{property.name}</h2>
                <p className="mt-2 flex items-start gap-2 text-sm leading-6 text-ink/65">
                  <MapPin size={17} className="mt-1 shrink-0" />
                  {property.address}
                </p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-cloud p-4">
                <p className="text-sm text-ink/55">Loyer</p>
                <p className="mt-1 text-2xl font-bold text-ink">{formatCurrency(property.monthly_rent)}</p>
              </div>
              <div className="rounded-lg bg-cloud p-4">
                <p className="text-sm text-ink/55">Charges</p>
                <p className="mt-1 text-2xl font-bold text-ink">{formatCurrency(property.monthly_charges)}</p>
              </div>
            </div>
            <div className="mt-4 rounded-lg border border-line p-4">
              <p className="font-semibold text-ink">{property.tenant_name ?? "Aucun locataire indiqué"}</p>
              {property.tenant_email ? (
                <p className="mt-1 flex items-center gap-2 text-sm text-ink/60">
                  <Mail size={16} /> {property.tenant_email}
                </p>
              ) : null}
              {property.notes ? <p className="mt-3 text-sm leading-6 text-ink/65">{property.notes}</p> : null}
            </div>
          </article>
        ))}
      </section>
    </AppShell>
  );
}
