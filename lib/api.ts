import { NextResponse } from "next/server";
import { createRouteSupabaseClient } from "@/lib/supabase/server";

export function hasRuntimeSupabase() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function getRouteUser() {
  if (!hasRuntimeSupabase()) return null;
  const supabase = createRouteSupabaseClient();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

export function demoResponse(message: string, extra: Record<string, unknown> = {}) {
  return NextResponse.json({
    ok: true,
    demo: true,
    message,
    ...extra
  });
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}
