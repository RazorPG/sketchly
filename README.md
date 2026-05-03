<p align="center">
	<img src="public/images/logo.png" alt="Sketchly Logo" width="180" />
</p>

<h1 align="center">Sketchly</h1>

<p align="center">
  Sketchly adalah aplikasi whiteboard berbasis web untuk membuat, mengelola, dan menggambar di workspace digital. Aplikasi ini dibangun dengan Next.js, Clerk untuk autentikasi, Prisma untuk akses database PostgreSQL, dan canvas SVG untuk menggambar bebas di dalam workspace.
</p>

## Gambaran Singkat

Proyek ini berfokus pada alur kerja berikut:

1. Pengguna login menggunakan Clerk.
2. Pengguna melihat daftar workspace miliknya di halaman utama.
3. Pengguna dapat membuat workspace baru, mencari workspace yang ada, lalu membukanya.
4. Di dalam workspace, pengguna bisa menggambar dengan pena, menghapus dengan penghapus, memindahkan canvas dengan hand tool, melakukan undo/redo, zoom in/out, reset tampilan, dan mengekspor hasil gambar.
5. Data workspace dan histori stroke disimpan ke database PostgreSQL melalui Prisma.

## Fitur Utama

- Autentikasi dan manajemen user menggunakan Clerk.
- Sinkronisasi user Clerk ke database melalui webhook.
- Daftar workspace milik user dengan fitur pencarian.
- Canvas menggambar bebas berbasis SVG.
- Tool pen untuk membuat stroke.
- Tool eraser untuk menghapus stroke.
- Tool hand untuk memindahkan area canvas.
- Undo dan redo untuk histori gambar.
- Zoom in, zoom out, dan reset view.
- Clear canvas.
- Export canvas ke file JPEG.
- Penyimpanan workspace, stroke, dan history ke database.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Clerk
- Prisma
- PostgreSQL
- Tailwind CSS 4
- HeroUI
- Framer Motion
- svix untuk verifikasi webhook

## Struktur Proyek

```text
src/
	app/
		api/
			clerk/route.ts        # Webhook Clerk untuk sync user
			workspaces/route.ts   # List dan create workspace
			workspaces/[id]/route.ts
		workspace/[id]/page.tsx # Halaman workspace
	components/
		layouts/                # Layout halaman utama dan workspace
		sections/               # Navbar, footer, dan section UI
		ui/                     # Komponen kecil reusable
		views/                  # View utama Home dan Workspace
	config/prisma.ts          # Konfigurasi Prisma client
	contexts/                 # Context global untuk Home dan Workspace
prisma/
	schema.prisma             # Skema database
```

## Model Database

Database memiliki dua model utama:

- `User`: menyimpan data user dari Clerk.
- `Workspace`: menyimpan judul workspace, stroke canvas, history undo/redo, dan relasi ke pemilik workspace.

Workspace menyimpan data gambar dalam bentuk JSON agar state canvas bisa dipulihkan saat user membuka workspace kembali.

## Prasyarat

Sebelum menjalankan proyek, pastikan Anda sudah memiliki:

- Node.js versi yang kompatibel dengan Next.js 16.
- PostgreSQL yang aktif.
- Akun Clerk beserta project dan API keys.

## Instalasi

1. Clone repository ini.
2. Install dependencies:

```bash
npm install
```

3. Siapkan file environment di root project.

## Environment Variables

Buat atau lengkapi file `.env.local` atau `.env.production` dengan variabel berikut:

```dotenv
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
DIRECT_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
SIGNING_SECRET=your_clerk_webhook_signing_secret
```

Keterangan:

