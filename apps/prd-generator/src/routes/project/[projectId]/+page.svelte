<script lang="ts">
  import { prd } from '$lib/stores/prd.store';
  import PrdSplitEditor from '$lib/components/features/editor/PrdSplitEditor.svelte';
  import VirtualReviewTab from '$lib/components/features/audit/VirtualReviewTab.svelte';
  import QualityAuditBadge from '$lib/components/features/audit/QualityAuditBadge.svelte';
  import SprintRoadmapView from '$lib/components/features/sprint/SprintRoadmapView.svelte';
  import VersionDiffViewer from '$lib/components/features/version/VersionDiffViewer.svelte';
  import ExportModal from '$lib/components/features/export/ExportModal.svelte';
  import ShareModal from '$lib/components/features/share/ShareModal.svelte';

  let activeTab = $state<'editor' | 'review' | 'audit' | 'sprint' | 'versions'>('editor');
  let showExport = $state(false);
  let showShare = $state(false);

  const tabs = [
    { id: 'editor' as const, label: 'Editor' },
    { id: 'review' as const, label: 'Virtual Review' },
    { id: 'audit' as const, label: 'Quality Audit' },
    { id: 'sprint' as const, label: 'Sprint Plan' },
    { id: 'versions' as const, label: 'Versi' },
  ];
</script>

<div class="h-full flex flex-col">
  <!-- Tab Bar -->
  <div class="shrink-0 border-b border-white/[0.06] bg-[#060a12]/50">
    <div class="flex items-center gap-1 px-4 overflow-x-auto">
      {#each tabs as tab}
        <button
          onclick={() => activeTab = tab.id}
          class="px-4 py-3 text-xs font-semibold whitespace-nowrap transition-all relative
            {activeTab === tab.id
              ? 'text-orange-400'
              : 'text-slate-500 hover:text-slate-300'}"
        >
          {tab.label}
          {#if activeTab === tab.id}
            <div class="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div>
          {/if}
        </button>
      {/each}

      <div class="ml-auto flex items-center gap-2 py-2">
        <button
          onclick={() => showExport = true}
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-slate-400 hover:text-white bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-all"
        >
          Export
        </button>
        <button
          onclick={() => showShare = true}
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-slate-400 hover:text-white bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-all"
        >
          Share
        </button>
      </div>
    </div>
  </div>

  <!-- Content -->
  <div class="flex-1 overflow-hidden">
    {#if activeTab === 'editor'}
      <PrdSplitEditor />
    {:else if activeTab === 'review'}
      <div class="h-full overflow-y-auto p-6">
        <VirtualReviewTab />
      </div>
    {:else if activeTab === 'audit'}
      <div class="h-full overflow-y-auto p-6">
        <QualityAuditBadge />
      </div>
    {:else if activeTab === 'sprint'}
      <div class="h-full overflow-y-auto p-6">
        <SprintRoadmapView />
      </div>
    {:else if activeTab === 'versions'}
      <div class="h-full overflow-y-auto p-6">
        <VersionDiffViewer />
      </div>
    {/if}
  </div>
</div>

<ExportModal bind:open={showExport} />
<ShareModal bind:open={showShare} />
