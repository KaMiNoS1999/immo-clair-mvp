import { NextResponse } from "next/server";
import { z } from "zod";
import { demoResponse, errorResponse, getRouteUser } from "@/lib/api";
import { createRouteSupabaseClient } from "@/lib/supabase/server";

const propertySchema = z.object({
  name: z.string().min(2),
  kind: z.enum(["maison", "appartement", "garage", "commerce", "autre"]),
  address: z.string().min(4),
  tenant_name: z.string().optional().nullable(),
  tenant_email: z.string().optional().nullable(),
  monthly_rent: z.coerce.number().min(0).default(0),
  monthly_charges: z.coerce.number().min(0).default(0),
  notes: z.string().optional().nullable()
});

export async function POST(request: Request) {
  const payload = propertySchema.safeParse(await request.json());
  if (!payload.success) return errorResponse("Certains champs du bien sont incomplets.");

  const user = await getRouteUser();
  if (!user) return demoResponse("Mode démo: le bien est prêt à être ajouté après connexion Supabase.");

  const supabase = createRouteSupabaseClient();
  const { error } = await supabase.from("properties").insert({
    ...payload.data,
    owner_id: user.id
  });

  if (error) return errorResponse(error.message);
  return NextResponse.json({ ok: true, message: "Bien ajouté avec succès." });
}
