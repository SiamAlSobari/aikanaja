# SchemaFlow: Aplikasi Pembuat ERD Otomatis

_Product Requirement Document (PRD)_
_Dibuat: 29/5/2026_
_Diperbarui: 17/7/2026_
_Status: SYNCED_

---

## Ringkasan Eksekutif

SchemaFlow adalah aplikasi web yang memungkinkan pengguna untuk membuat Entity Relationship Diagram (ERD) secara otomatis hanya dengan memberikan deskripsi teks. Aplikasi ini akan memproses deskripsi tersebut, menghasilkan struktur database, dan memvisualisasikannya secara interaktif di kanvas.

**Tujuan Utama:**

- Membantu pengembang dan pengguna non-teknis dalam membuat struktur database yang akurat dan efisien.
- Meningkatkan produktivitas dan mengurangi kesalahan dalam pembuatan struktur database.

**Fitur Utama:**

- **Input AI:** Memungkinkan pengguna untuk memasukkan deskripsi teks dan menghasilkan struktur database yang akurat.
- **Visualisasi Interaktif:** Memvisualisasikan struktur database secara interaktif di kanvas, sehingga pengguna dapat dengan mudah memahami dan mengedit struktur database.
- **Ekspor:** Memungkinkan pengguna untuk mengekspor struktur database ke dalam format SQL atau Prisma Schema.

**Teknologi:**

- **SvelteKit:** Sebagai framework frontend dengan file-based routing dan server-side rendering.
- **Tailwind CSS:** Sebagai utility-first CSS framework untuk styling.
- **@xyflow/svelte (Svelte Flow):** Sebagai library untuk memvisualisasikan struktur database secara interaktif di kanvas.
- **Elysia + Bun:** Sebagai backend API framework dengan runtime yang cepat.
- **Prisma + SQLite:** Sebagai ORM dan database untuk penyimpanan data pengguna dan proyek.
- **JWT Auth:** Autentikasi berbasis cookie (httpOnly) via `@elysia/jwt`.
- **AI API (OpenAI/Gemini):** Untuk memproses deskripsi teks dan menghasilkan struktur database.

**Alur Kerja:**

1. Pengguna memasukkan deskripsi teks untuk membuat struktur database.
2. Aplikasi memproses deskripsi teks dan menghasilkan struktur database.
3. Pengguna dapat memvisualisasikan struktur database secara interaktif di kanvas.
4. Pengguna dapat mengedit struktur database yang dihasilkan.
5. Pengguna dapat mengekspor struktur database ke dalam format SQL atau Prisma Schema.

## Gambaran Umum Produk

### Visi

SchemaFlow bertujuan untuk menjadi aplikasi utama dalam pembuatan ERD secara otomatis, memudahkan pengguna untuk membuat struktur database yang akurat dan efisien.

### Target Audiens

- Pengembang software
- Pengguna non-teknis yang membutuhkan struktur database
- Bisnis yang memerlukan perancangan database cepat

## Cerita Pengguna

- Sebagai pengembang, saya ingin bisa membuat ERD secara otomatis dari deskripsi teks, sehingga saya dapat fokus pada pengembangan aplikasi.
- Sebagai pengguna non-teknis, saya ingin bisa membuat struktur database yang akurat tanpa pengetahuan teknis yang mendalam.
- Sebagai pengembang, saya ingin bisa mengedit hasil generate AI secara manual untuk memastikan akurasi.
- Sebagai pengguna, saya ingin bisa mengekspor struktur database ke format SQL atau Prisma Schema.
- Sebagai pengguna, saya ingin bisa memvisualisasikan struktur database secara interaktif di kanvas.

## Kebutuhan Fungsional

### 1. Fitur Input AI (Natural Language to Schema)

- **Input teks bebas:** Pengguna dapat mengetik deskripsi dalam bahasa Indonesia atau Inggris.
- **Validasi input:** Panjang minimal 5 karakter, peringatan jika input terlalu pendek.
- **Ekstraksi entitas dan atribut:** AI mengidentifikasi entitas (User, Product, Order) dan atribut dari deskripsi.
- **Deteksi relasi:** Sistem mengidentifikasi hubungan one-to-one, one-to-many, many-to-many.
- **Output skema awal:** JSON berisi tabel, kolom, tipe data, dan constraints.
- **Konfirmasi dan koreksi:** Pengguna dapat merevisi hasil generate.

### 2. Fitur Visualisasi dan Interaksi

- **Render otomatis:** Struktur database dirender di kanvas Svelte Flow sebagai node (tabel) dan edge (relasi).
- **Interaksi node:**
  - Klik node untuk membuka panel edit tabel.
  - Drag node untuk mengubah posisi.
  - Double-click kolom untuk edit nama, tipe data, atau constraint.
