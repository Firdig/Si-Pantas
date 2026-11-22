export type NavItem = {
  label: string;
  href: string;
};

/** Navigasi publik — maksimal 4 menu utama (Foundations: navigasi dibatasi). */
export const navItems: NavItem[] = [
  { label: "Beranda", href: "/" },
  { label: "Peta Sampah", href: "/peta" },
  { label: "Cek Status", href: "/status" },
  { label: "Edukasi", href: "/edukasi" },
];

export const hero = {
  badge: "Layanan warga RW XI",
  title: "Pantau kondisi sampah dengan mudah dan jelas.",
  description:
    "SI-PANTAS membantu warga melihat titik sampah, memantau tindak lanjut, dan mempelajari cara memilah sampah dari rumah.",
  // ITERASI 2: warga hanya memantau — tidak ada alur "Buat Laporan".
  action: { label: "Cek Status Laporan", href: "/status" },
};

export const ringkasan = {
  title: "Ringkasan RW XI",
  stats: [
    { value: 3, label: "Titik prioritas", tone: "brand" as const },
    { value: 4, label: "RT terlayani", tone: "info" as const },
  ],
  panduan: {
    title: "Panduan cepat",
    steps: [
      "Pilih titik atau lokasi masalah.",
      "Ceritakan masalah secara singkat.",
      "Tambahkan foto bila ada.",
      "Simpan nomor laporan.",
    ],
  },
};

export const footer = {
  note: "SI-PANTAS · Sistem Informasi Pemantauan Sampah",
  links: [
    { label: "Privasi Pelapor", href: "/privasi" },
    { label: "Kontak RW", href: "/kontak" },
  ],
};
