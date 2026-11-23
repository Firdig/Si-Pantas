# Si Pantas — Backend

Backend REST API untuk **Si Pantas** (Sistem Informasi Pengelolaan dan Pemantauan Sampah) yang dibangun menggunakan **Node.js**, **Express 5**, **PostgreSQL**, dan **Prisma ORM 7**.

---

## Prasyarat (Prerequisites)

Sebelum melakukan instalasi pada perangkat baru, pastikan perangkat lunak berikut sudah terpasang:

- **Node.js** versi `20.x` atau lebih baru (disarankan **Node.js 22 LTS**)
- **npm** (otomatis terpasang bersama Node.js)
- **PostgreSQL** versi `14` atau lebih baru (dalam kondisi berjalan/aktif)
- **Git**

Cek versi yang terpasang melalui terminal:

```bash
node -v
npm -v
psql --version
git --version
```

---

## Panduan Instalasi pada Perangkat Baru

### 1. Clone Repository

Clone repository proyek lalu masuk ke direktori `Backend`:

```bash
git clone https://github.com/Firdig/Si-Pantas.git
cd Si-Pantas/Backend
```

### 2. Install Dependensi

Pasang seluruh paket Node.js yang dibutuhkan:

```bash
npm install
```

### 3. Buat Database PostgreSQL

Buat database baru di PostgreSQL (misalnya `sipantas_db`). Anda bisa membuatnya melalui **pgAdmin** atau melalui terminal `psql`:

```bash
psql -U postgres
```

Lalu jalankan perintah SQL berikut di dalam prompt `psql`:

```sql
CREATE DATABASE sipantas_db;
\q
```

### 4. Konfigurasi Environment Variables (`.env`)

Salin file contoh `.env.example` menjadi `.env`:

- **Windows (PowerShell):**
  ```powershell
  Copy-Item .env.example .env
  ```
- **Linux / macOS / Git Bash:**
  ```bash
  cp .env.example .env
  ```

Buka file `.env` lalu sesuaikan nilainya dengan konfigurasi lokal perangkat Anda:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL="postgresql://postgres:password@localhost:5432/sipantas_db?schema=public"

# CORS & Frontend
CORS_ORIGIN="http://localhost:3000"
FRONTEND_URL="http://localhost:3000"

# JWT & Auth
JWT_ACCESS_SECRET="ganti_dengan_random_string_minimal_32_karakter"
JWT_REFRESH_SECRET="ganti_dengan_random_string_lain_minimal_32_karakter"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN_DAYS=7
COOKIE_SECURE=false
COOKIE_SAME_SITE="lax"

# TPS Collection Task
TPS_TASK_EXPIRES_HOURS=48

# WhatsApp Service
WHATSAPP_PROVIDER="mock"
WHATSAPP_API_KEY=""
WHATSAPP_API_URL=""

# Initial Operator Seed (development/bootstrap only)
SEED_OPERATOR_NAME="Operator Si Pantas"
SEED_OPERATOR_USERNAME="operator"
SEED_OPERATOR_PASSWORD="ChangeMe123!"
```

#### Penjelasan Variabel Penting

| Variabel | Wajib | Keterangan |
|---|---|---|
| `DATABASE_URL` | Ya | Connection string PostgreSQL (`postgresql://USER:PASSWORD@HOST:PORT/DB_NAME?schema=public`). |
| `PORT` | Tidak | Port HTTP server backend (default: `5000`). |
| `CORS_ORIGIN` | Tidak | Origin frontend yang diizinkan (bisa lebih dari satu, dipisahkan koma `,`). |
| `FRONTEND_URL` | Tidak | Base URL frontend untuk membentuk tautan halaman tugas TPS. |
| `JWT_ACCESS_SECRET` | Ya | Secret penandatanganan access token JWT (minimal 16 karakter, disarankan >= 32 karakter acak). |
| `JWT_REFRESH_SECRET` | Ya | Secret penandatanganan refresh token (minimal 16 karakter, harus berbeda dari access secret). |
| `COOKIE_SECURE` | Tidak | Set `false` untuk pengembangan lokal (`http`), dan `true` saat production (`https`). |
| `WHATSAPP_PROVIDER` | Tidak | Default `"mock"` untuk pengembangan lokal (pesan dicetak di console server, tidak mengirim WA sungguhan). |
| `SEED_OPERATOR_*` | Ya (saat seed) | Kredensial akun **Operator** awal yang dibuat saat menjalankan `npm run prisma:seed`. |

> **Tips:** Untuk membuat string acak yang aman bagi `JWT_ACCESS_SECRET` dan `JWT_REFRESH_SECRET`, jalankan perintah berikut di terminal (jalankan dua kali untuk dua secret berbeda):
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

### 5. Generate Prisma Client & Migrasi Database

Jalankan perintah berikut untuk menghasilkan Prisma Client dan menerapkan skema tabel ke database PostgreSQL:

```bash
npm run prisma:generate
npm run prisma:migrate
```

> **Catatan:** Untuk environment **staging/production** (tanpa membuat migrasi baru), gunakan:
> ```bash
> npm run prisma:deploy
> ```

### 6. Seed Akun Operator Awal

