"use client";

import { LogIn, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export function AuthButton() {
  const hasSupabaseEnv = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!hasSupabaseEnv) return;
    const supabase = createBrowserSupabaseClient();
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, [hasSupabaseEnv]);

  async function signIn() {
    const supabase = createBrowserSupabaseClient();
    const origin = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?next=/`
      }
    });
  }

  async function signOut() {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    window.location.reload();
  }

  if (!hasSupabaseEnv) {
    return (
      <span className="inline-flex min-h-12 items-center justify-center rounded-lg border border-line bg-cloud px-4 text-sm font-semibold text-ink/65">
        Mode démo
      </span>
    );
  }

  return email ? (
    <button onClick={signOut} className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-line bg-white px-4 text-sm font-semibold text-ink">
      <LogOut size={18} />
      Déconnexion
    </button>
  ) : (
    <button onClick={signIn} className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-pine px-4 text-sm font-semibold text-white">
      <LogIn size={18} />
      Connexion Google
    </button>
  );
}
