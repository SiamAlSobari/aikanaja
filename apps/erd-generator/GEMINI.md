## Project Configuration

- **Language**: TypeScript
- **Framework**: SvelteKit (Svelte 5 runes)
- **Styling**: Tailwind CSS + DaisyUI
- **ERD**: @xyflow/svelte
- **Package Manager**: bun

## Commands

Prefix `rtk` untuk hemat token.

| Command             | Fungsi           |
| ------------------- | ---------------- |
| `rtk bun run dev`   | Dev server       |
| `rtk bun run build` | Build production |
| `rtk bun run check` | Type check       |
| `rtk bun run lint`  | Lint check       |

## Structure

```
src/lib/
├── api/              # Fetch wrapper, typed
├── stores/           # Svelte 5 $state, $derived
├── types/            # TypeScript types
├── utils/            # Pure functions
└── components/
    ├── ui/           # Base (Button, Input, Modal)
    ├── layout/       # Navbar, Sidebar, Footer
    ├── flow/         # Svelte Flow (ERDCanvas, TableNode)
    └── features/     # AIChat, ExportModal, ProjectCard
```

## Rules: DRY, KISS, YAGNI

**DRY** — Jangan copy-paste. Extract ke component/utils/store jika 2+ kali pakai. API client di `$lib/api/`, types di `$lib/types/`.

**KISS** — Simple. Component max 100-150 baris. Satu component = satu tanggung jawab. Nama jelas.

**YAGNI** — Implementasi HANYA untuk kebutuhan saat ini. Jangan bikin reusable component sebelum dipakai 2+ kali. Hapus dead code.

### Data Fetching

- `+page.server.ts` → load function → return data
- `+page.svelte` → `let { data } = $props()`
- Mutation via form action atau API call di event handler
- ❌ DILARANG fetch di component (kecuali SSE/real-time)

### Svelte Flow

- `$state.raw` untuk nodes/edges (bukan deep reactive)
- Custom node/edge di `src/lib/components/flow/`
- Undo/redo via snapshot stack

### Error Handling

- Try-catch di setiap async operation
- Loading state untuk UX
- `console.error` dengan context: `[ComponentName.method]`

### Naming

| Item           | Format               | Contoh               |
| -------------- | -------------------- | -------------------- |
| Component file | `PascalCase.svelte`  | `ProjectCard.svelte` |
| Other file     | `kebab-case.ts`      | `project.service.ts` |
| Component      | `PascalCase`         | `<ProjectCard />`    |
| Function       | `camelCase`          | `getProjects`        |
| Variable       | `camelCase`          | `isLoading`          |
| Store          | `camelCase.store.ts` | `auth.store.ts`      |
| Type           | `PascalCase`         | `ErdProject`         |

### Styling

- Tailwind CSS + DaisyUI components
- Responsive: `sm:`, `md:`, `lg:`
- Dark mode: `dark:` prefix

---

## Svelte MCP Tools

1. **list-sections** — Discover documentation sections. Use FIRST.
2. **get-documentation** — Fetch content for specific sections.
3. **svelte-autofixer** — Analyze Svelte code for issues. Use before sending code.
4. **playground-link** — Generate Svelte Playground link. Ask user confirmation first.
