"use client";

import { Loader2, SendHorizontal, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { formatCurrency } from "@/lib/format";

const examples = [
  "Quel bien est le plus rentable ?",
  "Combien je gagne réellement par mois ?",
  "Quels loyers sont en retard ?",
  "Quels frais dois-je prévoir ?"
];

export function AssistantAnalyzer({
  monthlyIncome,
  monthlyExpenses,
  latePayments
}: {
  monthlyIncome: number;
  monthlyExpenses: number;
  latePayments: number;
}) {
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);

  const defaultAnswer = useMemo(() => {
    const cashflow = monthlyIncome - monthlyExpenses - 620 / 12;
    return [
      `Rendement brut estimé: 5,7 % sur l’ensemble des biens.`,
      `Rendement net estimé: 4,1 % après charges, assurance, précompte et petits travaux.`,
      `Cashflow mensuel estimé: ${formatCurrency(cashflow)} après les frais connus.`,
      `Précompte immobilier estimé: environ ${formatCurrency(620)} à lisser sur l’année.`,
      `Charges à surveiller: assurance habitation, énergie des communs et entretien chaudière.`,
      `Travaux probables: prévoir une réserve de ${formatCurrency(900)} à ${formatCurrency(1200)} pour plomberie et entretien.`,
      latePayments > 0
        ? `Alerte risque: ${latePayments} loyer semble en retard. À vérifier en priorité.`
        : "Alerte risque: aucun retard visible dans les données actuelles."
    ].join("\n");
  }, [latePayments, monthlyExpenses, monthlyIncome]);

  function analyze() {
    if (!question.trim()) return;
    setBusy(true);
    window.setTimeout(() => {
      setAnswer(defaultAnswer);
      setBusy(false);
    }, 450);
  }

  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
      <div className="flex items-start gap-4">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-pine text-white">
          <Sparkles size={26} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold text-ink">Posez une question simple</h2>
          <p className="mt-1 text-sm leading-6 text-ink/62">L’assistant répond avec une analyse immobilière claire, basée sur les données de démonstration.</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Exemple: Quels loyers sont en retard ?"
          className="focus-ring min-h-32 rounded-lg border border-line bg-cloud px-4 py-3 text-base text-ink"
        />
        <button
          type="button"
          onClick={analyze}
          disabled={busy || !question.trim()}
          className="focus-ring inline-flex min-h-14 items-center justify-center gap-2 rounded-lg bg-pine px-6 text-base font-bold text-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit"
        >
          {busy ? <Loader2 size={20} className="animate-spin" /> : <SendHorizontal size={20} />}
          Analyser
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {examples.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => setQuestion(example)}
            className="focus-ring rounded-lg border border-line bg-cloud px-3 py-2 text-sm font-semibold text-ink hover:bg-mint hover:text-pine"
          >
            {example}
          </button>
        ))}
      </div>

      {answer ? (
        <div className="mt-5 rounded-lg border border-line bg-cloud p-4">
          <h3 className="font-bold text-ink">Analyse proposée</h3>
          <div className="mt-3 space-y-2">
            {answer.split("\n").map((line) => (
              <p key={line} className="text-sm leading-6 text-ink/72">
                {line}
              </p>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