- **Manajemen edge:**
  - Klik edge untuk melihat detail relasi.
  - Ubah jenis relasi via dropdown.
  - Hapus edge saat dipilih.
- **Operasi massal:**
  - Pilih beberapa node/edge untuk hapus atau duplikasi.
  - Undo dan Redo.
- **Validasi visual:** Sistem mencegah siklus yang tidak diizinkan.

### 3. Fitur Ekspor

- **Pilihan format:**
  1. SQL DDL (MySQL, PostgreSQL, SQLite)
  2. Prisma Schema
- **Pengaturan ekspor:**
  - Target database (untuk SQL).
  - Tambahkan komentar dokumentasi.
  - Sertakan migrasi awal (untuk Prisma).
- **Proses unduh:** File dibuat client-side via Blob dan langsung diunduh.
- **Verifikasi output:** Quick-lint pada hasil SQL/Prisma sebelum unduh.

## Kebutuhan Teknis

### Tech Stack

| Layer              | Teknologi                    | Keterangan                              |
| ------------------ | ---------------------------- | --------------------------------------- |
| Frontend Framework | SvelteKit                    | File-based routing, SSR, load functions |
| Styling            | Tailwind CSS                 | Utility-first CSS                       |
| UI Components      | DaisyUI                      | Tailwind plugin, pre-built components   |
| ERD Visualization  | @xyflow/svelte               | Svelte Flow untuk kanvas interaktif     |
| Backend API        | Elysia                       | HTTP framework di atas Bun              |
| Runtime            | Bun                          | JavaScript/TypeScript runtime           |
| ORM                | Prisma 7                     | Multi-file schema, auto-merge           |
| Database           | SQLite                       | Ringan, file-based                      |
| Auth               | JWT via @elysia/jwt          | httpOnly cookie, Google OAuth only      |
| AI SDK             | Vercel AI SDK (`ai`)         | Unified AI API, streaming (SSE)         |
| AI Providers       | @ai-sdk/groq, @ai-sdk/google | Groq + Gemini, multiple keys rotation   |

### Arsitektur

```
┌─────────────────────────────────────┐
│           Frontend (SvelteKit)       │
│  ┌─────────┐  ┌──────────────────┐  │
│  │  Pages   │  │  Svelte Flow     │  │
│  │  (UI)    │  │  (Kanvas ERD)    │  │
│  └────┬─────┘  └──────────────────┘  │
│       │ fetch/load                    │
└───────┼───────────────────────────────┘
        │ HTTP
┌───────┼───────────────────────────────┐
│       ▼                               │
│  Backend (Elysia + Bun)               │
│  ┌─────────┐  ┌──────────────────┐   │
│  │ Modules  │  │  AI Service      │   │
│  │ /erd     │  │  (OpenAI/Gemini) │   │
│  │ /prd     │  └──────────────────┘   │
│  │ /auth    │                         │
│  └────┬─────┘                         │
│       │ Prisma                        │
│       ▼                               │
│  ┌─────────┐                          │
│  │ SQLite   │                          │
│  └─────────┘                          │
└───────────────────────────────────────┘
```

### Struktur Lengkap Frontend

#### File Tree

