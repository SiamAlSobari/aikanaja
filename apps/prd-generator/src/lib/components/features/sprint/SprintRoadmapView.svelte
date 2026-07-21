<script lang="ts">
  import { prd } from '$lib/stores/prd.store';
  import { prdApi } from '$lib/api/prd';
  import { ui } from '$lib/stores/ui.store';
  import { Play, Rocket, Target, Zap } from 'lucide-svelte';
  import Spinner from '$lib/components/ui/Spinner.svelte';

  let isPlanning = $state(false);
  let result = $derived($prd.sprintRoadmap);

  async function runPlan() {
    if (!$prd.rawMarkdown.trim()) {
      ui.addToast('PRD kosong', 'warning');
      return;
    }
    isPlanning = true;
    try {
      const res = await prdApi.sprintPlan($prd.rawMarkdown);
      $prd.sprintRoadmap = res;
      ui.addToast('Sprint plan berhasil!', 'success');
    } catch {
      ui.addToast('Gagal generate sprint plan', 'error');
    } finally {
      isPlanning = false;
    }
  }

  const sprints = [
    { key: 'sprint1' as const, label: 'Sprint 1', sub: 'MVP Launch', icon: Rocket, color: 'text-orange-400', bg: 'bg-orange-500/8', border: 'border-orange-500/15', barColor: 'bg-orange-500' },
    { key: 'sprint2' as const, label: 'Sprint 2', sub: 'Expansion', icon: Target, color: 'text-amber-400', bg: 'bg-amber-500/8', border: 'border-amber-500/15', barColor: 'bg-amber-500' },
    { key: 'sprint3' as const, label: 'Sprint 3', sub: 'Scalability', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/8', border: 'border-yellow-500/15', barColor: 'bg-yellow-500' },
  ];

  function totalSP(items: Array<{ storyPoints: number }>) {
    return items.reduce((a, b) => a + b.storyPoints, 0);
  }

  function priorityStyle(p: string) {
    if (p === 'high') return 'text-red-300 bg-red-500/8 border-red-500/15';
    if (p === 'medium') return 'text-amber-300 bg-amber-500/8 border-amber-500/15';
    return 'text-slate-400 bg-white/[0.03] border-white/[0.06]';
  }
</script>

<div class="max-w-5xl mx-auto space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h2 class="text-lg font-black text-white tracking-tight">Sprint Roadmap & Story Points</h2>
      <p class="text-[11px] text-slate-500 mt-0.5">Fibonacci story pointing + alokasi sprint otomatis</p>
    </div>
    <button
      onclick={runPlan}
      disabled={isPlanning}
      class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-300 hover:to-amber-300 shadow-lg shadow-orange-500/20 transition-all disabled:opacity-50 active:scale-[0.97]"
    >
      {#if isPlanning}
        <Spinner size="sm" /> Planning...
      {:else}
        <Play class="w-3.5 h-3.5" /> Generate Plan
      {/if}
    </button>
  </div>

  {#if result}
    <!-- Sprint summary — 3 columns with different visual weight -->
    <div class="grid grid-cols-3 gap-4">
      {#each sprints as cfg, i}
        {@const items = result[cfg.key]}
        {@const sp = totalSP(items)}
        {@const totalSPAll = totalSP(result.sprint1) + totalSP(result.sprint2) + totalSP(result.sprint3)}
        <div class="relative rounded-2xl overflow-hidden border border-white/[0.04] group hover:border-white/[0.1] transition-colors">
          <div class="absolute inset-0 {cfg.bg}"></div>
          <div class="relative p-5">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-8 h-8 rounded-lg {cfg.bg} border {cfg.border} flex items-center justify-center">
                <cfg.icon class="w-4 h-4 {cfg.color}" />
              </div>
              <div>
                <p class="text-[11px] font-bold text-white">{cfg.label}</p>
                <p class="text-[9px] text-slate-500">{cfg.sub}</p>
              </div>
            </div>
            <div class="flex items-baseline gap-1.5">
              <span class="text-2xl font-black text-white">{sp}</span>
              <span class="text-[10px] text-slate-500">SP</span>
            </div>
            <!-- Progress bar relative to total -->
            {#if totalSPAll > 0}
              <div class="mt-3 h-1 rounded-full bg-white/[0.04] overflow-hidden">
                <div class="h-full rounded-full {cfg.barColor}" style="width: {(sp/totalSPAll)*100}%"></div>
              </div>
              <p class="text-[9px] text-slate-600 mt-1 font-mono">{Math.round((sp/totalSPAll)*100)}% of total</p>
            {/if}
          </div>
        </div>
      {/each}
    </div>

    <!-- Sprint detail lists -->
    <div class="space-y-4">
      {#each sprints as cfg}
        {@const items = result[cfg.key]}
        {#if items.length > 0}
          <div class="rounded-2xl bg-[#0b0f18] border border-white/[0.04] overflow-hidden">
            <div class="flex items-center justify-between px-5 py-3 border-b border-white/[0.03]">
              <div class="flex items-center gap-2">
                <cfg.icon class="w-4 h-4 {cfg.color}" />
                <span class="text-xs font-bold text-white">{cfg.label}</span>
                <span class="text-[10px] text-slate-600">— {cfg.sub}</span>
              </div>
              <span class="text-[10px] font-mono text-slate-600">{totalSP(items)} SP · {items.length} items</span>
            </div>
            <div class="divide-y divide-white/[0.02]">
              {#each items as item, i}
                <div class="flex items-center gap-4 px-5 py-3 hover:bg-white/[0.01] transition-colors group">
                  <span class="text-[10px] font-mono text-slate-700 w-5 text-right">{i + 1}</span>
                  <span class="flex-1 text-[12px] text-slate-300 group-hover:text-white transition-colors">{item.title}</span>
                  <span class="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border {priorityStyle(item.priority)}">{item.priority}</span>
                  <span class="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold text-violet-300 bg-violet-500/8 border border-violet-500/15">{item.storyPoints}</span>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      {/each}
    </div>
  {:else if !isPlanning}
    <div class="rounded-2xl bg-[#0b0f18] border border-white/[0.04] p-16 text-center space-y-4">
      <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/10 to-amber-500/5 flex items-center justify-center mx-auto border border-orange-500/10">
        <Zap class="w-8 h-8 text-orange-400/60" />
      </div>
      <div class="space-y-1">
        <p class="text-sm font-semibold text-white">Belum ada sprint plan</p>
        <p class="text-[11px] text-slate-500 max-w-[240px] mx-auto">Klik "Generate Plan" untuk mengestimasi story points dan mengalokasikan ke sprint</p>
      </div>
    </div>
  {/if}
</div>
