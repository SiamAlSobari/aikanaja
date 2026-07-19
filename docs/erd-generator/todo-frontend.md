# Todo Frontend — AiKanAja

_Last updated: 19/7/2026_
_Status: IN PROGRESS_

---

## Tech Stack

| Layer             | Teknologi                                    |
| ----------------- | -------------------------------------------- |
| Framework         | SvelteKit (Svelte 5 runes)                   |
| Language          | TypeScript                                   |
| Styling           | Tailwind CSS + DaisyUI                       |
| ERD Visualization | @xyflow/svelte                               |
| State Management  | Svelte 5 `$state`, `$derived`, `$state.raw`  |
| Data Fetching     | SvelteKit load functions (`+page.server.ts`) |
| Auth              | JWT cookie (httpOnly) via backend            |
| Package Manager   | Bun                                          |

---

## ATURAN KETAT — SvelteKit First

**Prinsip:** Default = Server-side load. Client-side = pengecualian.

### 1. Client component (`$state`, event handler) hanya boleh dipakai kalo ADA SALAH SATU ini:

- `$state` / `$derived` / `$effect` untuk reactive UI
- Event handler (`onclick`, `onsubmit`, `onchange`, dll)
- Browser API (`localStorage`, `window`, `document`)
- Svelte Flow (`$state.raw` untuk nodes/edges)
- Real-time updates (WebSocket, SSE consumer)

### 2. DILARANG:

- ❌ Pakai `$state` cuma karena males mikir — itu dosa performa
- ❌ Bikin API route (`+server.ts`) cuma buat baca data dari backend — pakai `+page.server.ts` load function
- ❌ Pakai `fetch()` dari client kalo bisa load function di server
- ❌ Deep reactive state untuk Svelte Flow — WAJIB `$state.raw`

### 3. WAJIB:

- ✅ Data fetching → `+page.server.ts` load function (server-side, type-safe)
- ✅ Mutation → form action (`+page.server.ts` actions) atau direct API call di event handler
- ✅ Halaman publik (landing, try, share view) → SSR, SEO optimal
- ✅ Halaman private (dashboard, workspace, settings) → server load + auth guard
- ✅ Client state minimal — hanya untuk UI interaksi (sidebar open, modal, selected node)
- ✅ Pakai `$state.raw` untuk Svelte Flow nodes/edges (bukan deep reactive)

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

- [x] Inisialisasi SvelteKit dengan TypeScript
- [x] Setup Tailwind CSS
- [x] Install DaisyUI
- [x] Install @xyflow/svelte
- [x] Setup folder structure: `src/lib`, `src/routes`
- [x] Setup `.gitignore`
- [x] Push initial setup ke git

### 0.2 Environment & Config

- [x] 🔴 Setup `.env` file:
  - `VITE_API_URL` — Backend API URL (default: `http://localhost:3000`)
- [x] 🔴 Setup `src/lib/api/client.ts` — base fetch wrapper:
  - Auto-attach JWT cookie (`credentials: 'include'`)
  - Error handling (401 → redirect login)
  - JSON parse
  - Base URL dari env

### 0.3 TypeScript Types

- [x] 🔴 `src/lib/types/erd.ts`:
  - `ErdProject` — id, name, description, createdAt, updatedAt, schema
  - `ErdSchema` — tables[], relations[]
  - `ErdTable` — id, name, position, columns[]
  - `ErdColumn` — id, name, type, primaryKey, nullable, unique, defaultValue, foreignKey
  - `ErdRelation` — id, sourceTableId, targetTableId, sourceColumn, targetColumn, type
  - `RelationType` — 'one-to-one' | 'one-to-many' | 'many-to-many'
  - `GenerateSchemaRequest` — prompt, apiKey?
  - `GenerateSchemaResponse` — success, schema?, error?
- [x] 🔴 `src/lib/types/user.ts`:
  - `User` — id, name, email, role, avatar, plan, createdAt
  - `AuthState` — user, isAuthenticated, isLoading
- [x] 🔴 `src/lib/types/api.ts`:
  - `ApiResponse<T>` — success, data?, error?, message?
  - `PaginatedResponse<T>` — data[], total, page, limit
  - `PlanTier` — 'free' | 'pro' | 'team'
  - `UsageInfo` — count, limit, remaining

---

## Phase 1 — API Client & Stores

### 1.1 API Client Layer

- [x] 🔴 `src/lib/api/client.ts` — base fetch wrapper:
  - `apiGet<T>(path)` — GET request
  - `apiPost<T>(path, body)` — POST request
  - `apiPatch<T>(path, body)` — PATCH request
  - `apiDelete<T>(path)` — DELETE request
  - Auto cookie, error handling, JSON parse
- [x] 🔴 `src/lib/api/auth.ts`:
  - `authApi.loginGoogle()` — redirect ke `/auth/google`
  - `authApi.getSession()` — GET `/session`
  - `authApi.logout()` — POST `/auth/logout`
