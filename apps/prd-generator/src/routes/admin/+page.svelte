<script lang="ts">
  import { onMount } from 'svelte';
  import { Users, FolderOpen, Activity, TrendingUp, BarChart3 } from 'lucide-svelte';

  let stats = $state({ users: 0, projects: 0, activeProjects: 0, totalVersions: 0 });
  let loading = $state(true);

  onMount(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/admin/prd/stats`, {
        credentials: 'include',
      });
      if (res.ok) {
        stats = await res.json();
      }
    } catch { /* silent */ }
    loading = false;
  });

  const cards = $derived([
    { label: 'Total Users', value: stats.users, icon: Users, accent: 'text-orange-400', bg: 'bg-orange-500/8' },
    { label: 'Total Projects', value: stats.projects, icon: FolderOpen, accent: 'text-amber-400', bg: 'bg-amber-500/8' },
    { label: 'Active Projects', value: stats.activeProjects, icon: Activity, accent: 'text-emerald-400', bg: 'bg-emerald-500/8' },
    { label: 'Total Versions', value: stats.totalVersions, icon: TrendingUp, accent: 'text-violet-400', bg: 'bg-violet-500/8' },
  ]);
</script>

<div class="space-y-6">
  <div>
    <h2 class="text-lg font-black text-white tracking-tight">Overview</h2>
    <p class="text-[11px] text-slate-500 mt-0.5">Statistik sistem PRD Generator</p>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {#each cards as card}
      <div class="rounded-2xl bg-[#0b0f18] border border-white/[0.04] p-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl {card.bg} flex items-center justify-center">
            <card.icon class="w-5 h-5 {card.accent}" />
          </div>
          <div>
            <p class="text-[11px] text-slate-500">{card.label}</p>
            <p class="text-xl font-black text-white">{loading ? '—' : card.value}</p>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
