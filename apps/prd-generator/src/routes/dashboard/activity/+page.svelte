<script lang="ts">
  import { onMount } from 'svelte';
  import { Activity, FileText, GitBranch, Download, Share2, RotateCcw, Pencil, Clock } from 'lucide-svelte';
  import { prdApi } from '$lib/api/prd';
  import type { PrdAuditLog } from '$lib/types/prd';

  let logs = $state<PrdAuditLog[]>([]);
  let loading = $state(true);

  const actionConfig: Record<string, { icon: typeof FileText; color: string; label: string }> = {
    create: { icon: FileText, color: 'text-emerald-400 bg-emerald-500/10', label: 'Membuat PRD' },
    copilot_edit: { icon: Pencil, color: 'text-orange-400 bg-orange-500/10', label: 'Copilot Edit' },
    virtual_review: { icon: Activity, color: 'text-violet-400 bg-violet-500/10', label: 'Virtual Review' },
    version_restore: { icon: RotateCcw, color: 'text-amber-400 bg-amber-500/10', label: 'Restore Versi' },
    export: { icon: Download, color: 'text-cyan-400 bg-cyan-500/10', label: 'Export' },
    share: { icon: Share2, color: 'text-pink-400 bg-pink-500/10', label: 'Share' },
  };

  onMount(async () => {
    try {
      // We need a project ID to fetch audit logs — load projects first
      const projects = await prdApi.getProjects({ limit: 100 });
      const allLogs: PrdAuditLog[] = [];
      for (const p of projects.data.slice(0, 10)) {
        try {
          const pLogs = await prdApi.getAuditLogs(p.id);
          allLogs.push(...pLogs);
        } catch { /* skip */ }
      }
      logs = allLogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 50);
    } catch {
      // silent
    } finally {
      loading = false;
    }
  });

  function timeAgo(date: string): string {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Baru saja';
    if (mins < 60) return `${mins}m lalu`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h lalu`;
    const days = Math.floor(hours / 24);
    return `${days}d lalu`;
  }
</script>

<div class="space-y-6">
  <div>
    <h1 class="text-xl font-black text-white">Aktivitas</h1>
    <p class="text-sm text-slate-500 mt-1">Riwayat audit trail semua aktivitas PRD Anda</p>
  </div>

  <div class="rounded-2xl bg-[#0a0e17] border border-white/[0.06] overflow-hidden">
    {#if loading}
      <div class="p-12 text-center">
        <span class="loading loading-spinner loading-md text-orange-400"></span>
      </div>
    {:else if logs.length === 0}
      <div class="p-12 text-center space-y-3">
        <Activity class="w-10 h-10 text-slate-600 mx-auto" />
        <p class="text-sm text-slate-400">Belum ada aktivitas</p>
      </div>
    {:else}
      <div class="divide-y divide-white/[0.04]">
        {#each logs as log}
          {@const config = actionConfig[log.action] || { icon: FileText, color: 'text-slate-400 bg-slate-500/10', label: log.action }}
          <div class="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors">
            <div class="w-9 h-9 rounded-xl {config.color} flex items-center justify-center shrink-0">
              <config.icon class="w-4 h-4" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-white">{config.label}</p>
              {#if log.sectionName}
                <p class="text-xs text-slate-500 truncate">Section: {log.sectionName}</p>
              {/if}
            </div>
            <div class="flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
              <Clock class="w-3 h-3" />
              <span>{timeAgo(log.createdAt)}</span>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
