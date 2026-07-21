<script lang="ts">
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import { ArrowLeft, Save, Share2, Download, History, Sparkles, Check, Loader2 } from 'lucide-svelte';
  import { prdApi } from '$lib/api/prd';
  import { prd } from '$lib/stores/prd.store';
  import { ui } from '$lib/stores/ui.store';
  import type { PrdProject } from '$lib/types/prd';
  import CopilotSidebar from '$lib/components/features/copilot/CopilotSidebar.svelte';
  import ExportModal from '$lib/components/features/export/ExportModal.svelte';
  import ShareModal from '$lib/components/features/share/ShareModal.svelte';

  let { children } = $props();
  let loading = $state(true);
  let saving = $state(false);
  let saveStatus = $state<'saved' | 'unsaved' | 'saving'>('saved');
  let copilotOpen = $state(true);
  let showExport = $state(false);
  let showShare = $state(false);

  const projectId = $derived(String(page.params.projectId || ''));

  onMount(async () => {
    try {
      const data = await prdApi.getProject(projectId);
      prd.setCurrentProject(data);
    } catch {
      ui.addToast('Gagal memuat proyek', 'error');
    } finally {
      loading = false;
    }
  });

  async function handleSave() {
    const project = $prd.currentProject;
    if (!project) return;
    saving = true;
    saveStatus = 'saving';
    try {
      await prdApi.update(project.id, { content: $prd.rawMarkdown });
      saveStatus = 'saved';
    } catch {
      ui.addToast('Gagal menyimpan', 'error');
      saveStatus = 'unsaved';
    } finally {
      saving = false;
    }
  }

  async function saveVersion() {
    const project = $prd.currentProject;
    if (!project) return;
    try {
      await prdApi.createVersion(project.id, { content: $prd.rawMarkdown });
      ui.addToast('Versi tersimpan', 'success');
    } catch {
      ui.addToast('Gagal menyimpan versi', 'error');
    }
  }
</script>

<div class="h-screen flex flex-col bg-[#030712] overflow-hidden">
  <!-- Header -->
  <header class="h-14 shrink-0 border-b border-white/[0.06] bg-[#060a12]/90 backdrop-blur-xl flex items-center justify-between px-4 z-30">
    <div class="flex items-center gap-3 min-w-0">
      <a href="/dashboard/projects" class="p-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/[0.04] transition-all shrink-0">
        <ArrowLeft class="w-4 h-4" />
      </a>
      <div class="h-4 w-px bg-white/[0.06]"></div>
      {#if loading}
        <div class="h-4 w-40 bg-white/[0.04] rounded animate-pulse"></div>
      {:else}
        <div class="min-w-0">
          <h1 class="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-[300px]">{$prd.currentProject?.title}</h1>
          <div class="flex items-center gap-2 text-[10px]">
            {#if saveStatus === 'saved'}
              <span class="flex items-center gap-1 text-emerald-400"><Check class="w-3 h-3" /> saved</span>
            {:else if saveStatus === 'saving'}
              <span class="flex items-center gap-1 text-amber-400"><Loader2 class="w-3 h-3 animate-spin" /> saving...</span>
            {:else}
              <span class="text-amber-400">unsaved</span>
            {/if}
          </div>
        </div>
      {/if}
    </div>

    <div class="flex items-center gap-1.5">
      <button
        onclick={handleSave}
        disabled={saving || saveStatus === 'saved'}
        class="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold transition-all
          {saveStatus === 'unsaved' ? 'text-orange-400 bg-orange-500/10 border border-orange-500/20' : 'text-slate-600 bg-white/[0.02] border border-white/[0.04] cursor-not-allowed'}"
      >
        <Save class="w-3.5 h-3.5" /> Save
      </button>
      <button onclick={saveVersion} class="p-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/[0.04] transition-all" title="Save Version">
        <History class="w-4 h-4" />
      </button>
      <div class="h-4 w-px bg-white/[0.06]"></div>
      <button onclick={() => showExport = true} class="p-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/[0.04] transition-all" title="Export">
        <Download class="w-4 h-4" />
      </button>
      <button onclick={() => showShare = true} class="p-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/[0.04] transition-all" title="Share">
        <Share2 class="w-4 h-4" />
      </button>
      <button
        onclick={() => copilotOpen = !copilotOpen}
        class="p-2 rounded-xl transition-all {copilotOpen ? 'text-orange-400 bg-orange-500/10 border border-orange-500/20' : 'text-slate-500 hover:text-white hover:bg-white/[0.04]'}"
        title="AI Copilot"
      >
        <Sparkles class="w-4 h-4" />
      </button>
    </div>
  </header>

  <!-- Body -->
  <div class="flex-1 flex overflow-hidden">
    <!-- Main -->
    <div class="flex-1 overflow-hidden">
      {#if loading}
        <div class="h-full flex items-center justify-center">
          <div class="text-center space-y-3">
            <Loader2 class="w-8 h-8 text-orange-400 animate-spin mx-auto" />
            <p class="text-xs text-slate-500">Memuat proyek...</p>
          </div>
        </div>
      {:else}
        {@render children()}
      {/if}
    </div>

    <!-- Copilot -->
    {#if copilotOpen && !loading}
      <aside class="w-80 xl:w-96 border-l border-white/[0.06] bg-[#060a12] flex flex-col shrink-0 overflow-hidden">
        <CopilotSidebar />
      </aside>
    {/if}
  </div>
</div>

<ExportModal bind:open={showExport} />
<ShareModal bind:open={showShare} />
