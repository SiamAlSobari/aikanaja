# Todo Backend — AI Kanaja Backend (SchemaFlow Module)

_Last updated: 17/7/2026_
_Status: IN PROGRESS_

---

## Tech Stack

| Layer           | Teknologi                               |
| --------------- | --------------------------------------- |
| Runtime         | Bun                                     |
| HTTP Framework  | Elysia                                  |
| ORM             | Prisma 7 (multi-file schema)            |
| Database        | SQLite (file: `data/dev.db`)            |
| Auth            | JWT via `@elysia/jwt` (httpOnly cookie) |
| OAuth           | Google OAuth 2.0                        |
| AI SDK          | Vercel AI SDK (`ai`)                    |
| AI Providers    | `@ai-sdk/groq`, `@ai-sdk/google`        |
| Package Manager | Bun                                     |

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
    └── erd-generator/
        ├── index.ts              # Mount controllers
        └── controllers/          # Route handlers
```

### 2. DILARANG:

- ❌ Hardcode secrets di source code — pakai env
- ❌ Skip validasi input — WAJIB validasi semua request body
- ❌ Return password/hash di response — filter sensitive fields
- ❌ Langsung akses Prisma dari controller — pakai service layer
- ❌ Tanpa error handling — wrap semua async call

### 3. WAJIB:

- ✅ Controller → Service → Prisma (3 layer)
- ✅ Validasi input pakai Elysia `t.Object()` atau Zod
- ✅ Return format konsisten: `{ message, data }` atau `{ success, data, error }`
- ✅ Auth middleware untuk protected routes
- ✅ Error handling: try-catch + proper HTTP status codes
- ✅ Multi-file Prisma schema: shared di `schema.prisma`, per-project di `projects/`

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
- [x] Setup `.env` (DATABASE_URL, JWT_SECRET)
- [x] Setup `src/config/index.ts` (port, jwt, cors)
- [x] Push initial setup ke git

### 0.2 Prisma Setup

- [x] Setup `prisma/schema.prisma` (shared: User model)
- [x] Setup `prisma/projects/prd-generator.prisma` (PrdProject model)
- [x] Setup `prisma.config.ts`
- [x] Generate Prisma client → `generated/prisma/`
- [x] First migration
- [x] Setup `src/lib/prisma.ts` (Prisma client singleton)

### 0.3 Auth Module (Basic)

- [x] `src/common/middlewares/auth.middleware.ts`:
  - JWT verification dari cookie
  - Extract user: id, email, role
  - 401 response jika invalid
- [x] `src/modules/shared/auth/auth.service.ts`:
  - register(name, email, password)
  - login(email, password)
  - getProfile(userId)
- [x] `src/modules/shared/auth/auth.controller.ts`:
  - POST `/auth/register`
  - POST `/auth/login`
  - JWT sign + set cookie
- [x] `src/modules/shared/auth/auth.validation.ts`:
  - RegisterBody, LoginBody validation
- [x] `src/modules/shared/session/session.controller.ts`:
  - GET `/session` (protected)

### 0.4 Entry Point

- [x] `src/index.ts`:
  - Elysia app
  - Mount modules: auth, erd, prd, session
  - Error handling
  - Logging (logixlysia)
  - Listen on port

---

## Phase 1 — Database Schema (ERD Module)

### 1.1 ERD Schema (Prisma)

- [x] 🔴 Buat `prisma/projects/erd-generator.prisma`:
  - `ErdProject` — id, name, description, userId, schema (JSON), status, visibility, timestamps
  - `ErdVersion` — id, projectId, schema, description, createdAt
  - `ErdShare` — id, projectId, userId, role, createdAt
  - `ErdShareLink` — id, projectId, link (unique), expiresAt, createdAt
  - `ErdTemplate` — id, name, description, category, schema, thumbnail, createdAt
  - `Usage` — id, userId, month, count, limit
  - `Payment` — id, userId, plan, amount, method, status, proof, verifiedAt, createdAt
- [x] 🔴 Update `prisma/schema.prisma` — tambah relation ke User:
  - `erdProjects`, `erdShares`, `usage`, `payments`
- [x] 🔴 Migration: `rtk bun run db:migrate`
- [x] 🔴 Generate: `rtk bun run db:generate`

### 1.2 Seed Data

- [x] 🟡 `prisma/seed-erd.ts`:
  - Sample templates (5):
    - E-commerce (user, product, order, order_item, payment)
    - Blog (user, post, comment, category, tag)
    - Inventory (product, warehouse, stock_movement, supplier)
    - Social Media (user, post, like, follow, comment)
    - School (student, teacher, class, subject, grade)
  - Seed dijalankan via `rtk bun run prisma/seed-erd.ts`

---

## Phase 2 — Auth Module (Google OAuth)

### 2.1 Google OAuth Setup

- [x] 🔴 `src/modules/shared/auth/google.service.ts`:
  - Google OAuth 2.0 flow:
    1. Generate Google auth URL
    2. Exchange code for tokens
    3. Get user info dari Google
    4. Create/update user di database
    5. Return user data
  - Env vars: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`
