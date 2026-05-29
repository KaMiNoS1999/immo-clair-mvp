"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { GoogleLoginButton } from "@/components/google-login-button";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export function AuthButton() {
  const hasSupabaseEnv = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!hasSupabaseEnv) return;
    const supabase = createBrowserSupabaseClient();
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user.email ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, [hasSupabaseEnv]);

  async function signOut() {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  if (!hasSupabaseEnv) {
    return (
      <Link href="/login" className="focus-ring inline-flex min-h-12 items-center justify-center rounded-lg bg-pine px-4 text-sm font-bold text-white">
        Connexion Google
      </Link>
    );
  }

  return email ? (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <span className="max-w-[220px] truncate rounded-lg bg-cloud px-3 py-2 text-sm font-semibold text-ink/75">{email}</span>
      <button onClick={signOut} className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-line bg-white px-4 text-sm font-semibold text-ink">
        <LogOut size={18} />
        Déconnexion
      </button>
    </div>
  ) : (
    <GoogleLoginButton label="Connexion Google" className="min-h-12 px-4 text-sm" />
  );
}
