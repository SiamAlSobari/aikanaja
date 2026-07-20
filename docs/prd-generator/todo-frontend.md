# Todo Frontend — AiKanAja (PRD Generator Module)

_Last updated: 20/7/2026_
_Status: IN PROGRESS_

---

## Tech Stack

| Layer | Teknologi |
| --- | --- |
| Framework | SvelteKit (Svelte 5 runes) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + DaisyUI v5 |
| Diagram Visualization | Mermaid.js (`mermaid`) |
| Markdown & Sanitization | Marked (`marked`) + DOMPurify (`dompurify`) |
| Diff Engine | `diff` / `diff-match-patch` (Visual Version Diff) |
| State Management | Svelte 5 `$state`, `$derived`, `$effect` |
| Data Fetching | SvelteKit load functions (`+page.server.ts`) |
| Auth | JWT cookie (httpOnly) via backend |
| Package Manager | Bun |

---

## ATURAN KETAT — SvelteKit First

**Prinsip:** Default = Server-side load. Client-side = pengecualian.

### 1. Client component (`$state`, event handler) hanya boleh dipakai kalo ADA SALAH SATU ini:

- `$state` / `$derived` / `$effect` untuk reactive UI
- Event handler (`onclick`, `onsubmit`, `onchange`, dll)
- Browser API (`localStorage`, `window`, `document`)
- Live Markdown / Mermaid rendering (`$state` untuk raw markdown / preview DOM)
- Real-time AI streaming updates (SSE consumer)

### 2. DILARANG:

- ❌ Pakai `$state` cuma karena males mikir — itu dosa performa
- ❌ Bikin API route (`+server.ts`) cuma buat baca data dari backend — pakai `+page.server.ts` load function
- ❌ Pakai `fetch()` dari client kalo bisa load function di server
- ❌ Deep reactive state untuk dokumen markdown besar — gunakan state terfokus
- ❌ Menyimpan Custom API Key ke server database (WAJIB di `localStorage` browser)

### 3. WAJIB:

- ✅ Data fetching → `+page.server.ts` load function (server-side, type-safe)
- ✅ Mutation → form action (`+page.server.ts` actions) atau direct API call di event handler
- ✅ Halaman publik (landing, try, share view) → SSR, SEO optimal
- ✅ Halaman private (dashboard, workspace, settings) → server load + auth guard
- ✅ Client state minimal — hanya untuk UI interaksi (sidebar open, modal, selected section)

### 4. Hukumannya:

- Langgar aturan 1 → JS bundle bengkak → loading lama → user kabur
- Langgar aturan 2 → latency nambah + kode tambahan yang gak perlu
- Konsekuensi: Code review REJECT.

---

## Legend

- 🔴 Wajib (MVP)
- 🟡 Opsional (nice-to-have)
- 🟢 Future (fase 2+)

---

## Phase 0 — Foundation Setup

### 0.1 Project Initialization

- [x] 🔴 Inisialisasi SvelteKit dengan TypeScript via `npx sv create`
- [x] 🔴 Setup Tailwind CSS v4 (`@tailwindcss/vite`, `@tailwindcss/typography`, `@tailwindcss/forms`)
- [x] 🔴 Install DaisyUI v5 & Lucide Svelte
- [x] 🔴 Install Marked, DOMPurify, Mermaid.js, jsPDF, html2canvas, diff
- [x] 🔴 Setup folder structure: `src/lib`, `src/routes`
- [x] 🔴 Setup `.gitignore`
- [x] 🔴 Push initial setup ke git

### 0.2 Environment & Config

- [ ] 🔴 Setup `.env` file:
  - `VITE_API_URL` — Backend API URL (default: `http://localhost:3000`)
- [ ] 🔴 Setup `src/lib/api/client.ts` — base fetch wrapper:
  - Auto-attach JWT cookie (`credentials: 'include'`)
  - Auto-attach Custom API Key dari `localStorage` jika ada (`x-custom-api-key`)
  - Error handling (401 → redirect login)
  - JSON parse
  - Base URL dari env

