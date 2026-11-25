import { cn } from "@/lib/cn";
import type { StatusTone } from "@/lib/status";

const dotTone: Record<StatusTone, string> = {
  success: "bg-brand",
  info: "bg-info",
  warning: "bg-warn",
  danger: "bg-danger",
};

export type TimelineEntry = {
  id: string;
  /** "08.42" */
  timeLabel: string;
  /** "Dilaporkan" */
  label: string;
  note: string | null;
  tone: StatusTone;
  isLatest: boolean;
};

type ReportTimelineProps = {
  entries: TimelineEntry[];
};

export function ReportTimeline({ entries }: ReportTimelineProps) {
  return (
    <ol className="mt-4">
      {entries.map((entry, index) => (
        <li
          key={entry.id}
          className={cn(
            "flex gap-2 rounded-xl px-2 py-3 sm:gap-3 sm:px-3",
            entry.isLatest && "bg-brand-tint",
          )}
        >
          <span className="w-10 shrink-0 pt-0.5 text-caption font-semibold tabular-nums text-ink-muted sm:w-12">
            {entry.timeLabel}
          </span>

          <span aria-hidden="true" className="flex flex-col items-center">
            <span
              className={cn(
                "mt-1.5 h-3 w-3 shrink-0 rounded-full",
                dotTone[entry.tone],
              )}
            />
            {index < entries.length - 1 ? (
              <span className="mt-1 w-px flex-1 bg-line-strong" />
            ) : null}
          </span>

          <div className="min-w-0 pb-1">
            <p className="text-body font-semibold leading-snug text-ink">
              {entry.label}
            </p>
            {entry.note ? (
              <p className="mt-0.5 text-caption leading-snug text-ink-muted">
                {entry.note}
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