- [x] 🔴 `src/lib/api/erd.ts`:
  - `erdApi.getProjects()` — GET `/erd/projects`
  - `erdApi.getProject(id)` — GET `/erd/projects/:id`
  - `erdApi.create(data)` — POST `/erd/projects`
  - `erdApi.update(id, data)` — PATCH `/erd/projects/:id`
  - `erdApi.delete(id)` — DELETE `/erd/projects/:id`
  - `erdApi.restore(id)` — POST `/erd/projects/:id/restore`
  - `erdApi.generate(prompt, apiKey?)` — POST `/erd/generate`
  - `erdApi.export(schema, format, target)` — POST `/erd/export`
  - `erdApi.getUsage()` — GET `/erd/usage`
  - `erdApi.getTemplates()` — GET `/erd/templates`
  - `erdApi.getTemplate(id)` — GET `/erd/templates/:id`
  - `erdApi.useTemplate(id)` — POST `/erd/templates/:id/use`
  - `erdApi.getHistory(id)` — GET `/erd/projects/:id/history`
  - `erdApi.restoreVersion(id, versionId)` — POST `/erd/projects/:id/history/:versionId/restore`
  - `erdApi.share(id, email, role)` — POST `/erd/projects/:id/share`
  - `erdApi.removeShare(id, userId)` — DELETE `/erd/projects/:id/share/:userId`
  - `erdApi.generateShareLink(id)` — POST `/erd/projects/:id/share/link`

### 1.2 Svelte Stores (Svelte 5 runes)

- [x] 🔴 `src/lib/stores/auth.store.ts`:
  - `user` — `$state<User | null>(null)`
  - `isAuthenticated` — `$derived(!!user)`
  - `isLoading` — `$state(true)`
  - `login()`, `logout()`, `fetchSession()`
- [x] 🔴 `src/lib/stores/ui.store.ts`:
  - `sidebarOpen` — `$state(false)`
  - `theme` — `$state<'light' | 'dark' | 'system'>('system')`
  - `toasts` — `$state<Toast[]>([])`
  - `addToast()`, `removeToast()`
- [x] 🟡 `src/lib/stores/project.store.ts`:
  - `projects` — `$state<ErdProject[]>([])`
  - `currentProject` — `$state<ErdProject | null>(null)`
  - `fetchProjects()`, `createProject()`, `deleteProject()`
- [x] 🟡 `src/lib/stores/flow.store.ts`:
  - `nodes` — `$state.raw<Node[]>([])`
  - `edges` — `$state.raw<Edge[]>([])`
  - `selectedNodeId` — `$state<string | null>(null)`
  - `selectedNode` — `$derived(...)`
  - `undoStack`, `redoStack` — `$state<FlowSnapshot[]>([])`
  - `addNode()`, `updateNode()`, `deleteNode()`
  - `addEdge()`, `updateEdge()`, `deleteEdge()`
  - `undo()`, `redo()`, `pushSnapshot()`

---

## Phase 2 — Layout & UI Components

### 2.1 Root Layout

- [x] 🔴 Update `src/routes/+layout.svelte`:
  - Import DaisyUI CSS
  - Theme provider (light/dark/system)
  - Toast container
  - Global navbar (conditional: show on landing, hide on workspace)
- [x] 🔴 `src/routes/+layout.server.ts`:
  - Load session user (if any)
  - Pass user data ke layout

### 2.2 Base UI Components

- [x] 🔴 `src/lib/components/ui/Button.svelte`:
  - Variants: primary, secondary, ghost, danger, outline
  - Sizes: sm, md, lg
  - Loading state dengan spinner
  - Disabled state
  - Icon slot (optional)
- [x] 🔴 `src/lib/components/ui/Input.svelte`:
  - Label, placeholder, error message
  - Types: text, email, password, number
  - Icon slot (left/right)
  - Disabled, readonly states
- [x] 🔴 `src/lib/components/ui/Textarea.svelte`:
  - Auto-resize
  - Character count (optional)
  - Label, error
- [x] 🔴 `src/lib/components/ui/Select.svelte`:
  - Custom dropdown (bukan native select)
  - Searchable (optional)
  - Multi-select (optional)
  - Option groups
- [x] 🔴 `src/lib/components/ui/Modal.svelte`:
  - Backdrop click to close
  - Escape key to close
  - Title, content, footer slots
  - Sizes: sm, md, lg, xl
  - DaisyUI `modal` component
- [x] 🔴 `src/lib/components/ui/Card.svelte`:
  - Header, body, footer slots
  - Hover state (optional)
  - Clickable variant
- [x] 🔴 `src/lib/components/ui/Badge.svelte`:
  - Variants: info, success, warning, error, neutral
  - Sizes: sm, md
- [x] 🔴 `src/lib/components/ui/Toast.svelte`:
  - Variants: success, error, info, warning
  - Auto-dismiss (configurable duration)
  - Position: top-right, bottom-right, top-center
  - DaisyUI `toast` component
- [x] 🔴 `src/lib/components/ui/Spinner.svelte`:
  - Sizes: sm, md, lg
  - DaisyUI `loading` component
- [x] 🟡 `src/lib/components/ui/Tooltip.svelte`:
  - Position: top, bottom, left, right
  - Trigger: hover, click
- [x] 🟡 `src/lib/components/ui/Dropdown.svelte`:
  - Menu items, dividers
  - Keyboard navigation
- [x] 🟡 `src/lib/components/ui/Tabs.svelte`:
  - Tab list, tab panels
  - Animated indicator

### 2.3 Layout Components