### 0.3 TypeScript Types

- [ ] 🔴 `src/lib/types/prd.ts`:
  - `PrdProject` — id, name, description, templateType, erdLinkId, currentVersion, createdAt, updatedAt
  - `PrdVersion` — id, projectId, versionNum, title, content, qualityScore, storyPointsTotal, createdAt
  - `PrdShareLink` — id, projectId, shareToken, isPublic, createdAt
  - `PrdWizardForm` — name, description, templateType, targetUser, techStack, options
  - `VirtualReviewResult` — techLeadFeedback, qaEngineerFeedback, businessSponsorFeedback
  - `QualityAuditResult` — score, ambiguityWarnings[], completenessCheck
  - `SprintRoadmap` — sprint1[], sprint2[], sprint3[]
- [ ] 🔴 `src/lib/types/user.ts`:
  - `User` — id, name, email, role, avatar, plan, createdAt
  - `AuthState` — user, isAuthenticated, isLoading
- [ ] 🔴 `src/lib/types/api.ts`:
  - `ApiResponse<T>` — success, data?, error?, message?
  - `PaginatedResponse<T>` — data[], total, page, limit
  - `PlanTier` — 'free' | 'pro' | 'team'
  - `UsageInfo` — count, limit, remaining

---

## Phase 1 — API Client & Stores

### 1.1 API Client Layer

- [ ] 🔴 `src/lib/api/client.ts` — base fetch wrapper:
  - `apiGet<T>(path)` — GET request
  - `apiPost<T>(path, body)` — POST request
  - `apiPatch<T>(path, body)` — PATCH request
  - `apiDelete<T>(path)` — DELETE request
  - Auto cookie, error handling, JSON parse
- [ ] 🔴 `src/lib/api/auth.ts`:
  - `authApi.loginGoogle()` — redirect ke `/auth/google`
  - `authApi.getSession()` — GET `/session`
  - `authApi.logout()` — POST `/auth/logout`
- [ ] 🔴 `src/lib/api/prd.ts`:
  - `prdApi.getProjects()` — GET `/prd/projects`
  - `prdApi.getProject(id)` — GET `/prd/projects/:id`
  - `prdApi.create(data)` — POST `/prd/projects`
  - `prdApi.update(id, data)` — PATCH `/prd/projects/:id`
  - `prdApi.delete(id)` — DELETE `/prd/projects/:id`
  - `prdApi.restore(id)` — POST `/prd/projects/:id/restore`
  - `prdApi.generate(wizardData)` — POST `/prd/generate` (streaming)
  - `prdApi.copilot(content, instruction)` — POST `/prd/copilot` (streaming)
  - `prdApi.virtualReview(content)` — POST `/prd/virtual-review`
  - `prdApi.qualityAudit(content)` — POST `/prd/quality-audit`
  - `prdApi.sprintPlan(content)` — POST `/prd/sprint-plan`
  - `prdApi.exportAgentPrompt(content)` — POST `/prd/export-agent`
  - `prdApi.exportJsonSpec(content)` — POST `/prd/export-json`
  - `prdApi.getVersions(id)` — GET `/prd/projects/:id/versions`
  - `prdApi.getVersionDiff(id, vA, vB)` — GET `/prd/projects/:id/diff`
  - `prdApi.share(id)` — POST `/prd/projects/:id/share`
  - `prdApi.getPrdQuota()` — GET `/prd/quota` (Terpisah dari ERD Generator)

### 1.2 Svelte Stores (Svelte 5 runes)

- [ ] 🔴 `src/lib/stores/auth.store.ts`:
  - `user` — `$state<User | null>(null)`
  - `isAuthenticated` — `$derived(!!user)`
  - `isLoading` — `$state(true)`
  - `login()`, `logout()`, `fetchSession()`