- [x] 🔴 `src/modules/shared/auth/auth.controller.ts` — tambah endpoints:
  - GET `/auth/google` — redirect ke Google OAuth consent screen
  - GET `/auth/callback` — handle callback, create user, set JWT cookie, redirect ke frontend
  - POST `/auth/logout` — clear cookie

### 2.2 Auth Middleware Update

- [x] 🔴 Update `src/common/middlewares/auth.middleware.ts`:
  - `authMiddleware()` — wajib authenticated (401 jika tidak)
  - `optionalAuthMiddleware()` — opsional (user bisa null untuk guest routes)
  - Extract user dari JWT cookie
  - Attach user ke context

### 2.3 Session Management

- [x] 🔴 Update `src/modules/shared/session/session.controller.ts`:
  - GET `/session` — return current user data (dari DB, bukan hanya JWT payload)
  - POST `/auth/logout` — clear cookie (di auth controller)

---

## Phase 3 — ERD Project CRUD

### 3.1 Project Service

- [x] 🔴 `src/modules/project/erd-generator/services/project.service.ts`:
  - `listProjects(userId, { page, limit, sort, filter })`
  - `getProject(userId, projectId)`
  - `createProject(userId, { name, description })`
  - `updateProject(userId, projectId, { name, description, schema })`
  - `deleteProject(userId, projectId)` — soft delete (status → "deleted")
  - `restoreProject(userId, projectId)`
  - `permanentDelete(userId, projectId)`
  - Access check: owner atau collaborator dengan role "edit"

### 3.2 Project Controller

- [x] 🔴 `src/modules/project/erd-generator/controllers/project.controller.ts`:
  - GET `/erd/projects` — List projects (paginated, sorted, filtered)
  - GET `/erd/projects/:id` — Get project detail + schema
  - POST `/erd/projects` — Create project
  - PATCH `/erd/projects/:id` — Update project (name, description, schema)
  - DELETE `/erd/projects/:id` — Soft delete (status → "deleted")
  - POST `/erd/projects/:id/restore` — Restore from trash
  - DELETE `/erd/projects/:id/permanent` — Permanent delete

### 3.3 Validation

- [x] 🔴 Validation schemas:
  - `CreateProjectBody`: `{ name: string, description?: string }`
  - `UpdateProjectBody`: `{ name?: string, description?: string, schema?: string, visibility?: string }`
  - `ListProjectsQuery`: `{ page?, limit?, sort?, order?, filter?, search? }`

---

## Phase 4 — AI Generate Service

### 4.1 AI Service Setup

- [x] 🔴 `src/modules/project/erd-generator/services/ai.service.ts`:
  - Setup Vercel AI SDK providers:
    - Groq: `@ai-sdk/groq` dengan multiple keys rotation
    - Gemini: `@ai-sdk/google` dengan multiple keys rotation
  - Key rotation logic:
    - Load keys dari env: `GROQ_AI_API_KEY1-4`, `GEMINI_API_KEY1-3`
    - Round-robin atau random selection
    - Fallback: jika satu key gagal, coba key lain
  - Provider selection:
    - Default: Groq (lebih cepat)
    - Fallback: Gemini
    - User bisa pilih provider (jika pakai API key sendiri)

### 4.2 Schema Generate Service

