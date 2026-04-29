# Issue: Backend Setup — Simpan Workspace ke Neon DB dengan Clerk Webhook

## Konteks Proyek

- **Framework:** Next.js 16 (App Router)
- **Auth:** Clerk (sudah terintegrasi)
- **Database Target:** Neon (PostgreSQL serverless)
- **ORM:** Prisma + Neon Serverless Adapter

> **Kenapa Neon?** Neon menyediakan **unlimited projects** di free tier (tidak seperti Supabase yang hanya 2), dan karena Neon adalah PostgreSQL, Prisma bisa digunakan 100% tanpa perubahan schema apapun.

---

## Tujuan

Membuat sistem backend yang:

1. Menyimpan data user ke Neon DB saat user mendaftar via Clerk (menggunakan Webhook)
2. Menyimpan data workspace/canvas (strokes) milik user ke database

---

## Schema Database

```
-- Tabel users (disinkronkan dari Clerk via webhook)
users {
  id         String    (Primary Key)   ← Clerk User ID
  name       String
  email      String    (Unique)
  created_at DateTime
}

-- Tabel workspaces (canvas milik user)
workspaces {
  id         String    (Primary Key, auto-generated)
  title      String
  strokes    Json      ← Array stroke disimpan sebagai JSON
  user_id    String    (Foreign Key → users.id)
  created_at DateTime
  updated_at DateTime
}
```

---

## Langkah-langkah Implementasi

### Langkah 1 — Buat Project di Neon

1. Buka https://neon.tech dan daftar/login
2. Klik **"New Project"**
3. Pilih nama project (contoh: `sketchly`) dan region terdekat
4. Setelah project dibuat, klik **"Connection Details"**
5. Pilih tab **"Prisma"** (Neon punya tab khusus untuk ini!)
6. Copy dua nilai yang muncul:
   - `DATABASE_URL` (pooled connection — untuk query normal)
   - `DATABASE_URL_UNPOOLED` (direct connection — untuk migrasi Prisma)

---

### Langkah 2 — Install Dependencies

Jalankan perintah berikut di terminal dalam folder project:

```bash
# Prisma ORM
npm install prisma @prisma/client

# Neon serverless adapter (wajib untuk Next.js serverless)
npm install @neondatabase/serverless @prisma/adapter-neon

# Init Prisma (membuat folder prisma/ dan file .env)
npx prisma init
```

---

### Langkah 3 — Konfigurasi `.env.local`

Tambahkan variabel berikut ke file `.env.local` di root project:

```env
# Neon — Pooled (untuk query di API routes)
DATABASE_URL="postgresql://[user]:[password]@[host]-pooler.neon.tech/[dbname]?sslmode=require"

# Neon — Direct (untuk npx prisma db push / migrate)
DATABASE_URL_UNPOOLED="postgresql://[user]:[password]@[host].neon.tech/[dbname]?sslmode=require"

# Clerk — untuk memverifikasi webhook
CLERK_WEBHOOK_SECRET="whsec_..."
```

> **Cara mendapatkan URL Neon:**
>
> 1. Dashboard Neon → pilih project → klik "Connection Details"
> 2. Pilih tab **"Prisma"**
> 3. Copy `DATABASE_URL` (yang ada `-pooler` di hostname = pooled)
> 4. Copy `DATABASE_URL_UNPOOLED` (tanpa `-pooler` = direct)

> **Cara mendapatkan `CLERK_WEBHOOK_SECRET`:**
>
> 1. Buka https://dashboard.clerk.com
> 2. Pilih aplikasi Anda → "Webhooks" → "Add Endpoint"
> 3. Masukkan URL: `https://your-domain.com/api/webhooks/clerk`
> 4. Centang event: `user.created`
> 5. Copy "Signing Secret" yang muncul

---

### Langkah 4 — Buat Schema Prisma

Buka file `prisma/schema.prisma` dan ganti isinya menjadi:

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["driverAdapters"]  // ← Wajib untuk Neon adapter
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")          // Pooled — untuk query
  directUrl = env("DATABASE_URL_UNPOOLED") // Direct — untuk migrasi
}

model User {
  id         String      @id           // Clerk User ID (bukan auto-increment)
  name       String
  email      String      @unique
  createdAt  DateTime    @default(now()) @map("created_at")
  workspaces Workspace[]

  @@map("users")
}

model Workspace {
  id        String   @id @default(cuid())
  title     String   @default("Untitled")
  strokes   Json     @default("[]")
  userId    String   @map("user_id")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  user User @relation(fields: [userId], references: [id])

  @@map("workspaces")
}
```

Lalu jalankan perintah berikut untuk membuat tabel di Neon:

```bash
npx prisma db push
npx prisma generate
```

> **Catatan:** `prisma db push` akan menggunakan `DATABASE_URL_UNPOOLED` (direct connection) untuk membuat tabel. Ini penting karena koneksi pooled tidak mendukung operasi DDL (pembuatan tabel).

---

### Langkah 5 — Buat Prisma Client dengan Neon Adapter

> **Kenapa perlu adapter?** Next.js API routes berjalan di lingkungan serverless. Koneksi database tradisional (TCP) tidak efisien di sana. Neon Serverless Adapter menggunakan **WebSocket** yang jauh lebih cocok untuk serverless.

Buat file baru: `lib/prisma.ts`

```typescript
import { PrismaClient } from "@prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"
import { neonConfig, Pool } from "@neondatabase/serverless"
import ws from "ws"

