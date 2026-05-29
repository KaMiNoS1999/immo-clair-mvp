import Link from "next/link";
import { redirect } from "next/navigation";
import { AlertCircle, Home, ShieldCheck } from "lucide-react";
import { GoogleLoginButton } from "@/components/google-login-button";
import { getCurrentUser, hasSupabaseConfig } from "@/lib/auth";

export default async function LoginPage() {
  const configured = hasSupabaseConfig();
  const user = await getCurrentUser();

  if (configured && user) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-cloud px-4 py-8 text-ink sm:px-6">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col justify-center gap-8">
        <Link href="/" className="inline-flex items-center gap-3 self-start">
          <span className="grid h-12 w-12 place-items-center rounded-lg bg-pine text-white">
            <Home size={24} />
          </span>
          <span>
            <span className="block text-lg font-bold">Immo Clair</span>
            <span className="block text-sm text-ink/60">Gestion simple des loyers</span>
          </span>
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-lg bg-mint px-3 py-2 text-sm font-bold text-pine">
              <ShieldCheck size={18} />
              Accès privé
            </p>
            <h1 className="mt-5 text-4xl font-bold tracking-normal text-ink sm:text-5xl">
              Se connecter avec Google
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-8 text-ink/68">
              Une fois connecté, vous arrivez directement sur le tableau de bord avec vos loyers, documents et alertes importantes.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              {configured ? (
                <GoogleLoginButton className="w-full sm:w-auto" />
              ) : (
                <div className="rounded-lg border border-amber/40 bg-white p-4 text-sm font-semibold leading-6 text-ink shadow-soft">
                  <div className="flex gap-3">
                    <AlertCircle className="mt-0.5 shrink-0 text-amber" size={21} />
                    <p>Connexion Google non configurée. Ajoutez les variables Supabase dans Vercel.</p>
                  </div>
                </div>
              )}
              <Link href="/dashboard" className="focus-ring inline-flex min-h-14 items-center justify-center rounded-lg border border-line bg-white px-6 text-base font-bold text-ink">
                Ouvrir le tableau de bord
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-line bg-white p-5 shadow-soft">
            <h2 className="text-xl font-bold text-ink">Après connexion</h2>
            <div className="mt-4 space-y-3 text-sm leading-6 text-ink/70">
              <p>1. Ajoutez un relevé bancaire.</p>
              <p>2. Ajoutez une facture ou un PDF.</p>
              <p>3. Vérifiez les retards et les alertes.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