```
src/
├── app.html                              # HTML template
├── app.d.ts                              # TypeScript declarations
├── lib/
│   ├── types/                            # TypeScript types & interfaces
│   │   ├── erd.ts                        # ErdTable, ErdColumn, ErdRelation, ErdSchema
│   │   ├── user.ts                       # User, AuthState
│   │   └── api.ts                        # ApiResponse<T>, PaginatedResponse<T>
│   ├── api/                              # API client layer
│   │   ├── client.ts                     # Base fetch wrapper (interceptor, error handling, auth header)
│   │   ├── erd.ts                        # erdApi.getProjects(), .getProject(id), .create(), .update(), .delete(), .generate()
│   │   └── auth.ts                       # authApi.loginGoogle(), .getSession(), .logout()
│   ├── stores/                           # Global state (Svelte 5 runes)
│   │   ├── auth.store.ts                 # user state, isAuthenticated, login/logout actions
│   │   ├── project.store.ts              # currentProject, projects list, CRUD actions
│   │   ├── flow.store.ts                 # nodes, edges, selectedNode, selectedEdge, undo/redo history
│   │   └── ui.store.ts                   # sidebarOpen, theme, modal state, notifications
│   ├── utils/                            # Pure utility functions
│   │   ├── export.ts                     # toSqlDdl(schema, target), toPrismaSchema(schema)
│   │   ├── validation.ts                 # validatePrompt(), validateTableName(), validateColumnName()
│   │   ├── schema-transform.ts           # jsonToFlowNodes(schema), flowNodesToSchema(nodes, edges)
│   │   └── constants.ts                  # Column types, relation types, DB targets
│   └── components/
│       ├── ui/                           # Base UI components (reusable, no business logic)
│       │   ├── Button.svelte             # Variants: primary, secondary, ghost, danger
│       │   ├── Input.svelte              # Text input with label, error, icon slots
│       │   ├── Textarea.svelte           # Auto-resize textarea
│       │   ├── Select.svelte             # Custom select dropdown
│       │   ├── Modal.svelte              # Dialog modal with backdrop, close button
│       │   ├── Card.svelte               # Container with hover/active states
│       │   ├── Badge.svelte              # Status badges (draft, published, etc)
│       │   ├── Tooltip.svelte            # Hover tooltip
│       │   ├── Toast.svelte              # Notification toast (success, error, info)
│       │   ├── Spinner.svelte            # Loading spinner
│       │   ├── Dropdown.svelte           # Dropdown menu
│       │   └── Tabs.svelte               # Tab navigation
│       ├── layout/                       # Layout components
│       │   ├── Navbar.svelte             # Top navigation (logo, nav links, auth buttons, user menu)
│       │   ├── Sidebar.svelte            # Collapsible sidebar wrapper
│       │   ├── Footer.svelte             # Footer with links
│       │   ├── DashboardLayout.svelte    # Sidebar + content area for dashboard
│       │   └── WorkspaceLayout.svelte    # Full-screen layout for ERD editor (no navbar/footer)
│       ├── flow/                         # Svelte Flow custom components
│       │   ├── ERDCanvas.svelte          # Main canvas wrapper (nodes, edges, controls, minimap, background)
│       │   ├── TableNode.svelte          # Custom node: table with columns, PK/FK indicators
│       │   ├── RelationEdge.svelte       # Custom edge: cardinality labels (1:N, N:M)
│       │   ├── CanvasControls.svelte     # Zoom, fit view, lock toggle
│       │   └── MiniMap.svelte            # Minimap overlay
│       └── features/                     # Feature-specific composite components
│           ├── ai/
│           │   ├── AIChatPanel.svelte    # Sidebar panel: chat input, message history, generate button
│           │   ├── AIMessage.svelte      # Single message bubble (user/AI)
│           │   └── PromptSuggestions.svelte # Pre-built prompt templates
│           ├── editor/
│           │   ├── TableDetailPanel.svelte  # Right panel: edit selected table (name, columns, constraints)
│           │   ├── ColumnEditor.svelte      # Edit single column (name, type, PK, nullable, unique, default, FK)
│           │   ├── RelationEditor.svelte    # Edit relation type, source/target columns
│           │   └── SchemaToolbar.svelte     # Top toolbar: undo, redo, auto-layout, zoom controls, export button
│           ├── export/
│           │   ├── ExportModal.svelte    # Modal: choose format (SQL/Prisma), target DB, options
│           │   └── ExportPreview.svelte  # Code preview of export output with syntax highlight
│           ├── project/
│           │   ├── ProjectCard.svelte    # Card: project name, description, last edited, preview thumbnail
│           │   ├── ProjectGrid.svelte    # Grid layout for project cards
│           │   ├── NewProjectModal.svelte # Modal: project name, description, optional AI prompt
│           │   └── ProjectSearchBar.svelte # Search + filter projects
│           └── auth/
│               ├── GoogleLoginButton.svelte # Tombol "Login with Google"
│               └── AuthGuard.svelte      # Protected route wrapper
│
├── routes/
│   ├── +layout.svelte                    # Root layout: Navbar, theme provider, Toast container
│   ├── +layout.server.ts                 # Root server load: get session user (if any)
│   ├── +page.svelte                      # Landing page
│   ├── +error.svelte                     # Global error page
│   │
│   ├── try/
│   │   ├── +page.svelte                  # Guest workspace (simplified editor)
│   │   └── +page.server.ts              # Rate limit check (1x generate per session)
│   │
│   ├── auth/
│   │   ├── +layout.svelte                # Auth layout (centered card, no navbar)
│   │   ├── login/
│   │   │   ├── +page.svelte             # Login page (Google button only)
│   │   │   └── +page.server.ts          # Redirect ke Google OAuth
│   │   └── callback/
│   │       └── +page.server.ts          # Handle OAuth callback, set JWT cookie, redirect to dashboard
│   │
│   ├── dashboard/
│   │   ├── +layout.svelte                # Dashboard layout (sidebar + content)
│   │   ├── +layout.server.ts             # Auth guard
│   │   ├── +page.svelte                  # Overview: stats, recent projects, quick actions
│   │   ├── +page.server.ts              # Load stats
│   │   │
│   │   ├── projects/
│   │   │   ├── +page.svelte              # Semua project (grid/list view, sort, filter, pagination)
│   │   │   ├── +page.server.ts          # Load projects + pagination
│   │   │   └── shared/
│   │   │       ├── +page.svelte          # Project yang di-share ke user
│   │   │       └── +page.server.ts       # Load shared projects
│   │   │
│   │   ├── templates/
│   │   │   ├── +page.svelte              # Gallery template siap pakai
│   │   │   ├── +page.server.ts          # Load templates
│   │   │   └── [templateId]/
│   │   │       ├── +page.svelte          # Preview template + tombol "Use Template"
│   │   │       └── +page.server.ts       # Load template detail
│   │   │
│   │   ├── activity/
│   │   │   ├── +page.svelte              # Riwayat aktivitas user
│   │   │   └── +page.server.ts           # Load activity log
│   │   │
│   │   └── trash/
│   │       ├── +page.svelte              # Project yang dihapus (soft delete, bisa restore)
│   │       └── +page.server.ts           # Load deleted projects
│   │
│   ├── project/
│   │   └── [projectId]/
│   │       ├── +layout.svelte            # Workspace layout (full-screen)
│   │       ├── +layout.server.ts         # Auth guard + load project
│   │       ├── +page.svelte              # ERD Editor (workspace utama)
│   │       ├── +page.server.ts           # Load schema
│   │       │
│   │       ├── settings/
│   │       │   ├── +page.svelte          # Project settings (nama, deskripsi, visibility)
│   │       │   └── +page.server.ts       # Update settings
│   │       │
│   │       ├── share/
│   │       │   ├── +page.svelte          # Share/collaborate (invite email, generate link)
│   │       │   ├── +page.server.ts       # Manage collaborators
│   │       │   └── [shareLink]/
│   │       │       └── +page.svelte      # Public view (read-only, tanpa login)
│   │       │
│   │       ├── history/
│   │       │   ├── +page.svelte          # Version history (list versi)
│   │       │   ├── +page.server.ts       # Load versions
│   │       │   └── [versionId]/
│   │       │       └── +page.svelte      # Preview + restore versi tertentu
│   │       │
│   │       └── export/
│   │           └── +page.svelte          # Full page export (bukan modal)
│   │
│   ├── settings/
│   │   ├── +layout.svelte                # Settings layout (sidebar tabs)
│   │   ├── +layout.server.ts             # Auth guard
│   │   ├── +page.svelte                  # Redirect ke /settings/profile
│   │   │
│   │   ├── profile/
│   │   │   ├── +page.svelte              # Edit nama, avatar, bio
│   │   │   └── +page.server.ts           # Update profile
│   │   │
│   │   ├── account/
│   │   │   ├── +page.svelte              # Email (read-only, dari Google), hapus akun
│   │   │   └── +page.server.ts           # Delete account
│   │   │
│   │   ├── api-keys/
│   │   │   ├── +page.svelte              # Manage custom API keys (OpenAI/Gemini)
│   │   │   └── +page.server.ts           # CRUD API keys
│   │   │
│   │   ├── appearance/
│   │   │   ├── +page.svelte              # Theme (light/dark/system), font size
│   │   │   └── +page.server.ts           # Save preferences
│   │   │
│   │   ├── notifications/
│   │   │   ├── +page.svelte              # Notification preferences
│   │   │   └── +page.server.ts           # Update prefs
│   │   │
│   │   └── billing/
│   │       ├── +page.svelte              # Billing overview (plan, usage, next billing)
│   │       ├── +page.server.ts           # Load billing info
│   │       ├── upgrade/
│   │       │   ├── +page.svelte          # Pilih plan (Free/Pro/Team)
│   │       │   └── +page.server.ts       # Process upgrade
│   │       ├── payment/
│   │       │   ├── +page.svelte          # Payment history
│   │       │   └── +page.server.ts       # Load invoices
│   │       └── cancel/
│   │           ├── +page.svelte          # Cancel subscription
│   │           └── +page.server.ts       # Process cancellation
│   │
│   └── admin/                            # Opsional (fase 2)
│       ├── +layout.svelte                # Admin layout
│       ├── +layout.server.ts             # Admin guard (role = admin)
│       ├── +page.svelte                  # Admin dashboard (stats)
│       ├── users/
│       │   ├── +page.svelte              # Manage users (list, search, ban)
│       │   └── [userId]/
│       │       └── +page.svelte          # User detail + edit plan
│       ├── projects/
│       │   └── +page.svelte              # Manage all projects
│       └── billing/
│           └── +page.svelte              # Manage subscriptions + verify payments
│
├── api/                                  # SvelteKit API routes (proxy ke backend)
│   ├── auth/[...all]/+server.ts          # Proxy ke backend /auth/*
│   ├── generate/+server.ts               # Proxy ke backend /erd/generate
│   └── webhook/
│       └── stripe/+server.ts             # Stripe webhook (future)
```

