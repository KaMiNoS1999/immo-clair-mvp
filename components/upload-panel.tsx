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
      <h2 className="text-xl font-semibold text-ink">Ajouter automatiquement</h2>
      <p className="mt-1 text-sm leading-6 text-ink/60">Déposez un relevé bancaire, une facture ou une photo. L’application classe les informations importantes.</p>

      <div className="mt-5 grid gap-3">
        <label className="focus-within:ring-4 focus-within:ring-mint flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-sage bg-cloud p-4">
          <Landmark className="text-pine" />
          <span>
            <span className="block font-semibold text-ink">Importer un relevé bancaire</span>
            <span className="block text-sm text-ink/55">CSV maintenant, PDF prêt pour l’analyse IA.</span>
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

        <label className="focus-within:ring-4 focus-within:ring-mint flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-sage bg-cloud p-4">
          <FileUp className="text-pine" />
          <span>
            <span className="block font-semibold text-ink">Importer une facture</span>
            <span className="block text-sm text-ink/55">PDF ou image, extraction du montant et de la date.</span>
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
