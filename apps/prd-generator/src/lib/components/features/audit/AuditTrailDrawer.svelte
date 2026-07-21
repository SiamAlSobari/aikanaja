<script lang="ts">
  import { onMount } from 'svelte';
  import { ClipboardList, X, Clock, FileText, Pencil, Share2, Download, RotateCcw, Sparkles } from 'lucide-svelte';
  import { prdApi } from '$lib/api/prd';
  import { prd } from '$lib/stores/prd.store';
  import type { PrdAuditLog } from '$lib/types/prd';

  let { open = $bindable(false) }: { open?: boolean } = $props();
  let logs = $state<PrdAuditLog[]>([]);
  let loading = $state(true);

  const projectId = $derived($prd.currentProject?.id);

  $effect(() => {
    if (open && projectId) {
      loadLogs();
    }
  });

  async function loadLogs() {
    if (!projectId) return;
    loading = true;
    try {
      logs = await prdApi.getAuditLogs(projectId);
    } catch { /* silent */ }
    loading = false;
  }

  function timeAgo(date: string): string {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'baru saja';
    if (mins < 60) return `${mins}m lalu`;
    const hours = Math.floor(mins / 60);
    return `${hours}j lalu`;
  }

  const actionConfig: Record<string, { icon: typeof FileText; color: string; label: string }> = {
    create: { icon: FileText, color: 'text-emerald-400 bg-emerald-500/8', label: 'Created' },
    copilot_edit: { icon: Pencil, color: 'text-orange-400 bg-orange-500/8', label: 'Copilot Edit' },
    virtual_review: { icon: Sparkles, color: 'text-violet-400 bg-violet-500/8', label: 'Virtual Review' },
    version_restore: { icon: RotateCcw, color: 'text-amber-400 bg-amber-500/8', label: 'Version Restore' },
    export: { icon: Download, color: 'text-cyan-400 bg-cyan-500/8', label: 'Export' },
    share: { icon: Share2, color: 'text-pink-400 bg-pink-500/8', label: 'Share' },
  };

  function handleClose() {
    open = false;
  }
</script>

{#if open}
  <!-- Backdrop -->
  <div
    class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
    onclick={handleClose}
    onkeydown={(e) => e.key === 'Escape' && handleClose()}
    role="presentation"
  ></div>

  <!-- Drawer — slides from bottom -->
  <div class="fixed bottom-0 left-0 right-0 z-50 max-h-[70vh] bg-[#0a0e14] border-t border-white/[0.08] rounded-t-2xl shadow-2xl flex flex-col overflow-hidden">
    <!-- Handle bar -->
    <div class="shrink-0 flex justify-center pt-3 pb-1">
      <div class="w-10 h-1 rounded-full bg-white/[0.08]"></div>
    </div>

    <!-- Header -->
    <div class="shrink-0 flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
      <div class="flex items-center gap-2.5">
        <ClipboardList class="w-4 h-4 text-orange-400" />
        <h3 class="text-xs font-bold text-white">Audit Trail</h3>
        {#if logs.length > 0}
          <span class="px-1.5 py-0.5 rounded text-[9px] font-mono text-slate-500 bg-white/[0.03]">{logs.length}</span>
        {/if}
      </div>
      <button onclick={handleClose} class="p-1.5 rounded-md text-slate-500 hover:text-white hover:bg-white/[0.06] transition-colors">
        <X class="w-4 h-4" />
      </button>
    </div>

    <!-- Timeline -->
    <div class="flex-1 overflow-y-auto px-5 py-4">
      {#if loading}
        <div class="text-center py-8">
          <span class="loading loading-spinner loading-sm text-orange-400"></span>
        </div>
      {:else if logs.length === 0}
        <div class="text-center py-8 space-y-2">
          <ClipboardList class="w-6 h-6 text-slate-600 mx-auto" />
          <p class="text-[11px] text-slate-500">Belum ada aktivitas</p>
        </div>
      {:else}
        <!-- Timeline with vertical line -->
        <div class="relative pl-6">
          <!-- Vertical line -->
          <div class="absolute left-[9px] top-2 bottom-2 w-px bg-white/[0.06]"></div>

          <div class="space-y-4">
            {#each logs as log, i}
              {@const config = actionConfig[log.action] || { icon: FileText, color: 'text-slate-400 bg-white/[0.04]', label: log.action }}
              <div class="relative flex items-start gap-3 group">
                <!-- Timeline dot -->
                <div class="absolute left-[-17px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#0a0e14] border-2 {config.color.includes('emerald') ? 'border-emerald-400' : config.color.includes('orange') ? 'border-orange-400' : config.color.includes('violet') ? 'border-violet-400' : config.color.includes('amber') ? 'border-amber-400' : config.color.includes('cyan') ? 'border-cyan-400' : config.color.includes('pink') ? 'border-pink-400' : 'border-slate-400'} z-10"></div>

                <!-- Content -->
                <div class="flex-1 min-w-0 px-3 py-2.5 rounded-xl bg-white/[0.015] border border-white/[0.03] group-hover:border-white/[0.06] transition-colors">
                  <div class="flex items-center justify-between mb-1">
                    <div class="flex items-center gap-2">
                      <span class="text-[10px] font-bold text-white">{config.label}</span>
                      {#if log.sectionName}
                        <span class="text-[9px] text-slate-600 font-mono">in {log.sectionName}</span>
                      {/if}
                    </div>
                    <span class="flex items-center gap-1 text-[9px] text-slate-600 font-mono">
                      <Clock class="w-2.5 h-2.5" /> {timeAgo(log.createdAt)}
                    </span>
                  </div>
                  {#if log.details}
                    <p class="text-[10px] text-slate-500 leading-relaxed line-clamp-2">{log.details}</p>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}
