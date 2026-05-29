import { NextResponse } from "next/server";
import { inflateSync } from "node:zlib";
import { createOpenAIClient } from "@/lib/openai";
import { demoResponse, errorResponse, getRouteUser } from "@/lib/api";
import { createRouteSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return errorResponse("Aucun document reçu.");

  const user = await getRouteUser();
  if (!user) return demoResponse("Mode démo: le document serait stocké, analysé et classé automatiquement.");

  const supabase = createRouteSupabaseClient();
  const filePath = `${user.id}/${Date.now()}-${file.name}`;
  const upload = await supabase.storage.from("property-documents").upload(filePath, file, {
    contentType: file.type,
    upsert: false
  });

  if (upload.error) return errorResponse(upload.error.message);

  const extracted = await analyzeDocument(file);
  const { error } = await supabase.from("documents").insert({
    owner_id: user.id,
    title: file.name,
    file_path: filePath,
    file_type: file.type,
    status: extracted ? "classe" : "a_traiter",
    extracted_amount: extracted?.amount ?? null,
    extracted_date: extracted?.date ?? null,
    extracted_company: extracted?.company ?? null,
    extracted_category: extracted?.category ?? null,
    ai_summary: extracted?.summary ?? "Document importé. Analyse automatique à compléter."
  });

  if (error) return errorResponse(error.message);
  return NextResponse.json({ ok: true, message: "Document importé et analysé." });
}

async function analyzeDocument(file: File) {
  if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
    const text = await extractPdfText(file);
    return analyzeTextDocument(text);
  }

  if (!file.type.startsWith("image/")) return null;
  if (!process.env.OPENAI_API_KEY) return null;

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString("base64");
  const openai = createOpenAIClient();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: "Extract invoice data. Return JSON with amount, date, company, category, summary. Use null when unknown."
      },
      {
        role: "user",
        content: [
          { type: "text", text: "Analyse cette facture ou ce document administratif en français." },
          { type: "image_url", image_url: { url: `data:${file.type};base64,${base64}` } }
        ]
      }
    ]
  });

  const content = completion.choices[0]?.message.content;
  if (!content) return null;
  return parseExtractedJson(content);
}

async function extractPdfText(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const chunks = [buffer.toString("latin1")];
  const source = buffer.toString("latin1");
  const streamPattern = /<<(?:.|\n|\r)*?\/Filter\s*\/FlateDecode(?:.|\n|\r)*?>>\s*stream\r?\n([\s\S]*?)\r?\nendstream/g;

  for (const match of source.matchAll(streamPattern)) {
    try {
      chunks.push(inflateSync(Buffer.from(match[1], "latin1")).toString("latin1"));
    } catch {
      // Some PDF streams are not plain Flate blocks. The raw text pass still gives us a best effort.
    }
  }

  return chunks.map(extractPdfStrings).join("\n").replace(/\s{2,}/g, " ").slice(0, 12000);
}

async function analyzeTextDocument(text: string) {
  if (!text.trim()) return null;

  if (!process.env.OPENAI_API_KEY) {
    const amountMatch = text.match(/(?:total|montant|à payer|a payer)[^\d]{0,30}(\d{1,3}(?:[ .]\d{3})*(?:[,.]\d{2})?)/i);
    const dateMatch = text.match(/\b(20\d{2}-\d{2}-\d{2}|\d{2}\/\d{2}\/20\d{2}|\d{2}-\d{2}-20\d{2})\b/);
    const company = text.split("\n").map((line) => line.trim()).find((line) => line.length > 3 && line.length < 80) ?? null;

    return {
      amount: amountMatch ? Number(amountMatch[1].replace(/[ .]/g, "").replace(",", ".")) : null,
      date: normalizeDate(dateMatch?.[1] ?? null),
      company,
      category: inferCategory(text),
      summary: "PDF analysé localement. Ajoutez OPENAI_API_KEY pour une extraction plus précise."
    };
  }

  const openai = createOpenAIClient();
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: "Extract invoice data from OCR/PDF text. Return JSON with amount, date, company, category, summary. Date must be YYYY-MM-DD or null."
      },
      {
        role: "user",
        content: text
      }
    ]
  });

  const content = completion.choices[0]?.message.content;
  if (!content) return null;
  return parseExtractedJson(content);
}

function parseExtractedJson(content: string) {
  return JSON.parse(content) as {
    amount: number | null;
    date: string | null;
    company: string | null;
    category: string | null;
    summary: string | null;
  };
}

function normalizeDate(value: string | null) {
  if (!value) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const match = value.match(/^(\d{2})[/-](\d{2})[/-](20\d{2})$/);
  if (!match) return null;
  return `${match[3]}-${match[2]}-${match[1]}`;
}

function inferCategory(text: string) {
  const value = text.toLowerCase();
  if (/assurance|insurance/.test(value)) return "assurance";
  if (/energie|énergie|gaz|electric|électric|eau|engie|luminus/.test(value)) return "energie";
  if (/taxe|précompte|precompte|spf|impôt|impot/.test(value)) return "taxes";
  if (/travaux|plomb|chauff|rénov|renov|réparation|reparation/.test(value)) return "travaux";
  return "facture";
}

function extractPdfStrings(value: string) {
  const parts: string[] = [];
  const literalPattern = /\((?:\\.|[^\\)])*\)/g;
  const hexPattern = /<([0-9a-fA-F\s]{8,})>/g;

  for (const match of value.matchAll(literalPattern)) {
    parts.push(
      match[0]
        .slice(1, -1)
        .replace(/\\([nrtbf()\\])/g, (_, escaped: string) => {
          const replacements: Record<string, string> = {
            n: "\n",
            r: "\r",
            t: "\t",
            b: "",
            f: "",
            "(": "(",
            ")": ")",
            "\\": "\\"
          };
          return replacements[escaped] ?? escaped;
        })
    );
  }

  for (const match of value.matchAll(hexPattern)) {
    const compact = match[1].replace(/\s/g, "");
    if (compact.length % 2 !== 0) continue;
    const bytes = Buffer.from(compact, "hex");
    const decoded = bytes.includes(0) ? bytes.toString("utf16le") : bytes.toString("latin1");
    if (/[A-Za-zÀ-ÿ0-9]{3}/.test(decoded)) parts.push(decoded);
  }

  return parts.join(" ");
}