#### Deskripsi Per-Halaman

**1. Landing Page (`/`)**

- Hero section dengan tagline dan CTA
- Fitur utama (3-4 card)
- Demo GIF/screenshot
- Testimonial (opsional)
- Footer

**2. Guest Workspace (`/try`)**

- Simplified ERD editor
- AI input → generate → visualisasi
- Batasan: 1x generate, tidak bisa save
- CTA login setelah generate

**3. Login (`/auth/login`)**

- Hanya tombol "Login with Google"
- Tidak ada form email/password
- Redirect ke Google OAuth → callback → set JWT → redirect ke dashboard

**4. OAuth Callback (`/auth/callback`)**

- Handle callback dari Google
- Create/update user di database
- Set JWT cookie
- Redirect ke dashboard

**5. Dashboard Overview (`/dashboard`)**

- Stats: jumlah project, generate count bulan ini, quota tersisa
- Recent projects (5 terakhir)
- Quick actions: "Buat ERD Baru", "Browse Templates"
- Activity feed

**6. Dashboard Projects (`/dashboard/projects`)**

- Grid/list view toggle
- Sort: nama, terbaru, terlama
- Filter: semua, milik sendiri, shared
- Search
- Pagination
- Empty state untuk user baru

**7. Dashboard Shared Projects (`/dashboard/projects/shared`)**