- [ ] 🔴 `src/lib/stores/ui.store.ts`:
  - `sidebarOpen` — `$state(false)`
  - `theme` — `$state<'light' | 'dark' | 'system'>('system')`
  - `toasts` — `$state<Toast[]>([])`
  - `addToast()`, `removeToast()`
- [ ] 🔴 `src/lib/stores/prd.store.ts`:
  - `projects` — `$state<PrdProject[]>([])`
  - `currentProject` — `$state<PrdProject | null>(null)`
  - `rawMarkdown` — `$state<string>('')`
  - `qualityScore` — `$state<number | null>(null)`
  - `virtualReview` — `$state<VirtualReviewResult | null>(null)`
  - `sprintRoadmap` — `$state<SprintRoadmap | null>(null)`
- [ ] 🔴 `src/lib/stores/wizard.store.ts`:
  - `step` — `$state(1)`
  - `formData` — `$state<PrdWizardForm>(...)`
  - `nextStep()`, `prevStep()`, `reset()`

---

## Phase 2 — Layout & Base UI Components

### 2.1 Root Layout


### 2.2 Base UI Components

- [ ] 🔴 `src/lib/components/ui/Button.svelte`
- [ ] 🔴 `src/lib/components/ui/Input.svelte`
- [ ] 🔴 `src/lib/components/ui/Textarea.svelte`
- [ ] 🔴 `src/lib/components/ui/Select.svelte`
- [ ] 🔴 `src/lib/components/ui/Modal.svelte`
- [ ] 🔴 `src/lib/components/ui/Badge.svelte`
- [ ] 🔴 `src/lib/components/ui/Toast.svelte`
- [ ] 🔴 `src/lib/components/ui/Spinner.svelte`
- [ ] 🔴 `src/lib/components/ui/GlowBlob.svelte`
- [ ] 🔴 `src/lib/components/ui/Reveal.svelte`
- [ ] 🔴 `src/lib/components/ui/Sparkline.svelte`

---

## Phase 3 — Landing Page & Guest Try Mode

### 3.1 Landing Page Components

- [ ] 🔴 `src/lib/components/landing/HeroSection.svelte`:
  - Hero headline, sub-headline, CTA buttons
- [ ] 🔴 `src/lib/components/landing/FeaturesGrid.svelte`:
  - 4 Killer Features Grid (Virtual Review, Mermaid Diagrams, Quality Audit, Agent Exporter)
- [ ] 🔴 `src/lib/components/landing/ComparisonSection.svelte`:
  - Tabel perbandingan: PRD Generator vs Manual ChatGPT vs Notion Templates
- [ ] 🔴 `src/lib/components/landing/WorkflowStepper.svelte`:
  - Visual step 1 (Wizard) -> step 2 (AI Auto Gen) -> step 3 (Copilot & Audit) -> step 4 (Export)
- [ ] 🔴 `src/lib/components/landing/CTASection.svelte`
- [ ] 🔴 `src/lib/components/landing/FAQAccordion.svelte`
- [ ] 🔴 `src/routes/+page.svelte`: Landing Page utama

### 3.2 Guest Try Mode (`/try`)

- [ ] 🔴 `src/routes/try/+page.svelte`:
  - Halaman uji coba tanpa login
  - Menyimpan draf sementara di `localStorage`
  - Banner "Save to Cloud Account"

---

## Phase 4 — Dashboard & Project Management

- [ ] 🔴 `src/routes/dashboard/+layout.svelte`: Dashboard Sidebar & Header Layout
- [ ] 🔴 `src/routes/dashboard/+page.svelte`: Project overview & quick statistics
- [ ] 🔴 `src/routes/dashboard/projects/+page.svelte`: List proyek PRD dengan pagination & filter
- [ ] 🔴 `src/routes/dashboard/templates/+page.svelte`: Katalog Template PRD (SaaS, Mobile, API, AI)
- [ ] 🔴 `src/routes/dashboard/activity/+page.svelte`: Audit log riwayat aktivitas pembuatan PRD
- [ ] 🔴 `src/routes/dashboard/trash/+page.svelte`: Soft-deleted PRD trash & restore
- [ ] 🔴 `src/lib/components/features/project/ProjectCard.svelte`
- [ ] 🔴 `src/lib/components/features/project/NewProjectModal.svelte`

