import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = {
  title: "Butuh Bantuan? — SI-PANTAS",
};

export default function BantuanPage() {
  return (
    <ComingSoon
      title="Butuh Bantuan?"
      description="Panduan memakai SI-PANTAS dan kontak pengurus RW XI Kelurahan Temas."
      note="Halaman bantuan sedang disiapkan. Bila Anda kesulitan memakai SI-PANTAS, silakan hubungi pengurus RW XI secara langsung — nomor kontak akan ditampilkan di halaman ini."
    />
  );
}