- [x] 🔴 `src/lib/components/layout/Navbar.svelte`:
  - Logo
  - Nav links (Landing: Features, Pricing; Dashboard: Projects, Templates)
  - Auth buttons (Login / User dropdown)
  - Theme toggle
  - Mobile responsive (hamburger menu)
  - DaisyUI `navbar` component
- [x] 🔴 `src/lib/components/layout/Footer.svelte`:
  - Logo, description
  - Links: About, Features, Pricing, Contact
  - Social links (optional)
  - Copyright
- [x] 🔴 `src/lib/components/layout/DashboardLayout.svelte`:
  - Sidebar (collapsible)
  - Main content area
  - Sidebar items: Overview, Projects, Templates, Activity, Trash, Settings
  - Mobile: bottom navigation atau slide-out sidebar
- [x] 🔴 `src/lib/components/layout/WorkspaceLayout.svelte`:
  - Full-screen (no navbar/footer)
  - 3-column: left sidebar (AI chat) | center (canvas) | right sidebar (detail panel)
  - Both sidebars collapsible
  - Escape key to exit fullscreen (optional)

---

## Phase 3 — Auth Pages

### 3.1 Auth Layout

- [x] 🔴 `src/routes/auth/+layout.svelte`:
  - Centered card layout
  - No navbar/footer
  - Background pattern/gradient
  - Logo di atas card

### 3.2 Login Page

- [x] 🔴 `src/routes/auth/login/+page.svelte`:
  - Google OAuth button (single button, besar)
  - AiKanAja logo
  - Tagline "Buat ERD dari deskripsi teks"
  - Loading state saat redirect
- [x] 🔴 `src/routes/auth/login/+page.server.ts`:
  - Redirect ke backend `/auth/google`
  - Check if already logged in → redirect dashboard

### 3.3 OAuth Callback

- [x] 🔴 `src/routes/auth/callback/+page.server.ts`:
  - Handle callback dari Google OAuth
  - Backend set JWT cookie
  - Redirect ke `/dashboard`
  - Error handling: redirect ke `/auth/login` dengan error message

### 3.4 Auth Guard Component

- [x] 🔴 `src/lib/components/features/auth/AuthGuard.svelte`:
  - Check auth state
  - Loading state
  - Redirect ke `/auth/login` jika tidak authenticated
  - Bisa dipakai di layout

---

## Phase 4 — Landing Page & Try Workspace

### 4.1 Landing Page

- [x] 🔴 `src/routes/+page.svelte`:
  - Hero section:
    - Headline: "Buat ERD Otomatis dari Deskripsi Teks"
    - Subheadline: deskripsi singkat AiKanAja
    - CTA buttons: "Coba Gratis" → `/try`, "Login" → `/auth/login`
    - Quick input: textarea + generate button (redirect ke `/try`)
  - Features section:
    - 4 cards: AI-Powered, Visual Interaktif, Export SQL & Prisma, Multi-Format
    - Icon/illustration per card
  - How It Works section:
    - 4 steps: Deskripsikan → Generate → Edit → Export
    - Numbered steps dengan deskripsi
  - Pricing section (optional):
    - 3 plan cards: Free, Pro, Team
    - Feature comparison
  - CTA section:
    - "Siap Membuat ERD?"
    - Buttons: "Coba Gratis", "Login"
  - Footer

### 4.2 Guest Workspace

- [x] 🔴 `src/routes/try/+page.svelte`:
  - Simplified ERD editor
  - AI input panel (sidebar atau top)
  - Svelte Flow canvas
  - Export button
  - Batasan:
    - 1x generate only (cek via cookie/localStorage)
    - Tidak bisa save
    - CTA login setelah generate: "Login untuk menyimpan dan generate unlimited"
  - Banner: "Guest mode — Login untuk fitur lengkap"
- [x] 🟡 `src/routes/try/+page.server.ts`:
  - Rate limit check (server-side, cookie-based)
  - Block generate jika sudah pernah

---

## Phase 5 — Dashboard

### 5.1 Dashboard Layout

- [x] 🔴 `src/routes/dashboard/+layout.svelte`:
  - DashboardLayout component
  - Sidebar navigation:
    - Overview (`/dashboard`)
    - Projects (`/dashboard/projects`)
    - Templates (`/dashboard/templates`)
    - Activity (`/dashboard/activity`)
    - Trash (`/dashboard/trash`)
    - Settings (`/settings`)
  - User info di sidebar bottom
- [x] 🔴 `src/routes/dashboard/+layout.server.ts`:
  - Auth guard: redirect ke `/auth/login` jika tidak authenticated

### 5.2 Dashboard Overview

- [x] 🔴 `src/routes/dashboard/+page.svelte`:
  - Stats cards:
    - Jumlah project
    - Generate count bulan ini
    - Quota tersisa (atau "Unlimited" jika pakai API key sendiri)
    - Plan saat ini
  - Recent projects (5 terakhir):
    - Card per project: name, description, last edited
    - Click → ke workspace
  - Quick actions:
    - "Buat ERD Baru" button → modal input nama + prompt
    - "Browse Templates" button → `/dashboard/templates`
  - Activity feed (5 aktivitas terakhir)
  - Empty state jika belum ada project
- [x] 🔴 `src/routes/dashboard/+page.server.ts`:
  - Load: projects, usage stats

