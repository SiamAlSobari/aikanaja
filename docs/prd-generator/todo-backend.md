# Technical Architecture & Detailed Backend Specification — AiKanAja PRD Generator

_Last updated: 20/7/2026_  
_Module: `src/modules/project/prd-generator`_  
_Status: ACTIVE / IN PROGRESS_

---

## 1. High-Level Architecture & Principles

### 1.1 Tech Stack Matrix
| Layer | Tech / Library | Details & Configuration |
| --- | --- | --- |
| **Runtime** | Bun v1.3+ | Ultra-fast JS/TS execution & native SQLite bindings |
| **HTTP Framework** | ElysiaJS v1.4+ | Type-safe end-to-end framework with Schema Validation (`t.Object`) |
| **ORM** | Prisma 7 | Multi-file schema compilation (`prisma.config.ts`) |
| **Database** | SQLite | Single-file database (`file:./data/dev.db`) with Bun adapter |
| **Authentication** | JWT (`@elysia/jwt`) | HTTP-Only secure cookie parsing & token validation |
| **OAuth** | Google OAuth 2.0 | Redirect flow & profile synchronization |
| **AI SDK** | Vercel AI SDK (`ai`) | Streaming text & structured object generation (`streamText`, `generateText`) |
| **AI Providers** | `@ai-sdk/google`, `@ai-sdk/groq` | Primary: **Gemini 2.0 Flash** (`gemini-2.0-flash`)<br>Fallback: **Groq Llama 3.3 70B** (`llama-3.3-70b-versatile`) |
| **Diff Engine** | `diff` (@types/diff) | Line-by-line visual markdown diff engine (`diffLines`) |

---

## 2. Strict Architectural Directives (Elysia Module Pattern)

### 2.1 Layer Separation
```
Request Header / Body 
       │
       ▼
┌──────────────────────────────┐
│  Elysia Controller Layer     │ ──► Auth Middleware & Schema Validation (t.Object)
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│  Service Layer (Business)   │ ──► AI Provider Fallback Engine & Algorithm Logic
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│  Prisma Data Layer           │ ──► Multi-File Prisma Client & SQLite DB
└──────────────────────────────┘
```

### 2.2 Security Rules & Zero-Persistence Policy
1. **Custom API Key Handling**:
   - Extracted dynamically from HTTP Header `x-custom-api-key`.
   - **NEVER** saved to SQLite or server environment variables.
   - Forwarded directly in-memory to AI provider instances during request execution.
2. **Access Control & Ownership Enforcement**:
   - Every protected route MUST execute `authMiddleware()`.
   - Every project query MUST verify `project.userId === user.id` before read, update, or deletion.
   - Resource access violation MUST raise `ForbiddenException('Access denied')` (HTTP 403).
3. **Input & Response Sanitization**:
   - All input bodies, params, and query strings MUST be validated using Elysia `t.Object()`.
   - Internal error details MUST be logged via `console.error` and return sanitized HTTP Exceptions (`InternalServerErrorException`, `NotFoundException`, `BadRequestException`).

---

## 3. Database Schema Models Reference (`prisma/projects/prd-generator.prisma`)