// Gunakan WebSocket untuk koneksi serverless
neonConfig.webSocketConstructor = ws

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaNeon(pool)
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
```

> **Kenapa pakai singleton?** Next.js di mode development akan me-reload modul berkali-kali. Singleton mencegah terlalu banyak koneksi pool yang terbuka sekaligus.

---

### Langkah 6 — Buat Webhook Handler untuk Clerk

Install library verifikasi Clerk webhook:

```bash
npm install svix
```

Buat file: `src/app/api/webhooks/clerk/route.ts`

```typescript
import { headers } from "next/headers"
import { Webhook } from "svix"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    return new Response("Missing CLERK_WEBHOOK_SECRET", { status: 500 })
  }

  // Ambil headers untuk verifikasi tanda tangan
  const headerPayload = await headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Verifikasi bahwa request benar-benar berasal dari Clerk
  const wh = new Webhook(WEBHOOK_SECRET)
  let evt: any

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    })
  } catch (err) {
    return new Response("Invalid signature", { status: 400 })
  }

  // Tangani event user.created — simpan user baru ke Neon DB
  if (evt.type === "user.created") {
    const { id, first_name, last_name, email_addresses } = evt.data

    await prisma.user.create({
      data: {
        id, // Clerk User ID sebagai Primary Key
        name: `${first_name ?? ""} ${last_name ?? ""}`.trim(),
        email: email_addresses[0].email_address,
      },
    })
  }

  return new Response("OK", { status: 200 })
}
```

---

### Langkah 7 — Buat API Route untuk Workspace

Buat file: `src/app/api/workspaces/route.ts`

```typescript
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET — ambil semua workspace milik user yang sedang login
export async function GET() {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const workspaces = await prisma.workspace.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  })

  return NextResponse.json(workspaces)
}

// POST — buat workspace baru
export async function POST(req: Request) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { title, strokes } = await req.json()

  const workspace = await prisma.workspace.create({
    data: {
      title: title ?? "Untitled",
      strokes: strokes ?? [],
      userId,
    },
  })

  return NextResponse.json(workspace, { status: 201 })
}
```

Buat file: `src/app/api/workspaces/[id]/route.ts`

```typescript
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// PATCH — update strokes pada workspace yang ada
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { title, strokes } = await req.json()

  const workspace = await prisma.workspace.updateMany({
    where: { id: params.id, userId }, // user hanya bisa edit workspace miliknya sendiri
    data: { title, strokes },
  })

  return NextResponse.json(workspace)
}
```

---

## Struktur File yang Dibuat

```
sketchly/
├── lib/
│   └── prisma.ts                      ← Prisma + Neon adapter singleton
├── prisma/
│   └── schema.prisma                  ← Schema database
└── src/
    └── app/
        └── api/
            ├── webhooks/
            │   └── clerk/
            │       └── route.ts       ← Webhook dari Clerk → simpan user
            └── workspaces/
                ├── route.ts           ← GET & POST workspace
                └── [id]/
                    └── route.ts       ← PATCH workspace
```

---

## Kriteria Penerimaan

- [ ] Ketika user baru mendaftar via Clerk, record user otomatis masuk ke tabel `users` di Neon
- [ ] API `GET /api/workspaces` mengembalikan daftar workspace user yang sedang login
- [ ] API `POST /api/workspaces` membuat workspace baru
- [ ] API `PATCH /api/workspaces/[id]` menyimpan perubahan strokes
- [ ] Semua endpoint dilindungi — hanya user yang login yang bisa mengakses

---

## Catatan Penting

> **Urutan yang benar:**
>
> 1. Buat project di Neon dan dapatkan `DATABASE_URL` + `DATABASE_URL_UNPOOLED`
> 2. Isi `.env.local` dengan kedua URL tersebut
> 3. Jalankan `npx prisma db push` untuk membuat tabel
> 4. Setup webhook di dashboard Clerk
> 5. Deploy atau gunakan `ngrok` untuk tes webhook secara lokal

> **Perbedaan URL Neon:**
>
> | Variabel | Digunakan untuk | Kapan |
> |---|---|---|
> | `DATABASE_URL` | Query (INSERT, SELECT, UPDATE) | Saat app berjalan |
> | `DATABASE_URL_UNPOOLED` | Migrasi Prisma (CREATE TABLE) | Saat `prisma db push` |
