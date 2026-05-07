# Sistem Booking dr. gigi

<p align="center">
  Platform reservasi klinik gigi modern untuk pasien dan admin dalam satu aplikasi.
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" />
  <img alt="React" src="https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white" />
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma" />
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql&logoColor=white" />
</p>

## Tentang Project

Sistem ini dirancang untuk membantu klinik gigi mengelola alur reservasi dari awal sampai akhir:
- Pasien bisa melihat profil klinik, layanan, jadwal, FAQ, lalu reservasi online.
- Admin bisa mengelola data reservasi, jadwal praktik, layanan, pasien, laporan, dan pengaturan klinik.

Fokus utama project ini adalah pengalaman booking yang cepat, rapi, dan mudah dipantau.

## Why This Project

- Reservasi lebih tertata: validasi kuota, tanggal, dan jadwal berjalan otomatis.
- Operasional klinik lebih efisien: panel admin terpusat untuk semua data penting.
- Tetap ramah pengguna: UI publik informatif dan terhubung ke WhatsApp klinik.

## Fitur Unggulan

### Area Pasien
- Landing page informatif: profil klinik, layanan unggulan, jadwal, testimoni, lokasi.
- Halaman lengkap: layanan, jadwal, FAQ, tentang, kontak.
- Form reservasi online dengan validasi ketat.
- Cek status reservasi.
- Tombol WhatsApp langsung ke klinik.

### Area Admin
- Login aman dengan JWT + HttpOnly cookie.
- Dashboard ringkasan data operasional.
- Manajemen reservasi: filter, update status, detail reservasi.
- Manajemen jadwal praktik dan blocked dates (hari libur/penutupan).
- Manajemen layanan dan data pasien.
- Pengaturan klinik serta laporan.

## Preview Alur

```text
Pasien buka website -> pilih layanan & jadwal -> kirim reservasi
-> sistem validasi slot -> data tersimpan -> admin memproses dari dashboard
```

## Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, Tailwind CSS 4 |
| Backend | Next.js Route Handlers |
| Database | PostgreSQL (Neon) |
| ORM | Prisma 7 + Prisma Adapter Neon |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Language | TypeScript |

## Struktur Project

```text
src/
  app/
    (patient)/        # halaman publik
    admin/            # dashboard admin
    api/              # auth, reservasi, jadwal, layanan, settings
  components/
    admin/
    layout/
    ui/
  lib/                # auth, prisma client, data helpers, utils
prisma/
  schema.prisma
  seed.ts
```

## Quick Start

1. Install dependencies

```bash
npm install
```

2. Sinkronkan schema database

```bash
# Opsi A (disarankan): migration
npx prisma migrate dev --name init

# Opsi B: tanpa migration lokal
npx prisma db push
```

3. Seed data awal

```bash
npm run seed
```

4. Jalankan aplikasi

```bash
npm run dev
```

5. Akses aplikasi
- Publik: http://localhost:3000
- Admin: http://localhost:3000/admin/login

## Akun Default Seed (Development)

Data default dari proses seed untuk uji coba lokal:

| Role | Email | Password |
|---|---|---|
| Admin | bentengdentalcare@gmail.com | admin123 |
| Doctor | drg.astuti@bentengdentalcare.com | doctor123 |

Catatan keamanan: jangan pakai kredensial ini di production.

## NPM Scripts

```bash
npm run dev     # Development mode
npm run build   # prisma generate + build next
npm run start   # Run production build
npm run lint    # Linting
npm run seed    # Seed initial data
```

## API Endpoints

### Auth
- POST `/api/auth/login`
- POST `/api/auth/logout`
- GET `/api/auth/me`
- POST `/api/auth/change-password`

### Reservations
- POST `/api/reservations`
- GET/PUT/DELETE `/api/reservations/[id]`
- GET `/api/reservations/availability`
- POST `/api/reservations/check`

### Schedules
- GET/POST `/api/schedules`
- GET/PUT/DELETE `/api/schedules/[id]`
- GET/POST `/api/schedules/blocked-dates`
- DELETE `/api/schedules/blocked-dates/[id]`

### Services
- GET/POST `/api/services`
- GET/PUT/DELETE `/api/services/[id]`

### Settings
- GET/PUT `/api/settings`

## Validasi Reservasi

Endpoint reservasi melakukan validasi berikut secara otomatis:
- Field wajib harus terisi.
- Nomor telepon harus valid.
- Tanggal tidak boleh di masa lalu.
- Layanan harus aktif.
- Tanggal tidak boleh termasuk blocked date.
- Jadwal praktik harus tersedia di hari tersebut.
- Slot waktu tidak boleh melebihi kuota.

## Deployment Notes

- Jika pakai migration, jalankan:

```bash
npx prisma migrate deploy
```

- Nonaktifkan/ubah akun default seed sebelum go-live.

## Roadmap Pengembangan

- Notifikasi WhatsApp otomatis saat status reservasi berubah.
- Kalender admin yang lebih interaktif.
- Export laporan ke PDF/Excel.
- Multi-role granular permission (ADMIN/DOCTOR/RECEPTIONIST).

## Kontribusi

Kontribusi sangat terbuka. Buat branch fitur, lakukan perubahan, lalu ajukan pull request.

## Lisensi

Silakan tentukan lisensi project sesuai kebutuhan (contoh: MIT).
