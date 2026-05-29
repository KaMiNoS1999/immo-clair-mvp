import { NextResponse } from "next/server";
import { demoResponse, getRouteUser } from "@/lib/api";

export async function POST() {
  const user = await getRouteUser();
  if (!user) return demoResponse("Mode démo: connectez Google pour scanner les mails administratifs.");

  return NextResponse.json({
    ok: true,
    message: "Connecteur Gmail prêt. Ajoutez les scopes Gmail dans Supabase Auth pour activer le scan réel."
  });
}
