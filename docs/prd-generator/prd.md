# Product Requirement Document (PRD) — AiKanAja PRD Generator

## 1. Visi & Workflow Utama
**AiKanAja PRD Generator** adalah platform berbasis AI yang membantu Product Manager, System Architect, dan Developer menyusun Product Requirement Document (PRD) komprehensif melalui alur **AI-Guided PRD Wizard & Live Editor**.

### Workflow Utama:
1. **Interactive AI Wizard**: Pengguna mengisi/menjawab panduan singkat seputar visi produk, target user, dan tech stack.
2. **Auto-Generation & Live Split Editor**: AI menggenerasi dokumen PRD awal dalam format Markdown di samping live preview editor.
3. **AI Copilot In-Editor**: Pengguna dapat berinteraksi dengan AI untuk menambah section, merevisi acceptance criteria, atau memperjelas user stories.
4. **Export & Sharing**: Ekspor PRD ke format Markdown (.md), PDF, JSON spec, atau AI Agent Prompt.

---

## 2. Fitur Pembeda Utama (Killer Differentiating Features)

AiKanAja PRD Generator memiliki 4 fitur pembeda inovatif yang membuatnya jauh lebih unggul dibanding tools PRD tradisional:

### 2.1 AI Virtual Stakeholder Review Simulation (Simulasi Kritik Tim)
- **Multi-Agent Review System**: AI mensimulasikan tanggapan & kritik dari 3 peran profesional sebelum PRD diberikan ke tim nyata:
  - **Tech Lead Persona**: Menganalisis kelayakan teknis, arsitektur, dan mengidentifikasi bottleneck performa.
  - **QA Engineer Persona**: Menemukan *edge cases*, kondisi batas (*boundary conditions*), dan skenario kegagalan yang belum tercover.
  - **Product Sponsor / Business Persona**: Menilai apakah fitur relevan dengan nilai bisnis, ROI, dan KPI.
- Output hasil review disajikan dalam bentuk tab **"Virtual Review & Feedback"** beserta saran perbaikan otomatis.

### 2.2 Visual Flow & Diagram Auto-Generation (Mermaid.js)
- **Visual Diagram Generator**: PRD tidak hanya berisi teks biasa. AI secara otomatis menggenerasi sintaks **Mermaid.js** yang dirender menjadi diagram interaktif langsung di dalam dokumen:
  - *User Flow Diagrams*: Diagram alur langkah pengguna saat berinteraksi dengan fitur.
  - *Sequence Diagrams*: Diagram komunikasi alur data antara Frontend, Backend, dan Database.
  - *System Architecture Diagrams*: Visualisasi komponen infrastruktur dan API third-party.

### 2.3 PRD Quality Score & Ambiguity Audit (Health Check Audit)
- **Automated Health Check (Skor 0-100)**: Audit instan terhadap kualitas & kelengkapan dokumen PRD.
- **Ambiguity Detector**: Algoritma AI yang menandai kata/kalimat samar (misal: *"aplikasi harus cepat"* diubah menjadi rekomendasi spesifik *"P95 response time < 200ms"*).
- **Completeness Inspector**: Memastikan setiap Functional Requirement (FR) memiliki User Story dan Acceptance Criteria format *Given-When-Then* yang valid.

### 2.4 AI Coding Agent Prompt Exporter (`AGENTS.md` / `PROMPT.md`)
- **One-Click Agent Export**: Ekspor dokumen PRD menjadi berkas spesifikasi terstruktur yang siap dibaca oleh AI Coding Agents (seperti Cursor, Claude Code, Antigravity, dll).
- Otomatis membuatkan instruksi koding bertahap (*step-by-step implementation instructions*) berbasis PRD yang dihasilkan.

---

## 3. Fitur Kompleks & Arsitektur Lanjutan (Deep Enterprise Features)

