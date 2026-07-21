<script lang="ts">
  import { onMount } from 'svelte';
  import { Trash2, RotateCcw, FileText, Clock } from 'lucide-svelte';
  import { prdApi } from '$lib/api/prd';
  import { ui } from '$lib/stores/ui.store';
  import type { PrdProject } from '$lib/types/prd';

  let projects = $state<PrdProject[]>([]);
  let loading = $state(true);

  onMount(async () => {
    try {
      const res = await prdApi.getProjects({ filter: 'deleted', limit: 50 });
      projects = res.data;
    } catch {
      // silent
    } finally {
      loading = false;
    }
  });

  async function restoreProject(id: string) {
    try {
      await prdApi.restore(id);
      ui.addToast('Proyek berhasil dipulihkan', 'success');
      projects = projects.filter((p) => p.id !== id);
    } catch {
      ui.addToast('Gagal memulihkan proyek', 'error');
    }
  }

  function timeAgo(date: string): string {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / 86400000);
    if (days < 1) return 'Hari ini';
    if (days === 1) return 'Kemarin';
    return `${days} hari lalu`;
  }
</script>

<div class="space-y-6">
  <div>
    <h1 class="text-xl font-black text-white">Sampah</h1>
    <p class="text-sm text-slate-500 mt-1">Proyek yang dihapus. Pulihkan jika diperlukan.</p>
  </div>

  <div class="rounded-2xl bg-[#0a0e17] border border-white/[0.06] overflow-hidden">
    {#if loading}
      <div class="p-12 text-center">
        <span class="loading loading-spinner loading-md text-orange-400"></span>
      </div>
    {:else if projects.length === 0}
      <div class="p-12 text-center space-y-3">
        <Trash2 class="w-10 h-10 text-slate-600 mx-auto" />
        <p class="text-sm text-slate-400">Sampah kosong</p>
      </div>
    {:else}
      <div class="divide-y divide-white/[0.04]">
        {#each projects as project}
          <div class="flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors">
            <div class="flex items-center gap-4 min-w-0">
              <div class="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                <Trash2 class="w-5 h-5 text-red-400" />
              </div>
              <div class="min-w-0">
                <p class="text-sm font-semibold text-white truncate">{project.title}</p>
                <div class="flex items-center gap-2 text-xs text-slate-500">
                  <Clock class="w-3 h-3" />
                  <span>Dihapus {timeAgo(project.updatedAt)}</span>
                </div>
              </div>
            </div>
            <button
              onclick={() => restoreProject(project.id)}
              class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all shrink-0"
            >
              <RotateCcw class="w-3.5 h-3.5" /> Pulihkan
            </button>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
