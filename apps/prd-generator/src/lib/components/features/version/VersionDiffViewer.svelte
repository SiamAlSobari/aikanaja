<script lang="ts">
  import { onMount } from 'svelte';
  import { prd } from '$lib/stores/prd.store';
  import { prdApi } from '$lib/api/prd';
  import { ui } from '$lib/stores/ui.store';
  import { GitBranch, RotateCcw, Plus, Minus, Equal, Loader2, ChevronDown } from 'lucide-svelte';
  import type { PrdVersion, DiffResult } from '$lib/types/prd';
  import Spinner from '$lib/components/ui/Spinner.svelte';

  let versions = $state<PrdVersion[]>([]);
  let loading = $state(true);
  let selectedA = $state('');
  let selectedB = $state('');
  let diffResult = $state<DiffResult | null>(null);
  let diffing = $state(false);
  let viewMode = $state<'list' | 'diff'>('list');

  const projectId = $derived($prd.currentProject?.id);

  onMount(async () => {
    if (!projectId) return;
    try {
      versions = await prdApi.getVersions(projectId);
      if (versions.length >= 2) {
        selectedA = versions[1].id;
        selectedB = versions[0].id;
      }
    } catch {
      // silent
    } finally {
      loading = false;
    }
  });

  async function loadDiff() {
    if (!projectId || !selectedA || !selectedB || selectedA === selectedB) return;
    diffing = true;
    try {
      diffResult = await prdApi.getVersionDiff(projectId, selectedA, selectedB);
      viewMode = 'diff';
    } catch {
      ui.addToast('Gagal memuat diff', 'error');
    } finally {
      diffing = false;
    }
  }

  async function restoreVersion(versionId: string) {
    if (!projectId) return;
    if (!confirm('Yakin ingin restore ke versi ini?')) return;
    try {
      const project = await prdApi.restoreVersion(projectId, versionId);
      prd.setCurrentProject(project);
      ui.addToast('Berhasil restore versi', 'success');
    } catch {
      ui.addToast('Gagal restore versi', 'error');
    }
  }

  function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  }
</script>

<div class="max-w-5xl mx-auto space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h2 class="text-lg font-black text-white">Version History</h2>
      <p class="text-xs text-slate-500 mt-1">Bandingkan & restore versi PRD</p>
    </div>
    {#if versions.length >= 2}
      <button
        onclick={loadDiff}
        disabled={diffing || selectedA === selectedB}
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-300 hover:to-amber-300 shadow-lg shadow-orange-500/20 transition-all disabled:opacity-50"
      >
        {#if diffing}
          <Spinner size="sm" /> Loading...
        {:else}
          Bandingkan
        {/if}
      </button>
    {/if}
  </div>

  {#if loading}
    <div class="rounded-2xl bg-[#0a0e17] border border-white/[0.06] p-12 text-center">
      <Spinner size="md" />
    </div>
  {:else if versions.length === 0}
    <div class="rounded-2xl bg-[#0a0e17] border border-white/[0.06] p-16 text-center space-y-4">
      <GitBranch class="w-10 h-10 text-slate-600 mx-auto" />
      <p class="text-sm text-slate-400">Belum ada versi tersimpan</p>
    </div>
  {:else}
    <!-- Diff Selector -->
    {#if versions.length >= 2}
      <div class="flex items-center gap-3 flex-wrap">
        <div class="flex items-center gap-2">
          <span class="text-[10px] font-mono text-slate-500">FROM</span>
          <select bind:value={selectedA} class="px-3 py-1.5 rounded-lg bg-[#0a0e17] border border-white/[0.06] text-xs text-white focus:outline-none focus:border-orange-500/30">
            {#each versions as v}
              <option value={v.id}>v{v.versionNum} — {formatDate(v.createdAt)}</option>
            {/each}
          </select>
        </div>
        <span class="text-slate-600">→</span>
        <div class="flex items-center gap-2">
          <span class="text-[10px] font-mono text-slate-500">TO</span>
          <select bind:value={selectedB} class="px-3 py-1.5 rounded-lg bg-[#0a0e17] border border-white/[0.06] text-xs text-white focus:outline-none focus:border-orange-500/30">
            {#each versions as v}
              <option value={v.id}>v{v.versionNum} — {formatDate(v.createdAt)}</option>
            {/each}
          </select>
        </div>
      </div>
    {/if}

    <!-- Version List -->
    {#if viewMode === 'list' || !diffResult}
      <div class="rounded-2xl bg-[#0a0e17] border border-white/[0.06] overflow-hidden">
        <div class="divide-y divide-white/[0.04]">
          {#each versions as v, i}
            <div class="flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <span class="text-sm font-black text-orange-400">v{v.versionNum}</span>
                </div>
                <div>
                  <p class="text-sm font-semibold text-white">{v.title || `Version ${v.versionNum}`}</p>
                  <p class="text-[10px] text-slate-500 font-mono">{formatDate(v.createdAt)}</p>
                  {#if v.qualityScore}
                    <span class="text-[10px] text-emerald-400 font-mono">Skor {v.qualityScore}</span>
                  {/if}
                </div>
              </div>
              <div class="flex items-center gap-2">
                {#if i > 0}
                  <button
                    onclick={() => restoreVersion(v.id)}
                    class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-all"
                  >
                    <RotateCcw class="w-3 h-3" /> Restore
                  </button>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Diff View -->
    {#if diffResult && viewMode === 'diff'}
      <div class="rounded-2xl bg-[#0a0e17] border border-white/[0.06] overflow-hidden">
        <!-- Stats -->
        <div class="flex items-center gap-4 px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
          <button onclick={() => viewMode = 'list'} class="text-xs text-orange-400 hover:text-orange-300">← Kembali</button>
          <div class="flex items-center gap-3 ml-auto">
            <span class="flex items-center gap-1 text-xs text-emerald-400"><Plus class="w-3 h-3" /> {diffResult.stats.addedLines}</span>
            <span class="flex items-center gap-1 text-xs text-red-400"><Minus class="w-3 h-3" /> {diffResult.stats.removedLines}</span>
            <span class="flex items-center gap-1 text-xs text-slate-500"><Equal class="w-3 h-3" /> {diffResult.stats.unchangedLines}</span>
          </div>
        </div>

        <!-- Diff Lines -->
        <div class="font-mono text-xs leading-relaxed max-h-[600px] overflow-y-auto">
          {#each diffResult.added as chunk}
            {#each chunk.lines as line}
              <div class="px-5 py-0.5 bg-emerald-500/5 border-l-2 border-emerald-500/40 text-emerald-300">
                <span class="text-emerald-500/60 mr-3">+</span>{line}
              </div>
            {/each}
          {/each}
          {#each diffResult.removed as chunk}
            {#each chunk.lines as line}
              <div class="px-5 py-0.5 bg-red-500/5 border-l-2 border-red-500/40 text-red-300">
                <span class="text-red-500/60 mr-3">-</span>{line}
              </div>
            {/each}
          {/each}
          {#each diffResult.unchanged as chunk}
            {#each chunk.lines.slice(0, 3) as line}
              <div class="px-5 py-0.5 text-slate-500">
                <span class="text-slate-600 mr-3"> </span>{line}
              </div>
            {/each}
            {#if chunk.lines.length > 3}
              <div class="px-5 py-1 text-slate-600 text-center">... {chunk.lines.length - 3} lines unchanged ...</div>
            {/if}
          {/each}
        </div>
      </div>
    {/if}
  {/if}
</div>
