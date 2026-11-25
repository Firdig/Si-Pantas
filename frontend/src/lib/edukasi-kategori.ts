import type { EducationSummary } from "@/types/api";

/**
 * Label & deskripsi kartu kategori di Pusat Edukasi.
 *
 * Nilai `category` di backend berupa teks bebas (lihat schema Prisma:
 * `category String?`), jadi kartu disusun dari kategori yang benar-benar
 * ada di data PUBLISHED. Kunci di bawah hanya untuk mempercantik tampilan;
 * kategori lain tetap tampil dengan deskripsi umum.
 */
type InfoKategori = {
  title: string;
  description: string;
};

const INFO_KATEGORI: Record<string, InfoKategori> = {
  organik: {
    title: "Organik",
    description: "Sisa makanan, daun, ranting.",
  },
  anorganik: {
    title: "Anorganik",
    description: "Kertas, plastik, kaleng, kaca, logam.",
  },
  residu: {
    title: "Residu",
    description: "Puntung rokok, pampers, tisu kotor, dll.",
  },
  b3: {
    title: "B3 (Rumah Tangga)",
    description: "Baterai, lampu, obat kadaluarsa, cat, dll.",
  },
  umum: {
    title: "Umum",
    description: "Panduan umum memilah sampah rumah tangga.",
  },
  kompos: {
    title: "Kompos",
    description: "Mengolah sampah organik menjadi kompos.",
  },
  "pemilahan sampah": {
    title: "Pemilahan Sampah",
    description: "Dasar memisahkan sampah sejak dari rumah.",
  },
  "pengelolaan sampah": {
    title: "Pengelolaan Sampah",
    description: "Prinsip dan kebiasaan mengelola sampah.",
  },
  "daur ulang": {
    title: "Daur Ulang",
    description: "Menyiapkan barang bekas agar bisa diolah lagi.",
  },
  "kesehatan lingkungan": {
    title: "Kesehatan Lingkungan",
    description: "Dampak sampah bagi kesehatan dan udara.",
  },
};

export type KartuKategori = {
  title: string;
  description: string;
  href: string;
};

function labelKategori(kategori: string | null): string {
  return kategori?.trim() || "Umum";
}

function infoKategori(kategori: string): InfoKategori {
  return (
    INFO_KATEGORI[kategori.toLowerCase()] ?? {
      title: kategori,
      description: `Panduan dan artikel seputar ${kategori.toLowerCase()}.`,
    }
  );
}

/**
 * Ambil satu artikel terbaru per kategori, lalu ubah menjadi kartu.
 * `artikel` sudah terurut dari yang terbaru (orderBy backend).
 *
 * Kategori "Umum" dipakai untuk banner "Panduan Lengkap", jadi tidak
 * dijadikan kartu selama ada kategori lain.
 */
export function susunKartuKategori(
  artikel: EducationSummary[],
): KartuKategori[] {
  const perKategori = new Map<string, EducationSummary>();

  for (const item of artikel) {
    const kategori = labelKategori(item.category);
    const kunci = kategori.toLowerCase();

    if (!perKategori.has(kunci)) {
      perKategori.set(kunci, item);
    }
  }

  let entri = [...perKategori.entries()];
  const tanpaUmum = entri.filter(([kunci]) => kunci !== "umum");

  if (tanpaUmum.length > 0) {
    entri = tanpaUmum;
  }

  return entri.map(([, item]) => {
    const kategori = labelKategori(item.category);

    return {
      ...infoKategori(kategori),
      href: `/edukasi/${item.slug}`,
    };
  });
}

/**
 * Cari artikel untuk banner "Lihat Panduan Lengkap".
 * Prioritas: kategori "Umum", lalu judul yang mengandung "panduan lengkap".
 */
export function cariPanduanLengkap(
  artikel: EducationSummary[],
): EducationSummary | null {
  const umum = artikel.find(
    (item) => labelKategori(item.category).toLowerCase() === "umum",
  );
  if (umum) return umum;

  return (
    artikel.find((item) =>
      item.title.toLowerCase().includes("panduan lengkap"),
    ) ?? null
  );
}
