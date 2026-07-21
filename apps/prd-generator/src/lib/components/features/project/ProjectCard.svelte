<script lang="ts">
  import { FileText, Clock, Trash2, ArrowUpRight } from 'lucide-svelte';
  import type { PrdProject } from '$lib/types/prd';

  let { project, ondelete }: { project: PrdProject; ondelete?: (id: string) => void } = $props();
  let menuOpen = $state(false);
  let hoverX = $state(0);
  let hoverY = $state(0);

  function timeAgo(date: string): string {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m lalu`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h lalu`;
    const days = Math.floor(hours / 24);
    return `${days}d lalu`;
  }

  function getGrade(score: number): { label: string; ring: string; text: string } {
    if (score >= 90) return { label: 'A+', ring: 'stroke-emerald-400', text: 'text-emerald-400' };
    if (score >= 80) return { label: 'A', ring: 'stroke-emerald-500', text: 'text-emerald-400' };
    if (score >= 70) return { label: 'B', ring: 'stroke-amber-400', text: 'text-amber-400' };
    if (score >= 60) return { label: 'C', ring: 'stroke-orange-400', text: 'text-orange-400' };
    return { label: 'D', ring: 'stroke-red-400', text: 'text-red-400' };
  }

  const typeAccents: Record<string, { dot: string; bg: string }> = {
    saas: { dot: 'bg-orange-400', bg: 'from-orange-500/8' },
    ecommerce: { dot: 'bg-amber-400', bg: 'from-amber-500/8' },
    mobile: { dot: 'bg-emerald-400', bg: 'from-emerald-500/8' },
    api: { dot: 'bg-violet-400', bg: 'from-violet-500/8' },
    custom: { dot: 'bg-slate-400', bg: 'from-slate-500/8' },
  };

  const accent = $derived(typeAccents[project.templateType || 'custom'] || typeAccents.custom);
  const grade = $derived(project.qualityScore ? getGrade(project.qualityScore) : null);
</script>

<a
  href="/project/{project.id}"
  class="group block relative"
  onmousemove={(e) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    hoverX = e.clientX - r.left;
    hoverY = e.clientY - r.top;
  }}
>
  <!-- Card -->
  <div class="relative h-full rounded-2xl bg-[#0b0f18] border border-white/[0.04] overflow-hidden transition-all duration-500 group-hover:border-white/[0.12] group-hover:shadow-[0_8px_40px_-12px_rgba(255,107,0,0.15)]">

    <!-- Mouse follow glow -->
    <div
      class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
      style="background: radial-gradient(circle 250px at {hoverX}px {hoverY}px, rgba(255,107,0,0.06), transparent 70%)"
    ></div>

    <!-- Top gradient stripe by type -->
    <div class="h-1 w-full bg-gradient-to-r {accent.bg} to-transparent"></div>

    <div class="p-5 relative z-10">
      <!-- Header row -->
      <div class="flex items-start justify-between mb-3">
        <div class="flex items-center gap-3">
          <!-- Type icon with unique bg per type -->
          <div class="w-9 h-9 rounded-lg bg-gradient-to-br {accent.bg} to-transparent flex items-center justify-center border border-white/[0.04]">
            <FileText class="w-4 h-4 text-slate-300" />
          </div>
          <div class="min-w-0">
            <h3 class="text-sm font-bold text-white truncate max-w-[180px] group-hover:text-orange-200 transition-colors">{project.title}</h3>
            <div class="flex items-center gap-1.5 mt-0.5">
              <span class="w-1.5 h-1.5 rounded-full {accent.dot}"></span>
              <span class="text-[10px] text-slate-500 uppercase tracking-wider font-medium">{project.templateType || 'custom'}</span>
            </div>
          </div>
        </div>

        <!-- Score ring (if exists) -->
        {#if grade && project.qualityScore}
          <div class="relative w-11 h-11 shrink-0">
            <svg class="w-11 h-11 -rotate-90" viewBox="0 0 44 44">
              <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="3" />
              <circle cx="22" cy="22" r="18" fill="none" class={grade.ring} stroke-width="3" stroke-linecap="round" stroke-dasharray="113" stroke-dashoffset={113 - (project.qualityScore / 100) * 113} />
            </svg>
            <span class="absolute inset-0 flex items-center justify-center text-[10px] font-black {grade.text}">{grade.label}</span>
          </div>
        {/if}
      </div>

      <!-- Description -->
      <p class="text-[11px] text-slate-500 leading-relaxed mb-4 line-clamp-2 min-h-[2rem]">
        {project.description || 'Tanpa deskripsi'}
      </p>

      <!-- Bottom row -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          {#if project.storyPointsTotal}
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold text-violet-300 bg-violet-500/8 border border-violet-500/15">
              {project.storyPointsTotal} SP
            </span>
          {/if}
          {#if project.qualityScore}
            <span class="text-[10px] font-mono {grade?.text}">{project.qualityScore}/100</span>
          {/if}
        </div>
        <div class="flex items-center gap-1 text-[10px] text-slate-600">
          <Clock class="w-3 h-3" />
          <span>{timeAgo(project.updatedAt)}</span>
        </div>
      </div>
    </div>

    <!-- Hover arrow -->
    <div class="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0">
      <ArrowUpRight class="w-4 h-4 text-orange-400/60" />
    </div>
  </div>
</a>
