<script lang="ts">
  import { onMount } from 'svelte';
  import { FileText, FolderOpen, TrendingUp, Zap, ArrowRight, Clock, Sparkles } from 'lucide-svelte';
  import { prdApi } from '$lib/api/prd';
  import type { PrdProject } from '$lib/types/prd';

  let projects = $state<PrdProject[]>([]);
  let totalProjects = $state(0);
  let loading = $state(true);

  onMount(async () => {
    try {
      const res = await prdApi.getProjects({ limit: 5, sort: 'createdAt', order: 'desc' });
      projects = res.data;
      totalProjects = res.total;
    } catch (e) {
      console.error(e);
    } finally {
      loading = false;
    }
  });

  function timeAgo(date: string): string {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m lalu`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h lalu`;
    const days = Math.floor(hours / 24);
    return `${days}d lalu`;
  }

  const statCards = $derived([
    {
      label: 'Total Proyek',
      value: totalProjects,
      icon: FolderOpen,
      accent: 'text-orange-400',
      ring: 'ring-orange-500/10',
      bg: 'bg-gradient-to-br from-orange-500/10 to-transparent',
    },
    {
      label: 'Rata-rata Skor',
      value: projects.length ? Math.round(projects.reduce((a, p) => a + (p.qualityScore ?? 0), 0) / (projects.length || 1)) : 0,
      icon: TrendingUp,
      accent: 'text-emerald-400',
      ring: 'ring-emerald-500/10',
      bg: 'bg-gradient-to-br from-emerald-500/10 to-transparent',
      suffix: '/100',
    },
    {
      label: 'Total Story Points',
      value: projects.reduce((a, p) => a + (p.storyPointsTotal ?? 0), 0),
      icon: Zap,
      accent: 'text-violet-400',
      ring: 'ring-violet-500/10',
      bg: 'bg-gradient-to-br from-violet-500/10 to-transparent',
    },
  ]);
</script>

<div class="space-y-8">
  <!-- Welcome + CTA strip -->
  <div class="relative rounded-2xl overflow-hidden border border-white/[0.04]">
    <div class="absolute inset-0 bg-gradient-to-r from-orange-600/8 via-amber-600/4 to-transparent"></div>
    <div class="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
    <div class="relative px-6 py-5 flex items-center justify-between">
      <div class="space-y-1">
        <h2 class="text-lg font-black text-white tracking-tight">Selamat datang kembali</h2>
        <p class="text-xs text-slate-400">Kelola dan buat dokumen PRD enterprise Anda</p>
      </div>
      <a
        href="/try"
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold text-slate-950 bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-300 hover:to-amber-300 shadow-lg shadow-orange-500/20 transition-all active:scale-[0.97]"
      >
        <Sparkles class="w-3.5 h-3.5" /> Buat PRD Baru
      </a>
    </div>
  </div>

  <!-- Stats -->
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
    {#each statCards as stat}
      <div class="relative rounded-2xl bg-[#0b0f18] border border-white/[0.04] p-5 overflow-hidden group hover:border-white/[0.1] transition-colors">
        <div class="absolute inset-0 {stat.bg} opacity-50"></div>
        <div class="relative flex items-center gap-4">
          <div class="w-11 h-11 rounded-xl ring-1 {stat.ring} flex items-center justify-center">
            <stat.icon class="w-5 h-5 {stat.accent}" />
          </div>
          <div>
            <p class="text-[11px] text-slate-500 font-medium">{stat.label}</p>
            <p class="text-2xl font-black text-white">{stat.value}{#if stat.suffix}<span class="text-sm text-slate-600 ml-0.5">{stat.suffix}</span>{/if}</p>
          </div>
        </div>
      </div>
    {/each}
  </div>

  <!-- Recent Projects -->
  <div class="rounded-2xl bg-[#0b0f18] border border-white/[0.04] overflow-hidden">
    <div class="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.04]">
      <span class="text-xs font-bold text-white">Proyek Terbaru</span>
      <a href="/dashboard/projects" class="text-[11px] text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors">
        Semua <ArrowRight class="w-3 h-3" />
      </a>
    </div>

    {#if loading}
      <div class="p-12 text-center">
        <span class="loading loading-spinner loading-sm text-orange-400"></span>
      </div>
    {:else if projects.length === 0}
      <div class="p-12 text-center space-y-3">
        <div class="w-12 h-12 rounded-xl bg-white/[0.03] flex items-center justify-center mx-auto">
          <FileText class="w-5 h-5 text-slate-600" />
        </div>
        <p class="text-sm text-slate-500">Belum ada proyek PRD</p>
        <a href="/try" class="inline-flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 transition-colors">
          Mulai sekarang <ArrowRight class="w-3 h-3" />
        </a>
      </div>
    {:else}
      <div class="divide-y divide-white/[0.03]">
        {#each projects as project}
          <a
            href="/project/{project.id}"
            class="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.015] transition-colors group"
          >
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center shrink-0 group-hover:bg-orange-500/8 transition-colors">
                <FileText class="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-400 transition-colors" />
              </div>
              <div class="min-w-0">
                <p class="text-xs font-semibold text-white truncate max-w-[250px] group-hover:text-orange-200 transition-colors">{project.title}</p>
                <p class="text-[10px] text-slate-600 truncate">{project.description || 'Tanpa deskripsi'}</p>
              </div>
            </div>
            <div class="flex items-center gap-4 shrink-0 ml-4">
              {#if project.qualityScore}
                <span class="text-[10px] font-mono text-emerald-400/80">{project.qualityScore}</span>
              {/if}
              <span class="flex items-center gap-1 text-[10px] text-slate-600">
                <Clock class="w-3 h-3" /> {timeAgo(project.updatedAt)}
              </span>
            </div>
          </a>
        {/each}
      </div>
    {/if}
  </div>
</div>
