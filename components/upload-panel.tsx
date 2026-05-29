"use client";

import { FileUp, Landmark, Loader2 } from "lucide-react";
import { useState } from "react";

export function UploadPanel() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function upload(endpoint: string, file: File) {
    setBusy(true);
    setMessage(null);
    const form = new FormData();
    form.append("file", file);
    const response = await fetch(endpoint, { method: "POST", body: form });
    const result = await response.json();
    setMessage(result.message ?? "Import terminé.");
    setBusy(false);
  }

  return (
    <div className="rounded-lg border border-line bg-white p-5 shadow-soft">
      <h2 className="text-2xl font-bold text-ink">Ajouter un document</h2>
      <p className="mt-1 text-sm leading-6 text-ink/60">Choisissez un relevé, une facture ou une photo. L’application enregistre les informations utiles.</p>

      <div className="mt-5 grid gap-3">
        <label id="releve-bancaire" className="focus-within:ring-4 focus-within:ring-mint flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-sage bg-cloud p-4">
          <Landmark className="text-pine" />
          <span>
            <span className="block font-bold text-ink">Ajouter un relevé bancaire</span>
            <span className="block text-sm text-ink/55">CSV ou PDF.</span>
          </span>
          <input
            type="file"
            accept=".csv,.pdf"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void upload("/api/import/bank", file);
            }}
          />
        </label>

        <label id="facture" className="focus-within:ring-4 focus-within:ring-mint flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-sage bg-cloud p-4">
          <FileUp className="text-pine" />
          <span>
            <span className="block font-bold text-ink">Ajouter une facture</span>
            <span className="block text-sm text-ink/55">PDF ou image.</span>
          </span>
          <input
            type="file"
            accept=".pdf,image/*"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void upload("/api/documents/analyze", file);
            }}
          />
        </label>
      </div>

      {busy ? (
        <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-pine">
          <Loader2 size={18} className="animate-spin" /> Analyse en cours...
        </p>
      ) : null}
      {message ? <p className="mt-4 rounded-lg bg-mint p-3 text-sm font-semibold text-pine">{message}</p> : null}
    </div>
  );
}