### 5.2 Dashboard Overview

- [x] 🔴 `src/routes/dashboard/+page.svelte`:
  - Stats cards:
    - Jumlah project
    - Generate count bulan ini
    - Quota tersisa (atau "Unlimited" jika pakai API key sendiri)
    - Plan saat ini
  - Recent projects (5 terakhir):
    - Card per project: name, description, last edited
    - Click → ke workspace
  - Quick actions:
    - "Buat ERD Baru" button → modal input nama + prompt
    - "Browse Templates" button → `/dashboard/templates`
  - Activity feed (5 aktivitas terakhir)
  - Empty state jika belum ada project
- [x] 🔴 `src/routes/dashboard/+page.server.ts`:
  - Load: projects, usage stats

### 5.3 Projects List

- [x] 🔴 `src/routes/dashboard/projects/+page.svelte`:
  - Grid/list view toggle
  - Sort: nama, terbaru, terlama
  - Filter: semua, milik sendiri, shared
  - Search input
  - Pagination
  - ProjectCard per project:
    - Name, description, last edited
    - Preview thumbnail (optional)
    - Actions: Open, Edit, Delete
  - Empty state: "Belum ada project. Buat ERD baru?"
  - "Buat ERD Baru" button
- [x] 🔴 `src/routes/dashboard/projects/+page.server.ts`:
  - Load: projects dengan pagination, sort, filter
- [x] 🟡 `src/routes/dashboard/projects/shared/+page.svelte`:
  - Project yang di-share ke user
  - Indicator: siapa yang share, role (view/edit)
- [x] 🟡 `src/routes/dashboard/projects/shared/+page.server.ts`:
  - Load: shared projects

### 5.4 Templates

- [x] 🟡 `src/routes/dashboard/templates/+page.svelte`:
  - Gallery template siap pakai
  - Kategori: E-commerce, Blog, Social Media, Inventory, dll
  - Card per template: name, description, preview thumbnail
  - Click → detail
  - "Use Template" button
- [x] 🟡 `src/routes/dashboard/templates/+page.server.ts`:
  - Load: templates dari backend
- [x] 🟡 `src/routes/dashboard/templates/[templateId]/+page.svelte`:
  - Preview ERD template (Svelte Flow, read-only)
  - Deskripsi dan use case
  - "Use Template" button → buat project baru dengan schema pre-filled
  - Back button
- [x] 🟡 `src/routes/dashboard/templates/[templateId]/+page.server.ts`:
  - Load: template detail

### 5.5 Activity Log

- [x] 🟡 `src/routes/dashboard/activity/+page.svelte`:
  - List aktivitas:
    - Create project
    - Generate schema
    - Edit schema
    - Export
    - Share project
  - Timestamp per aktivitas
  - Filter by type (optional)
- [x] 🟡 `src/routes/dashboard/activity/+page.server.ts`:
  - Load: activity log

### 5.6 Trash

- [x] 🟡 `src/routes/dashboard/trash/+page.svelte`:
  - Soft-deleted projects
  - Card per project: name, deleted date
  - Actions: Restore, Permanent Delete
  - Auto-purge info: "Akan dihapus permanen setelah 30 hari"
  - Empty state: "Trash kosong"
- [x] 🟡 `src/routes/dashboard/trash/+page.server.ts`:
  - Load: deleted projects

---

## Phase 6 — ERD Workspace (Core Feature)

### 6.1 Workspace Layout

- [x] 🔴 `src/routes/project/[projectId]/+layout.svelte`:
  - WorkspaceLayout component (full-screen)
  - Auth guard
- [x] 🔴 `src/routes/project/[projectId]/+layout.server.ts`:
  - Load project data
  - Validate ownership/access

### 6.2 ERD Canvas

- [x] 🔴 `src/lib/components/flow/ERDCanvas.svelte`:
  - Svelte Flow wrapper
  - Custom node types: `table` → TableNode
  - Custom edge types: `relation` → RelationEdge
  - Background (dots pattern)
  - MiniMap
  - Controls (zoom, fit view)
  - `on:nodeclick` → select node
  - `on:edgeclick` → select edge
  - `on:paneClick` → deselect
  - State: `$state.raw` untuk nodes & edges
- [x] 🔴 `src/lib/components/flow/TableNode.svelte`:
  - Custom Svelte Flow node
  - Display: table name, columns
  - Columns: name, type, PK icon, FK icon
  - Click → select node
  - Style: card-like, header berwarna
  - Add column button (optional inline)
- [x] 🔴 `src/lib/components/flow/RelationEdge.svelte`:
  - Custom Svelte Flow edge
  - Cardinality label: 1:N, N:M, 1:1
  - Click → select edge
  - Style: dashed/solid berdasarkan type
- [x] 🟡 `src/lib/components/flow/CanvasControls.svelte`:
  - Zoom in/out buttons
  - Fit view button
  - Lock toggle (disable drag)
- [x] 🟡 `src/lib/components/flow/MiniMap.svelte`:
  - Minimap overlay
  - Click to navigate

### 6.3 Schema Toolbar

- [x] 🔴 `src/lib/components/features/editor/SchemaToolbar.svelte`:
  - Top toolbar (floating)
  - Buttons:
    - Undo (disabled jika stack kosong)
    - Redo (disabled jika stack kosong)
    - Auto-layout (re-arrange nodes rapi)
    - Zoom controls
    - Export button → ExportModal
  - Project name display
  - Auto-save indicator: "Saved" / "Saving..."
  - Back to dashboard button