- [x] 🔴 `src/modules/project/erd-generator/services/schema.service.ts`:
  - `generateSchema(prompt, provider?, userApiKey?)`:
    1. Cek quota (jika pakai server key)
    2. Select provider + key
    3. Generate schema via AI SDK
    4. Parse response → ErdSchema JSON
    5. Validate schema structure
    6. Increment usage (jika pakai server key)
    7. Return schema
  - Streaming support:
    - Pakai `streamText` dari `ai`
    - Return SSE stream ke frontend

### 4.3 Generate Endpoint

- [x] 🔴 `src/modules/project/erd-generator/controllers/schema.controller.ts`:
  - POST `/erd/generate` — Generate ERD dari AI (non-streaming)
  - POST `/erd/generate/stream` — Generate ERD dari AI (streaming SSE)
  - GET `/erd/usage` — Cek quota usage
  - Request: `{ prompt: string, apiKey?: string, provider?: string }`
  - User quota logic:
    - `apiKey` ada → unlimited, skip quota
    - `apiKey` tidak ada → cek Usage table, increment count

### 4.4 AI Prompt Engineering

- [x] 🔴 `src/modules/project/erd-generator/prompts/generate-erd.prompt.ts`:
  - System prompt terpisah dari logic (mudah edit/versioning)
  - `GENERATE_ERD_SYSTEM_PROMPT` — instruksi lengkap untuk AI
  - `buildGeneratePrompt(description)` — build user prompt
  - Rules: UUID PK, snake_case, proper types, detect relations
    "defaultValue": null|"value",
    "foreignKey": null|{ "table": "name", "column": "name" }
    }
    ]
    }
    ],
    "relations": [
    {
    "id": "uuid",
    "sourceTableId": "uuid",
    "targetTableId": "uuid",
    "sourceColumn": "column_name",
    "targetColumn": "column_name",
    "type": "one-to-one|one-to-many|many-to-many"
    }
    ]
    }

  Rules:
  - Always include id (UUID) primary key for each table
  - Use appropriate data types
  - Detect relationships from the description
  - Add foreign keys for relationships
  - Use snake_case for table and column names
  - Include createdAt and updatedAt where appropriate

  ```

  ```

---

## Phase 5 — Export Service

### 5.1 Export Logic

- [x] 🔴 `src/modules/project/erd-generator/services/export.service.ts`:
  - `toSqlDdl(schema, target)`:
    - target: 'mysql' | 'postgresql' | 'sqlite'
    - Generate CREATE TABLE statements
    - Include PRIMARY KEY, FOREIGN KEY, UNIQUE constraints
    - Type mapping per target:
      - MySQL: VARCHAR, INT, BIGINT, BOOLEAN, DATETIME, TEXT, JSON
      - PostgreSQL: VARCHAR, INTEGER, BIGINT, BOOLEAN, TIMESTAMP, TEXT, JSONB, UUID
      - SQLite: TEXT, INTEGER, REAL, BLOB
    - Add indexes (optional)
  - `toPrismaSchema(schema)`:
    - Generate Prisma schema file content
    - Model definitions with Prisma types
    - Relations with @relation
    - Include datasource + generator blocks

### 5.2 Export Endpoint

- [x] 🟡 `src/modules/project/erd-generator/controllers/export.controller.ts`:
  - POST `/erd/export` — Export schema ke SQL/Prisma
  - Request: `{ schema: ErdSchema, format: 'sql'|'prisma', target?: 'mysql'|'postgresql'|'sqlite' }`
  - Response: `{ file: string, filename: string }`

---

## Phase 6 — Quota & Billing Service

### 6.1 Quota Service

- [x] 🔴 `src/modules/project/erd-generator/services/quota.service.ts`:
  - `checkQuota(userId)` — cek usage bulan ini
  - `incrementUsage(userId)` — increment count
  - `updateLimit(userId, limit)` — update limit saat upgrade

### 6.2 Quota Endpoint

- [x] 🔴 GET `/erd/usage` — Get usage info (di schema.controller.ts)

### 6.3 Billing Service

- [x] 🟡 `src/modules/project/erd-generator/services/billing.service.ts`:
  - `getBillingInfo(userId)` — plan, usage, payment history
  - `requestUpgrade(userId, plan)` — create pending payment + instruksi Dana
  - `verifyPayment(paymentId)` — admin only, update plan
  - `rejectPayment(paymentId)` — admin only
  - `cancelSubscription(userId)` — back to free

