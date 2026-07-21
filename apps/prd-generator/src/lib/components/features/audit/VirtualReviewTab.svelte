<script lang="ts">
  import { prd } from '$lib/stores/prd.store';
  import { prdApi } from '$lib/api/prd';
  import { ui } from '$lib/stores/ui.store';
  import { Play, AlertTriangle, CheckCircle } from 'lucide-svelte';
  import Spinner from '$lib/components/ui/Spinner.svelte';

  let isReviewing = $state(false);
  let result = $derived($prd.virtualReview);

  const personas = [
    {
      key: 'techLead' as const,
      label: 'Tech Lead',
      initials: 'TL',
      gradient: 'from-orange-500 to-amber-600',
      ring: 'ring-orange-500/20',
      desc: 'Arsitektur, bottleneck, & feasibility',
      bgGlow: 'bg-orange-500/5',
    },
    {
      key: 'qa' as const,
      label: 'QA Engineer',
      initials: 'QA',
      gradient: 'from-amber-400 to-yellow-500',
      ring: 'ring-amber-400/20',
      desc: 'Edge cases, boundary, & failure scenarios',
      bgGlow: 'bg-amber-500/5',
    },
    {
      key: 'productSponsor' as const,
      label: 'Product Sponsor',
      initials: 'PS',
      gradient: 'from-yellow-400 to-orange-500',
      ring: 'ring-yellow-400/20',
      desc: 'ROI, KPI alignment, & business value',
      bgGlow: 'bg-yellow-500/5',
    },
  ];

  async function runReview() {
    if (!$prd.rawMarkdown.trim()) {
      ui.addToast('PRD kosong, tidak bisa review', 'warning');
      return;
    }
    isReviewing = true;
    try {
      const res = await prdApi.virtualReview($prd.rawMarkdown);
      $prd.virtualReview = res;
      ui.addToast('Virtual review selesai!', 'success');
    } catch {
      ui.addToast('Gagal melakukan virtual review', 'error');
    } finally {
      isReviewing = false;
    }
  }

  function scoreColor(s: number) {
    if (s >= 80) return { text: 'text-emerald-400', stroke: '#34d399', bg: 'bg-emerald-500' };
    if (s >= 60) return { text: 'text-amber-400', stroke: '#fbbf24', bg: 'bg-amber-500' };
    return { text: 'text-red-400', stroke: '#f87171', bg: 'bg-red-500' };
  }
</script>