```prisma
// 1. PROJECT UTAMA
model PrdProject {
  id               String   @id @default(uuid())
  title            String
  description      String?
  author           String
  userId           String
  content          String?  // Markdown PRD content
  templateType     String?  // saas, ecommerce, mobile, api, custom
  targetUser       String?  // Target audience info
  techStack        String?  // Tech stack info
  erdLinkId        String?  // Optional link to ERD project
  shareToken       String?  @unique
  visibility       String   @default("private") // private, public, team
  status           String   @default("active")  // active, archived, deleted
  qualityScore     Int?     // Skor Kesehatan PRD (0-100)
  storyPointsTotal Int?     // Total Fibonacci Story Points
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  user           User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  versions       PrdVersion[]
  shares         PrdShare[]
  shareLinks     PrdShareLink[]
  chatMessages   PrdChatMessage[]
  virtualReviews PrdVirtualReview[]
  auditLogs      PrdAuditLog[]

  @@index([userId])
  @@index([status])
  @@index([userId, status])
}

// 2. RIWAYAT VERSI (Version History & Visual Diff)
model PrdVersion {
  id               String   @id @default(uuid())
  projectId        String
  versionNum       Int
  title            String?
  changelog        String?  // Catatan perubahan versi
  content          String   // Markdown snapshot
  qualityScore     Int?
  storyPointsTotal Int?
  createdBy        String?
  createdAt        DateTime @default(now())

  project PrdProject @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@index([projectId])
  @@index([projectId, createdAt])
}

// 3. RIWAYAT AI CHAT & COPILOT INTERACTION LOGS
model PrdChatMessage {
  id                  String   @id @default(uuid())
  projectId           String
  userId              String
  role                String   // user, assistant, system
  actionType          String   @default("chat") // chat, inline_edit, selection_highlight, section_expand
  content             String   // Teks pesan / instruksi
  revisedSnippet      String?  // Hasil potongan markdown yang direvisi AI
  modelUsed           String?  // gemini-2.0-flash, llama-3.3-70b
  promptTokenCount    Int?
  responseTokenCount Int?
  createdAt           DateTime @default(now())

  project PrdProject @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@index([projectId, createdAt])
}

// 4. RIWAYAT VIRTUAL STAKEHOLDER REVIEWS
model PrdVirtualReview {
  id                     String   @id @default(uuid())
  projectId              String
  overallScore           Int      // Skor rata-rata 0-100
  techLeadScore          Int
  techLeadFeedback       String   // JSON string feedback Tech Lead
  qaScore                Int
  qaFeedback             String   // JSON string feedback QA Engineer
  productSponsorScore    Int
  productSponsorFeedback String   // JSON string feedback Business Sponsor
  recommendations        String?  // JSON array string
  createdAt              DateTime @default(now())

  project PrdProject @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@index([projectId, createdAt])
}

// 5. KOLABORASI TIM & HAK AKSES ANGGOTA
model PrdShare {
  id        String   @id @default(uuid())
  projectId String
  userId    String
  role      String   @default("view") // view, edit, admin
  createdAt DateTime @default(now())

  project PrdProject @relation(fields: [projectId], references: [id], onDelete: Cascade)
  user    User       @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([projectId, userId])
  @@index([userId])
}

// 6. TAUTAN SHARE PUBLIK (Tautan Berbagi Read-Only)
model PrdShareLink {
  id            String    @id @default(uuid())
  projectId     String
  token         String    @unique
  allowComments Boolean   @default(false)
  expiresAt     DateTime?
  createdAt     DateTime  @default(now())

  project PrdProject @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@index([projectId])
  @@index([token])
}

// 7. KATALOG TEMPLATE PRD PRESET
model PrdTemplate {
  id              String   @id @default(uuid())
  name            String
  description     String?
  category        String   // saas, ecommerce, mobile, api, ai
  templateContent String   // Markdown boilerplate template
  icon            String?
  thumbnail       String?
  isOfficial      Boolean  @default(true)
  createdAt       DateTime @default(now())

  @@index([category])
}

// 8. AUDIT LOG AKTIVITAS DETIL (Audit Trail PRD)
model PrdAuditLog {
  id          String   @id @default(uuid())
  projectId   String
  userId      String
  action      String   // create, copilot_edit, virtual_review, version_restore, export, share
  sectionName String?  // Nama bab yang diedit
  details     String?  // JSON string
  createdAt   DateTime @default(now())

  project PrdProject @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@index([projectId, createdAt])
}
```

---

## 4. Phase-by-Phase Technical Specifications & Checklist

### Legend
- [x] Selesai & Terverifikasi
- [ ] Belum Dikerjakan

---

### Phase 0 — Foundation & Base Middlewares
- [x] **0.1 Setup Project & Dependencies**
  - Config: `bun` package.json with Elysia, Prisma 7, `@ai-sdk/google`, `@ai-sdk/groq`, `diff`.
  - SQLite Database Sync: `data/dev.db` via `prisma db push`.
- [x] **0.2 Auth Middleware & Security Helper**
  - File: `src/common/middlewares/auth.middleware.ts`
  - Function: Extract JWT from `cookie.auth`, verify claims, attach `user: { id, email, role }`.

---