### 6.4 Billing Endpoints

- [x] 🟡 `src/modules/project/erd-generator/controllers/billing.controller.ts`:
  - GET `/erd/billing` — Get billing info
  - POST `/erd/billing/upgrade` — Request upgrade
  - POST `/erd/billing/cancel` — Cancel subscription

### 6.3 Billing Service

- [ ] 🟡 `src/modules/project/erd-generator/services/billing.service.ts`:
  - `getBillingInfo(userId)`:
    - Return: plan, status, nextBilling, usage
  - `requestUpgrade(userId, plan)`:
    - Create Payment record (status: pending)
    - Return payment info (Dana number, WA link)
  - `verifyPayment(paymentId)`:
    - Admin only
    - Update payment status → verified
    - Update user plan
  - `cancelSubscription(userId)`:
    - Update plan → free
    - Set effective date (end of billing period)

### 6.4 Billing Endpoints

- [ ] 🟡 `src/modules/project/erd-generator/controllers/billing.controller.ts`:
  - GET `/erd/billing` — Get billing info
  - POST `/erd/billing/upgrade` — Request upgrade
  - POST `/erd/billing/cancel` — Cancel subscription

---

## Phase 7 — Share & Collaboration

### 7.1 Share Service

- [x] 🟡 `src/modules/project/erd-generator/services/share.service.ts`:
  - `inviteCollaborator(ownerId, projectId, email, role)` — invite by email
  - `removeCollaborator(ownerId, projectId, userId)` — remove collaborator
  - `updateRole(ownerId, projectId, userId, role)` — update role
  - `listCollaborators(userId, projectId)` — list collaborators
  - `generateShareLink(userId, projectId, expiresInDays?)` — generate public link
  - `getShareLink(userId, projectId)` — get current share link
  - `getProjectByShareLink(link)` — get project by link (public, no auth)

### 7.2 Share Endpoints

- [x] 🟡 `src/modules/project/erd-generator/controllers/share.controller.ts`:
  - GET `/erd/projects/:id/share` — List collaborators
  - POST `/erd/projects/:id/share` — Invite collaborator
  - DELETE `/erd/projects/:id/share/:userId` — Remove collaborator
  - PATCH `/erd/projects/:id/share/:userId` — Update role
  - GET `/erd/projects/:id/share/link` — Get share link
  - POST `/erd/projects/:id/share/link` — Generate share link
  - GET `/erd/share/:link` — Get project by link (public)

---

## Phase 8 — Version History

### 8.1 History Service

- [x] 🟡 `src/modules/project/erd-generator/services/history.service.ts`:
  - `saveVersion(userId, projectId, schema, description?)` — save snapshot
  - `getVersions(userId, projectId)` — list versions (newest first)
  - `getVersion(userId, projectId, versionId)` — get specific version
  - `restoreVersion(userId, projectId, versionId)` — restore + save new version
  - Auto-cleanup: max 100 versions per project

### 8.2 History Endpoints

- [x] 🟡 `src/modules/project/erd-generator/controllers/history.controller.ts`:
  - GET `/erd/projects/:id/history` — List versions
  - POST `/erd/projects/:id/history` — Save version
  - GET `/erd/projects/:id/history/:versionId` — Get version detail
  - POST `/erd/projects/:id/history/:versionId/restore` — Restore version

### 8.2 History Endpoints

- [ ] 🟡 `src/modules/project/erd-generator/controllers/history.controller.ts`:
  - GET `/erd/projects/:id/history` — List versions
  - GET `/erd/projects/:id/history/:versionId` — Get version detail
  - POST `/erd/projects/:id/history/:versionId/restore` — Restore version

---

## Phase 9 — Templates

### 9.1 Template Service

- [x] 🟡 `src/modules/project/erd-generator/services/template.service.ts`:
  - `listTemplates(category?)` — list templates
  - `getTemplate(templateId)` — get template detail
  - `useTemplate(userId, templateId, projectName?)` — create project from template

### 9.2 Template Endpoints

