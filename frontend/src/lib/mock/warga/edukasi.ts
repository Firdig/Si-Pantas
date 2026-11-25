import type { EducationContent } from "@/types/api";

/**
 * Kategori pada layar "Pusat Edukasi" (ITERASI 2).
 * Tombol "Buka Panduan" diarahkan ke artikel PUBLISHED yang kategorinya cocok,
 * jadi pengurus bisa mengganti isi artikel tanpa mengubah kode.
 */
export const KATEGORI_EDUKASI = [
  {
    category: "Organik",
    title: "Organik",
    description: "Sisa makanan, daun, ranting.",
  },
  {
    category: "Anorganik",
    title: "Anorganik",
    description: "Kertas, plastik, kaleng, kaca, logam.",
  },
  {
    category: "Residu",
    title: "Residu",
    description: "Puntung rokok, pampers, tisu kotor, dll.",
  },
  {
    category: "B3",
    title: "B3 (Rumah Tangga)",
    description: "Baterai, lampu, obat kadaluarsa, cat, dll.",
  },
] as const;

/**
 * Data contoh artikel edukasi. Isi artikel sengaja ditulis ringkas
 * (3–4 paragraf) agar halaman baca bisa langsung dicoba.
 */
export const edukasiList: EducationContent[] = [
  {
    id: "edukasi-organik",
    title: "Cara Memilah Sampah Organik",
    slug: "cara-memilah-sampah-organik",
    category: "Organik",
    imageUrl: null,
    status: "PUBLISHED",
    authorName: "Pengurus RW XI",
    createdAt: "2026-11-10T08:00:00+07:00",
    updatedAt: "2026-11-20T09:00:00+07:00",
    content: [
      "Sampah organik adalah sampah yang berasal dari makhluk hidup dan mudah terurai, seperti sisa makanan, sayur, buah, daun, dan ranting. Di rumah, jenis sampah inilah yang paling banyak dihasilkan setiap hari.",
      "Pisahkan sampah organik ke wadah tertutup tersendiri, jangan dicampur dengan plastik atau kertas. Tiriskan dulu sisa makanan agar tidak berair, karena air dari sampah organik mempercepat bau dan mengundang lalat.",
      "Sebagian sampah organik bisa diolah sendiri menjadi kompos di halaman rumah, atau dibuang ke lubang biopori. Bila tidak sempat mengolah, bawa ke titik pengumpulan dalam kantong terpisah dan ikat rapat.",
      "Kebiasaan kecil ini membantu petugas mengangkut sampah lebih cepat, karena sampah organik dan anorganik tidak perlu dipisahkan lagi di titik pengumpulan.",
    ].join("\n\n"),
  },
  {
    id: "edukasi-anorganik",
    title: "Cara Memilah Sampah Anorganik",
    slug: "cara-memilah-sampah-anorganik",
    category: "Anorganik",
    imageUrl: null,
    status: "PUBLISHED",
    authorName: "Pengurus RW XI",
    createdAt: "2026-11-10T08:00:00+07:00",
    updatedAt: "2026-11-19T10:30:00+07:00",
    content: [
      "Sampah anorganik adalah sampah yang sulit terurai, seperti kertas, plastik, kaleng, kaca, dan logam. Sebagian besar jenis sampah ini masih bisa didaur ulang bila dipisahkan dengan benar.",
      "Sebelum dibuang, bersihkan dan keringkan wadah bekas makanan atau minuman. Botol plastik dipipihkan, kardus dilipat, dan kaleng dikumpulkan terpisah agar tidak melukai petugas.",
      "Jangan mencampur sampah anorganik dengan sampah berbahaya seperti baterai, lampu, atau obat kadaluarsa. Bahan-bahan itu termasuk sampah B3 yang penanganannya berbeda.",
      "Sampah anorganik yang masih layak bisa disetorkan ke bank sampah atau dititipkan ke titik pengumpulan RW XI untuk diolah kembali.",
    ].join("\n\n"),
  },
  {
    id: "edukasi-residu",
    title: "Cara Menangani Sampah Residu",
    slug: "cara-memilah-sampah-residu",
    category: "Residu",
    imageUrl: null,
    status: "PUBLISHED",
    authorName: "Pengurus RW XI",
    createdAt: "2026-11-11T08:00:00+07:00",
    updatedAt: "2026-11-18T14:15:00+07:00",
    content: [
      "Sampah residu adalah sampah yang tidak bisa didaur ulang dan tidak mudah terurai, misalnya puntung rokok, pampers, tisu kotor, pembalut, dan masker sekali pakai.",
      "Karena tidak bisa diolah, sampah residu sebaiknya dibuang ke tempat sampah khusus residu. Pampers dan pembalut perlu dibungkus rapat sebelum dibuang agar tidak menimbulkan bau dan menjaga kebersihan petugas.",
      "Jangan mencampur residu dengan sampah organik. Campuran ini membuat sampah organik tidak bisa dijadikan kompos dan mempercepat timbulnya bau di titik pengumpulan.",
      "Cara terbaik tetap mengurangi sampah residu dari sumbernya, misalnya memakai tas belanja sendiri dan menghindari produk sekali pakai bila ada pilihan lain.",
    ].join("\n\n"),
  },
  {
    id: "edukasi-b3",
    title: "Cara Mengelola Sampah B3 Rumah Tangga",
    slug: "cara-mengelola-sampah-b3-rumah-tangga",
    category: "B3",
    imageUrl: null,
    status: "PUBLISHED",
    authorName: "Pengurus RW XI",
    createdAt: "2026-11-12T08:00:00+07:00",
    updatedAt: "2026-11-21T11:00:00+07:00",
    content: [
      "Sampah B3 (bahan berbahaya dan beracun) rumah tangga meliputi baterai bekas, lampu, obat kadaluarsa, sisa cat, dan cairan pembersih. Jumlahnya sedikit, tetapi dampaknya besar bila tercampur sampah lain.",
      "Baterai dan lampu mengandung logam berat yang bisa mencemari tanah dan air. Jangan membakar sampah B3 dan jangan membuang cairannya ke saluran air atau tanah.",
      "Simpan sampah B3 di wadah tertutup, jauh dari jangkauan anak-anak, sampai jumlahnya cukup untuk diserahkan. Jangan mencampurnya dengan sampah harian.",
      "Serahkan sampah B3 ke titik pengumpulan khusus atau kepada pengurus RW XI agar diteruskan ke pengelola yang berwenang.",
    ].join("\n\n"),
  },
  {
    id: "edukasi-panduan-lengkap",
    title: "Panduan Lengkap Memilah Sampah Rumah Tangga",
    slug: "panduan-lengkap-memilah-sampah",
    category: "Umum",
    imageUrl: null,
    status: "PUBLISHED",
    authorName: "Pengurus RW XI",
    createdAt: "2026-11-05T08:00:00+07:00",
    updatedAt: "2026-11-21T16:00:00+07:00",
    content: [
      "Ada empat langkah sederhana yang bisa diingat: pisahkan, bersihkan, keringkan, lalu serahkan. Empat langkah ini berlaku untuk hampir semua jenis sampah rumah tangga.",
      "Sediakan tiga wadah di rumah: satu untuk organik, satu untuk anorganik, dan satu untuk residu. Bila ada baterai atau lampu bekas, simpan di wadah kecil terpisah sebagai sampah B3.",
      "Biasakan membuang sampah pada jadwal yang sama setiap hari, lalu periksa kondisi titik pengumpulan melalui halaman Peta Sampah. Bila titik penuh, laporkan kepada pengurus agar segera diangkut.",
      "Mulailah dari satu kebiasaan kecil dan libatkan seluruh anggota keluarga. Perubahan yang bertahan lama biasanya dimulai dari langkah yang paling mudah dilakukan.",
    ].join("\n\n"),
  },
];

/** Hanya artikel PUBLISHED yang boleh tampil di area warga. */
export const edukasiPublik = edukasiList.filter(
  (edukasi) => edukasi.status === "PUBLISHED",
);

export function getEdukasiBySlug(slug: string) {
  return edukasiPublik.find((edukasi) => edukasi.slug === slug);
}

export function getEdukasiByKategori(category: string) {
  return edukasiPublik.find((edukasi) => edukasi.category === category);
}