### 3.1 Story Points Estimation & Auto Sprint Planning (Perencanaan Sprint)
- **Fibonacci Story Pointing**: AI menganalisis setiap User Story dan menetapkan estimasi kompleksitas mengikut deret Fibonacci (1, 2, 3, 5, 8, 13) berdasarkan faktor risiko teknis, jumlah dependensi, dan tingkat kerumitan UI/API.
- **Automated Sprint Roadmap Allocation**: AI secara pintar mengelompokkan fitur-fitur ke dalam milestone alokasi sprint:
  - **Sprint 1 (MVP Launch)**: Fitur-fitur berprioritas tinggi dan fondasi inti sistem.
  - **Sprint 2 (Expansion & Enhancements)**: Fitur pelengkap dan integrasi sekunder.
  - **Sprint 3 (Scalability & Advanced Features)**: Optimasi performa dan fitur kompleks tingkat lanjut.

### 3.2 Visual Version Diff & Audit Trail (Version Control Visual untuk PRD)
- **Visual Markdown Diff Engine**: Seperti sistem Version Control (Git), pengguna dapat memilih dan membandingkan dua versi dokumen PRD (misal: PRD v1.0 vs PRD v1.2).
- **Color-Coded Visual Comparison**:
  - *Green Highlight (`+`)*: Menampilkan teks, section, atau User Story baru yang ditambahkan.
  - *Red Strike-Through (`-`)*: Menampilkan teks atau fitur yang dihapus/direvisi.
  - *Blue Badge (`~`)*: Menandai perubahan estimasi story points atau perubahan prioritas fitur.

---

## 4. Struktur Section PRD Dokumen (Full & Dinamis)

AI akan menggenerasi struktur dokumen PRD secara **Lengkap (Full Enterprise)** dan secara adaptif berhak **menambah sub-section spesifik secara bebas** sesuai konteks domain aplikasi:

### Core Sections (Standar Wajib):
1. **Executive Summary & Visi Produk**: Ringkasan proyek, nilai bisnis, dan latar belakang.
2. **Problem Statement, Scope & Goals**: Permasalahan yang diselesaikan, batas lingkup, dan KPI keberhasilan.
3. **User Personas & Target Audience**: Detail profil pengguna, kebutuhan, dan pain points.
4. **Functional Requirements (FR)**: Matriks kebutuhan fungsional (Feature ID, Fitur, Deskripsi, Prioritas).
5. **User Stories, Acceptance Criteria & Story Points**: Format *Given-When-Then* dilengkapi estimasi Story Points (1-13).
6. **Sprint Roadmap & Milestone Allocation**: Alokasi distribusi User Stories ke dalam Sprint 1 (MVP), Sprint 2, dan Sprint 3.
7. **Non-Functional Requirements (NFR)**: Performa, Keamanan (Security), Skalabilitas, & Ketersediaan (Availability).
8. **Mermaid.js Flow & Architecture Diagrams**: Diagram visual User Flow, Sequence, dan Arsitektur.
9. **Virtual Stakeholder Review & Quality Audit**: Hasil audit skor kualitas PRD dan masukan dari Tech Lead/QA/Business.
10. **Risk Analysis & Mitigation**: Risiko teknis/bisnis dan strategi mitigasinya.
11. **Out of Scope / Future Enhancements**: Fitur yang sengaja ditunda ke Phase berikutnya.

---

## 5. Spesifikasi AI Copilot & Live Editor Interaksi

AI Copilot beroperasi di dalam Live Editor dengan 3 mode interaksi kontekstual:

1. **Chat Sidebar Prompt**:
   - Kolom percakapan interaktif di panel kanan.
   - Mendukung instruksi tingkat tinggi (misal: *"Tambahkan bab integrasi Payment Gateway Midtrans"*, *"Ganti tech stack ke Go + Postgres"*).

2. **Inline Section Quick Actions**:
   - Tombol-tombol tindakan cepat AI di samping setiap Heading Section.
   - Opsi: *Refine Acceptance Criteria*, *Recalculate Story Points*, *Expand Section Details*, *Run Virtual Stakeholder Review*.

