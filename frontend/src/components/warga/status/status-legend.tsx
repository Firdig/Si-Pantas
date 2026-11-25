import { cn } from "@/lib/cn";
import { reportStatusDisplay, type StatusTone } from "@/lib/status";
import type { ReportStatus } from "@/types/api";

const dotTone: Record<StatusTone, string> = {
  success: "bg-brand",
  info: "bg-info",
  warning: "bg-warn",
  danger: "bg-danger",
};

const urutanStatus: ReportStatus[] = [
  "PENDING",
  "IN_PROGRESS",
  "COMPLETED",
  "REJECTED",
];

export function StatusLegend() {
  return (
    <aside
      aria-labelledby="legenda-status-judul"
      className="rounded-card border border-line bg-surface p-4 sm:p-5"
    >
      <h2
        id="legenda-status-judul"
        className="text-section-title font-semibold text-ink"
      >
        Status
      </h2>

      <ul className="mt-4 space-y-3">
        {urutanStatus.map((status) => {
          const display = reportStatusDisplay[status];

          return (
            <li key={status} className="flex gap-3">
              <span
                aria-hidden="true"
                className={cn(
                  "mt-1.5 h-3 w-3 shrink-0 rounded-full",
                  dotTone[display.tone],
                )}
              />
              <div>
                <p className="text-caption font-semibold text-ink">
                  {display.label}
                </p>
                <p className="text-meta leading-snug text-ink-muted">
                  {display.description}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
