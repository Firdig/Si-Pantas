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

Halaman edukasi mengambil data dari backend Express. Jalankan backend lebih
dulu, lalu siapkan `.env.local`:

```powershell
Copy-Item .env.example .env.local
```

```env
API_BASE_URL=http://localhost:5000/api/v1
```

Variabel ini hanya dipakai di server (Server Component), jadi tidak perlu
prefix `NEXT_PUBLIC_`.

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
src/app/(publik)/        halaman warga
  page.tsx               Beranda
  peta/                  Peta Titik Sampah + detail titik
  status/                Status & Laporan Warga + detail laporan
  edukasi/               Pusat Edukasi + artikel
  bantuan/               Kontak RW XI + tombol WhatsApp
src/components/ui/       komponen dasar (Button, Badge, Card, dst.)
src/components/          komponen per halaman (beranda, peta, status, edukasi)
src/lib/mock/            data contoh
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

## Data

Data edukasi (`/edukasi` dan `/edukasi/[slug]`) sudah memakai API publik
backend lewat `src/lib/edukasi.ts`:

- `GET /api/v1/public/education` — daftar konten PUBLISHED
- `GET /api/v1/public/education/:slug` — detail artikel

Sisanya masih **mock** di `src/lib/mock/` dan mengikuti bentuk di
`src/types/api.ts`. Saat API Express siap untuk fitur lain, ganti sumber data
di halaman — komponen tidak perlu diubah.