### Phase 1 — Project CRUD & Query Filters
- [x] **1.1 Project Service** (`src/modules/project/prd-generator/services/project.service.ts`)
  - `listProjects(userId, { page, limit, sort, order, filter, search })`: Paginated project retrieval with `PROJECT_SELECT` (including `userId`).
  - `getProject(userId, projectId)`: Fetch project details & full markdown content + ownership check.
  - `createProject(userId, { title, description, templateType, targetUser, techStack })`: Insert `PrdProject` record.
  - `updateProject(userId, projectId, data)`: Partial update `PrdProject` fields (`title`, `description`, `content`, `erdLinkId`).
  - `deleteProject(userId, projectId)`: Soft delete project by setting `status = 'deleted'`.
  - `restoreProject(userId, projectId)`: Restore project status to `'active'`.
- [x] **1.2 Project Controller** (`src/modules/project/prd-generator/controllers/project.controller.ts`)
  - GET `/prd/projects`
  - GET `/prd/projects/:id`
  - POST `/prd/projects`
  - PATCH `/prd/projects/:id`
  - DELETE `/prd/projects/:id`
  - POST `/prd/projects/:id/restore`

---

### Phase 2 — Multi-Provider AI Engine & Fallback Chain
- [x] **2.1 AI Prompt Service & Fallback Engine** (`src/modules/project/prd-generator/services/ai-prompt.service.ts`)
  - Primary Provider: Google Gemini 2.0 Flash (`gemini-2.0-flash`).
  - Secondary Fallback: Groq Llama 3.3 70B (`llama-3.3-70b-versatile`).
  - Multi-Key Fallback Engine: User Header Key (`x-custom-api-key`) ➔ Server Gemini Keys ➔ Server Groq Keys.
  - `streamGenerate(prompt, userApiKey, signal)`: Generates complete Markdown PRD via `streamText()`.
  - `streamCopilot(instruction, currentContent, userApiKey, signal)`: Streams inline revisions via `streamText()`.
  - `generateText(systemPrompt, userPrompt, userApiKey, preferredProvider)`: Non-streaming AI generator using `generateText()`.

---

### Phase 3 — Killer Features Services & AI Controllers
- [x] **3.1 Multi-Agent Virtual Review Service** (`src/modules/project/prd-generator/services/virtual-review.service.ts`)
  - System Prompts: Persona simulation for **Tech Lead**, **QA Engineer**, & **Product Sponsor/Business**.
  - Output: Structured JSON payload with scores (0-100), feasibility issues, edge cases, KPI alignment, and overall recommendations.
  - Endpoint: `POST /prd/virtual-review`
- [x] **3.2 Quality Score & Ambiguity Audit Service** (`src/modules/project/prd-generator/services/quality-audit.service.ts`)
  - Health Score Calculator (0-100) & 11 Core Section Completeness Inspector.
  - Ambiguity Detector: Identifies vague terms (*"harus cepat"*) and suggests quantifiable metrics (*"P95 response time < 200ms"*).
  - Endpoint: `POST /prd/quality-audit`
- [x] **3.3 Story Points & Sprint Planner Service** (`src/modules/project/prd-generator/services/sprint-planner.service.ts`)
  - Fibonacci Story Pointing (1, 2, 3, 5, 8, 13) for User Stories based on technical risk & UI/API complexity.
  - Roadmap Allocator: Grouping into Sprint 1 (MVP Launch), Sprint 2 (Expansion), & Sprint 3 (Scalability).
  - Endpoint: `POST /prd/sprint-plan`
- [x] **3.4 AI Agent Prompt Exporter Service** (`src/modules/project/prd-generator/services/agent-exporter.service.ts`)
  - Exporter to `AGENTS.md` / `PROMPT.md` / `.cursorrules` structured technical specs for AI coding agents.
  - Endpoint: `POST /prd/export-agent`
- [x] **3.5 Enterprise JSON Spec Exporter Service** (`src/modules/project/prd-generator/services/json-exporter.service.ts`)
  - Converts raw Markdown PRD into enterprise-grade JSON Spec data structure.
  - Endpoint: `POST /prd/export-json`

---

### Phase 4 — Version Control History & Visual Diff Engine
- [x] **4.1 Version Snapshot & Diff Service** (`src/modules/project/prd-generator/services/version.service.ts`)
  - `createVersionSnapshot(userId, projectId, { content, title, qualityScore, storyPointsTotal })`: Generates version `v1.0`, `v2.0`, etc.
  - `listVersions(userId, projectId)`: Fetches snapshot history sorted by `versionNum desc`.
  - `getVersionDiff(userId, projectId, versionIdA, versionIdB)`: Computes line-by-line markdown diff via `diffLines()` (`added`, `removed`, `unchanged` chunks & stats).
  - `restoreVersion(userId, projectId, versionId)`: Restores project content to targeted version and creates restoration snapshot.
