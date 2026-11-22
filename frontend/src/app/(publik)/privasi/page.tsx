import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = {
  title: "Privasi Pelapor — SI-PANTAS",
};

export default function PrivasiPage() {
  return (
    <ComingSoon
      title="Privasi Pelapor"
      description="Penjelasan data apa yang disimpan pada laporan yang dicatat pengurus RW."
      note="Kebijakan privasi sedang disusun. Rencananya laporan ditampilkan tanpa identitas pelapor, dan hanya pengurus RW yang dapat melihat data yang diperlukan untuk menindaklanjuti laporan."
    />
  );
}
