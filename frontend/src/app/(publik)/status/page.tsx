import type { Metadata } from "next";
import { StatusExplorer } from "@/components/status/status-explorer";
import { PageHeader } from "@/components/ui/page-header";
import { formatDayTimeWib } from "@/lib/format";
import { laporanSampah } from "@/lib/mock/laporan";
import { MOCK_NOW, titikSampah } from "@/lib/mock/titik";

export const metadata: Metadata = {
  title: "Status & Laporan Warga — SI-PANTAS",
  description:
    "Pantau laporan sampah di lingkungan RW XI Kelurahan Temas, dari yang baru masuk hingga yang sudah selesai ditangani.",
};

export default function StatusPage() {
  const reports = laporanSampah.map((report) => ({
    ...report,
    pointLabel: `${report.wastePoint.name} · ${report.wastePoint.rt}`,
    updatedLabel: formatDayTimeWib(report.updatedAt, MOCK_NOW),
  }));

  const points = titikSampah.map((point) => ({
    id: point.id,
    label: `${point.name} · ${point.rt}`,
  }));

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 pb-10 pt-6 sm:px-8 sm:pb-14 sm:pt-10 lg:px-14 lg:pb-20 lg:pt-12">
      <PageHeader
        title="Status & Laporan Warga"
        description="Pantau laporan sampah di lingkungan Anda, dari yang sudah ditindaklanjuti hingga yang masih diproses."
      />

      <StatusExplorer reports={reports} points={points} />
    </div>
  );
}
