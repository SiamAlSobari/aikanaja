<script lang="ts">
  import { onMount } from 'svelte';
  import { FileText, Plus, Search, Filter, Clock, MoreVertical, Trash2, Copy, ExternalLink } from 'lucide-svelte';
  import { prdApi } from '$lib/api/prd';
  import { ui } from '$lib/stores/ui.store';
  import type { PrdProject } from '$lib/types/prd';
  import ProjectCard from '$lib/components/features/project/ProjectCard.svelte';
  import NewProjectModal from '$lib/components/features/project/NewProjectModal.svelte';

  let projects = $state<PrdProject[]>([]);
  let loading = $state(true);
  let searchQuery = $state('');
  let filterStatus = $state('active');
  let showNewModal = $state(false);
  let currentPage = $state(1);
  let totalPages = $state(1);

  async function loadProjects() {
    loading = true;
    try {
      const res = await prdApi.getProjects({
        page: currentPage,
        limit: 12,
        search: searchQuery || undefined,
        filter: filterStatus,
        sort: 'updatedAt',
        order: 'desc',
      });
      projects = res.data;
      totalPages = Math.ceil(res.total / 12);
    } catch (e) {
      ui.addToast('Gagal memuat proyek', 'error');
    } finally {
      loading = false;
    }
  }

  onMount(loadProjects);

  function handleSearch() {
    currentPage = 1;
    loadProjects();
  }

  function handleFilter(status: string) {
    filterStatus = status;
    currentPage = 1;
    loadProjects();
  }

  async function handleDelete(id: string) {
    if (!confirm('Yakin ingin menghapus proyek ini?')) return;
    try {
      await prdApi.delete(id);
      ui.addToast('Proyek dihapus', 'success');
      loadProjects();
    } catch {
      ui.addToast('Gagal menghapus proyek', 'error');
    }
  }

  function handleCreated() {
    showNewModal = false;
    loadProjects();
  }
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
    <div>
      <h1 class="text-xl font-black text-white">Proyek PRD</h1>
      <p class="text-sm text-slate-500 mt-1">Kelola semua dokumen Product Requirement Document Anda</p>
    </div>
    <button
      onclick={() => showNewModal = true}
      class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold text-slate-950 bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-300 hover:to-amber-300 shadow-lg shadow-orange-500/20 transition-all active:scale-95"
    >
      <Plus class="w-4 h-4" /> Proyek Baru
    </button>
  </div>

  <!-- Search & Filter -->
  <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
    <div class="relative flex-1 max-w-md">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
      <input
        type="text"
        bind:value={searchQuery}
        onkeydown={(e) => e.key === 'Enter' && handleSearch()}
        placeholder="Cari proyek..."
        class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0a0e17] border border-white/[0.06] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500/30 transition-colors"
      />
    </div>
    <div class="flex items-center gap-2">
      {#each ['active', 'archived', 'all'] as status}
        <button
          onclick={() => handleFilter(status)}
          class="px-3 py-2 rounded-xl text-xs font-semibold transition-all
            {filterStatus === status
              ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
              : 'text-slate-500 hover:text-slate-300 bg-white/[0.02] border border-white/[0.06]'}"
        >
          {status === 'active' ? 'Aktif' : status === 'archived' ? 'Arsip' : 'Semua'}
        </button>
      {/each}
    </div>
  </div>

  <!-- Projects Grid -->
  {#if loading}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each Array(6) as _}
        <div class="rounded-2xl bg-[#0a0e17] border border-white/[0.06] p-5 animate-pulse">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-xl bg-white/[0.05]"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-white/[0.05] rounded-lg w-2/3"></div>
              <div class="h-3 bg-white/[0.03] rounded-lg w-1/2"></div>
            </div>
          </div>
          <div class="space-y-2">
            <div class="h-3 bg-white/[0.03] rounded-lg w-full"></div>
            <div class="h-3 bg-white/[0.03] rounded-lg w-4/5"></div>
          </div>
        </div>
      {/each}
    </div>
  {:else if projects.length === 0}
    <div class="rounded-2xl bg-[#0a0e17] border border-white/[0.06] p-16 text-center space-y-4">
      <FileText class="w-12 h-12 text-slate-600 mx-auto" />
      <p class="text-sm text-slate-400">
        {searchQuery ? 'Tidak ada proyek yang cocok' : 'Belum ada proyek PRD'}
      </p>
      {#if !searchQuery}
        <button
          onclick={() => showNewModal = true}
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-orange-400 to-amber-400 transition-all"
        >
          <Plus class="w-4 h-4" /> Buat Sekarang
        </button>
      {/if}
    </div>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each projects as project (project.id)}
        <ProjectCard {project} ondelete={handleDelete} />
      {/each}
    </div>

    <!-- Pagination -->
    {#if totalPages > 1}
      <div class="flex justify-center gap-2">
        {#each Array(totalPages) as _, i}
          <button
            onclick={() => { currentPage = i + 1; loadProjects(); }}
            class="w-8 h-8 rounded-lg text-xs font-semibold transition-all
              {currentPage === i + 1
                ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                : 'text-slate-500 hover:text-slate-300 bg-white/[0.02] border border-white/[0.06]'}"
          >
            {i + 1}
          </button>
        {/each}
      </div>
    {/if}
  {/if}
</div>

<NewProjectModal bind:open={showNewModal} oncreated={handleCreated} />