- [x] 🟡 Keyboard shortcuts:
  - `Ctrl+Z` → Undo
  - `Ctrl+Y` → Redo
  - `Ctrl+S` → Force save
  - `Delete` → Delete selected node/edge

### 6.4 AI Chat Panel

- [x] 🔴 `src/lib/components/features/ai/AIChatPanel.svelte`:
  - Left sidebar (collapsible)
  - Chat input (textarea)
  - Generate button
  - Message history (user + AI messages)
  - Loading state saat generate
  - Quota indicator: "Sisa X generate" atau "Unlimited"
  - Collapse/expand toggle
- [x] 🔴 `src/lib/components/features/ai/AIMessage.svelte`:
  - Message bubble
  - User message: right-aligned
  - AI message: left-aligned, dengan schema preview (optional)
  - Timestamp
- [x] 🟡 `src/lib/components/features/ai/PromptSuggestions.svelte`:
  - Pre-built prompt templates
  - Click → fill input
  - Contoh:
    - "Buat sistem e-commerce dengan user, product, order"
    - "Sistem blog dengan user, post, comment"
    - "Inventory management dengan product, warehouse, stock"

### 6.5 Table Detail Panel

- [x] 🔴 `src/lib/components/features/editor/TableDetailPanel.svelte`:
  - Right sidebar (collapsible, muncul saat node dipilih)
  - Table name input (editable)
  - Column list:
    - Each column: name, type, PK, nullable, unique, default, FK
    - Edit inline
    - Delete button
  - Add column button
  - Delete table button (dengan konfirmasi)
  - Close button (deselect)
- [x] 🔴 `src/lib/components/features/editor/ColumnEditor.svelte`:
  - Name input
  - Type select: VARCHAR, TEXT, INT, BIGINT, FLOAT, BOOLEAN, DATE, DATETIME, JSON, UUID
  - PK toggle
  - Nullable toggle
  - Unique toggle
  - Default value input
  - FK select: pilih table + column
- [x] 🟡 `src/lib/components/features/editor/RelationEditor.svelte`:
  - Edit relation type (1:1, 1:N, N:M)
  - Source table + column
  - Target table + column
  - Delete relation button

### 6.6 Export

- [x] 🔴 `src/lib/components/features/export/ExportModal.svelte`:
  - Modal (bukan full page, untuk quick export)
  - Format select: SQL DDL, Prisma Schema
  - Target DB select (untuk SQL): MySQL, PostgreSQL, SQLite
  - Options:
    - Tambahkan komentar dokumentasi
    - Sertakan migrasi awal (untuk Prisma)
  - Code preview dengan syntax highlighting
  - Download button
  - Close button
- [x] 🟡 `src/routes/project/[projectId]/export/+page.svelte`:
  - Full page export (untuk advanced options)
  - Lebih banyak ruang untuk preview
  - Copy to clipboard button

### 6.7 Workspace Page

- [x] 🔴 `src/routes/project/[projectId]/+page.svelte`:
  - Compose semua komponen:
    - SchemaToolbar (top)
    - AIChatPanel (left)
    - ERDCanvas (center)
    - TableDetailPanel (right)
  - Load initial schema dari project
  - Convert schema → Svelte Flow nodes/edges
  - Auto-save: setiap perubahan → PATCH `/erd/projects/:id`
- [x] 🔴 `src/routes/project/[projectId]/+page.server.ts`:
  - Load: project by ID
  - Validate access (owner atau collaborator)

---

## Phase 7 — Settings

### 7.1 Settings Layout

- [x] 🔴 `src/routes/settings/+layout.svelte`:
  - Sidebar tabs:
    - Profile (`/settings/profile`)
    - Account (`/settings/account`)
    - API Keys (`/settings/api-keys`)
    - Appearance (`/settings/appearance`)
    - Notifications (`/settings/notifications`)
    - Billing (`/settings/billing`)
  - Content area
  - Mobile: dropdown select untuk tabs
- [x] 🔴 `src/routes/settings/+layout.server.ts`:
  - Auth guard
- [x] 🔴 `src/routes/settings/+page.svelte`:
  - Redirect ke `/settings/profile`

### 7.2 Profile Settings

- [x] 🔴 `src/routes/settings/profile/+page.svelte`:
  - Form: name, avatar (upload/URL), bio
  - Email (read-only, dari Google)
  - Save button
  - Success/error toast
- [x] 🔴 `src/routes/settings/profile/+page.server.ts`:
  - Load: user profile
  - Form action: update profile

### 7.3 Account Settings

- [x] 🔴 `src/routes/settings/account/+page.svelte`:
  - Email (read-only, dari Google)
  - Connected accounts: Google (badge "Connected")
  - Danger zone:
    - Hapus akun button
    - Konfirmasi modal: "Ketik email Anda untuk konfirmasi"
    - Warning: "Semua data akan dihapus permanen"
- [x] 🔴 `src/routes/settings/account/+page.server.ts`:
  - Load: account info
  - Form action: delete account

### 7.4 API Keys Settings

