# PRD Generator Frontend Setup Specification

## Overview
A modern, AI-powered Product Requirement Document (PRD) Generator frontend app (`@aikanaja/prd-generator`) built within the `aikanaja` monorepo using Svelte 5 and SvelteKit.

## Technical Stack

### Core Framework & Build
- **Framework**: SvelteKit 2 + Svelte 5 (Runes `$state`, `$derived`, `$effect`)
- **Build Tool**: Vite 8
- **Language**: TypeScript 6
- **Monorepo Package Name**: `@aikanaja/prd-generator`
- **Shared Package**: `@aikanaja/shared` (workspace link)

### UI & Styling
- **CSS Framework**: Tailwind CSS v4 (`@tailwindcss/vite`, `@tailwindcss/typography`, `@tailwindcss/forms`)
- **Component UI**: DaisyUI v5
- **Icons**: Lucide Svelte (`lucide-svelte`)
- **Animations**: Svelte Motion (`@humanspeak/svelte-motion`)

### Markdown & Document Processing
- **Markdown Renderer**: `marked` + `dompurify`
- **PDF Export**: `jspdf` + `html2canvas`
- **AI Streaming**: `@ai-sdk/svelte` / `ai`

## Directory Structure
```
apps/prd-generator/
├── src/
│   ├── app.d.ts
│   ├── app.html
│   ├── app.css
│   ├── lib/
│   │   ├── api/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   ├── features/
│   │   │   │   └── prd/
│   │   ├── stores/
│   │   ├── types/
│   │   └── utils/
│   └── routes/
│       ├── +layout.svelte
│       └── +page.svelte
├── package.json
├── svelte.config.js
├── tsconfig.json
└── vite.config.ts
```

## Setup & Verification Steps
1. Create `apps/prd-generator` directory with configured `package.json`, `svelte.config.js`, `vite.config.ts`, `tsconfig.json`.
2. Install dependencies using `bun install`.
3. Scaffold core SvelteKit entry files (`app.html`, `app.css`, `+layout.svelte`, `+page.svelte`).
4. Run `bun run check` / `bun run build` to verify clean setup.
