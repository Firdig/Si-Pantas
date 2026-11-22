import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = {
  title: "Kontak RW — SI-PANTAS",
};

export default function KontakPage() {
  return (
    <ComingSoon
      title="Kontak RW"
      description="Hubungi pengurus RW XI Kelurahan Temas."
      note="Daftar kontak pengurus RW sedang disiapkan. Sementara itu, kondisi titik sampah terbaru dapat Anda lihat di halaman Peta Sampah."
    />
  );
}