- [x] 🔴 `src/routes/settings/api-keys/+page.svelte`:
  - List API keys (masked: `sk-...abc`)
  - Provider badge: OpenAI, Gemini, Groq
  - Default key indicator
  - Actions: Set default, Delete
  - "Add API Key" form:
    - Provider select
    - Key input
    - "Test Connection" button
    - Save button
  - Info box: "Pakai API key sendiri = unlimited generate, tidak kena quota server"
- [x] 🔴 `src/routes/settings/api-keys/+page.server.ts`:
  - Load: user API keys
  - Form action: add, delete, set default

### 7.5 Appearance Settings

- [x] 🟡 `src/routes/settings/appearance/+page.svelte`:
  - Theme: Light, Dark, System (radio cards)
  - Font size: Small, Medium, Large (radio)
  - Canvas background: Dots, Lines, Cross (radio)
  - Preview section
  - Preferensi disimpan di localStorage via `ui.store` (`setAppearance`), diterapkan via `data-theme`/`data-font-size`/`data-canvas-bg` di `document.documentElement`
- [x] 🟡 `src/routes/settings/appearance/+page.server.ts`:
  - Tidak ada (preferensi client-only, persist via localStorage)

### 7.6 Notification Settings

- [x] 🟡 `src/routes/settings/notifications/+page.svelte`:
  - Toggles:
    - Email notifications
    - Project shared notification
    - Quota warning (80%, 90%, 100%)
    - Billing notification
  - Save button
  - Preferensi disimpan di localStorage via `ui.store` (`setNotifications`)
- [x] 🟡 `src/routes/settings/notifications/+page.server.ts`:
  - Tidak ada (preferensi client-only, persist via localStorage)

---

## Phase 8 — Billing & Quota

### 8.1 Billing Overview

- [x] 🔴 `src/routes/settings/billing/+page.svelte`:
  - Current plan card:
    - Plan name (Free/Pro/Team)
    - Plan price
    - Status badge (Active, Pending, Cancelled)
  - Usage stats:
    - Generate count / limit (progress bar)
    - Project count / limit
    - Quota reset date
  - "Upgrade" button (jika Free)
  - "Manage Plan" button (jika Pro/Team)
  - "Cancel Subscription" link (jika Pro/Team)
- [x] 🔴 `src/routes/settings/billing/+page.server.ts`:
  - Load: plan, usage, billing status

### 8.2 Upgrade Page

- [x] 🔴 `src/routes/settings/billing/upgrade/+page.svelte`:
  - Pricing cards:
    - Free: Rp 0, 10x generate/bulan, 5 projects
    - Pro: Rp X/bulan, unlimited generate, unlimited projects
    - Team: Rp X/bulan, semua Pro + team features
  - Feature comparison table
  - Current plan indicator
  - "Upgrade" button per plan
  - Payment method info:
    - Dana transfer
    - Instruksi:
      1. Transfer ke Dana: [nomor admin]
      2. Screenshot bukti transfer
      3. Chat WA: 08826545202 dengan bukti + email akun
      4. Tunggu verifikasi (max 1x24 jam)
    - Tombol "Chat WA" → `wa.me/628826545202` (buka di new tab)
- [x] 🔴 `src/routes/settings/billing/upgrade/+page.server.ts`:
  - Load: current plan, available plans
  - Form action: request upgrade

### 8.3 Payment History

- [x] 🟡 `src/routes/settings/billing/payment/+page.svelte`:
  - Table/list pembayaran:
    - Date
    - Amount
    - Plan
    - Status: Pending (badge kuning), Verified (badge hijau), Rejected (badge merah)
  - Detail per payment (expandable/modal)
  - Empty state: "Belum ada riwayat pembayaran"
- [x] 🟡 `src/routes/settings/billing/payment/+page.server.ts`:
  - Load: payment history

### 8.4 Cancel Subscription

- [x] 🟡 `src/routes/settings/billing/cancel/+page.svelte`:
  - Info: "Anda akan tetap memiliki akses sampai akhir periode billing"
  - Alasan cancel (dropdown):
    - Terlalu mahal
    - Tidak terpakai
    - Pindah ke tool lain
    - Lainnya
  - Konfirmasi checkbox: "Saya mengerti akses akan berakhir pada [tanggal]"
  - "Cancel Subscription" button (danger)
  - "Kembali" button
- [x] 🟡 `src/routes/settings/billing/cancel/+page.server.ts`:
  - Form action: cancel subscription

---

## Phase 9 — Project Sub-pages

### 9.1 Project Settings

- [x] 🟡 `src/routes/project/[projectId]/settings/+page.svelte`:
  - Form: project name, description
  - Visibility: Private, Public (toggle)
  - Danger zone:
    - Delete project button
    - Konfirmasi modal
- [x] 🟡 `src/routes/project/[projectId]/settings/+page.server.ts`:
  - Load: project settings
  - Form action: update, delete

### 9.2 Project Share

- [x] 🟡 `src/routes/project/[projectId]/share/+page.svelte`:
  - Invite by email:
    - Email input
    - Role select: View, Edit
    - "Invite" button
  - Collaborators list:
    - Avatar, name, email
    - Role badge
    - Remove button
  - Public share link:
    - Generate link button
    - Link display + copy button
    - Expiry select (optional)
  - Link permissions: View-only
