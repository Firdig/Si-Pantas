import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { reportStatusDisplay } from "@/lib/status";
import type { Report } from "@/types/api";

export type ReportView = Report & {
  /** "Titik 1 · RT 01" */
  pointLabel: string;
  /** "hari ini, 10.05" */
  updatedLabel: string;
};

type ReportCardProps = {
  report: ReportView;
};

export function ReportCard({ report }: ReportCardProps) {
  const status = reportStatusDisplay[report.status];

  return (
    <li>
      <article className="rounded-xl border border-line bg-surface p-4 transition-colors hover:border-line-strong sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-caption text-ink-subtle">{report.pointLabel}</p>

            <h3 className="mt-1 text-[19px] font-semibold leading-snug text-ink">
              {report.title}
            </h3>

            {report.description ? (
              <p className="mt-1 line-clamp-2 text-caption text-ink-muted">
                {report.description}
              </p>
            ) : null}

            <p className="mt-2 text-[14px] text-ink-subtle">
              {report.reportCode} · Diperbarui {report.updatedLabel}
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-3">
            <Badge tone={status.tone}>{status.label}</Badge>

            <ButtonLink
              href={`/status/${report.reportCode}`}
              variant="outline"
              size="md"
              aria-label={`Detail laporan ${report.reportCode}`}
            >
              Detail Laporan
            </ButtonLink>
          </div>
        </div>
      </article>
    </li>
  );
}
