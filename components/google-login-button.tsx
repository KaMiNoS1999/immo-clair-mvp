"use client";

import { LogIn, Loader2 } from "lucide-react";
import { useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function GoogleLoginButton({
  label = "Se connecter avec Google",
  next = "/dashboard",
  className
}: {
  label?: string;
  next?: string;
  className?: string;
}) {
  const hasSupabaseEnv = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const [busy, setBusy] = useState(false);

  async function signIn() {
    if (!hasSupabaseEnv) {
      window.location.href = "/login";
      return;
    }

    setBusy(true);
    const supabase = createBrowserSupabaseClient();
    const origin = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`
      }
    });
  }

  return (
    <button
      type="button"
      onClick={signIn}
      disabled={busy}
      className={cn(
        "focus-ring inline-flex min-h-14 items-center justify-center gap-3 rounded-lg bg-pine px-6 text-base font-bold text-white shadow-soft disabled:cursor-wait disabled:opacity-75",
        className
      )}
    >
      {busy ? <Loader2 size={21} className="animate-spin" /> : <LogIn size={21} />}
      {busy ? "Ouverture de Google..." : label}
    </button>
  );
}