---

## Phase 5 — Workspace & PRD Live Editor (`/project/[projectId]`)

- [ ] 🔴 `src/routes/project/[projectId]/+layout.svelte`: Workspace Layout
- [ ] 🔴 `src/routes/project/[projectId]/+page.svelte`: Main PRD Editor Page
- [ ] 🔴 `src/lib/components/features/editor/PrdEditorHeader.svelte`: Topbar status, version selector, export button
- [ ] 🔴 `src/lib/components/features/editor/PrdSplitEditor.svelte`: Split view container
- [ ] 🔴 `src/lib/components/features/editor/MarkdownPreviewPane.svelte`: Marked + DOMPurify + Mermaid.js renderer
- [ ] 🔴 `src/lib/components/features/copilot/CopilotSidebar.svelte`: AI Chat Copilot panel
- [ ] 🔴 `src/lib/components/features/copilot/SectionActionToolbar.svelte`: Inline Section Actions
- [ ] 🔴 `src/lib/components/features/copilot/SelectionPopover.svelte`: Text selection highlight AI popup
- [ ] 🔴 `src/lib/components/features/audit/VirtualReviewTab.svelte`: Multi-agent 3 Persona Review (Tech Lead, QA, Business)
- [ ] 🔴 `src/lib/components/features/audit/QualityAuditBadge.svelte`: Health score (0-100) & Ambiguity Warnings
- [ ] 🔴 `src/lib/components/features/sprint/SprintRoadmapView.svelte`: Story points (1-13) & Sprint 1/2/3 allocation
- [ ] 🔴 `src/lib/components/features/version/VersionDiffViewer.svelte`: Visual Git-style Diff viewer
- [ ] 🔴 `src/lib/components/features/export/ExportModal.svelte`: Export modal (MD, PDF, AGENTS.md, JSON Spec)
- [ ] 🔴 `src/lib/components/features/share/ShareModal.svelte`: Public Share Link generator

---

## Phase 6 — Admin Panel

- [ ] 🟡 `src/routes/admin/+layout.svelte`
- [ ] 🟡 `src/routes/admin/users/+page.svelte`
- [ ] 🟡 `src/routes/admin/projects/+page.svelte`
- [ ] 🟡 `src/routes/admin/payments/+page.svelte`

---

## Phase 7 — Settings & Account

- [ ] 🔴 `src/routes/settings/+layout.svelte`
- [ ] 🔴 `src/routes/settings/profile/+page.svelte`
- [ ] 🔴 `src/routes/settings/account/+page.svelte`
- [ ] 🔴 `src/routes/settings/api-keys/+page.svelte`: Management Custom API Key (Google Gemini 2.0 Flash / Groq) di LocalStorage
- [ ] 🔴 `src/routes/settings/appearance/+page.svelte`
- [ ] 🟡 `src/routes/settings/billing/+page.svelte`: Tampilan Kuota & Subskripsi terpisah antara PRD Generator dan ERD Generator
- [ ] 🟡 `src/routes/settings/notifications/+page.svelte`

---

## Phase 8 — Enterprise Chat History, Stakeholder Review History, Templates & Audit Trail

- [ ] 🔴 `src/lib/components/features/copilot/CopilotChatHistory.svelte`: Persisted copilot message history loader
- [ ] 🔴 `src/lib/components/features/audit/VirtualReviewHistoryModal.svelte`: Past stakeholder review snapshots comparison
- [ ] 🔴 `src/lib/components/features/templates/TemplateGalleryModal.svelte`: Preset template selector (SaaS, Mobile, E-commerce, API, AI)
- [ ] 🔴 `src/lib/components/features/audit/AuditTrailDrawer.svelte`: Real-time section edit audit trail drawer
