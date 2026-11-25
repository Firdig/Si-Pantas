import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = {
  title: "Tugas Pengangkutan TPS — SI-PANTAS",
  description:
    "Halaman tugas pengangkutan sampah untuk TPS, dibuka lewat tautan dari pengurus RW XI Kelurahan Temas.",
};

export default function TpsTaskPage() {
  return (
    <ComingSoon
      title="Tugas Pengangkutan TPS"
      description="Halaman ini dibuka dari tautan tugas yang dikirim pengurus RW lewat WhatsApp."
      note="Pemuatan tugas berbasis token sedang disiapkan. Tautan yang Anda terima akan menampilkan daftar laporan yang perlu diselesaikan."
    />
  );
}