<div class="max-w-4xl mx-auto space-y-6">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div>
      <h2 class="text-lg font-black text-white tracking-tight">Virtual Stakeholder Review</h2>
      <p class="text-[11px] text-slate-500 mt-0.5">3 persona AI mensimulasikan review sebelum PRD ke tim nyata</p>
    </div>
    <button
      onclick={runReview}
      disabled={isReviewing}
      class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-300 hover:to-amber-300 shadow-lg shadow-orange-500/20 transition-all disabled:opacity-50 active:scale-[0.97]"
    >
      {#if isReviewing}
        <Spinner size="sm" /> Reviewing...
      {:else}
        <Play class="w-3.5 h-3.5" /> Run Review
      {/if}
    </button>
  </div>

  {#if result}
    {@const sc = scoreColor(result.overallScore)}

    <!-- Overall Score — big hero card -->
    <div class="relative rounded-2xl overflow-hidden border border-white/[0.04]">
      <div class="absolute inset-0 {sc.bg}/5"></div>
      <div class="relative px-8 py-8 flex items-center gap-8">
        <!-- Big gauge -->
        <div class="relative shrink-0">
          <svg class="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="8" />
            <circle cx="60" cy="60" r="52" fill="none" stroke={sc.stroke} stroke-width="8" stroke-linecap="round" stroke-dasharray="327" stroke-dashoffset={327 - (result.overallScore / 100) * 327} class="transition-all duration-[1.5s] ease-out" />
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <span class="text-4xl font-black {sc.text}">{result.overallScore}</span>
            <span class="text-[10px] text-slate-500 font-medium mt-0.5">/ 100</span>
          </div>
        </div>

        <div class="space-y-2">
          <h3 class="text-base font-bold text-white">Overall Score</h3>
          <p class="text-xs text-slate-400 leading-relaxed max-w-md">
            Rata-rata penilaian dari 3 persona stakeholder. Skor di atas 80 menunjukkan PRD sudah cukup matang untuk diserahkan ke tim development.
          </p>
          <!-- Mini persona scores -->
          <div class="flex items-center gap-4 pt-1">
            {#each personas as p}
              {@const score = p.key === 'techLead' ? result.techLeadScore : p.key === 'qa' ? result.qaScore : result.productSponsorScore}
              {@const s = scoreColor(score)}
              <div class="flex items-center gap-1.5">
                <div class="w-5 h-5 rounded bg-gradient-to-br {p.gradient} flex items-center justify-center">
                  <span class="text-[7px] font-black text-white">{p.initials}</span>
                </div>
                <span class="text-[11px] font-mono font-bold {s.text}">{score}</span>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>

    <!-- Persona Cards — asymmetric layout -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
      {#each personas as persona, i}
        {@const score = persona.key === 'techLead' ? result.techLeadScore : persona.key === 'qa' ? result.qaScore : result.productSponsorScore}
        {@const feedback = persona.key === 'techLead' ? result.techLeadFeedback : persona.key === 'qa' ? result.qaFeedback : result.productSponsorFeedback}
        {@const s = scoreColor(score)}
        <!-- TL: 5 cols, QA: 4 cols, PS: 3 cols — asymmetric -->
        <div class="relative rounded-2xl overflow-hidden border border-white/[0.04] {i === 0 ? 'md:col-span-5' : i === 1 ? 'md:col-span-4' : 'md:col-span-3'}">
          <div class="absolute inset-0 {persona.bgGlow}"></div>
          <div class="relative p-5 space-y-4">
            <!-- Avatar + name -->
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br {persona.gradient} flex items-center justify-center ring-1 {persona.ring}">
                <span class="text-xs font-black text-white">{persona.initials}</span>
              </div>
              <div>
                <p class="text-xs font-bold text-white">{persona.label}</p>
                <p class="text-[10px] text-slate-500">{persona.desc}</p>
              </div>
            </div>

            <!-- Score bar -->
            <div class="space-y-1.5">
              <div class="flex items-baseline justify-between">
                <span class="text-xl font-black {s.text}">{score}</span>
                <span class="text-[10px] text-slate-600">/ 100</span>
              </div>
              <div class="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                <div class="h-full rounded-full {s.bg}" style="width: {score}%"></div>
              </div>
            </div>

            <!-- Feedback -->
            <p class="text-[11px] text-slate-400 leading-relaxed line-clamp-5">{feedback}</p>
          </div>
        </div>
      {/each}
    </div>

    <!-- Recommendations -->
    {#if result.recommendations && result.recommendations.length > 0}
      <div class="rounded-2xl bg-[#0b0f18] border border-white/[0.04] p-5 space-y-3">
        <div class="flex items-center gap-2">
          <CheckCircle class="w-4 h-4 text-emerald-400" />
          <h3 class="text-xs font-bold text-white">Rekomendasi Perbaikan</h3>
        </div>
        <div class="space-y-2">
          {#each result.recommendations as rec}
            <div class="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/[0.015] border border-white/[0.03]">
              <AlertTriangle class="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
              <p class="text-[11px] text-slate-400 leading-relaxed">{rec}</p>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  {:else if !isReviewing}
    <div class="rounded-2xl bg-[#0b0f18] border border-white/[0.04] p-16 text-center space-y-4">
      <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/10 to-amber-500/5 flex items-center justify-center mx-auto border border-orange-500/10">
        <svg class="w-8 h-8 text-orange-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      </div>
      <div class="space-y-1">
        <p class="text-sm font-semibold text-white">Belum ada review</p>
        <p class="text-[11px] text-slate-500 max-w-[240px] mx-auto">Klik "Run Review" untuk mensimulasikan feedback dari Tech Lead, QA, dan Product Sponsor</p>
      </div>
    </div>
  {/if}
</div>