- Project yang di-share oleh user lain ke user ini
- Indicator: siapa yang share, role (view/edit)

**8. Dashboard Templates (`/dashboard/templates`)**

- Gallery template siap pakai
- Kategori: E-commerce, Blog, Social Media, Inventory, dll
- Preview thumbnail
- "Use Template" → buat project baru dari template

**9. Dashboard Template Detail (`/dashboard/templates/[templateId]`)**

- Preview ERD template
- Deskripsi dan use case
- Tombol "Use Template" → redirect ke workspace dengan schema pre-filled

**10. Dashboard Activity (`/dashboard/activity`)**

- Log aktivitas: create project, generate schema, export, share
- Timestamp dan detail

**11. Dashboard Trash (`/dashboard/trash`)**

- Soft-deleted projects
- Bisa restore atau permanent delete
- Auto-purge setelah 30 hari

**12. ERD Workspace (`/project/[projectId]`)**

- **Layout 3 kolom:**
  - Kiri: AI Chat Panel (collapsible)
  - Tengah: Svelte Flow Canvas (full width)
  - Kanan: Table Detail Panel (collapsible, muncul saat node dipilih)
- **Toolbar atas:** undo, redo, auto-layout, zoom, export
- **Interaksi:**
  - Drag node untuk posisi
  - Klik node → buka detail panel
  - Klik edge → edit relasi
  - Double-click kolom → edit inline
- **Auto-save** setiap perubahan

**13. Project Settings (`/project/[projectId]/settings`)**

- Edit nama project
- Edit deskripsi
- Visibility (private/public)
- Danger zone: delete project

**14. Project Share (`/project/[projectId]/share`)**

- Invite by email (view-only atau edit)
- Generate public share link (read-only)
- Manage collaborators (list, remove, change role)

**15. Project Share View (`/project/[projectId]/share/[shareLink]`)**

- Read-only view tanpa login
- Canvas tapi tidak bisa edit
- Tombol "Login to Fork" atau "Login to Edit"

**16. Project History (`/project/[projectId]/history`)**

- List versi (auto-save snapshots)
- Timestamp, description (auto-generated)
- Preview per versi

**17. Project Version Preview (`/project/[projectId]/history/[versionId]`)**

- Preview ERD pada versi tertentu
- Diff view: perubahan dari versi sebelumnya
- Tombol "Restore This Version"

**18. Project Export (`/project/[projectId]/export`)**

- Full page (bukan modal)
- Pilih format: SQL DDL atau Prisma Schema
- Pilih target DB (MySQL, PostgreSQL, SQLite) untuk SQL
- Options: komentar dokumentasi, migrasi awal
- Code preview dengan syntax highlighting
- Download button

**19. Settings Profile (`/settings/profile`)**

- Edit nama
- Upload avatar
- Edit bio
- Email (read-only, dari Google)

**20. Settings Account (`/settings/account`)**

- Email (read-only, dari Google Connected)
- Hapus akun (konfirmasi, permanent)

**21. Settings API Keys (`/settings/api-keys`)**

- List API keys (masked: `sk-...abc`) — **disimpan di localStorage, bukan DB**
- Provider: Groq, Gemini
- Tambah key baru (input + test connection)
- Hapus key
- Set default key
- Info: "Pakai API key sendiri = unlimited generate, tidak kena quota"
- **Security:** Key disimpan di localStorage browser, tidak dikirim ke server kecuali saat generate request

