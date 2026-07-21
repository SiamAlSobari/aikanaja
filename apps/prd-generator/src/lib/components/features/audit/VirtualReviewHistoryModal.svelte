<script lang="ts">
  import { onMount } from 'svelte';
  import { History, X, ChevronDown, ChevronUp, UserCheck } from 'lucide-svelte';
  import { prdApi } from '$lib/api/prd';
  import { prd } from '$lib/stores/prd.store';
  import type { VirtualReviewResult } from '$lib/types/prd';

  let { open = $bindable(false) }: { open?: boolean } = $props();
  let reviews = $state<VirtualReviewResult[]>([]);
  let loading = $state(true);
  let expandedIndex = $state<number | null>(null);

  const projectId = $derived($prd.currentProject?.id);

  $effect(() => {
    if (open && projectId) {
      loadReviews();
    }
  });

  async function loadReviews() {
    if (!projectId) return;
    loading = true;
    try {
      reviews = await prdApi.getVirtualReviews(projectId);
    } catch { /* silent */ }
    loading = false;
  }

  function timeAgo(date: string): string {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m lalu`;
    const hours = Math.floor(mins / 60);
    return `${hours}j lalu`;
  }

  function scoreColor(s: number) {
    if (s >= 80) return 'text-emerald-400';
    if (s >= 60) return 'text-amber-400';
    return 'text-red-400';
  }

  function handleClose() {
    open = false;
  }
</script>

{#if open}
  <div
    class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-end"
    onclick={handleClose}
    onkeydown={(e) => e.key === 'Escape' && handleClose()}
    role="presentation"
  >
    <!-- Drawer panel -->
    <div
      class="w-full max-w-md h-full bg-[#0a0e14] border-l border-white/[0.06] flex flex-col overflow-hidden"
      onclick={(e) => e.stopPropagation()}
      role="document"
    >
      <!-- Header -->
      <div class="shrink-0 flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
            <History class="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <h3 class="text-xs font-bold text-white">Review History</h3>
            <p class="text-[9px] text-slate-500">{reviews.length} reviews</p>
          </div>
        </div>
        <button onclick={handleClose} class="p-1.5 rounded-md text-slate-500 hover:text-white hover:bg-white/[0.06] transition-colors">
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto">
        {#if loading}
          <div class="p-12 text-center">
            <span class="loading loading-spinner loading-sm text-orange-400"></span>
          </div>
        {:else if reviews.length === 0}
          <div class="p-12 text-center space-y-3">
            <UserCheck class="w-8 h-8 text-slate-600 mx-auto" />
            <p class="text-[11px] text-slate-500">Belum ada riwayat review</p>
          </div>
        {:else}
          <div class="divide-y divide-white/[0.03]">
            {#each reviews as review, i}
              <div class="px-5 py-4 hover:bg-white/[0.01] transition-colors">
                <!-- Summary row -->
                <button
                  onclick={() => expandedIndex = expandedIndex === i ? null : i}
                  class="w-full flex items-center justify-between text-left"
                >
                  <div class="flex items-center gap-3">
                    <!-- Mini score ring -->
                    <div class="relative w-9 h-9 shrink-0">
                      <svg class="w-9 h-9 -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="2.5" />
                        <circle cx="18" cy="18" r="15" fill="none" stroke={review.overallScore >= 80 ? '#34d399' : review.overallScore >= 60 ? '#fbbf24' : '#f87171'} stroke-width="2.5" stroke-linecap="round" stroke-dasharray="94" stroke-dashoffset={94 - (review.overallScore / 100) * 94} />
                      </svg>
                      <span class="absolute inset-0 flex items-center justify-center text-[9px] font-black {scoreColor(review.overallScore)}">{review.overallScore}</span>
                    </div>
                    <div>
                      <p class="text-[11px] font-bold text-white">Review #{i + 1}</p>
                      <p class="text-[9px] text-slate-600">{timeAgo(review.createdAt || new Date().toISOString())}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="flex items-center gap-1">
                      <span class="text-[9px] font-mono {scoreColor(review.techLeadScore)}">TL:{review.techLeadScore}</span>
                      <span class="text-[9px] font-mono {scoreColor(review.qaScore)}">QA:{review.qaScore}</span>
                      <span class="text-[9px] font-mono {scoreColor(review.productSponsorScore)}">PS:{review.productSponsorScore}</span>
                    </div>
                    {#if expandedIndex === i}
                      <ChevronUp class="w-3.5 h-3.5 text-slate-600" />
                    {:else}
                      <ChevronDown class="w-3.5 h-3.5 text-slate-600" />
                    {/if}
                  </div>
                </button>

                <!-- Expanded detail -->
                {#if expandedIndex === i}
                  <div class="mt-3 space-y-2.5 pl-12">
                    {#each [
                      { label: 'Tech Lead', score: review.techLeadScore, feedback: review.techLeadFeedback, color: 'text-orange-300' },
                      { label: 'QA Engineer', score: review.qaScore, feedback: review.qaFeedback, color: 'text-amber-300' },
                      { label: 'Product Sponsor', score: review.productSponsorScore, feedback: review.productSponsorFeedback, color: 'text-yellow-300' },
                    ] as persona}
                      <div class="px-3 py-2.5 rounded-lg bg-white/[0.015] border border-white/[0.03]">
                        <div class="flex items-center justify-between mb-1">
                          <span class="text-[10px] font-bold {persona.color}">{persona.label}</span>
                          <span class="text-[10px] font-mono {scoreColor(persona.score)}">{persona.score}/100</span>
                        </div>
                        <p class="text-[10px] text-slate-500 leading-relaxed line-clamp-3">{persona.feedback}</p>
                      </div>
                    {/each}

                    {#if review.recommendations && review.recommendations.length > 0}
                      <div class="px-3 py-2.5 rounded-lg bg-emerald-500/[0.03] border border-emerald-500/10">
                        <p class="text-[9px] font-bold text-emerald-300 mb-1">Rekomendasi</p>
                        {#each review.recommendations.slice(0, 3) as rec}
                          <p class="text-[10px] text-slate-500 leading-relaxed">• {rec}</p>
                        {/each}
                      </div>
                    {/if}
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}
