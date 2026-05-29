import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export function hasSupabaseConfig() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function getCurrentUser(): Promise<User | null> {
  if (!hasSupabaseConfig()) return null;

  const supabase = createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

export async function requireUserOrDemo() {
  if (!hasSupabaseConfig()) {
    return { isDemo: true, user: null as User | null };
  }

  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return { isDemo: false, user };
}