**22. Settings Appearance (`/settings/appearance`)**

- Theme: light, dark, system
- Font size: small, medium, large
- Canvas background preference

**23. Settings Notifications (`/settings/notifications`)**

- Email notifications toggle
- Project shared notification
- Quota warning notification
- Billing notification

**24. Settings Billing (`/settings/billing`)**

- Current plan (Free/Pro/Team)
- Usage stats: generate count, project count, quota remaining
- Next billing date
- Upgrade button

**25. Settings Billing Upgrade (`/settings/billing/upgrade`)**

- Pricing cards: Free, Pro ($9/bulan), Team ($29/bulan)
- Feature comparison table
- Payment method: Dana transfer
- Instruksi pembayaran:
  1. Transfer ke Dana: [nomor]
  2. Screenshot bukti transfer
  3. Chat WA: 08826545202 dengan bukti + email akun
  4. Tunggu verifikasi (max 1x24 jam)
- Tombol "Chat WA" → wa.me/628826545202

**26. Settings Billing Payment (`/settings/billing/payment`)**

- Riwayat pembayaran
- Status: pending, verified, rejected
- Invoice details

**27. Settings Billing Cancel (`/settings/billing/cancel`)**

- Alasan cancel (survey dropdown)
- Konfirmasi cancel
- Info: tetap akses sampai akhir periode billing

#### Data Flow

```
User Input (prompt)
    ↓
AIChatPanel → POST /erd/generate
    ↓
Backend → AI API → ErdSchema JSON
    ↓
Frontend receive schema
    ↓
schema-transform.ts → jsonToFlowNodes()
    ↓
flow.store → update nodes + edges
    ↓
ERDCanvas re-render
    ↓
User edit (drag, click, modify)
    ↓
flow.store → update state (with undo history)
    ↓
Auto-save → PATCH /erd/:id
    ↓
Export → export.ts → toSqlDdl() / toPrismaSchema()
    ↓
Download file (Blob → <a download>)
```

#### Component Hierarchy (ERD Workspace)

```
+layout.svelte (WorkspaceLayout)
└── +page.svelte
    ├── SchemaToolbar
    │   ├── UndoButton
    │   ├── RedoButton
    │   ├── AutoLayoutButton
    │   ├── ZoomControls
    │   └── ExportButton → ExportModal
    │       ├── FormatSelect (SQL/Prisma)
    │       ├── TargetDBSelect (MySQL/PG/SQLite)
    │       └── ExportPreview
    ├── AIChatPanel (left sidebar)
    │   ├── PromptSuggestions
    │   ├── AIMessage[] (history)
    │   └── ChatInput + GenerateButton
    ├── ERDCanvas (center)
    │   ├── TableNode[] (custom nodes)
    │   │   ├── TableName
    │   │   ├── Column[] (name, type, PK/FK icon)
    │   │   └── AddColumnButton
    │   ├── RelationEdge[] (custom edges)
    │   │   └── CardinalityLabel (1:N, N:M)
    │   ├── CanvasControls
    │   └── MiniMap
    └── TableDetailPanel (right sidebar)
        ├── TableNameInput
        ├── ColumnEditor[]
        │   ├── NameInput
        │   ├── TypeSelect
        │   ├── PKToggle
        │   ├── NullableToggle
        │   ├── UniqueToggle
        │   ├── DefaultValueInput
        │   └── ForeignKeySelect
        ├── AddColumnButton
        └── DeleteTableButton
```

### Struktur API Backend (Elysia)

```
src/modules/
├── shared/
│   ├── auth/
│   │   ├── auth.controller.ts    # GET /auth/google, GET /auth/callback, POST /auth/logout
│   │   ├── auth.service.ts       # Business logic: Google OAuth verify, create/update user, JWT sign
│   │   └── auth.validation.ts    # Validation schemas
│   └── session/
│       └── session.controller.ts # GET /session (protected)
│
└── project/
    └── erd-generator/
        ├── index.ts              # Mount all erd controllers
        └── controllers/
            ├── project.controller.ts   # CRUD /erd/projects, /erd/projects/:id, trash, restore
            ├── schema.controller.ts    # POST /erd/generate (AI), PATCH /erd/:id/schema
            ├── share.controller.ts     # /erd/projects/:id/share (invite, link, manage)
            ├── history.controller.ts   # /erd/projects/:id/history (list, preview, restore)
            ├── template.controller.ts  # /erd/templates (list, detail, use)
            └── export.controller.ts    # POST /erd/export (SQL/Prisma)
```

**Endpoints Detail:**

