# Design Spec: AiKanAja Landing Page (Enhanced Version)

**Date**: 2026-07-18  
**Status**: APPROVED  

---

## 1. Overview & Objectives
Update the AiKanAja landing page to make it highly interactive, visually "alive", and densely informative. The layout will transition from a developer-focused jargon page to a highly polished, benefits-focused, soft-dark landing page.

---

## 2. Visual Design System & Interactions
- **Primary Background**: `bg-slate-950` (Deep bluish black).
- **Theme Accents**: Emerald/Mint green (`text-emerald-400`, `bg-emerald-500`, glowing highlights).
- **Floating Pill Navbar**:
  - Full width and transparent at scroll position `y === 0`.
  - Transitions smoothly into a floating glassmorphic pill shape (`max-w-4xl mx-auto rounded-full mt-4`) when scrolled (`y > 20`).
- **Integrated Buttons**:
  - Border and background blend seamlessly using ambient glow, smooth gradients, and hover transitions.
- **Copywriting focus**: Focus on visual database modeling, AI acceleration, full custom control, and zero lock-in exports.

---

## 3. High-Value Interactive Sections

### 3.1 Hero Section
- Animated typewriter prompt simulator.
- 3D parallax mockup ERD canvas connected to the stepper steps.

### 3.2 Visual Comparison Section (Before/After)
- Side-by-side comparison panel:
  - **Left (Manual Coding)**: Red-tinted, full of lint errors, slow, manual.
  - **Right (AiKanAja)**: Green-tinted, instant visual connection, automated.

### 3.3 Tech Stack Orbit Integrator
- Central AiKanAja icon orbited by brand badges: PostgreSQL, MySQL, SQLite, Prisma, Supabase, Neon, PlanetScale, Drizzle.
- Hovering an icon animates a glowing bezier path from the badge to the center, demonstrating native compatibility.

### 3.4 FAQ Accordion Grid
- Highly interactive collapsible accordion answers built using Svelte 5 state.

---

## 4. Implementation Plan
- Modify `src/routes/layout.css` to add support for floating navbar transitions and new orbit animations.
- Re-write `src/routes/+page.svelte` to implement the new markup, copy, and visual components.
- Run typecheck, lint, and production build checks.
