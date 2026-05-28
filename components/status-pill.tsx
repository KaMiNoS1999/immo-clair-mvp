import { cn } from "@/lib/utils";

const labels: Record<string, string> = {
  info: "Info",
  warning: "À vérifier",
  critical: "Urgent",
  a_payer: "À payer",
  payee: "Payée",
  en_retard: "En retard",
  archivee: "Archivée",
  recu: "Reçu",
  attendu: "Attendu",
  retard: "Retard",
  partiel: "Partiel",
  classe: "Classé",
  analyse: "Analyse",
  a_traiter: "À traiter",
  erreur: "Erreur"
};

export function StatusPill({ status }: { status: string }) {
  const isBad = ["critical", "en_retard", "retard", "erreur"].includes(status);
  const isWarn = ["warning", "a_payer", "attendu", "partiel", "a_traiter", "analyse"].includes(status);

  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center rounded-full px-3 text-xs font-bold",
        isBad && "bg-[#ffe6e9] text-rose",
        isWarn && "bg-[#fff2d9] text-[#7a4a0a]",
        !isBad && !isWarn && "bg-mint text-pine"
      )}
    >
      {labels[status] ?? status}
    </span>
  );
}
