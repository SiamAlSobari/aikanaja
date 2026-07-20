# PRD Generator Frontend Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create and scaffold the `@aikanaja/prd-generator` frontend app in `apps/prd-generator` using Svelte 5, SvelteKit, Tailwind CSS v4, DaisyUI, Lucide Svelte, marked, jspdf, and AI SDK dependencies.

**Architecture:** A SvelteKit monorepo application linking to `@aikanaja/shared`. It provides Svelte 5 runes-based state management and markdown document previewing.

**Tech Stack:** Svelte 5, SvelteKit 2, Vite 8, Tailwind CSS 4, DaisyUI 5, Lucide Svelte, TypeScript 6, Bun.

## Global Constraints
- Node/Bun environment: `bun@1.3.14`
- Monorepo workspace path: `apps/prd-generator`
- Must link to `@aikanaja/shared` workspace package
- Must pass `bun run check` and `bun run build`

---

### Task 1: Package Scaffolding & Configuration Files

**Files:**
- Create: `apps/prd-generator/package.json`
- Create: `apps/prd-generator/svelte.config.js`
- Create: `apps/prd-generator/vite.config.ts`
- Create: `apps/prd-generator/tsconfig.json`

**Interfaces:**
- Consumes: `@aikanaja/shared` package from monorepo
- Produces: Runnable build environment for SvelteKit 2 + Svelte 5 + Tailwind 4

- [ ] **Step 1: Write `apps/prd-generator/package.json`**

Create package.json with all required dependencies:

```json
{
	"name": "@aikanaja/prd-generator",
	"private": true,
	"version": "0.0.1",
	"type": "module",
	"scripts": {
		"dev": "vite dev",
		"build": "vite build",
		"preview": "vite preview",
		"prepare": "svelte-kit sync || echo ''",
		"check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
		"check:watch": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch",
		"lint": "prettier --check . && eslint .",
		"format": "prettier --write ."
	},
	"devDependencies": {
		"@eslint/js": "^10.0.1",
		"@sveltejs/adapter-auto": "^7.0.1",
		"@sveltejs/kit": "^2.63.0",
		"@sveltejs/vite-plugin-svelte": "^7.1.2",
		"@tailwindcss/forms": "^0.5.11",
		"@tailwindcss/typography": "^0.5.19",
		"@tailwindcss/vite": "^4.3.0",
		"@types/dompurify": "^3.2.0",
		"@types/marked": "^6.0.0",
		"@types/node": "^24",
		"eslint": "^10.4.1",
		"eslint-config-prettier": "^10.1.8",
		"eslint-plugin-svelte": "^3.19.0",
		"globals": "^17.6.0",
		"prettier": "^3.8.3",
		"prettier-plugin-svelte": "^4.1.0",
		"prettier-plugin-tailwindcss": "^0.8.0",
		"svelte": "^5.56.1",
		"svelte-check": "^4.6.0",
		"tailwindcss": "^4.3.0",
		"typescript": "^6.0.3",
		"typescript-eslint": "^8.60.1",
		"vite": "^8.0.16"
	},
	"dependencies": {
		"@ai-sdk/svelte": "^1.2.10",
		"@aikanaja/shared": "workspace:*",
		"@humanspeak/svelte-motion": "^0.7.19",
		"ai": "^4.1.54",
		"daisyui": "^5.6.18",
		"dompurify": "^3.2.4",
		"html2canvas": "^1.4.1",
		"jspdf": "^3.0.0",
		"lucide-svelte": "^1.0.1",
		"marked": "^15.0.7"
	}
}
```

- [ ] **Step 2: Write `apps/prd-generator/svelte.config.js`**

```javascript
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		alias: {
			$lib: './src/lib'
		}
	}
};

export default config;
```

- [ ] **Step 3: Write `apps/prd-generator/vite.config.ts`**

```typescript
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()]
});
```

- [ ] **Step 4: Write `apps/prd-generator/tsconfig.json`**

```json
{
	"extends": "./.svelte-kit/tsconfig.json",
	"compilerOptions": {
		"allowJs": true,
		"checkJs": true,
		"esModuleInterop": true,
		"forceConsistentCasingInFileNames": true,
		"resolveJsonModule": true,
		"skipLibCheck": true,
		"sourceMap": true,
		"strict": true,
		"moduleResolution": "bundler"
	}
}
```

---

### Task 2: Core SvelteKit Entry Files & Styling

**Files:**
- Create: `apps/prd-generator/src/app.html`
- Create: `apps/prd-generator/src/app.d.ts`
- Create: `apps/prd-generator/src/app.css`
- Create: `apps/prd-generator/src/routes/+layout.svelte`
- Create: `apps/prd-generator/src/routes/+page.svelte`

- [ ] **Step 1: Write `apps/prd-generator/src/app.html`**

```html
<!doctype html>
<html lang="en" data-theme="dark">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" href="%sveltekit.assets%/favicon.svg" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<title>AiKanAja PRD Generator</title>
		%sveltekit.head%
	</head>
	<body data-sveltekit-preload-data="hover" class="min-h-screen bg-base-300 text-base-content font-sans antialiased">
		<div style="display: contents">%sveltekit.body%</div>
	</body>
</html>
```

