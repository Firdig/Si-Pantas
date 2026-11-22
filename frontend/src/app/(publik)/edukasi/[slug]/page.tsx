import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { formatDateShort, formatDateTimeShort } from "@/lib/format";
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
    title: artikel
      ? `${artikel.title} — SI-PANTAS`
      : "Artikel tidak ditemukan — SI-PANTAS",
    description: artikel?.content.slice(0, 150),
  };
}

/** "Organik" → "Sampah Organik"; "Umum" → "Panduan Umum". */
function labelKategori(kategori: string | null): string {
  if (!kategori || kategori === "Umum") return "Panduan Umum";

  return `Sampah ${kategori}`;
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
    <div className="mx-auto w-full max-w-[1440px] px-4 pb-10 pt-6 sm:px-8 sm:pb-14 sm:pt-8 lg:px-14 lg:pb-16 lg:pt-10">
      {/* Kepala halaman — rata kiri mengikuti tepi konten */}
      <div className="max-w-[760px]">
        <Link
          href="/edukasi"
          className="inline-flex min-h-11 items-center gap-2 text-caption font-semibold text-brand hover:underline"
        >
          <span aria-hidden="true">←</span> Kembali ke Pusat Edukasi
        </Link>

        <div className="mt-3">
          <Badge tone="success">{labelKategori(artikel.category)}</Badge>
        </div>

        <h1 className="mt-2 text-balance text-page-title font-bold leading-[1.2] tracking-tight text-ink">
          {artikel.title}
        </h1>

        <p className="mt-1 text-caption text-ink-muted">
          Diperbarui {formatDateShort(artikel.updatedAt)}
        </p>
      </div>

      {/* Badan artikel — kolom di tengah halaman */}
      <article className="mx-auto mt-8 max-w-[720px] sm:mt-10">
        {/* Judul yang sama diulang di badan artikel seperti desain; disembunyikan
            dari pembaca layar agar tidak dibacakan dua kali berturut-turut. */}
        <h2
          aria-hidden="true"
          className="text-balance text-center text-[22px] font-semibold leading-snug text-ink sm:text-[24px]"
        >
          {artikel.title}
        </h2>

        <div className="mt-6 overflow-hidden rounded-xl bg-[#eef1ec]">
          {artikel.imageUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element -- URL gambar berasal dari backend, host belum ditentukan */}
              <img
                src={artikel.imageUrl}
                alt={`Ilustrasi: ${artikel.title}`}
                className="aspect-[2.2/1] w-full object-cover"
              />
            </>
          ) : (
            <div className="flex aspect-[2.2/1] items-center justify-center px-6">
              <p className="text-center text-caption text-ink-subtle">
                Gambar materi akan ditampilkan di sini jika diunggah oleh
                Operator.
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 space-y-4 text-body leading-relaxed text-ink">
          {paragraf.map((bagian) => (
            <p key={bagian.slice(0, 40)}>{bagian}</p>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center gap-1 rounded-lg border border-line bg-surface px-4 py-3 text-center text-meta text-ink-muted sm:flex-row sm:justify-between sm:text-left">
          <p>Dibuat: {formatDateTimeShort(artikel.createdAt)}</p>
          <p>Diperbarui: {formatDateTimeShort(artikel.updatedAt)}</p>
        </div>
      </article>
    </div>
  );
}