- [x] **4.2 Version Controller** (`src/modules/project/prd-generator/controllers/version.controller.ts`)
  - GET `/prd/projects/:id/versions`
  - POST `/prd/projects/:id/versions`
  - GET `/prd/projects/:id/versions/:versionId`
  - GET `/prd/projects/:id/diff?vA=versionIdA&vB=versionIdB`
  - POST `/prd/projects/:id/versions/:versionId/restore`

---

### Phase 5 — Public Sharing & Link Access Module
- [x] **5.1 Share Link Service** (`src/modules/project/prd-generator/services/share.service.ts`)
  - `generateShareLink(userId, projectId, expiresDays)`: Creates 32-character hex token & optional expiry timestamp.
  - `getPublicProject(shareToken)`: Public read-only project retriever with status & expiry validation.
- [x] **5.2 Share Controller** (`src/modules/project/prd-generator/controllers/share.controller.ts`)
  - POST `/prd/projects/:id/share` (Protected owner link generator)
  - GET `/prd/share/:shareToken` (Public read-only retriever)

---

### Phase 6 — Module-Specific PRD Billing & Admin System
- [x] **6.1 Isolated PRD Billing Service** (`src/modules/project/prd-generator/services/billing.service.ts`)
  - `PrdBillingService`: Isolated PRD quota tracking using month key `"YYYY-MM:prd"`.
  - `checkQuota(userId)`: Validates monthly free limit (10 PRDs/month for free tier, unlimited for pro/team).
  - `incrementUsage(userId)`: Atomically increments PRD monthly usage in `Usage` table.
  - Endpoint: `GET /prd/quota`
- [x] **6.2 PRD Admin Oversight Controller** (`src/modules/project/prd-generator/controllers/admin.controller.ts`)
  - Admin Role Guard (`user.role === 'admin'`).
  - GET `/admin/prd/stats`: System-wide statistics (projects, active/deleted count, versions, shares, users).
  - GET `/admin/prd/projects`: Comprehensive project management list across all users.
  - GET `/admin/prd/users`: User PRD project activity overview.

---

### Phase 7 — Enterprise Services (Chat History, Virtual Review History, Templates & Audit Logs)

- [x] **7.1 AI Chat & Copilot Message History Service** (`src/modules/project/prd-generator/services/chat-history.service.ts`)
  - `listChatMessages(userId, projectId, { limit, skip })`: Retrieves past copilot messages & instructions for a project.
  - `saveChatMessage(userId, projectId, { role, actionType, content, revisedSnippet, modelUsed, tokens })`: Persists user prompts & AI responses into `PrdChatMessage`.
  - Controller Routes:
    - GET `/prd/projects/:id/chat-messages`
    - POST `/prd/projects/:id/chat-messages`

- [x] **7.2 Virtual Stakeholder Review History Service** (`src/modules/project/prd-generator/services/virtual-review-history.service.ts`)
  - `listVirtualReviews(userId, projectId)`: Fetches past Virtual Review snapshots from database (`PrdVirtualReview`).
  - `saveVirtualReview(userId, projectId, reviewData)`: Persists Tech Lead, QA Engineer, & Business Sponsor feedback snapshots.
  - Controller Routes:
    - GET `/prd/projects/:id/virtual-reviews`
    - POST `/prd/projects/:id/virtual-reviews`

- [x] **7.3 PRD Preset Template Catalog Service** (`src/modules/project/prd-generator/services/template.service.ts`)
  - `listTemplates(category?: string)`: Retrieves preset PRD templates (SaaS B2B, E-Commerce Platform, Mobile App MVP, FinTech API, AI Service).
  - `getTemplate(templateId)`: Gets full markdown boilerplate for selected template.
  - Controller Routes:
    - GET `/prd/templates`
    - GET `/prd/templates/:id`

- [x] **7.4 Fine-Grained Audit Log Service** (`src/modules/project/prd-generator/services/audit-log.service.ts`)
  - `listAuditLogs(userId, projectId)`: Retrieves granular audit trail logs for section edits, version restores, and exports (`PrdAuditLog`).
  - `logAction(userId, projectId, action, sectionName, details)`: Appends structured log record.
  - Controller Routes:
    - GET `/prd/projects/:id/audit-logs`
