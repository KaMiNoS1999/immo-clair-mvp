"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function PropertyForm() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/properties", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: { "Content-Type": "application/json" }
    });
    const result = await response.json();
    setMessage(result.message ?? "Bien ajouté.");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="rounded-lg border border-line bg-white p-5 shadow-soft">
      <h2 className="text-xl font-semibold text-ink">Ajouter un bien</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <input name="name" required placeholder="Nom du bien" className="focus-ring min-h-12 rounded-lg border border-line px-3" />
        <select name="kind" className="focus-ring min-h-12 rounded-lg border border-line px-3">
          <option value="appartement">Appartement</option>
          <option value="maison">Maison</option>
          <option value="garage">Garage</option>
          <option value="commerce">Commerce</option>
          <option value="autre">Autre</option>
        </select>
        <input name="address" required placeholder="Adresse complète" className="focus-ring min-h-12 rounded-lg border border-line px-3 sm:col-span-2" />
        <input name="tenant_name" placeholder="Locataire" className="focus-ring min-h-12 rounded-lg border border-line px-3" />
        <input name="tenant_email" type="email" placeholder="Email du locataire" className="focus-ring min-h-12 rounded-lg border border-line px-3" />
        <input name="monthly_rent" type="number" min="0" step="0.01" placeholder="Loyer mensuel" className="focus-ring min-h-12 rounded-lg border border-line px-3" />
        <input name="monthly_charges" type="number" min="0" step="0.01" placeholder="Charges" className="focus-ring min-h-12 rounded-lg border border-line px-3" />
        <textarea name="notes" placeholder="Notes utiles" className="focus-ring min-h-28 rounded-lg border border-line px-3 py-3 sm:col-span-2" />
      </div>
      <button className="focus-ring mt-4 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-pine px-5 text-sm font-semibold text-white">
        <Plus size={18} /> Ajouter
      </button>
      {message ? <p className="mt-3 rounded-lg bg-mint p-3 text-sm font-semibold text-pine">{message}</p> : null}
    </form>
  );
}
