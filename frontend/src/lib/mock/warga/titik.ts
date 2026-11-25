import type { WastePoint } from "@/types/api";

/**
 * Waktu acuan data contoh — **tetap** (bukan `new Date()`), supaya halaman
 * bisa di-prerender dan hasil render server maupun browser selalu identik
 * (aturan Cache Components di Next 16).
 *
 * Saat data sudah berasal dari API, hapus konstanta ini dan hitung label
 * relatif di server dengan waktu permintaan yang sebenarnya.
 */
export const MOCK_NOW = new Date("2026-11-22T16:00:00+07:00");

function hoursBefore(base: Date, hours: number): string {
  return new Date(base.getTime() - hours * 3_600_000).toISOString();
}

/**
 * Data contoh layar Peta Sampah — mengikuti 3 titik pada desain ITERASI 2.
 * Koordinat masih perkiraan di sekitar Kelurahan Temas, Kota Batu.
 */
export const titikSampah: WastePoint[] = [
  {
    id: "titik-1",
    name: "Titik 1",
    rt: "RT 01",
    address: "Jl. Temas Gang 3, RT 01 / RW XI",
    latitude: -7.8693,
    longitude: 112.5214,
    condition: "NORMAL",
    lastUpdatedAt: hoursBefore(MOCK_NOW, 3),
  },
  {
    id: "titik-2",
    name: "Titik 2",
    rt: "RT 02",
    address: "Jl. Temas Gang 5, RT 02 / RW XI",
    latitude: -7.8726,
    longitude: 112.5253,
    condition: "ATTENTION",
    lastUpdatedAt: hoursBefore(MOCK_NOW, 5),
  },
  {
    id: "titik-3",
    name: "Titik 3",
    rt: "RT 04",
    address: "Jl. Temas Gang 8, RT 04 / RW XI",
    latitude: -7.8682,
    longitude: 112.5276,
    condition: "NORMAL",
    lastUpdatedAt: hoursBefore(MOCK_NOW, 8),
  },
];

export function getTitikById(id: string): WastePoint | undefined {
  return titikSampah.find((titik) => titik.id === id);
}
