import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = {
  title: "Dashboard Operator — SI-PANTAS",
  description:
    "Area pengurus RW XI Kelurahan Temas untuk mengelola laporan sampah dan tugas pengangkutan.",
};

export default function OperatorDashboardPage() {
  return (
    <ComingSoon
      title="Dashboard Operator"
      description="Area pengurus RW XI Kelurahan Temas untuk mengelola laporan, titik sampah, dan tugas pengangkutan."
      note="Halaman operator sedang disiapkan. Setelah autentikasi tersedia, pengurus dapat masuk ke area ini untuk menindaklanjuti laporan warga."
    />
  );
}
