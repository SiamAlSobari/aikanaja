<script lang="ts">
  import { prd } from '$lib/stores/prd.store';
  import { page } from '$app/state';
  import { ArrowLeft, Save, History, Share2, Download, Sparkles, Check, Loader2, ChevronDown } from 'lucide-svelte';
  import { prdApi } from '$lib/api/prd';
  import { ui } from '$lib/stores/ui.store';

  let { onsave, onshare, onexport }: {
    onsave?: () => void;
    onshare?: () => void;
    onexport?: () => void;
  } = $props();

  let saving = $state(false);
  let saveStatus = $state<'saved' | 'unsaved' | 'saving'>('saved');

  async function handleSave() {
    const project = $prd.currentProject;
    if (!project) return;
    saving = true;
    saveStatus = 'saving';
    try {
      await prdApi.update(project.id, { content: $prd.rawMarkdown });
      saveStatus = 'saved';
      ui.addToast('Tersimpan', 'success');
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

<div class="flex items-center justify-between px-4 py-2 border-b border-white/[0.04]">
  <div class="flex items-center gap-3">
    <a
      href="/dashboard/projects"
      class="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.04] transition-all"
    >
      <ArrowLeft class="w-4 h-4" />
    </a>
    <div class="h-4 w-px bg-white/[0.06]"></div>
    <span class="text-xs text-slate-500 font-mono truncate max-w-[200px]">{$prd.currentProject?.title}</span>
  </div>

  <div class="flex items-center gap-2">
    {#if saveStatus === 'saved'}
      <span class="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
        <Check class="w-3 h-3" /> saved
      </span>
    {:else if saveStatus === 'saving'}
      <span class="flex items-center gap-1 text-[10px] text-amber-400 font-mono">
        <Loader2 class="w-3 h-3 animate-spin" /> saving
      </span>
    {:else}
      <span class="text-[10px] text-amber-400 font-mono">unsaved</span>
    {/if}

    <button
      onclick={handleSave}
      disabled={saving || saveStatus === 'saved'}
      class="p-1.5 rounded-lg transition-all
        {saveStatus === 'unsaved'
          ? 'text-orange-400 hover:bg-orange-500/10'
          : 'text-slate-600 cursor-not-allowed'}"
      title="Save (Ctrl+S)"
    >
      <Save class="w-4 h-4" />
    </button>

    <button
      onclick={saveVersion}
      class="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.04] transition-all"
      title="Save Version"
    >
      <History class="w-4 h-4" />
    </button>

    <div class="h-4 w-px bg-white/[0.06]"></div>

    <button
      onclick={onexport}
      class="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.04] transition-all"
      title="Export"
    >
      <Download class="w-4 h-4" />
    </button>

    <button
      onclick={onshare}
      class="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.04] transition-all"
      title="Share"
    >
      <Share2 class="w-4 h-4" />
    </button>
  </div>
</div>
