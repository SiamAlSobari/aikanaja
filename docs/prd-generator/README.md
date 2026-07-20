# AiKanAja — PRD Generator Docs

Dokumentasi produk **AiKanAja — PRD Generator** (aplikasi pembuat Product Requirement Document otomatis dengan AI). Sumber frontend akan dibuat di `apps/prd-generator/`.

## Isi

| File | Isi |
| ---- | ---- |
| [prd.md](./prd.md) | Product Requirement Document — visi, fitur, tech stack, arsitektur, struktur frontend/backend, API endpoints, billing & quota |
| [todo-frontend.md](./todo-frontend.md) | Rencana kerja frontend (SvelteKit) per phase, dengan status progres |
| [todo-backend.md](./todo-backend.md) | Rencana kerja backend (Elysia + Bun) per phase, dengan status progres |

## Modul Terkait

- Backend: `apps/api` (Elysia modules di `src/modules/project/prd-generator/`)
- Frontend: `apps/prd-generator` (SvelteKit 5, `src/routes`, `src/lib`)
