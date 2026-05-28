import type { LucideIcon } from "lucide-react";

const tones = {
  green: "bg-mint text-pine",
  amber: "bg-[#fff2d9] text-[#7a4a0a]",
  red: "bg-[#ffe6e9] text-rose"
};

export function MetricCard({
  label,
  value,
  icon: Icon,
  tone
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  tone: keyof typeof tones;
}) {
  return (
    <article className="rounded-lg border border-line bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-ink/60">{label}</p>
          <p className="mt-3 text-3xl font-bold tracking-normal text-ink">{value}</p>
        </div>
        <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-lg ${tones[tone]}`}>
          <Icon size={24} />
        </span>
      </div>
    </article>
  );
}
