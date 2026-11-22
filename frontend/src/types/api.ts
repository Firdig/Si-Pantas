/**
 * Draf kontrak API antara frontend (Next.js) dan backend (Express).
 * File ini sengaja berdiri sendiri supaya bisa dikirim ke bagian backend
 * sebagai acuan bentuk response. Sesuaikan dengan hasil kesepakatan.
 */

/**
 * Kondisi titik sampah.
 *
 * Catatan: model `WastePoint` di Prisma belum punya field kondisi, jadi nilai
 * ini sebaiknya **dihitung oleh backend** dari laporan terakhir titik tersebut:
 * - tidak ada laporan aktif  -> NORMAL
 * - ada laporan PENDING      -> ATTENTION
 * - ada laporan IN_PROGRESS  -> ATTENTION (label bisa dipisah nanti)
 */
export type PointCondition = "NORMAL" | "ATTENTION";

export type WastePoint = {
  id: string;
  /** Nama titik, mis. "Titik 1". */
  name: string;
  /** Wilayah RT, mis. "RT 01". */
  rt: string;
  address: string;
  latitude: number;
  longitude: number;
  photoUrl?: string | null;
  condition: PointCondition;
  /** ISO 8601, dipakai untuk teks "Terakhir diperbarui …". */
  lastUpdatedAt: string;
};

/**
 * Enum `ReportStatus` di Prisma **belum punya `REJECTED`**.
 * Desain menampilkan empat status (Menunggu, Diproses, Selesai, Ditolak),
 * jadi `REJECTED` perlu ditambahkan di backend.
 */
export type ReportStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "REJECTED";

/** Enum `ActorType` di Prisma. */
export type ReportActor = "KADER" | "OPERATOR" | "TPS" | "SYSTEM";

/** Satu baris `ReportStatusHistory` — bahan timeline detail laporan. */
export type ReportStatusHistoryEntry = {
  id: string;
  newStatus: ReportStatus;
  actorType: ReportActor;
  note: string | null;
  createdAt: string;
};

export type Report = {
  id: string;
  /** Format desain: SPT-2026-00021 */
  reportCode: string;
  /**
   * Judul singkat yang tampil di daftar ("Sampah menumpuk").
   * `Report` di Prisma belum punya field ini — usulan: tambahkan `title`,
   * atau backend mengirim ringkasan dari `category`/`description`.
   */
  title: string;
  wastePoint: Pick<WastePoint, "id" | "name" | "rt">;
  /** `Report.category` masih String? di Prisma — perlu daftar nilai resmi. */
  category: string | null;
  description: string | null;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  /** Hanya diisi pada endpoint detail laporan. */
  histories?: ReportStatusHistoryEntry[];
};

/** Bentuk response seragam yang diusulkan untuk semua endpoint. */
export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

/** Enum `EducationStatus` di Prisma. */
export type EducationStatus = "DRAFT" | "PUBLISHED";

/**
 * `EducationContent` di Prisma: title, slug, content, category, imageUrl,
 * status, createdBy. Frontend hanya menampilkan yang berstatus PUBLISHED.
 *
 * `content` masih String bebas — disepakati dulu sebagai **teks biasa**
 * dengan paragraf dipisah baris kosong.
 */
export type EducationContent = {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string | null;
  imageUrl: string | null;
  status: EducationStatus;
  /** Nama pembuat artikel (`createdBy.name`). */
  authorName: string;
  createdAt: string;
  updatedAt: string;
};