| Method | Path                                           | Auth | Request                          | Response                      | Keterangan                                   |
| ------ | ---------------------------------------------- | ---- | -------------------------------- | ----------------------------- | -------------------------------------------- |
| GET    | `/auth/google`                                 | No   | -                                | redirect                      | Redirect ke Google OAuth                     |
| GET    | `/auth/callback`                               | No   | `?code`                          | redirect                      | Handle callback, set JWT cookie              |
| POST   | `/auth/logout`                                 | Yes  | -                                | `{message}`                   | Clear cookie                                 |
| GET    | `/session`                                     | Yes  | -                                | `{user}`                      | Get current user                             |
| GET    | `/erd/projects`                                | Yes  | -                                | `{projects[]}`                | List semua project user                      |
| GET    | `/erd/projects/:id`                            | Yes  | -                                | `{project}`                   | Detail project + schema                      |
| POST   | `/erd/projects`                                | Yes  | `{name, description?}`           | `{project}`                   | Buat project baru                            |
| PATCH  | `/erd/projects/:id`                            | Yes  | `{name?, description?, schema?}` | `{project}`                   | Update project                               |
| DELETE | `/erd/projects/:id`                            | Yes  | -                                | `{message}`                   | Soft delete (pindah ke trash)                |
| POST   | `/erd/projects/:id/restore`                    | Yes  | -                                | `{project}`                   | Restore dari trash                           |
| DELETE | `/erd/projects/:id/permanent`                  | Yes  | -                                | `{message}`                   | Permanent delete (admin/hanya milik sendiri) |
| POST   | `/erd/generate`                                | Yes* | `{prompt, apiKey?}`              | `{schema}`                    | Generate ERD dari AI                         |
| POST   | `/erd/export`                                  | No   | `{schema, format, target}`       | `{file}`                      | Export SQL/Prisma                            |
| POST   | `/erd/projects/:id/share`                      | Yes  | `{email, role}`                  | `{collaborator}`              | Invite collaborator                          |
| DELETE | `/erd/projects/:id/share/:userId`              | Yes  | -                                | `{message}`                   | Remove collaborator                          |
| PATCH  | `/erd/projects/:id/share/:userId`              | Yes  | `{role}`                         | `{collaborator}`              | Change collaborator role                     |
| POST   | `/erd/projects/:id/share/link`                 | Yes  | `{expiresIn?}`                   | `{shareLink}`                 | Generate public share link                   |
| GET    | `/erd/projects/:id/history`                    | Yes  | -                                | `{versions[]}`                | List version history                         |
| GET    | `/erd/projects/:id/history/:versionId`         | Yes  | -                                | `{version}`                   | Detail versi                                 |
| POST   | `/erd/projects/:id/history/:versionId/restore` | Yes  | -                                | `{project}`                   | Restore versi                                |
| GET    | `/erd/templates`                               | No   | -                                | `{templates[]}`               | List templates                               |
| GET    | `/erd/templates/:id`                           | No   | -                                | `{template}`                  | Detail template                              |
| POST   | `/erd/templates/:id/use`                       | Yes  | `{name?}`                        | `{project}`                   | Buat project dari template                   |
| GET    | `/erd/usage`                                   | Yes  | -                                | `{count, limit, remaining}`   | Cek quota usage                              |
| GET    | `/erd/billing`                                 | Yes  | -                                | `{plan, status, nextBilling}` | Billing info                                 |
| POST   | `/erd/billing/upgrade`                         | Yes  | `{plan}`                         | `{paymentInfo}`               | Request upgrade                              |

*Guest: 1x generate via cookie tracking, User: quota sesuai plan

### AI API Key Infrastructure

1. **Server Key (Default):** API key disimpan di environment variable backend (`GROQ_AI_API_KEY1-4`, `GEMINI_API_KEY1-3`). Digunakan sebagai fallback.
2. **User Key (Opsional):** Pengguna dapat memasang API key sendiri di Settings → API Keys. **Disimpan di localStorage browser, bukan di database.** Key dikirim ke backend hanya saat generate request.
3. **Endpoint:** `POST /erd/generate` — menerima `{ prompt, apiKey?, provider? }`, mengembalikan schema JSON (streaming).
4. **Quota Logic:**
   - Request dengan `apiKey` → **unlimited generate**, tidak kena quota server
   - Request tanpa `apiKey` → pakai server key, kena quota sesuai plan
   - Guest → 1x generate via cookie

### Billing & Quota System

**Plan Tiers:**

| Plan | Harga      | Generate/bulan | Projects  | Features                                                             |
| ---- | ---------- | -------------- | --------- | -------------------------------------------------------------------- |
| Free | Gratis     | 10x            | 5         | Export SQL & Prisma, community templates                             |
| Pro  | Rp X/bulan | Unlimited      | Unlimited | Custom API key, version history, share (3 user), all templates       |
| Team | Rp X/bulan | Unlimited      | Unlimited | Semua Pro + unlimited collaborators, team workspace, admin dashboard |

