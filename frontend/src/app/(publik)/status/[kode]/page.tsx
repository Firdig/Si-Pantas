import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReportTimeline } from "@/components/status/report-timeline";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { formatDayTimeWib, formatTimeWib } from "@/lib/format";
import { getLaporanByKode, laporanSampah } from "@/lib/mock/laporan";
import { MOCK_NOW } from "@/lib/mock/titik";
import {
  reportStatusAdvice,
  reportStatusDisplay,
  reportTimelineLabel,
} from "@/lib/status";

export const instant = false;

export function generateStaticParams() {
  return laporanSampah.map((laporan) => ({ kode: laporan.reportCode }));
}

export async function generateMetadata({
  params,
}: PageProps<"/status/[kode]">): Promise<Metadata> {
  const { kode } = await params;
  const report = getLaporanByKode(kode);

  return {
    title: report
      ? `${report.reportCode} — SI-PANTAS`
      : "Laporan tidak ditemukan — SI-PANTAS",
  };
}

export default async function DetailStatusPage({
  params,
}: PageProps<"/status/[kode]">) {
  const { kode } = await params;
  const report = getLaporanByKode(kode);

  if (!report) notFound();

  const status = reportStatusDisplay[report.status];
  const advice = reportStatusAdvice[report.status];

  const histories = [...(report.histories ?? [])].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  const entries = histories.map((entry, index) => {
    const previous = histories[index - 1];
    // Bila status belum berubah (mis. "Diangkut oleh petugas"), catatan
    // petugas lebih informatif daripada mengulang label status yang sama.
    const sameStatusAsPrevious = previous?.newStatus === entry.newStatus;
    const label =
      sameStatusAsPrevious && entry.note
        ? entry.note
        : reportTimelineLabel[entry.newStatus];

    return {
      id: entry.id,
      timeLabel: formatTimeWib(entry.createdAt),
      label,
      note: sameStatusAsPrevious ? null : entry.note,
      tone: reportStatusDisplay[entry.newStatus].tone,
      isLatest: index === histories.length - 1,
    };
  });

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 pb-10 pt-6 sm:px-8 sm:pb-14 sm:pt-10 lg:px-14 lg:pb-20 lg:pt-12">
      <PageHeader
        title="Status Laporan"
        description="Riwayat penanganan laporan sampah di lingkungan RW XI."
      />

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8">
        <Card className="p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-section-title font-semibold text-ink">
                {report.title}
              </h2>
              <p className="mt-1 text-caption text-ink-muted">
                {report.reportCode} · {report.wastePoint.name} ·{" "}
                {report.wastePoint.rt}
              </p>
              <p className="mt-1 text-meta text-ink-subtle">
                Diperbarui {formatDayTimeWib(report.updatedAt, MOCK_NOW)}
              </p>
            </div>

            <Badge tone={status.tone}>{status.label}</Badge>
          </div>

          {report.description ? (
            <p className="mt-4 border-t border-line pt-4 text-caption leading-relaxed text-ink-muted">
              {report.description}
            </p>
          ) : null}

          <h3 className="mt-5 text-caption font-semibold uppercase tracking-wide text-ink-subtle">
            Riwayat penanganan
          </h3>

          {entries.length > 0 ? (
            <ReportTimeline entries={entries} />
          ) : (
            <p className="mt-3 text-caption text-ink-muted">
              Belum ada riwayat penanganan untuk laporan ini.
            </p>
          )}
        </Card>

        <div className="space-y-4">
          <Card className="p-4 sm:p-5">
            <h2 className="text-section-title font-semibold text-ink">
              Informasi untuk Anda
            </h2>
            <p className="mt-2 text-caption leading-relaxed text-ink-muted">
              {advice}
            </p>

            <ButtonLink href="/status" variant="outline" full className="mt-5">
              Kembali ke Cek Status
            </ButtonLink>
          </Card>

          <p className="text-caption text-ink-muted">
            Punya pertanyaan lain?{" "}
            <Link
              href="/bantuan"
              className="font-semibold text-brand hover:underline"
            >
              Hubungi pengurus RW
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
