# AI Kanaja Backend

Multi-project monolith: Elysia + Prisma + SQLite. Setiap project module di `src/modules/project/`, schema di `prisma/projects/`.

## Commands

Prefix `rtk` untuk hemat token.

| Command | Fungsi |
|---------|--------|
| `rtk bun run dev` | Dev server |
| `rtk bun run db:migrate` | Migration baru |
| `rtk bun run db:generate` | Generate Prisma client |
| `rtk bun run db:push` | Push schema |
| `rtk bun run db:studio` | Prisma Studio |

## Structure

```
src/
├── index.ts                          # Entry point
├── config/index.ts                   # Port, JWT, CORS
├── lib/prisma.ts                     # Prisma client
├── common/middlewares/auth.middleware.ts  # JWT middleware
└── modules/
    ├── shared/auth/                  # Auth (Google OAuth)
    ├── shared/session/               # Session
    └── project/erd-generator/        # ERD module
        ├── controllers/              # Route handlers
        ├── services/                 # Business logic
        ├── validations/              # Schema validasi
        └── index.ts                  # Mount
```

## Prisma Convention

- `schema.prisma` → shared models (User)
- `projects/<nama>.prisma` → per-project models
- Auto-merge oleh Prisma 6+
- Output di `generated/prisma/`

## Tambah Module Baru

1. Buat `src/modules/project/<nama>/` (index.ts, controllers/, services/, validations/)
2. Buat `prisma/projects/<nama>.prisma`
3. Mount di `src/index.ts` → `.use(namaModule)`
4. `rtk bun run db:migrate`

## Tech Stack

Bun, Elysia, Prisma 7, SQLite, JWT (`@elysia/jwt`), logixlysia

---

## Rules: DRY, KISS, YAGNI

**DRY** — Jangan copy-paste. Extract ke shared function jika 2+ kali pakai.

**KISS** — Simple. Function max 30-50 baris. Satu function = satu tanggung jawab. Nama jelas.

**YAGNI** — Implementasi HANYA untuk kebutuhan saat ini. Jangan bikin abstraction "kali aja nanti butuh". Hapus dead code.

### Code Clean & Rapi

- File max **200 baris** — lebih dari itu, pisah jadi helper/service
- Function max **30-50 baris** — lebih dari itu, extract ke sub-function
- Comment hanya yang perlu — jangan comment obvious code
- **Dokumentasi code jika diperlukan:**
  - Complex logic → jelaskan "why", bukan "what"
  - Non-obvious algorithm → brief comment sebelum block
  - Public API / exported function → JSDoc singkat (params, return, throws)
  - Business rule → comment kenapa rule itu ada
  - ❌ Jangan comment yang obvious: `// increment count` → tidak perlu
- Nama variable/function harus **jelas** — `getUserById` bukan `getData`
- Import rapi — group: external → internal → relative
- Hapus unused import, variable, function

### Shared Modules (Lintas Project)

Jika code **bisa dipakai di banyak project** (bukan cuma ERD), pindah ke shared:

```
src/modules/shared/
├── auth/           # Auth logic (login, JWT, middleware)
├── session/        # Session management
└── ...             # Tambahkan jika ada shared logic baru

src/common/
├── middlewares/     # Shared middleware
├── helpers/         # Shared helper functions
└── types/           # Shared TypeScript types
```

**Contoh:**
- `quota.service.ts` → bisa dipakai project lain → pindah ke `src/modules/shared/quota/`
- `pagination.util.ts` → bisa dipakai semua project → pindah ke `src/common/helpers/`
- `api-response.type.ts` → bisa dipakai semua project → pindah ke `src/common/types/`

**Rule:** Jika ragu, tanya: "Apakah ini spesifik untuk ERD saja?" → Ya = di module. Tidak = di shared.

### Module Pattern

```
controllers/*.controller.ts  → thin layer, delegasi ke service
services/*.service.ts        → business logic, akses DB
validations/*.validation.ts  → schema only, tanpa logic
prompts/*.prompt.ts          # AI prompt templates (terpisah dari logic)
helpers/*.helper.ts          # Helper functions (jika service terlalu besar)
```

### Error Handling

- Pakai `elysia-http-exception` (`NotFoundException`, `ForbiddenException`, `BadRequestException`)
- Service throw exception, controller tinggal return
- `console.error` dengan context: `[ServiceName.method]`
- Try-catch di setiap service method

### Prisma Query

- `select` — ambil field yang dibutuhkan saja
- `where` — filter di query, bukan di app
- Pagination — max 100 per page
- `Promise.all` — query parallel

### Naming

| Item | Format | Contoh |
|------|--------|--------|
| File | `kebab-case.ts` | `project.service.ts` |
| Class | `PascalCase` | `ProjectService` |
| Method | `camelCase` | `createProject` |
| Variable | `camelCase` | `userId` |
| Constant | `UPPER_SNAKE` | `MAX_LIMIT` |
| Prisma model | `PascalCase` | `ErdProject` |
| Prisma field | `camelCase` | `createdAt` |
