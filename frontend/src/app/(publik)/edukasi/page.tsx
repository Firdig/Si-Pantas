import type { Metadata } from "next";
import { CategoryCard } from "@/components/edukasi/category-card";
import { TipsBanner } from "@/components/edukasi/tips-banner";
import { PageHeader } from "@/components/ui/page-header";
import { getEdukasiByKategori, getEdukasiBySlug, KATEGORI_EDUKASI } from "@/lib/mock/edukasi";

export const metadata: Metadata = {
  title: "Pusat Edukasi Pemilahan Sampah — SI-PANTAS",
  description:
    "Panduan praktis memilah sampah rumah tangga di RW XI Kelurahan Temas: organik, anorganik, residu, dan B3.",
};

const PANDUAN_LENGKAP = getEdukasiBySlug("panduan-lengkap-memilah-sampah");

export default function EdukasiPage() {
  const kategori = KATEGORI_EDUKASI.map((item) => {
    const artikel = getEdukasiByKategori(item.category);

    return {
      title: item.title,
      description: item.description,
      href: artikel ? `/edukasi/${artikel.slug}` : null,
    };
  });

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 pb-10 pt-6 sm:px-8 sm:pb-14 sm:pt-10 lg:px-14 lg:pb-20 lg:pt-12">
      <PageHeader
        title="Pusat Edukasi Pemilahan Sampah"
        description="Panduan praktis memilah sampah dari rumah, dari sisa makanan hingga bahan berbahaya."
      />

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kategori.map((item) => (
          <li key={item.title} className="h-full">
            <CategoryCard {...item} />
          </li>
        ))}
      </ul>

      {PANDUAN_LENGKAP ? (
        <TipsBanner href={`/edukasi/${PANDUAN_LENGKAP.slug}`} />
      ) : null}
    </div>
  );
}
