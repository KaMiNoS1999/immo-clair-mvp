import { NextResponse } from "next/server";
import { getTransactions } from "@/lib/data";

export async function GET() {
  const transactions = await getTransactions();
  const rows = [
    ["Date", "Libelle", "Type", "Categorie", "Montant", "Source"],
    ...transactions.map((item) => [item.occurred_on, item.label, item.kind, item.category, String(item.amount), item.source])
  ];
  const csv = rows.map((row) => row.map(escapeCsv).join(";")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=\"comptabilite-mensuelle.csv\""
    }
  });
}

function escapeCsv(value: string) {
  if (/[;"\n]/.test(value)) return `"${value.replaceAll("\"", "\"\"")}"`;
  return value;
}
