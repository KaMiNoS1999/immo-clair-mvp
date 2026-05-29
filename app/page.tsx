import Link from "next/link";
import { ArrowRight, FileUp, Home, Landmark, ReceiptText } from "lucide-react";
import { GoogleLoginButton } from "@/components/google-login-button";

const firstActions = [
  { label: "Ajouter un relevé bancaire", icon: Landmark },
  { label: "Ajouter une facture", icon: FileUp },
  { label: "Voir les retards", icon: ReceiptText }
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-cloud px-4 py-8 text-ink sm:px-6">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-center gap-10">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-lg bg-pine text-white">
            <Home size={24} />
          </span>
          <span>
            <span className="block text-lg font-bold">Immo Clair</span>
            <span className="block text-sm text-ink/60">Vos loyers et factures au même endroit</span>
          </span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <h1 className="max-w-3xl text-4xl font-bold tracking-normal text-ink sm:text-6xl">
              Une gestion immobilière claire, sans Excel et sans papiers partout.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/68">
              Connectez-vous, ajoutez vos documents, puis laissez l’application vous montrer les loyers reçus, les retards et les factures importantes.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <GoogleLoginButton className="w-full sm:w-auto" />
              <Link href="/dashboard" className="focus-ring inline-flex min-h-14 items-center justify-center gap-2 rounded-lg border border-line bg-white px-6 text-base font-bold text-ink">
                Ouvrir le tableau de bord
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-line bg-white p-5 shadow-soft">
            <h2 className="text-xl font-bold text-ink">Les 3 actions importantes</h2>
            <div className="mt-5 space-y-3">
              {firstActions.map((action) => (
                <div key={action.label} className="flex items-center gap-3 rounded-lg bg-cloud p-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-mint text-pine">
                    <action.icon size={21} />
                  </span>
                  <span className="font-bold text-ink">{action.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
