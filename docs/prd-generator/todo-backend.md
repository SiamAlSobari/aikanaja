# Todo Backend — AI Kanaja Backend (PRD Generator Module)

_Last updated: 20/7/2026_
_Status: IN PROGRESS_

---

## Tech Stack

| Layer | Teknologi |
| --- | --- |
| Runtime | Bun |
| HTTP Framework | Elysia |
| ORM | Prisma 7 (multi-file schema) |
| Database | SQLite (file: `data/dev.db`) |
| Auth | JWT via `@elysia/jwt` (httpOnly cookie) |
| OAuth | Google OAuth 2.0 |
| AI SDK | Vercel AI SDK (`ai`) |
| AI Providers | `@ai-sdk/google` (Gemini 2.0 Flash), `@ai-sdk/groq` |
| Package Manager | Bun |

---

## ATURAN KETAT — Elysia Module Pattern

**Prinsip:** Modular, terpisah per feature. Shared modules reusable.

### 1. Module Structure:

```
src/modules/
├── shared/           # Reusable lintas project
│   ├── auth/         # Auth logic
│   └── session/      # Session management
└── project/          # Per-project modules
    └── prd-generator/
        ├── index.ts              # Mount controllers
        ├── controllers/          # Route handlers
        └── services/             # Business logic & AI prompt services
```

### 2. DILARANG:

- ❌ Hardcode secrets di source code — pakai env
- ❌ Skip validasi input — WAJIB validasi semua request body via Elysia `t.Object()`
- ❌ Return password/hash di response — filter sensitive fields
- ❌ Langsung akses Prisma dari controller — pakai service layer
- ❌ Tanpa error handling — wrap semua async call dengan try-catch
- ❌ Menyimpan Custom API Key ke server database (Custom Key dari header `x-custom-api-key` langsung diteruskan ke AI provider)

### 3. WAJIB:

- ✅ Controller → Service → Prisma (3 layer)
- ✅ Validasi input pakai Elysia `t.Object()` atau Zod
- ✅ Return format konsisten: `{ message, data }` atau `{ success, data, error }`
- ✅ Auth middleware untuk protected routes
- ✅ Error handling: try-catch + proper HTTP status codes

### 4. Hukumannya:

- Langgar aturan 1 → Security breach
- Langgar aturan 2 → Data corruption
- Langgar aturan 3 → API inconsistency
- Konsekuensi: Code review REJECT.

---

## Legend

- 🔴 Wajib (MVP)
- 🟡 Opsional (nice-to-have)
- 🟢 Future (fase 2+)

---

## Phase 0 — Foundation Setup

### 0.1 Project Setup

