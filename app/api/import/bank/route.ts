import { NextResponse } from "next/server";
import Papa from "papaparse";
import { demoResponse, errorResponse, getRouteUser } from "@/lib/api";
import { createRouteSupabaseClient } from "@/lib/supabase/server";

type ParsedBankRow = {
  Date?: string;
  date?: string;
  Libelle?: string;
  label?: string;
  Description?: string;
  Montant?: string;
  amount?: string;
};

type TransactionInsert = {
  owner_id: string;
  occurred_on: string;
  label: string;
  amount: number;
  kind: "revenu" | "depense";
  category: string;
  counterparty: string;
  confidence: number;
  source: string;
};

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return errorResponse("Aucun fichier reçu.");

  const user = await getRouteUser();
  if (!user) return demoResponse("Mode démo: le relevé est lu, puis les transactions seront ajoutées après connexion.");

  if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
    return NextResponse.json({
      ok: true,
      message: "PDF bancaire reçu. Ajoutez une étape d’extraction PDF pour convertir les lignes avant insertion."
    });
  }

  const text = await file.text();
  const parsed = Papa.parse<ParsedBankRow>(text, { header: true, skipEmptyLines: true });

  if (parsed.errors.length) return errorResponse("Le CSV bancaire n’a pas pu être lu.");

  const transactions = parsed.data.reduce<TransactionInsert[]>((items, row) => {
      const rawAmount = row.Montant ?? row.amount ?? "0";
      const amount = Number(String(rawAmount).replace(",", ".").replace(/\s/g, ""));
      const label = row.Libelle ?? row.label ?? row.Description ?? "Transaction bancaire";
      const occurred_on = row.Date ?? row.date;

      if (!occurred_on || Number.isNaN(amount)) return items;

      items.push({
        owner_id: user.id,
        occurred_on,
        label,
        amount,
        kind: amount >= 0 ? "revenu" : "depense",
        category: categorize(label, amount),
        counterparty: label,
        confidence: 0.72,
        source: "banque"
      });

      return items;
    }, []);

  const supabase = createRouteSupabaseClient();
  const { error } = await supabase.from("transactions").insert(transactions);
  if (error) return errorResponse(error.message);

  return NextResponse.json({ ok: true, message: `${transactions.length} transaction(s) importée(s).` });
}

function categorize(label: string, amount: number) {
  const value = label.toLowerCase();
  if (amount > 0 && /loyer|rent|locataire/.test(value)) return "loyer";
  if (/assurance|insurance/.test(value)) return "assurance";
  if (/energie|gaz|electric|eau|engie|luminus/.test(value)) return "energie";
  if (/taxe|precompte|spf|impot/.test(value)) return "taxes";
  if (/travaux|plomb|chauff|renov|brico/.test(value)) return "travaux";
  return amount > 0 ? "revenu" : "autre_depense";
}
