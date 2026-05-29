import { FileText } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { StatusPill } from "@/components/status-pill";
import { UploadPanel } from "@/components/upload-panel";
import { requireUserOrDemo } from "@/lib/auth";
import { getDocuments } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/format";

export default async function DocumentsPage() {
  await requireUserOrDemo();
  const documents = await getDocuments();

  return (
    <AppShell title="Documents" subtitle="Factures, PDF et photos classés avec extraction automatique.">
      <UploadPanel />
      <section className="grid gap-4 lg:grid-cols-2">
        {documents.map((document) => (
          <article key={document.id} className="rounded-lg border border-line bg-white p-5 shadow-soft">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-lg bg-mint text-pine">
                  <FileText size={22} />
                </span>
                <div>
                  <h2 className="text-lg font-semibold text-ink">{document.title}</h2>
                  <p className="mt-1 text-sm text-ink/55">{document.file_path}</p>
                </div>
              </div>
              <StatusPill status={document.status} />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-cloud p-3">
                <p className="text-xs font-semibold uppercase text-ink/45">Montant</p>
                <p className="mt-1 font-bold text-ink">{formatCurrency(document.extracted_amount)}</p>
              </div>
              <div className="rounded-lg bg-cloud p-3">
                <p className="text-xs font-semibold uppercase text-ink/45">Date</p>
                <p className="mt-1 font-bold text-ink">{formatDate(document.extracted_date)}</p>
              </div>
              <div className="rounded-lg bg-cloud p-3">
                <p className="text-xs font-semibold uppercase text-ink/45">Type</p>
                <p className="mt-1 font-bold text-ink">{document.extracted_category ?? "À classer"}</p>
              </div>
            </div>
            {document.ai_summary ? <p className="mt-4 text-sm leading-6 text-ink/68">{document.ai_summary}</p> : null}
          </article>
        ))}
      </section>
    </AppShell>
  );
}