Jalankan script seed untuk membuat akun **Operator** pertama di database berdasarkan konfigurasi `SEED_OPERATOR_*` pada `.env`:

```bash
npm run prisma:seed
```

Jika berhasil, terminal akan menampilkan pesan:

```text
[Seed] Akun Operator siap: { id: '...', name: 'Operator Si Pantas', username: 'operator', role: 'OPERATOR', isActive: true }
```

### 7. Jalankan Server Backend

- **Mode Development** (dengan auto-reload menggunakan `nodemon`):
  ```bash
  npm run dev
  ```
- **Mode Production:**
  ```bash
  npm start
  ```

Jika berhasil, terminal akan menampilkan:

```text
[Database] Koneksi PostgreSQL berhasil.
[Server] Si Pantas Backend berjalan di http://localhost:5000 (development)
```

---

## Verifikasi Instalasi

1. **Cek Health Check Endpoint**  
   Buka browser atau jalankan perintah berikut untuk memastikan server dan koneksi PostgreSQL berjalan normal:
   ```bash
   curl http://localhost:5000/health
   ```
   Respons yang diharapkan:
   ```json
   {
     "success": true,
     "message": "Si Pantas Backend sehat",
     "data": {
       "status": "ok",
       "database": "connected",
       "uptime": 12,
       "timestamp": "..."
     }
   }
   ```

2. **Cek Root API v1**
   ```bash
   curl http://localhost:5000/api/v1
   ```

3. **Jalankan Automated Tests (Opsional)**  
   Pastikan migrasi dan seed akun Operator sudah dijalankan, lalu jalankan:
   ```bash
   npm test
   ```

---

## Daftar Perintah (NPM Scripts)

| Perintah | Deskripsi |
|---|---|
| `npm run dev` | Menjalankan server dalam mode development (`nodemon`). |
| `npm start` | Menjalankan server dalam mode standar/production (`node`). |
| `npm run prisma:generate` | Menghasilkan Prisma Client dari `prisma/schema.prisma`. |
| `npm run prisma:migrate` | Menjalankan migrasi database untuk development (`prisma migrate dev`). |
| `npm run prisma:deploy` | Menerapkan migrasi database yang ada untuk production (`prisma migrate deploy`). |
| `npm run prisma:seed` | Menjalankan `prisma/seed.js` untuk membuat/memperbarui akun Operator awal. |
| `npm run prisma:studio` | Membuka antarmuka web Prisma Studio untuk melihat isi database. |
| `npm test` | Menjalankan integration test pada folder `tests/`. |

---

## Struktur Proyek & Prefix Endpoint

```text
Backend/
├── prisma/
│   ├── migrations/      # Riwayat migrasi database PostgreSQL
│   ├── schema.prisma    # Definisi model & relasi database
│   └── seed.js          # Script seeding akun Operator awal
├── src/
│   ├── config/          # Validasi env (Zod) & koneksi PostgreSQL/Prisma
│   ├── middlewares/     # Auth JWT, RBAC, error handler, rate limiter
│   ├── modules/         # Route, controller, service, validator per fitur
│   ├── services/        # Layanan lintas modul (token, WhatsApp)
│   ├── utils/           # Helper response & custom error
│   ├── app.js           # Konfigurasi Express & registrasi seluruh route
│   └── server.js        # Entry point server & graceful shutdown
├── tests/               # Integration tests (node:test)
├── .env.example         # Template konfigurasi environment variable
├── prisma.config.js     # Konfigurasi Prisma 7
└── package.json
```

**Kelompok Endpoint API:**
- `GET /health` — Pemeriksaan kesehatan server & database
- `/api/v1/public/*` — API publik read-only untuk Warga (tanpa login)
- `/api/v1/auth/*` — Autentikasi (`login`, `refresh`, `logout`)
- `/api/v1/kader/*` — Endpoint khusus role `KADER` (JWT)
- `/api/v1/operator/*` — Endpoint khusus role `OPERATOR` (JWT)
- `/api/v1/collection/*` — Endpoint tugas pengangkutan untuk TPS (berbasis token URL)

---

## Troubleshooting

- **`Konfigurasi environment variable tidak valid`**  
  Pastikan file `.env` berada di dalam folder `Backend/`, `DATABASE_URL` sudah terisi, serta `JWT_ACCESS_SECRET` dan `JWT_REFRESH_SECRET` masing-masing minimal 16 karakter.
- **Gagal terhubung ke PostgreSQL (`ECONNREFUSED` / autentikasi gagal)**  
  Pastikan layanan PostgreSQL sudah berjalan (`services.msc` di Windows atau `sudo service postgresql status` di Linux), username/password sesuai, dan database (`sipantas_db`) sudah dibuat.
- **`SEED_OPERATOR_PASSWORD wajib diisi di .env`**  
  Isi variabel `SEED_OPERATOR_PASSWORD` di file `.env` sebelum menjalankan `npm run prisma:seed`.
- **Error saat `npm install` pada paket `bcrypt` di Windows**  
  Pastikan menggunakan Node.js versi LTS (v20 atau v22) agar binary prebuilt `bcrypt` tersedia tanpa perlu kompilasi native.
