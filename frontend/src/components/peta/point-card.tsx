import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import { pointConditionDisplay } from "@/lib/status";
import type { WastePoint } from "@/types/api";

type PointCardProps = {
  point: WastePoint;
  lastUpdatedLabel: string;
  active: boolean;
  onSelect: () => void;
};

export function PointCard({
  point,
  lastUpdatedLabel,
  active,
  onSelect,
}: PointCardProps) {
  const status = pointConditionDisplay[point.condition];

  return (
    <li id={`titik-${point.id}`}>
      <article
        onMouseEnter={onSelect}
        className={cn(
          "rounded-xl border bg-surface p-4 transition-colors",
          active ? "border-brand" : "border-line",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-item-title font-semibold leading-snug text-ink">
            {point.name} · {point.rt}
          </h3>
          <Badge tone={status.tone}>{status.label}</Badge>
        </div>

        <p className="mt-1.5 text-caption text-ink-muted">{lastUpdatedLabel}</p>

        <Link
          href={`/peta/${point.id}`}
          onFocus={onSelect}
          className="mt-3 inline-flex min-h-[52px] w-full items-center justify-center rounded-[10px] border-2 border-brand bg-surface px-4 text-body font-semibold text-brand transition-colors hover:bg-brand-tint"
        >
          Lihat Detail
        </Link>
      </article>
    </li>
  );
}
