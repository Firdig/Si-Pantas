import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { formatDateId } from "@/lib/format";
import { edukasiPublik, getEdukasiBySlug } from "@/lib/mock/edukasi";

export const instant = false;

export function generateStaticParams() {
  return edukasiPublik.map((edukasi) => ({ slug: edukasi.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/edukasi/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const artikel = getEdukasiBySlug(slug);

  return {
    title: artikel ? `${artikel.title} — SI-PANTAS` : "Artikel tidak ditemukan — SI-PANTAS",
    description: artikel?.content.slice(0, 150),
  };
}

/** Perkiraan waktu baca, dihitung dari jumlah kata (±200 kata/menit). */
function hitungMenitBaca(teks: string): number {
  const jumlahKata = teks.trim().split(/\s+/).filter(Boolean).length;

  return Math.max(1, Math.round(jumlahKata / 200));
}

export default async function DetailEdukasiPage({
  params,
}: PageProps<"/edukasi/[slug]">) {
  const { slug } = await params;
  const artikel = getEdukasiBySlug(slug);

  if (!artikel) notFound();

  const paragraf = artikel.content
    .split(/\n{2,}/)
    .map((bagian) => bagian.trim())
    .filter(Boolean);

  return (
    <div className="mx-auto w-full max-w-[1440px] px-5 pb-14 pt-8 sm:px-8 lg:px-14 lg:pb-20 lg:pt-10">
      <article className="max-w-[860px]">
        <Breadcrumb
          items={[
            { label: "Beranda", href: "/" },
            { label: "Pusat Edukasi", href: "/edukasi" },
            { label: artikel.title },
          ]}
        />

        <h1 className="mt-4 text-[30px] font-bold leading-[1.2] tracking-tight text-ink sm:text-[34px]">
          {artikel.title}
        </h1>

        <p className="mt-2 text-caption text-ink-muted">
          {artikel.category ?? "Umum"} · Bacaan ±{hitungMenitBaca(artikel.content)}{" "}
          menit
        </p>

        {artikel.imageUrl ? (
          <div className="mt-6 overflow-hidden rounded-xl border border-line bg-brand-tint">
            {/* eslint-disable-next-line @next/next/no-img-element -- URL gambar berasal dari backend, host belum ditentukan */}
            <img
              src={artikel.imageUrl}
              alt={`Ilustrasi: ${artikel.title}`}
              className="aspect-[16/9] w-full object-cover"
            />
          </div>
        ) : (
          <div className="mt-6 flex aspect-[16/9] w-full items-center justify-center rounded-xl border border-dashed border-line-strong bg-brand-tint">
            <p className="text-caption text-ink-subtle">
              Gambar ilustrasi belum tersedia.
            </p>
          </div>
        )}

        <div className="mt-6 space-y-4 text-body leading-relaxed text-ink">
          {paragraf.map((bagian) => (
            <p key={bagian.slice(0, 40)}>{bagian}</p>
          ))}
        </div>

        <p className="mt-10 border-t border-line pt-4 text-caption text-ink-muted">
          Ditulis oleh {artikel.authorName} · Diperbarui{" "}
          {formatDateId(artikel.updatedAt)}
        </p>
      </article>
    </div>
  );
}
