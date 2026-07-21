<script lang="ts">
  import { prd } from '$lib/stores/prd.store';
  import { prdApi } from '$lib/api/prd';
  import { ui } from '$lib/stores/ui.store';
  import { Play, CheckCircle, XCircle, AlertTriangle } from 'lucide-svelte';
  import Spinner from '$lib/components/ui/Spinner.svelte';

  let isAuditing = $state(false);
  let result = $state<{
    score: number;
    ambiguityWarnings: Array<{ original: string; suggestion: string; section?: string }>;
    completenessCheck: Record<string, boolean> | null;
  } | null>(null);

  const sectionLabels: Record<string, string> = {
    executiveSummary: 'Executive Summary',
    problemStatement: 'Problem Statement',
    userPersonas: 'User Personas',
    functionalRequirements: 'Functional Requirements',
    userStories: 'User Stories & Acceptance Criteria',
    sprintRoadmap: 'Sprint Roadmap',
    nonFunctionalRequirements: 'Non-Functional Requirements',
    diagrams: 'Mermaid Diagrams',
    riskAnalysis: 'Risk Analysis',
    outOfScope: 'Out of Scope',
  };

  async function runAudit() {
    if (!$prd.rawMarkdown.trim()) {
      ui.addToast('PRD kosong', 'warning');
      return;
    }
    isAuditing = true;
    try {
      const res = await prdApi.qualityAudit($prd.rawMarkdown);
      $prd.qualityScore = res.score;
      result = res;
      ui.addToast('Audit selesai!', 'success');
    } catch {
      ui.addToast('Gagal melakukan audit', 'error');
    } finally {
      isAuditing = false;
    }
  }

  function grade(s: number) {
    if (s >= 90) return { label: 'A+', color: 'text-emerald-400', stroke: '#34d399' };
    if (s >= 80) return { label: 'A', color: 'text-emerald-400', stroke: '#34d399' };
    if (s >= 70) return { label: 'B', color: 'text-amber-400', stroke: '#fbbf24' };
    if (s >= 60) return { label: 'C', color: 'text-orange-400', stroke: '#fb923c' };
    return { label: 'D', color: 'text-red-400', stroke: '#f87171' };
  }
</script>

<div class="max-w-4xl mx-auto space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h2 class="text-lg font-black text-white tracking-tight">Quality Audit & Ambiguity Check</h2>
      <p class="text-[11px] text-slate-500 mt-0.5">Skor kesehatan + deteksi ambiguitas dokumen</p>
    </div>
    <button
      onclick={runAudit}
      disabled={isAuditing}
      class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-300 hover:to-amber-300 shadow-lg shadow-orange-500/20 transition-all disabled:opacity-50 active:scale-[0.97]"
    >
      {#if isAuditing}
        <Spinner size="sm" /> Auditing...
      {:else}
        <Play class="w-3.5 h-3.5" /> Run Audit
      {/if}
    </button>
  </div>

  {#if result}
    {@const g = grade(result.score)}

    <!-- Score hero -->
    <div class="relative rounded-2xl overflow-hidden border border-white/[0.04]">
      <div class="absolute inset-0 bg-gradient-to-r from-orange-600/5 to-transparent"></div>
      <div class="relative px-8 py-8 flex items-center gap-8">
        <div class="relative shrink-0">
          <svg class="w-28 h-28 -rotate-90" viewBox="0 0 112 112">
            <circle cx="56" cy="56" r="48" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="7" />
            <circle cx="56" cy="56" r="48" fill="none" stroke={g.stroke} stroke-width="7" stroke-linecap="round" stroke-dasharray="301" stroke-dashoffset={301 - (result.score / 100) * 301} />
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <span class="text-3xl font-black {g.color}">{result.score}</span>
            <span class="text-[10px] font-black {g.color} mt-0.5">{g.label}</span>
          </div>
        </div>
        <div>
          <h3 class="text-base font-bold text-white">Health Score</h3>
          <p class="text-xs text-slate-400 mt-1 max-w-sm">Skor berdasarkan kelengkapan 10 section wajib + analisis ambiguitas</p>
          {#if result.completenessCheck}
            {@const passed = Object.values(result.completenessCheck).filter(Boolean).length}
            {@const total = Object.keys(result.completenessCheck).length}
            <div class="flex items-center gap-2 mt-3">
              <div class="h-1.5 w-32 rounded-full bg-white/[0.04] overflow-hidden">
                <div class="h-full rounded-full bg-emerald-500" style="width: {(passed/total)*100}%"></div>
              </div>
              <span class="text-[10px] text-slate-500 font-mono">{passed}/{total} section</span>
            </div>
          {/if}
        </div>
      </div>
    </div>

    <!-- Completeness grid -->
    {#if result.completenessCheck}
      <div class="rounded-2xl bg-[#0b0f18] border border-white/[0.04] p-5 space-y-3">
        <h3 class="text-xs font-bold text-white">Section Completeness</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {#each Object.entries(result.completenessCheck) as [key, passed]}
            <div class="flex items-center gap-2.5 px-3 py-2 rounded-xl {passed ? 'bg-emerald-500/[0.03] border border-emerald-500/10' : 'bg-red-500/[0.03] border border-red-500/10'}">
              {#if passed}
                <CheckCircle class="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              {:else}
                <XCircle class="w-3.5 h-3.5 text-red-400 shrink-0" />
              {/if}
              <span class="text-[11px] {passed ? 'text-emerald-300/80' : 'text-red-300/80'}">{sectionLabels[key] || key}</span>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Ambiguity warnings -->
    {#if result.ambiguityWarnings.length > 0}
      <div class="rounded-2xl bg-[#0b0f18] border border-amber-500/15 p-5 space-y-3">
        <div class="flex items-center gap-2">
          <AlertTriangle class="w-4 h-4 text-amber-400" />
          <h3 class="text-xs font-bold text-white">Ambiguity Warnings</h3>
          <span class="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold text-amber-400 bg-amber-500/10">{result.ambiguityWarnings.length}</span>
        </div>
        <div class="space-y-2">
          {#each result.ambiguityWarnings as warn}
            <div class="px-4 py-3 rounded-xl bg-white/[0.015] border border-white/[0.03] space-y-1.5">
              <div class="flex items-start gap-2">
                <span class="text-[9px] font-mono font-bold text-red-400/80 shrink-0 mt-0.5 w-8">ASLI</span>
                <p class="text-[11px] text-red-300/80 line-through leading-relaxed">{warn.original}</p>
              </div>
              <div class="flex items-start gap-2">
                <span class="text-[9px] font-mono font-bold text-emerald-400/80 shrink-0 mt-0.5 w-8">FIX</span>
                <p class="text-[11px] text-emerald-300/80 leading-relaxed">{warn.suggestion}</p>
              </div>
              {#if warn.section}
                <p class="text-[9px] text-slate-600 font-mono pl-10">{warn.section}</p>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    {/if}
  {:else if !isAuditing}
    <div class="rounded-2xl bg-[#0b0f18] border border-white/[0.04] p-16 text-center space-y-4">
      <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/10 to-amber-500/5 flex items-center justify-center mx-auto border border-orange-500/10">
        <svg class="w-8 h-8 text-orange-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      </div>
      <div class="space-y-1">
        <p class="text-sm font-semibold text-white">Belum ada audit</p>
        <p class="text-[11px] text-slate-500 max-w-[240px] mx-auto">Klik "Run Audit" untuk memeriksa kualitas & ambiguitas dokumen PRD</p>
      </div>
    </div>
  {/if}
</div>