3. **Selection Highlight AI Menu**:
   - Popover floating menu yang muncul otomatis saat pengguna memblok/highlight kalimat atau paragraf tertentu.
   - Opsi: *Rephrase for Clarity*, *Make More Technical*, *Generate User Story from Selection*, *Translate to English/Indonesian*.

---

## 6. Security, Zero-Persistence & Multi-Provider AI Engine

- **Zero-Persistence Client Security**:
  - Custom API Key milik pengguna (Google Gemini / Groq) **100% hanya tersimpan di `localStorage` browser lokal** pengguna.
  - API Key tidak pernah disimpan di database server AiKanAja.
  - Dikirim secara terenkripsi melalui HTTP Header saat streaming request ke AI provider.
- **Supported AI Providers**:
  - **Google Gemini 2.0**: Menggunakan **Gemini 2.0 Flash** untuk pemrosesan penalaran teks cepat, penyusunan struktur PRD, dan generasi sintaks Mermaid.js.
  - **Groq (Llama / DeepSeek)**: Pemrosesan latensi rendah (ultra-fast streaming) untuk respons copilot & inline action.
- **Fallback & Resilience**:
  - Jika satu provider mengalami rate-limit atau kegagalan API, sistem otomatis melakukan fallback ke provider cadangan.

---

## 7. Model Penyimpanan Data & Manajemen Proyek (Hybrid Storage)

- **Guest Try Mode (`/try`)**:
  - Pengguna tanpa login dapat mencoba menggenerasi & mengedit PRD secara langsung.
  - Hasil draft tersimpan sementara di `localStorage` browser.
  - Tersedia tombol *"Save to Account"* yang memicu alur login/register untuk menyimpan proyek ke cloud.
- **Authenticated Dashboard (`/dashboard`)**:
  - Pengguna yang terautentikasi memiliki akses penuh ke manajemen proyek PRD.
  - Fitur: Simpan otomatis ke database (SQLite + Prisma), riwayat versi (Version History), Visual Version Diff (v1 vs v2), pencarian/filter proyek, hapus/duplikasi, serta opsi buat Share Link publik.
- **Standalone Operation & Optional ERD Link**:
  - PRD Generator berjalan 100% mandiri.
  - Terdapat input field opsional untuk menautkan Project ID/URL ERD Generator.

---

## 8. Multi-Format Export & Sharing
- **Markdown Export**: Download berkas `.md` murni tanpa watermark.
- **PDF Export Engine**: Generate berkas `.pdf` dengan tata letak profesional & diagram Mermaid ter-render.
- **AI Coding Agent Export**: Download berkas `AGENTS.md` / `PROMPT.md` untuk Cursor, Claude Code, & Antigravity.
- **JSON Spec Export**: Download struktur data JSON terintegrasi.
- **Public Share Link**: Opsi membuat tautan read-only publik untuk dibagikan ke stakeholder.

---

## 9. Architecture & Tech Stack Details
- **Frontend Framework**: SvelteKit (Svelte 5 runes `$state`, `$derived`) + Tailwind CSS v4 + DaisyUI v5
- **Diagram Rendering Engine**: Mermaid.js (`mermaid`)
- **Diff Engine**: `diff` / `svelte-diff` (Visual Markdown comparison)
- **Icons & Motion**: Lucide Svelte + Svelte Motion (`@humanspeak/svelte-motion`)
- **Markdown & Security**: Marked + DOMPurify
- **PDF Engine**: jsPDF + html2canvas
- **Backend Runtime & API**: Bun + ElysiaJS
- **Database & ORM**: SQLite + Prisma ORM
- **AI Integration**: Vercel AI SDK (`@ai-sdk/google` dengan model **Gemini 2.0 Flash**, `@ai-sdk/groq`) dengan Custom API Key Header support
