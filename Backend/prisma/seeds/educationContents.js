const educationContents = [
  {
    title: "Cara Memilah Sampah Rumah Tangga",
    slug: "cara-memilah-sampah-rumah-tangga",
    content:
      "Pisahkan sampah organik dan anorganik sejak dari rumah. Sampah organik seperti sisa makanan dan daun dapat dijadikan kompos, sedangkan sampah anorganik seperti plastik, kertas, logam, dan kaca perlu dibersihkan lalu dikumpulkan untuk didaur ulang.",
    category: "Pemilahan Sampah",
    imageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b",
    status: "PUBLISHED",
  },
  {
    title: "Mengenal 3R: Reduce, Reuse, Recycle",
    slug: "mengenal-3r-reduce-reuse-recycle",
    content:
      "Prinsip 3R membantu mengurangi volume sampah. Reduce berarti mengurangi penggunaan barang sekali pakai, reuse berarti menggunakan kembali barang yang masih layak, dan recycle berarti mengolah barang bekas menjadi produk baru.",
    category: "Pengelolaan Sampah",
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09",
    status: "PUBLISHED",
  },
  {
    title: "Tips Mengelola Sampah Organik Menjadi Kompos",
    slug: "tips-mengelola-sampah-organik-menjadi-kompos",
    content:
      "Siapkan wadah berlubang, campurkan sampah dapur organik dengan daun kering, lalu aduk secara berkala dan jaga kelembapan agar proses pengomposan berlangsung baik.",
    category: "Kompos",
    imageUrl: null,
    status: "PUBLISHED",
  },
  {
    title: "Bahaya Membakar Sampah Plastik",
    slug: "bahaya-membakar-sampah-plastik",
    content:
      "Pembakaran plastik menghasilkan asap beracun dan dapat mencemari udara. Sebaiknya kumpulkan plastik untuk dipilah dan dikirim ke fasilitas daur ulang atau pengepul terdekat.",
    category: "Kesehatan Lingkungan",
    imageUrl: null,
    status: "PUBLISHED",
  },
  {
    title: "Panduan Menyiapkan Sampah Daur Ulang",
    slug: "panduan-menyiapkan-sampah-daur-ulang",
    content:
      "Kosongkan sisa isi kemasan, bilas sampah yang kotor, keringkan, lalu kelompokkan berdasarkan jenis bahan. Menyiapkan sampah dengan rapi memudahkan proses pengumpulan dan daur ulang.",
    category: "Daur Ulang",
    imageUrl: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807",
    status: "DRAFT",
  },
];

export async function seedEducationContents(prisma, createdById) {
  for (const content of educationContents) {
    await prisma.educationContent.upsert({
      where: { slug: content.slug },
      update: {
        title: content.title,
        content: content.content,
        category: content.category,
        imageUrl: content.imageUrl,
        status: content.status,
        createdById,
      },
      create: {
        ...content,
        createdById,
      },
    });
  }

  console.log(
    `[Seed] ${educationContents.length} konten edukasi siap ditambahkan.`,
  );
}