- [x] 🟡 `src/modules/project/erd-generator/controllers/template.controller.ts`:
  - GET `/erd/templates` — List templates (public, no auth)
  - GET `/erd/templates/:id` — Get template detail (public, no auth)
  - POST `/erd/templates/:id/use` — Create project from template (auth required)

---

## Phase 10 — API Key (Frontend Only)

### 10.1 API Key Handling

- API key user **tidak disimpan di database**
- Disimpan di **localStorage** browser (client-side)
- Dikirim ke backend hanya saat generate request (`POST /erd/generate`)
- Backend pakai key dari request, tidak persist
- Jika tidak ada key di request → pakai server key (kena quota)

### 10.2 Generate Endpoint Update

- [ ] 🔴 Update `POST /erd/generate`:
  - Request body: `{ prompt: string, apiKey?: string, provider?: string }`
  - Jika `apiKey` ada → pakai key tersebut, skip quota
  - Jika `apiKey` tidak ada → pakai server key, cek quota
  - Response: SSE stream (progress, schema, error)

---

## Phase 11 — Admin Module

### 11.1 Admin Middleware

- [x] 🟢 `src/common/middlewares/admin.middleware.ts`:
  - Check user.role === 'admin'
  - 403 Forbidden jika bukan admin

### 11.2 Admin Controller

- [x] 🟢 `src/modules/project/erd-generator/controllers/admin.controller.ts`:
  - GET `/admin/stats` — Dashboard stats
  - GET `/admin/users` — List all users
  - GET `/admin/users/:id` — User detail
  - PATCH `/admin/users/:id` — Update user (role)
  - DELETE `/admin/users/:id` — Delete user
  - GET `/admin/projects` — List all projects
  - GET `/admin/payments` — List all payments
  - POST `/admin/payments/:id/verify` — Verify payment
  - POST `/admin/payments/:id/reject` — Reject payment

---

## Phase 12 — Testing & Polish

### 12.1 Error Handling

- [x] 🔴 Global error handler di `src/index.ts`:
  - Validation errors → 400
  - Auth errors → 401
  - Forbidden → 403
  - Not found → 404
  - Quota exceeded → 429
  - Internal → 500
- [x] 🔴 Consistent error response format via `elysia-http-exception`

### 12.2 Logging

- [x] 🟡 Request logging (logixlysia sudah ada):
  - Method, path, status, duration
  - User ID (jika authenticated)
- [x] 🟡 Error logging:
  - Stack trace (development only)
  - Error context via `console.error` dengan context: `[ServiceName.method]`

### 12.3 Security

- [x] 🔴 CORS configuration (frontend origin)
- [x] 🔴 Input sanitization (Elysia validation)
- [x] 🔴 SQL injection prevention (Prisma handles this)
- [x] 🟡 Rate limiting via quota system (per-user)

### 12.4 Performance

- [x] 🟡 Database indexing:
  - `ErdProject.userId`
  - `ErdShare.projectId`, `ErdShare.userId`
  - `Usage.userId`, `Usage.month`
  - `Payment.userId`
- [x] 🟡 Pagination untuk list endpoints (max 100 per page)
- [x] 🟡 Select only needed fields (Prisma `select`)
- [x] 🟡 Parallel queries (`Promise.all`)

---

## Progress Summary

| Phase                        | Status  | Progress |
| ---------------------------- | ------- | -------- |
| 0 — Foundation               | ✅ Done | 100%     |
| 1 — Database Schema          | ✅ Done | 100%     |
| 2 — Auth (Google OAuth)      | ✅ Done | 100%     |
| 3 — ERD Project CRUD         | ✅ Done | 100%     |
| 4 — AI Generate Service      | ✅ Done | 100%     |
| 5 — Export Service           | ✅ Done | 100%     |
| 6 — Quota & Billing          | ✅ Done | 100%     |
| 7 — Share & Collaboration    | ✅ Done | 100%     |
| 8 — Version History          | ✅ Done | 100%     |
| 9 — Templates                | ✅ Done | 100%     |
| 10 — API Key (Frontend Only) | ✅ Done | 100%     |
| 11 — Admin Module            | ✅ Done | 100%     |
| 12 — Testing & Polish        | ✅ Done | 100%     |
