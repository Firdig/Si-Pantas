# SI-PANTAS — Frontend

Frontend **Sistem Informasi Pemantauan Sampah RW XI Kelurahan Temas**.
Backend (Express + Prisma + PostgreSQL) berada di folder `../Backend` dan
dikerjakan terpisah.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 + design token di `src/app/globals.css`
- Leaflet + OpenStreetMap untuk peta
- Poppins via `next/font`

## Menjalankan

```bash
npm install
npm run dev
```

Buka http://localhost:3000

## Cek dari HP lewat ngrok

Jalankan dua terminal:

```bash
# terminal 1
npm run dev

# terminal 2
npm run tunnel
```

Ambil URL publiknya di http://127.0.0.1:4040 (atau dari output terminal).
Catatan:

- URL ngrok gratis **berubah setiap kali tunnel dijalankan ulang**.
- Saat pertama dibuka di HP, ngrok menampilkan halaman peringatan —
  tekan **Visit Site**.
- Domain ngrok sudah diizinkan di `next.config.ts` (`allowedDevOrigins`),
  sehingga aset dan hot reload tetap jalan lewat terowongan.

## Struktur

```
src/app/(warga)/          halaman warga (URL di akar situs)
  page.tsx               Beranda
  peta/                  Peta Titik Sampah + detail titik
  status/                Status & Laporan Warga + detail laporan
  edukasi/               Pusat Edukasi + artikel
  bantuan/               Kontak RW XI + tombol WhatsApp
  privasi/               Kebijakan privasi
src/app/operator/        area operator (URL /operator)
src/app/tps/             tugas TPS berbasis token (URL /tps/[token])
src/components/ui/       komponen dasar (Button, Badge, Card, dst.)
src/components/layout/   kerangka halaman (header, footer, ComingSoon)
src/components/warga/    komponen isi halaman warga
src/lib/mock/warga/      data contoh halaman warga
src/lib/status.ts        label & warna status (satu sumber)
src/types/api.ts         draf kontrak API untuk backend
```

## Status halaman

| Rute | Keterangan |
|---|---|
| `/` | Beranda (ITERASI 2) |
| `/peta` · `/peta/[id]` | Peta titik + detail titik |
| `/status` · `/status/[kode]` | Daftar laporan + timeline status |
| `/edukasi` · `/edukasi/[slug]` | Pusat edukasi + artikel |
| `/bantuan` | Kontak pengurus RW XI + tombol WhatsApp |
| `/privasi` | Masih halaman sementara |
| `/kontak` | Dialihkan (redirect) ke `/bantuan` |
| `/operator` | Kerangka area operator (masih placeholder) |
| `/tps/[token]` | Kerangka tugas TPS (masih placeholder) |

## Data

Semua data masih **mock** di `src/lib/mock/warga/` dan mengikuti bentuk di
`src/types/api.ts`. Saat API Express siap, ganti sumber data di halaman —
komponen tidak perlu diubah.
