import type { Metadata } from "next";
import { CategoryCard } from "@/components/edukasi/category-card";
import { TipsBanner } from "@/components/edukasi/tips-banner";
import { PageHeader } from "@/components/ui/page-header";
import { getDaftarEdukasi } from "@/lib/edukasi";
import { cariPanduanLengkap, susunKartuKategori } from "@/lib/edukasi-kategori";

export const metadata: Metadata = {
  title: "Pusat Edukasi Pemilahan Sampah — SI-PANTAS",
  description:
    "Panduan praktis memilah sampah rumah tangga di RW XI Kelurahan Temas: organik, anorganik, residu, dan B3.",
};

export default async function EdukasiPage() {
  const artikel = await getDaftarEdukasi();
  const kategori = susunKartuKategori(artikel);
  const panduanLengkap = cariPanduanLengkap(artikel);

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 pb-10 pt-6 sm:px-8 sm:pb-14 sm:pt-10 lg:px-14 lg:pb-20 lg:pt-12">
      <PageHeader
        title="Pusat Edukasi Pemilahan Sampah"
        description="Panduan praktis memilah sampah dari rumah, dari sisa makanan hingga bahan berbahaya."
      />

      {kategori.length > 0 ? (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kategori.map((item) => (
            <li key={item.title} className="h-full">
              <CategoryCard {...item} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-8 rounded-lg border border-line bg-surface px-4 py-6 text-center text-caption text-ink-muted">
          Belum ada panduan yang dipublikasikan. Silakan cek kembali nanti.
        </p>
      )}

      {panduanLengkap ? (
        <TipsBanner href={`/edukasi/${panduanLengkap.slug}`} />
      ) : null}
    </div>
  );
}
