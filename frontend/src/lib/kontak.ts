/**
 * Kontak pengurus RW XI Kelurahan Temas.
 *
 * Satu sumber untuk seluruh halaman. Bila nomor berubah, cukup ubah di sini.
 * `waNumber` memakai format internasional tanpa "+", spasi, atau tanda hubung
 * (contoh: 6281234567890) karena itu yang dibaca tautan wa.me.
 */
export const rwContact = {
  nama: "Pengurus RW XI",
  wilayah: "Kelurahan Temas",
  // TODO: ganti dengan nomor WhatsApp RW XI yang sebenarnya.
  waNumber: "6200000000000",
} as const;

export const PESAN_BANTUAN =
  "Halo, saya warga RW XI Temas. Saya butuh bantuan terkait SI-PANTAS.";

/**
 * Tautan WhatsApp resmi. `wa.me` membuka aplikasi WhatsApp di HP dan
 * WhatsApp Web di desktop. Pesan diisi otomatis agar pengurus langsung
 * tahu konteksnya.
 */
export function waLink(pesan: string = PESAN_BANTUAN): string {
  return `https://wa.me/${rwContact.waNumber}?text=${encodeURIComponent(pesan)}`;
}