- [x] 🟡 `src/routes/project/[projectId]/share/+page.server.ts`:
  - Load: collaborators, share link
  - Form action: invite, remove, generate link

### 9.3 Project Share View

- [x] 🟡 `src/routes/project/[projectId]/share/[shareLink]/+page.svelte`:
  - Read-only Svelte Flow canvas
  - Tidak bisa edit
  - ERD visualization only
  - Export button (optional)
  - CTA: "Login to Fork" atau "Login to Edit"
  - Navbar minimal: logo + login button
- [x] 🟡 `src/routes/project/[projectId]/share/[shareLink]/+page.server.ts`:
  - Load: project by share link (public access, no auth required)

### 9.4 Project History

- [x] 🟡 `src/routes/project/[projectId]/history/+page.svelte`:
  - List versi:
    - Timestamp
    - Description (auto-generated: "Added table User", "Modified relation")
    - Preview thumbnail (optional)
  - Click → preview versi
  - "Restore" button per versi
  - Current version indicator
- [x] 🟡 `src/routes/project/[projectId]/history/+page.server.ts`:
  - Load: version history

### 9.5 Version Preview

- [x] 🟡 `src/routes/project/[projectId]/history/[versionId]/+page.svelte`:
  - Preview ERD pada versi tertentu (read-only canvas)
  - Diff view (optional):
    - Tabel ditambah (hijau)
    - Tabel dihapus (merah)
    - Tabel dimodifikasi (kuning)
  - "Restore This Version" button
  - "Back to History" button
- [x] 🟡 `src/routes/project/[projectId]/history/[versionId]/+page.server.ts`:
  - Load: version detail

---

## Phase 10 — Error Pages & Polish

### 10.1 Error Pages

- [x] 🔴 `src/routes/+error.svelte`:
  - Global error page
  - Error code display
  - "Back to Home" button
  - DaisyUI styling
- [x] 🔴 `src/routes/+not-found.svelte` (atau `+error.svelte` dengan 404):
  - 404 page
  - "Page Not Found" message
  - "Back to Home" button
  - Fun illustration (optional)

### 10.2 Loading States

- [x] 🔴 Loading skeleton untuk:
  - Dashboard (project cards)
  - Project list
  - Settings pages
  - Canvas initial load
- [x] 🔴 `src/lib/components/ui/Skeleton.svelte`:
  - Variants: text, card, circle, rectangle
  - Animated shimmer effect
  - DaisyUI `skeleton` component

### 10.3 Responsive & Polish

- [x] 🔴 Mobile responsive untuk semua halaman
- [x] 🔴 Dark mode support untuk semua komponen
- [x] 🔴 Keyboard navigation (Tab, Enter, Escape)
- [x] 🔴 Focus states yang jelas
- [x] 🔴 Transition animations (page transitions, sidebar slide)
- [x] 🟡 SEO meta tags per halaman
- [x] 🟡 OG tags untuk share links
- [x] 🟡 Sitemap (optional)

---

## Phase 11 — Admin Module

> Backend sudah selesai (`apps/api` — `admin.controller.ts` di `/erd/admin`, dilindungi `adminMiddleware` cek `role === 'admin'`).
> Frontend tinggal konsumsi endpoint tersebut. Admin di-identifikasi dari `user.role === 'admin'` (dari `/session`).
> **Akun admin:** email `siamqueen52@gmail.com` harus punya `role: 'admin'` (lihat catatan seeding di bawah).

### 11.1 Admin API Client

- [x] 🔴 `src/lib/api/admin.ts`:
  - `adminApi.getStats()` — GET `/erd/admin/stats`
  - `adminApi.getUsers(page?, limit?)` — GET `/erd/admin/users`
  - `adminApi.getUser(id)` — GET `/erd/admin/users/:id`
  - `adminApi.updateUserRole(id, role)` — PATCH `/erd/admin/users/:id`
  - `adminApi.deleteUser(id)` — DELETE `/erd/admin/users/:id`
  - `adminApi.getProjects(page?, limit?)` — GET `/erd/admin/projects`
  - `adminApi.getPayments(page?, limit?, status?)` — GET `/erd/admin/payments`
  - `adminApi.verifyPayment(id)` — POST `/erd/admin/payments/:id/verify`
  - `adminApi.rejectPayment(id)` — POST `/erd/admin/payments/:id/reject`

### 11.2 Admin Guard & Layout

- [x] 🔴 `src/lib/components/features/auth/AdminGuard.svelte`:
  - Cek `authStore.user?.role === 'admin'`
  - Loading state → redirect `/dashboard` jika bukan admin
  - Bisa dipakai di layout admin
- [x] 🔴 `src/routes/admin/+layout.svelte`:
  - Full admin layout (sidebar: Stats, Users, Projects, Payments)
  - Wrap dengan `AdminGuard`
  - User info di sidebar bottom (email, role badge)
- [x] 🔴 `src/routes/admin/+layout.server.ts`:
  - Load session user (butuh `role`)
  - Redirect ke `/dashboard` jika bukan admin

### 11.3 Admin Stats (Dashboard)

- [x] 🔴 `src/routes/admin/+page.svelte`:
  - Stats cards: userCount, projectCount, paymentCount, pendingPayments
  - Quick links ke Users / Projects / Payments
