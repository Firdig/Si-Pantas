import { Card } from "@/components/ui/card";
import { ringkasan } from "@/lib/mock/warga/beranda";

export function SummaryCard() {
  return (
    <section aria-labelledby="ringkasan-judul">
      <Card className="p-5 sm:p-6">
        <h2
          id="ringkasan-judul"
          className="text-section-title font-semibold text-ink"
        >
          {ringkasan.title}
        </h2>

        <dl className="mt-4 grid grid-cols-2 gap-3">
          {ringkasan.stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-line px-4 py-4"
            >
              <dd
                className={[
                  "text-stat font-bold leading-none",
                  stat.tone === "brand" ? "text-brand" : "text-info",
                ].join(" ")}
              >
                {stat.value}
              </dd>
              <dt className="mt-3 text-caption text-ink-muted">{stat.label}</dt>
            </div>
          ))}
        </dl>

        <div className="mt-4 rounded-xl bg-brand-soft px-4 py-4">
          <h3 className="text-[16px] font-semibold text-brand-dark">
            {ringkasan.panduan.title}
          </h3>
          <ol className="mt-2 space-y-1 text-caption text-ink-muted">
            {ringkasan.panduan.steps.map((step, index) => (
              <li key={step} className="flex gap-2">
                <span className="font-semibold text-brand-dark">
                  {index + 1}.
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </Card>
    </section>
  );
}