- `DATABASE_URL` dipakai Prisma saat aplikasi membaca dan menulis data.
- `DIRECT_URL` biasanya dipakai Prisma untuk koneksi langsung ke database.
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` dipakai di sisi client.
- `CLERK_SECRET_KEY` dipakai di sisi server.
- `SIGNING_SECRET` dipakai untuk memverifikasi webhook dari Clerk.

## Setup Database

Setelah environment siap, jalankan perintah berikut:

```bash
npm run db:generate
npm run db:push
```

`db:generate` membuat Prisma Client, sedangkan `db:push` menyinkronkan skema ke database.

Jika Anda ingin memakai migrasi yang sudah ada di folder `prisma/migrations`, pastikan database sudah sesuai dengan skema yang digunakan proyek.

## Webhook Clerk

Proyek ini memakai endpoint webhook di `src/app/api/clerk/route.ts` untuk menyinkronkan user Clerk ke tabel `users`.

Langkah umum konfigurasi webhook:

1. Buat webhook endpoint di dashboard Clerk.
2. Arahkan ke URL endpoint aplikasi Anda, misalnya:

```text
https://your-domain.com/api/clerk
```

3. Pastikan event user seperti `user.created`, `user.updated`, dan `user.deleted` diaktifkan.
4. Isi `SIGNING_SECRET` dengan secret webhook dari Clerk.

Jika Anda mengembangkan secara lokal, Anda bisa memakai tunnel seperti ngrok agar Clerk dapat mengirim webhook ke mesin lokal.

## Menjalankan Aplikasi

### Development

```bash
npm run dev
```

Lalu buka:

```text
http://localhost:3000
```

### Production Build

```bash
npm run build
npm run start
```

## Script yang Tersedia

- `npm run dev`: menjalankan aplikasi dalam mode development.
- `npm run build`: membuat build produksi.
- `npm run start`: menjalankan build produksi.
- `npm run lint`: menjalankan ESLint.
- `npm run db:generate`: generate Prisma Client.
- `npm run db:push`: sinkronisasi schema Prisma ke database.

## Alur Penggunaan Aplikasi

### 1. Login

Pengguna masuk melalui Clerk. Setelah autentikasi berhasil, data user akan disimpan ke database melalui webhook.

### 2. Home

Di halaman utama, pengguna dapat melihat workspace yang sudah dibuat dan menggunakan fitur pencarian untuk menemukan workspace tertentu.

### 3. Membuka Workspace

Saat workspace dibuka, pengguna akan masuk ke area canvas dengan beberapa kontrol:

- Toolbar kiri untuk memilih tool, warna stroke, ketebalan stroke, membersihkan canvas, dan export JPEG.
- Toolbar kanan untuk mengatur zoom dan reset tampilan.
- Toolbar bawah untuk undo, redo, dan melihat jumlah stroke.

### 4. Menggambar

Tool yang tersedia di canvas:

- `pen` untuk menggambar stroke baru.
- `eraser` untuk menghapus stroke yang ada.
- `hand` untuk memindahkan area canvas.

## Endpoint API

- `GET /api/workspaces` mengambil semua workspace milik user yang sedang login.
- `POST /api/workspaces` membuat workspace baru.
- `GET /api/workspaces/[id]` mengambil detail workspace tertentu.
- `PUT /api/workspaces/[id]` memperbarui title, strokes, atau history workspace.
- `DELETE /api/workspaces/[id]` menghapus workspace milik user.
- `POST /api/clerk` menerima webhook event dari Clerk.

## Deployment

Proyek ini dapat dideploy ke platform yang mendukung aplikasi Next.js, misalnya Vercel.

Checklist sebelum deploy:

1. Pastikan semua environment variable produksi sudah diisi.
2. Jalankan `npm run build` untuk memastikan build berhasil.
3. Konfigurasikan webhook Clerk ke domain produksi.
4. Pastikan database produksi dapat diakses oleh Prisma.

## Catatan Pengembangan

- Struktur data stroke disimpan sebagai JSON agar state canvas mudah diserialisasi dan dipulihkan.
- Workspace memakai history untuk mendukung undo/redo.
- Aplikasi ini memisahkan logic UI ke dalam `views`, `layouts`, dan `contexts` supaya kode lebih mudah dirawat.

## Referensi Singkat

- `src/app/page.tsx` untuk entry page utama.
- `src/app/workspace/[id]/page.tsx` untuk halaman workspace.
- `src/app/api/workspaces/route.ts` untuk create dan list workspace.
- `src/app/api/workspaces/[id]/route.ts` untuk operasi detail workspace.
- `src/app/api/clerk/route.ts` untuk sinkronisasi user Clerk.