- [x] 🔴 `src/routes/admin/+page.server.ts`:
  - Load: `adminApi.getStats()`

### 11.4 Users Management

- [x] 🔴 `src/routes/admin/users/+page.svelte`:
  - Tabel users (name, email, role, createdAt, project count, payment count)
  - Pagination
  - Row actions: Lihat detail, Edit role, Delete
- [x] 🔴 `src/routes/admin/users/+page.server.ts`:
  - Load: `adminApi.getUsers()`
- [x] 🔴 `src/routes/admin/users/[userId]/+page.svelte`:
  - User detail: profil, list project (10), list payment (10)
  - Edit role (select: free/pro/team/admin) → PATCH
  - Delete user (konfirmasi modal)
- [x] 🔴 `src/routes/admin/users/[userId]/+page.server.ts`:
  - Load: `adminApi.getUser(id)`

### 11.5 Projects Management

- [x] 🟡 `src/routes/admin/projects/+page.svelte`:
  - Tabel semua ERD project (name, status, visibility, owner, createdAt)
  - Pagination, filter by status
- [x] 🟡 `src/routes/admin/projects/+page.server.ts`:
  - Load: `adminApi.getProjects()`

### 11.6 Billing & Payments Management (Admin Approval)

> **Flow:** User request upgrade (`/settings/billing/upgrade` → `POST /erd/billing/upgrade`) buat Payment `status: pending` + `plan` yang diminta. Admin di sini yang review & **apply** billing-nya.

- [x] 🔴 `src/routes/admin/payments/+page.svelte` (Approval Queue):
  - Tabel payments: user (name+email), **plan diminta** (user mau billing apa: pro/team), amount, method (Dana), status, createdAt
  - Filter tab: Pending / Verified / Rejected
  - Status badge (kuning=pending, hijau=verified, merah=rejected)
  - Row actions:
    - **Approve** (hanya pending) → `adminApi.verifyPayment(id)` → apply plan + unlimited usage
    - **Reject** (hanya pending) → `adminApi.rejectPayment(id)`
    - **Lihat detail** → buka modal/halaman detail
  - Empty state untuk tab Pending: "Tidak ada pembayaran menunggu"
- [x] 🔴 `src/routes/admin/payments/+page.server.ts`:
  - Load: `adminApi.getPayments()` (default filter status=pending)
- [x] 🔴 `src/routes/admin/payments/[paymentId]/+page.svelte` (Detail & Action):
  - Info user (name, email, WA jika ada)
  - **Plan diminta** (pro/team) — highlight
  - Amount + method (nomor Dana)
  - Bukti transfer (`proof`): preview gambar jika ada, link buka
  - Tombol **Approve** / **Reject** dengan konfirmasi
  - Riwayat: createdAt, verifiedAt
- [x] 🔴 `src/routes/admin/payments/[paymentId]/+page.server.ts`:
  - Load: detail payment via `adminApi.getPayments()` lalu filter by id (atau tambah `adminApi.getPayment(id)` jika perlu)

### 11.7 Admin Manual Plan Override

- [x] 🟡 `src/routes/admin/users/[userId]/+page.svelte`:
  - Selain edit role, admin bisa **set plan langsung** (free/pro/team) tanpa lewat payment:
    - Select plan → PATCH `/erd/admin/users/:id` dengan `role` = plan (override)
    - Ini untuk kasus admin mau kasi akses manual (mis. comped/error)
  - Tampilkan plan saat ini user di detail
- [x] 🟡 Admin bisa **edit payment record** (plan/amount) sebelum approve (jika ada salah input):
  - Butuh endpoint `PATCH /erd/admin/payments/:id` (backend belum ada → catat di todo-backend jika jadi implementasi)

### 11.8 Admin Nav Entry

- [x] 🔴 Tampilkan link "Admin" di `Navbar`/`DashboardLayout` sidebar **hanya jika** `user.role === 'admin'`
  - `src/lib/components/layout/Navbar.svelte`
  - `src/lib/components/layout/DashboardLayout.svelte`

### 11.9 Backend Seeding (Admin Email)

- [x] 🔴 Pastikan `siamqueen52@gmail.com` dapat `role: 'admin'` (Opsi A — OAuth auto, **sudah diimplementasikan** di `apps/api/src/modules/shared/auth/google.service.ts`: `ADMIN_EMAILS` + set `role` saat create/update user).

---

## Progress Summary

| Phase                      | Status          | Progress |
| -------------------------- | --------------- | -------- |
| 0 — Foundation             | ✅ Done         | 100%     |
| 1 — API Client & Stores    | ✅ Done         | 100%     |
| 2 — Layout & UI Components | ✅ Done         | 100%     |
| 3 — Auth Pages             | ✅ Done         | 100%     |
| 4 — Landing & Try          | ✅ Done         | 100%     |
| 5 — Dashboard              | ✅ Done         | 100%     |
| 6 — ERD Workspace          | ✅ Done         | 100%     |
| 7 — Settings               | ✅ Done         | 100%     |
| 8 — Billing & Quota        | ✅ Done         | 100%     |
| 9 — Project Sub-pages      | ✅ Done         | 100%     |
| 10 — Error & Polish        | ✅ Done         | 100%     |
| 11 — Admin Module          | ✅ Done         | 100%     |
