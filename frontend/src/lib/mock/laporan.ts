import type { Report } from "@/types/api";
import { titikSampah } from "@/lib/mock/titik";

const titik1 = titikSampah[0]!;
const titik2 = titikSampah[1]!;
const titik3 = titikSampah[2]!;

const pointRef = (point: (typeof titikSampah)[number]) => ({
  id: point.id,
  name: point.name,
  rt: point.rt,
});

/**
 * Data contoh daftar laporan dan riwayat statusnya.
 * Mengikuti 4 baris pada layar "Status & Laporan Warga" di desain ITERASI 2.
 */
export const laporanSampah: Report[] = [
  {
    id: "laporan-00022",
    reportCode: "SPT-2026-00022",
    title: "Sampah menumpuk di depan gang",
    wastePoint: pointRef(titik1),
    category: "Anorganik",
    description:
      "Tumpukan plastik dan kardus bekas di pinggir jalan sejak pagi, membuat jalan sempit.",
    status: "PENDING",
    createdAt: "2026-11-22T09:55:00+07:00",
    updatedAt: "2026-11-22T10:05:00+07:00",
    histories: [
      {
        id: "riwayat-00022-1",
        newStatus: "PENDING",
        actorType: "KADER",
        note: "Laporan dicatat petugas dari pantauan lapangan.",
        createdAt: "2026-11-22T09:55:00+07:00",
      },
    ],
  },
  {
    id: "laporan-00021",
    reportCode: "SPT-2026-00021",
    title: "Sampah menumpuk",
    wastePoint: pointRef(titik1),
    category: "Anorganik",
    description:
      "Sampah menumpuk di sekitar titik pengumpulan dan sudah mulai menyebar ke jalan.",
    status: "IN_PROGRESS",
    createdAt: "2026-11-22T08:42:00+07:00",
    updatedAt: "2026-11-22T13:40:00+07:00",
    histories: [
      {
        id: "riwayat-00021-1",
        newStatus: "PENDING",
        actorType: "KADER",
        note: "Laporan dicatat petugas dari pantauan lapangan.",
        createdAt: "2026-11-22T08:42:00+07:00",
      },
      {
        id: "riwayat-00021-2",
        newStatus: "IN_PROGRESS",
        actorType: "OPERATOR",
        note: "Petugas menuju lokasi.",
        createdAt: "2026-11-22T08:50:00+07:00",
      },
      {
        id: "riwayat-00021-3",
        newStatus: "IN_PROGRESS",
        actorType: "TPS",
        note: "Diangkut oleh petugas.",
        createdAt: "2026-11-22T09:15:00+07:00",
      },
      {
        id: "riwayat-00021-4",
        newStatus: "COMPLETED",
        actorType: "OPERATOR",
        note: "Pembersihan selesai dilakukan di titik ini.",
        createdAt: "2026-11-22T13:40:00+07:00",
      },
    ],
  },
  {
    id: "laporan-00014",
    reportCode: "SPT-2026-00014",
    title: "Tumpukan sisa pengangkutan",
    wastePoint: pointRef(titik3),
    category: "Residu",
    description:
      "Sisa sampah tertinggal setelah pengangkutan, tersebar di sekitar titik.",
    status: "COMPLETED",
    createdAt: "2026-11-20T07:20:00+07:00",
    updatedAt: "2026-11-20T15:10:00+07:00",
    histories: [
      {
        id: "riwayat-00014-1",
        newStatus: "PENDING",
        actorType: "KADER",
        note: "Laporan dicatat petugas dari pantauan lapangan.",
        createdAt: "2026-11-20T07:20:00+07:00",
      },
      {
        id: "riwayat-00014-2",
        newStatus: "IN_PROGRESS",
        actorType: "OPERATOR",
        note: "Petugas menuju lokasi.",
        createdAt: "2026-11-20T09:05:00+07:00",
      },
      {
        id: "riwayat-00014-3",
        newStatus: "COMPLETED",
        actorType: "OPERATOR",
        note: "Area sekitar titik sudah dibersihkan.",
        createdAt: "2026-11-20T15:10:00+07:00",
      },
    ],
  },
  {
    id: "laporan-00009",
    reportCode: "SPT-2026-00009",
    title: "Titik 2 belum dapat diakses",
    wastePoint: pointRef(titik2),
    category: "Organik",
    description:
      "Lokasi tertutup material bangunan sehingga petugas belum bisa mengangkut sampah.",
    status: "REJECTED",
    createdAt: "2026-11-18T08:10:00+07:00",
    updatedAt: "2026-11-18T11:00:00+07:00",
    histories: [
      {
        id: "riwayat-00009-1",
        newStatus: "PENDING",
        actorType: "KADER",
        note: "Laporan dicatat petugas dari pantauan lapangan.",
        createdAt: "2026-11-18T08:10:00+07:00",
      },
      {
        id: "riwayat-00009-2",
        newStatus: "REJECTED",
        actorType: "OPERATOR",
        note: "Akses ke titik tertutup material bangunan. Mohon dibuka agar petugas dapat mengangkut.",
        createdAt: "2026-11-18T11:00:00+07:00",
      },
    ],
  },
];

export function getLaporanByKode(kode: string): Report | undefined {
  const target = kode.trim().toLowerCase();

  return laporanSampah.find(
    (laporan) => laporan.reportCode.toLowerCase() === target,
  );
}
