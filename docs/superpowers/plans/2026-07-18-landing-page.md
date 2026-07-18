# Enhanced SchemaFlow Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a highly animated, premium, and benefits-focused landing page for SchemaFlow featuring a floating glassmorphic pill navbar on scroll, before/after comparative panel, database stack orbit visualizer, and FAQ accordion.

**Architecture:** A single high-performance Svelte page (`src/routes/+page.svelte`) utilizing Svelte 5 `$state` and `$derived` runes for mouse parallax, dynamic navbar scrolling thresholds, accordion states, and interactive orbit callbacks. All visual transitions and layout adaptations run via GPU-accelerated CSS and reactive classes for maximum performance.

**Tech Stack:** SvelteKit (Svelte 5 runes), Tailwind CSS v4, DaisyUI, Lucide Svelte.

## Global Constraints

- Primary Background: slate-950 (`#020617`)
- Secondary Background/Cards: slate-900/60 (`rgba(15, 23, 42, 0.6)`) with backdrop-blur
- Primary Accent: emerald-400/emerald-500 (`#34d399` / `#10b981`)
- Font: Inter/Outfit for body, JetBrains Mono/monospace for code blocks
- GPU Acceleration: Use `will-change: transform` on all 3D or animated containers.

---

### Task 1: Custom CSS Transitions & Keyframes Setup

**Files:**
- Modify: `src/routes/layout.css`

**Interfaces:**
- Produces: CSS animations, custom scroll-smooth behavior, database stack orbit animations, and gradient utilities.

- [ ] **Step 1: Write custom styles for orbit, comparison panels, and glowing outlines**
  Completed. Added keyframes and animation classes to layout.css.

- [ ] **Step 2: Run a quick build to verify CSS compiling**
  Completed. Tested and compiled successfully.

- [ ] **Step 3: Commit styling updates**
  Completed. Committed to git.

---

### Task 2: Enhanced Svelte 5 Landing Page Implementation

**Files:**
- Modify: `src/routes/+page.svelte`

**Interfaces:**
- Produces: A highly polished landing page with a dynamic navbar, benefit-driven copywriting, a visual SQL vs SchemaFlow comparison section, a database stack orbit connector, and a smooth FAQ accordion.

- [ ] **Step 1: Write Svelte 5 logic and markup in `+page.svelte`**
  Completed. Clean landing page written with floating navbar, orbit, comparative before/after, and accordions.

- [ ] **Step 2: Run build to verify compiling**
  In progress. Running next.

- [ ] **Step 3: Commit landing page implementation**
  In progress. Running next.