**Quota Logic:**

```
User generate request
├── Cek: user punya custom API key?
│   ├── Ya → pakai key user, skip quota check, unlimited
│   └── Tidak → cek quota server
│       ├── Cek plan user (Free/Pro/Team)
│       ├── Cek usage bulan ini
│       ├── Quota tersisa? → proses generate, increment usage
│       └── Quota habis? → return error "Upgrade plan atau pakai API key sendiri"
```

**Quota Tracking:**

- Tabel `Usage` di database: `userId`, `month`, `count`, `limit`
- Reset: per bulan (tanggal 1)
- Increment: setiap generate sukses

**Payment Method (MVP):**

- Dana transfer + WhatsApp verification
- Flow:
  1. User klik "Upgrade ke Pro/Team"
  2. Tampilkan halaman dengan:
     - Nomor Dana: [nomor admin]
     - Instruksi transfer
     - Tombol "Chat WA" → wa.me/628826545202
  3. User transfer ke Dana
  4. User chat WA dengan bukti transfer + email akun
  5. Admin verifikasi manual (max 1x24 jam)
  6. Admin update plan user di database
  7. User dapat akses fitur plan

**Admin Verification Flow:**

```
User chat WA dengan bukti transfer
    ↓
Admin cek bukti transfer
    ↓
Admin buat payment record di database (status: pending → verified)
    ↓
Admin update user plan (Free → Pro/Team)
    ↓
User dapat notifikasi (email/WA) bahwa plan sudah aktif
```

### State Management (Frontend)

SvelteKit menggunakan Svelte 5 runes + load functions:

**Server-side (load functions):**

```typescript
// +page.server.ts
export const load = async ({ fetch, params }) => {
	const project = await erdApi.getProject(params.projectId);
	return { project };
};
```

**Client-side (Svelte 5 runes):**

```typescript
// stores/flow.store.ts
let nodes = $state.raw<Node[]>([]);
let edges = $state.raw<Edge[]>([]);
let selectedNodeId = $state<string | null>(null);
let undoStack = $state<FlowSnapshot[]>([]);
let redoStack = $state<FlowSnapshot[]>([]);

// Derived
let selectedNode = $derived(nodes.find((n) => n.id === selectedNodeId));
let canUndo = $derived(undoStack.length > 0);
let canRedo = $derived(redoStack.length > 0);
```

**Data fetching pattern:**

- `+page.server.ts` → load data dari backend, return sebagai props
- `+page.svelte` → terima data via `let { data } = $props()`
- Mutation via form actions atau direct API call di event handler
- Svelte Flow state pakai `$state.raw` (bukan deep reactive) untuk performa

## Pedoman UX/UI

### Alur Kerja

**Guest Flow:**

```
Landing Page → Click "Coba Gratis" → Try Workspace → Input prompt → Generate ERD → Visualisasi → Export → CTA Login
```

**User Flow:**

```
Login → Dashboard → Click "Buat ERD Baru" → Modal: nama + prompt → Workspace → Edit → Auto-save → Export
```

**Returning User Flow:**

```
Login → Dashboard → Click project card → Workspace (load existing schema) → Edit → Export
```

### Desain Antarmuka

**Theme System:**

- Light mode (default)
- Dark mode
- System preference detection
- Toggle di navbar

**Layout Patterns:**

- **Landing:** Full-width hero, centered content
- **Dashboard:** Sidebar + main content grid
- **Workspace:** Full-screen, 3-column (AI sidebar | Canvas | Detail sidebar)
- **Auth:** Centered card with minimal chrome

**Typography:**

- Headings: Inter or system font
- Code/Schema: JetBrains Mono or Fira Code

**Responsive Breakpoints:**

- Mobile: < 768px (simplified, no workspace)
- Tablet: 768px - 1024px (collapsible sidebars)
- Desktop: > 1024px (full workspace)

**Workspace UX Details:**

- Sidebar default: collapsed (maximize canvas)
- AI Chat: slide-in dari kiri
- Detail Panel: slide-in dari kanan saat node dipilih
- Canvas: zoom via scroll, pan via drag background
- MiniMap: bottom-right corner
- Toolbar: top-center, floating
- Auto-save indicator: subtle "Saved" / "Saving..." di toolbar

## Multi-Project Backend

Backend ini dirancang sebagai **multi-project monolith**:

- Satu backend (Elysia) melayani banyak project
- Setiap project punya module di `src/modules/project/`
- Setiap project punya schema Prisma di `prisma/projects/`
- Schema digabung otomatis oleh Prisma multi-file

Project yang sudah ada:

- **ERD Generator** (`/erd`) — SchemaFlow
- **PRD Generator** (`/prd`) — PRD generation tool
