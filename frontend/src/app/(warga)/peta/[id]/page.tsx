import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { formatRelativeDay } from "@/lib/format";
import { getTitikById, MOCK_NOW, titikSampah } from "@/lib/mock/warga/titik";
import { pointConditionDisplay } from "@/lib/status";

/**
 * Halaman detail butuh `params` untuk memuat titik dan bisa berakhir 404,
 * jadi wajar bila render pertama menunggu server (bukan instan).
 */
export const instant = false;

/** Semua titik pada data contoh dibuat statis lewat generateStaticParams. */
export function generateStaticParams() {
  return titikSampah.map((titik) => ({ id: titik.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/peta/[id]">): Promise<Metadata> {
  const { id } = await params;
  const point = getTitikById(id);

  return {
    title: point
      ? `${point.name} · ${point.rt} — SI-PANTAS`
      : "Titik tidak ditemukan — SI-PANTAS",
  };
}

export default async function DetailTitikPage({ params }: PageProps<"/peta/[id]">) {
  const { id } = await params;
  const point = getTitikById(id);

  if (!point) notFound();

  const status = pointConditionDisplay[point.condition];
  const lastUpdated = formatRelativeDay(point.lastUpdatedAt, MOCK_NOW);

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 pb-10 pt-6 sm:px-8 sm:pb-14 sm:pt-10 lg:px-14 lg:pb-20 lg:pt-12">
      <PageHeader
        title={`${point.name} · ${point.rt}`}
        description="Detail titik pengumpulan sampah di wilayah RW XI."
      />

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8">
        <Card className="p-5 sm:p-6">
          <h2 className="text-section-title font-semibold text-ink">
            Foto kondisi titik sampah
          </h2>

          <div className="mt-4 flex h-[240px] items-center justify-center rounded-xl border border-dashed border-line-strong bg-brand-tint sm:h-[340px] lg:h-[420px]">
            <p className="text-caption text-ink-subtle">
              Foto titik belum tersedia.
            </p>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-section-title font-semibold text-ink">
                Kondisi saat ini
              </h2>
              <Badge tone={status.tone}>{status.label}</Badge>
            </div>

            <p className="mt-3 text-caption leading-relaxed text-ink-muted">
              Terakhir diperbarui {lastUpdated}. Status dapat berubah bila ada
              laporan baru dari petugas.
            </p>
          </Card>

          <Card className="p-4 sm:p-5">
            <h2 className="text-section-title font-semibold text-ink">
              Informasi titik
            </h2>

            <dl className="mt-3 space-y-2.5 text-caption">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">Nama titik</dt>
                <dd className="text-right font-semibold text-ink">
                  {point.name}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">Wilayah</dt>
                <dd className="text-right font-semibold text-ink">
                  {point.rt} / RW XI
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">Alamat</dt>
                <dd className="text-right font-semibold text-ink">
                  {point.address}
                </dd>
              </div>
            </dl>
          </Card>

          <ButtonLink href="/peta" variant="outline" full>
            Kembali ke Peta
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
