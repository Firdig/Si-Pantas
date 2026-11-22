import type { PointCondition, ReportStatus } from "@/types/api";

/**
 * Warna status mengikuti halaman Foundations:
 * hijau = selesai/normal · biru = informasi/baru ·
 * kuning = proses/perlu perhatian · merah = peringatan/penolakan.
 *
 * Label teks selalu ditampilkan, tidak pernah warna saja.
 */
export type StatusTone = "success" | "info" | "warning" | "danger";

export type StatusDisplay = {
  label: string;
  tone: StatusTone;
  /** Keterangan singkat, dipakai di panel legenda status. */
  description: string;
};

export const pointConditionDisplay: Record<PointCondition, StatusDisplay> = {
  NORMAL: {
    label: "Normal",
    tone: "success",
    description: "Tidak ada laporan aktif di titik ini.",
  },
  ATTENTION: {
    label: "Perlu perhatian",
    tone: "warning",
    description: "Ada laporan yang belum selesai ditangani.",
  },
};

export const reportStatusDisplay: Record<ReportStatus, StatusDisplay> = {
  PENDING: {
    label: "Menunggu",
    tone: "info",
    description: "Laporan diterima, belum ditangani petugas.",
  },
  IN_PROGRESS: {
    label: "Diproses",
    tone: "warning",
    description: "Sedang ditangani petugas.",
  },
  COMPLETED: {
    label: "Selesai",
    tone: "success",
    description: "Sudah dibersihkan dan ditindaklanjuti.",
  },
  REJECTED: {
    label: "Ditolak",
    tone: "danger",
    description: "Belum dapat ditindaklanjuti.",
  },
};

/** Judul langkah pada timeline detail laporan. */
export const reportTimelineLabel: Record<ReportStatus, string> = {
  PENDING: "Dilaporkan",
  IN_PROGRESS: "Diproses",
  COMPLETED: "Selesai",
  REJECTED: "Ditolak",
};

/** Teks bantuan pada panel "Informasi untuk Anda" di detail laporan. */
export const reportStatusAdvice: Record<ReportStatus, string> = {
  PENDING:
    "Laporan Anda sudah diterima dan menunggu ditangani petugas. Mohon cek kembali halaman ini beberapa hari ke depan.",
  IN_PROGRESS:
    "Laporan Anda sedang ditangani petugas. Pembaruan berikutnya akan muncul di halaman ini.",
  COMPLETED:
    "Laporan sudah selesai ditindaklanjuti. Terima kasih telah ikut menjaga kebersihan lingkungan RW XI.",
  REJECTED:
    "Laporan ini belum dapat ditindaklanjuti. Silakan hubungi pengurus RW XI bila membutuhkan penjelasan lebih lanjut.",
};
