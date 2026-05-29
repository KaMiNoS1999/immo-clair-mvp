import { Mail, RefreshCw } from "lucide-react";
import { AppShell } from "@/components/app-shell";

const demoMails = [
  {
    id: "1",
    sender: "AG Insurance",
    subject: "Rappel facture assurance habitation",
    summary: "Facture détectée. Montant probable: 312 €. Échéance proche."
  },
  {
    id: "2",
    sender: "Plomberie Express",
    subject: "Facture intervention évier cuisine",
    summary: "Document lié à l’Appartement Louise. Catégorie proposée: travaux."
  }
];

export default function MailsPage() {
  return (
    <AppShell title="Mails administratifs" subtitle="Connexion Gmail pour détecter automatiquement factures, rappels et échéances.">
      <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-ink">Scanner Gmail</h2>
            <p className="mt-1 text-sm leading-6 text-ink/60">Le MVP prépare le flux. L’étape suivante consiste à ajouter les scopes Gmail dans Google Cloud.</p>
          </div>
          <button className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-pine px-5 text-sm font-semibold text-white">
            <RefreshCw size={18} /> Scanner
          </button>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {demoMails.map((mail) => (
          <article key={mail.id} className="rounded-lg border border-line bg-white p-5 shadow-soft">
            <div className="flex items-start gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-lg bg-mint text-pine">
                <Mail size={22} />
              </span>
              <div>
                <p className="text-sm font-semibold text-sage">{mail.sender}</p>
                <h2 className="mt-1 text-lg font-semibold text-ink">{mail.subject}</h2>
                <p className="mt-3 text-sm leading-6 text-ink/65">{mail.summary}</p>
              </div>
            </div>
          </article>
        ))}
      </section>
    </AppShell>
  );
}
