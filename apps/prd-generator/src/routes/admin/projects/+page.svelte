<script lang="ts">
  import { onMount } from 'svelte';
  import { FolderOpen, User, Clock } from 'lucide-svelte';

  interface AdminProject {
    id: string;
    title: string;
    status: string;
    qualityScore: number | null;
    createdAt: string;
    user?: { name: string; email: string };
  }

  let projects = $state<AdminProject[]>([]);
  let loading = $state(true);

  onMount(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/admin/prd/projects`, {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        projects = data.data ?? [];
      }
    } catch { /* silent */ }
    loading = false;
  });

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  }
</script>

<div class="space-y-6">
  <div>
    <h2 class="text-lg font-black text-white tracking-tight">Projects</h2>
    <p class="text-[11px] text-slate-500 mt-0.5">Semua proyek PRD di seluruh pengguna</p>
  </div>

  <div class="rounded-2xl bg-[#0b0f18] border border-white/[0.04] overflow-hidden">
    {#if loading}
      <div class="p-12 text-center"><span class="loading loading-spinner loading-sm text-orange-400"></span></div>
    {:else if projects.length === 0}
      <div class="p-12 text-center">
        <FolderOpen class="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <p class="text-xs text-slate-500">Tidak ada proyek</p>
      </div>
    {:else}
      <div class="grid grid-cols-12 gap-4 px-5 py-2.5 border-b border-white/[0.04] text-[10px] text-slate-500 font-medium uppercase tracking-wider">
        <div class="col-span-4">Project</div>
        <div class="col-span-3">Author</div>
        <div class="col-span-2">Status</div>
        <div class="col-span-1">Score</div>
        <div class="col-span-2">Date</div>
      </div>
      <div class="divide-y divide-white/[0.03]">
        {#each projects as p}
          <a href="/project/{p.id}" class="grid grid-cols-12 gap-4 px-5 py-3 hover:bg-white/[0.01] transition-colors items-center group">
            <div class="col-span-4">
              <p class="text-xs font-semibold text-white truncate group-hover:text-orange-200 transition-colors">{p.title}</p>
              <p class="text-[10px] text-slate-600 font-mono">{p.id.slice(0, 8)}</p>
            </div>
            <div class="col-span-3 flex items-center gap-1.5">
              <User class="w-3 h-3 text-slate-600" />
              <span class="text-xs text-slate-400 truncate">{p.user?.name ?? '—'}</span>
            </div>
            <div class="col-span-2">
              <span class="px-2 py-0.5 rounded-md text-[10px] font-bold
                {p.status === 'active' ? 'text-emerald-300 bg-emerald-500/8 border border-emerald-500/15' : p.status === 'deleted' ? 'text-red-300 bg-red-500/8 border border-red-500/15' : 'text-slate-400 bg-white/[0.03] border border-white/[0.06]'}">
                {p.status}
              </span>
            </div>
            <div class="col-span-1 text-[11px] font-mono text-slate-400">{p.qualityScore ?? '—'}</div>
            <div class="col-span-2 flex items-center gap-1 text-[10px] text-slate-600">
              <Clock class="w-3 h-3" /> {formatDate(p.createdAt)}
            </div>
          </a>
        {/each}
      </div>
    {/if}
  </div>
</div>