- [ ] **Step 2: Write `apps/prd-generator/src/app.d.ts`**

```typescript
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
```

- [ ] **Step 3: Write `apps/prd-generator/src/app.css`**

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";
@plugin "@tailwindcss/forms";
@plugin "daisyui";
```

- [ ] **Step 4: Write `apps/prd-generator/src/routes/+layout.svelte`**

```svelte
<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
	{@render children()}
</div>
```

- [ ] **Step 5: Write `apps/prd-generator/src/routes/+page.svelte`**

```svelte
<script lang="ts">
	import { FileText, Sparkles, Code, Download } from 'lucide-svelte';

	let prompt = $state('');
	let isGenerating = $state(false);
	let prdContent = $state(`# Product Requirement Document (PRD)

## 1. Executive Summary
Brief overview of the project vision and goals.

## 2. Problem Statement
What specific problem are we solving for the user?

## 3. Target Audience & User Personas
- **Persona A**: Developer / System Architect
- **Persona B**: Product Manager

## 4. Key Features & Functional Requirements
- **FR-1**: AI Prompt Wizard to generate structured PRD.
- **FR-2**: Live Markdown Preview with syntax highlighting.
- **FR-3**: PDF & Markdown export.

## 5. Technical Stack Recommendations
- **Frontend**: SvelteKit + Tailwind CSS v4
- **Backend**: Bun + ElysiaJS
- **Database**: SQLite + Prisma
`);
</script>

<div class="flex-1 flex flex-col">
	<header class="border-b border-slate-800 bg-slate-900/60 backdrop-blur px-6 py-4 flex items-center justify-between">
		<div class="flex items-center gap-3">
			<div class="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
				<FileText class="w-6 h-6" />
			</div>
			<div>
				<h1 class="font-bold text-lg text-slate-100 flex items-center gap-2">
					AiKanAja <span class="px-2 py-0.5 text-xs bg-indigo-500/20 text-indigo-300 rounded-md border border-indigo-500/30">PRD Generator</span>
				</h1>
				<p class="text-xs text-slate-400">AI-Powered Product Specification Workspace</p>
			</div>
		</div>

		<div class="flex items-center gap-3">
			<button class="btn btn-sm btn-outline text-slate-300 hover:text-white border-slate-700 hover:bg-slate-800">
				<Download class="w-4 h-4 mr-1" /> Export PDF
			</button>
			<button class="btn btn-sm bg-indigo-600 hover:bg-indigo-500 text-white border-0">
				<Sparkles class="w-4 h-4 mr-1" /> Generate Spec
			</button>
		</div>
	</header>

	<main class="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800">
		<div class="p-6 flex flex-col gap-4 bg-slate-950">
			<div class="flex items-center justify-between">
				<h2 class="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
					<Sparkles class="w-4 h-4 text-indigo-400" /> Prompt & Requirements
				</h2>
			</div>

			<textarea
				bind:value={prompt}
				placeholder="Describe your product idea (e.g. A real-time collaboration tool for developers with AI code reviews)..."
				class="w-full h-48 p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono text-sm resize-none"
			></textarea>

			<div class="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 flex flex-col gap-2">
				<span class="text-xs font-medium text-slate-400">Selected Libraries & Features:</span>
				<div class="flex flex-wrap gap-2">
					<span class="px-2.5 py-1 rounded-lg text-xs bg-slate-800 text-indigo-300 border border-slate-700">Svelte 5 Runes</span>
					<span class="px-2.5 py-1 rounded-lg text-xs bg-slate-800 text-teal-300 border border-slate-700">Tailwind CSS v4</span>
					<span class="px-2.5 py-1 rounded-lg text-xs bg-slate-800 text-purple-300 border border-slate-700">Marked & DOMPurify</span>
					<span class="px-2.5 py-1 rounded-lg text-xs bg-slate-800 text-amber-300 border border-slate-700">jsPDF & html2canvas</span>
					<span class="px-2.5 py-1 rounded-lg text-xs bg-slate-800 text-blue-300 border border-slate-700">Vercel AI SDK</span>
				</div>
			</div>
		</div>

		<div class="p-6 bg-slate-900/30 overflow-y-auto max-h-[calc(100vh-73px)]">
			<div class="prose prose-invert prose-indigo max-w-none">
				<pre class="bg-slate-900 p-4 rounded-xl text-slate-300 font-mono text-sm whitespace-pre-wrap">{prdContent}</pre>
			</div>
		</div>
	</main>
</div>
```

---

### Task 3: Monorepo Integration & Verification

- [ ] **Step 1: Run `bun install` at monorepo root**

Run: `bun install`
Expected: Dependencies resolved and lockfile updated.

- [ ] **Step 2: Run `bun run check` inside `apps/prd-generator`**

Run: `cd apps/prd-generator && bun run check`
Expected: 0 errors.

- [ ] **Step 3: Run `bun run build` inside `apps/prd-generator`**

Run: `cd apps/prd-generator && bun run build`
Expected: Successful SvelteKit build output.
