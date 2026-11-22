import type { Metadata } from "next";
import { PetaExplorer } from "@/components/peta/peta-explorer";
import { PageHeader } from "@/components/ui/page-header";
import { formatRelativeDay } from "@/lib/format";
import { MOCK_NOW, titikSampah } from "@/lib/mock/titik";

export const metadata: Metadata = {
  title: "Peta Titik Sampah — SI-PANTAS",
  description:
    "Lihat titik pengumpulan sampah prioritas di RW XI Kelurahan Temas beserta kondisi terakhirnya.",
};

export default function PetaPage() {
  const points = titikSampah.map((point) => ({
    ...point,
    lastUpdatedLabel: `Terakhir diperbarui ${formatRelativeDay(
      point.lastUpdatedAt,
      MOCK_NOW,
    )}.`,
  }));

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 pb-10 pt-6 sm:px-8 sm:pb-14 sm:pt-10 lg:px-14 lg:pb-20 lg:pt-12">
      <PageHeader
        title="Peta Titik Sampah"
        description="Lihat titik pengumpulan sampah prioritas dan kondisi terakhirnya."
      />

      <PetaExplorer points={points} />
    </div>
  );
}