- [x] Inisialisasi Bun project
- [x] Install Elysia
- [x] Setup TypeScript
- [x] Install Prisma + Bun SQLite adapter
- [x] Setup folder structure: `src/modules`, `src/lib`, `src/config`
- [x] Setup `.env` (`DATABASE_URL`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`)
- [x] Setup `src/config/index.ts` (port, jwt, cors)

### 0.2 Auth Module (Basic)

- [x] `src/common/middlewares/auth.middleware.ts`:
  - JWT verification dari cookie
  - Extract user: id, email, role
- [x] `src/modules/shared/auth/auth.service.ts`:
  - register(name, email, password)
  - login(email, password)
  - getProfile(userId)
- [x] `src/modules/shared/auth/auth.controller.ts`:
  - POST `/auth/register`
  - POST `/auth/login`
- [x] `src/modules/shared/session/session.controller.ts`:
  - GET `/session` (protected)

### 0.3 Entry Point

- [x] `src/index.ts`:
  - Elysia app
  - Mount modules: auth, erd, prd, session
  - Error handling & logging

---

## Phase 1 — Auth Module (Google OAuth)

- [x] 🔴 `src/modules/shared/auth/google.service.ts`
- [x] 🔴 `src/modules/shared/auth/auth.controller.ts` (GET `/auth/google`, GET `/auth/callback`, POST `/auth/logout`)
- [x] 🔴 `src/common/middlewares/auth.middleware.ts` (`authMiddleware`, `optionalAuthMiddleware`)

---

## Phase 2 — PRD Project CRUD

### 2.1 Project Service

- [x] 🔴 `src/modules/project/prd-generator/services/project.service.ts`:
  - `listProjects(userId, { page, limit, sort, filter })`
  - `getProject(userId, projectId)`
  - `createProject(userId, { name, description, templateType })`
  - `updateProject(userId, projectId, { name, description, content })`
  - `deleteProject(userId, projectId)` — soft delete (status → "deleted")
  - `restoreProject(userId, projectId)`

### 2.2 Project Controller

- [x] 🔴 `src/modules/project/prd-generator/controllers/project.controller.ts`:
  - GET `/prd/projects`
  - GET `/prd/projects/:id`
  - POST `/prd/projects`
  - PATCH `/prd/projects/:id`
  - DELETE `/prd/projects/:id`
  - POST `/prd/projects/:id/restore`

---

## Phase 3 — AI Generation & Stream Engine

### 3.1 AI Prompt Service

- [x] 🔴 `src/modules/project/prd-generator/services/ai-prompt.service.ts`:
  - Primary System Prompt for Gemini 2.0 Flash (`@ai-sdk/google`)
  - Provider fallback engine (Gemini 2.0 Flash -> Groq)
  - Custom API Key Header extractor (`x-custom-api-key`)
  - Streaming Markdown response generator

### 3.2 AI Controllers

- [x] 🔴 `src/modules/project/prd-generator/controllers/ai.controller.ts`:
  - POST `/prd/generate` — streaming PRD generator
  - POST `/prd/copilot` — streaming inline copilot modifier

---

## Phase 4 — Copilot & Killer Features Controllers

### 4.1 Multi-Agent Virtual Review Service

- [ ] 🔴 `src/modules/project/prd-generator/services/virtual-review.service.ts`:
  - Multi-agent System Prompts (Tech Lead, QA Engineer, Product Sponsor)
  - JSON response parser & feedback aggregator
- [ ] 🔴 POST `/prd/virtual-review` endpoint

### 4.2 Quality Score & Ambiguity Audit Service

- [ ] 🔴 `src/modules/project/prd-generator/services/quality-audit.service.ts`:
  - Health Score Calculator (0-100)
  - Ambiguity Warning Detector
  - Completeness Inspector
- [ ] 🔴 POST `/prd/quality-audit` endpoint

### 4.3 Story Points & Sprint Planner Service

- [ ] 🔴 `src/modules/project/prd-generator/services/sprint-planner.service.ts`:
  - Fibonacci Story Points Estimator (1, 2, 3, 5, 8, 13)
  - Sprint Roadmap Allocator (Sprint 1 MVP, Sprint 2 Expansion, Sprint 3 Scalability)
- [ ] 🔴 POST `/prd/sprint-plan` endpoint

### 4.4 AI Agent Prompt Exporter Service

- [ ] 🔴 `src/modules/project/prd-generator/services/agent-exporter.service.ts`:
  - Exporter to `AGENTS.md` / `PROMPT.md` format for Cursor / Claude Code / Antigravity
- [ ] 🔴 POST `/prd/export-agent` endpoint

---

## Phase 5 — Version History & Visual Diff Engine

- [ ] 🔴 `src/modules/project/prd-generator/services/version.service.ts`:
  - `createVersionSnapshot(projectId, content, title)`
  - `listVersions(projectId)`
  - `getVersionDiff(projectId, vA, vB)` — Diff algorithm
- [ ] 🔴 `src/modules/project/prd-generator/controllers/version.controller.ts`:
  - GET `/prd/projects/:id/versions`
  - GET `/prd/projects/:id/diff`
  - POST `/prd/projects/:id/versions/:versionId/restore`

---

## Phase 6 — Sharing & Export Module

- [ ] 🔴 `src/modules/project/prd-generator/services/share.service.ts`:
  - `generateShareLink(projectId)`
  - `getPublicProject(shareToken)`
- [ ] 🔴 `src/modules/project/prd-generator/controllers/share.controller.ts`:
  - POST `/prd/projects/:id/share`
  - GET `/prd/share/:shareToken` (public read-only)

---

## Phase 7 — Admin & Billing Module

- [ ] 🟡 `src/modules/project/prd-generator/controllers/admin.controller.ts`:
  - GET `/admin/prd/stats`
  - GET `/admin/prd/projects`
  - GET `/admin/prd/users`
- [ ] 🟡 `src/modules/shared/billing/billing.service.ts`:
  - Quota checking & plan tier limits ('free' | 'pro' | 'team')
