<script lang="ts">
  import { onMount } from 'svelte';
  import { LayoutTemplate, FileText, ArrowRight, Check } from 'lucide-svelte';
  import { prdApi } from '$lib/api/prd';
  import type { PrdTemplate } from '$lib/types/prd';

  let templates = $state<PrdTemplate[]>([]);
  let loading = $state(true);
  let activeCategory = $state('all');

  const categories = [
    { value: 'all', label: 'Semua' },
    { value: 'saas', label: 'SaaS' },
    { value: 'ecommerce', label: 'E-Commerce' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'api', label: 'API' },
    { value: 'ai', label: 'AI' },
  ];

  const categoryColors: Record<string, string> = {
    saas: 'from-orange-500 to-amber-500',
    ecommerce: 'from-amber-500 to-yellow-500',
    mobile: 'from-emerald-500 to-teal-500',
    api: 'from-violet-500 to-purple-500',
    ai: 'from-cyan-500 to-blue-500',
  };

  const categoryIcons: Record<string, string> = {
    saas: 'S',
    ecommerce: 'E',
    mobile: 'M',
    api: 'A',
    ai: 'AI',
  };

  onMount(async () => {
    try {
      templates = await prdApi.getTemplates();
    } catch {
      // Fallback static templates
      templates = [
        { id: '1', name: 'SaaS B2B Platform', description: 'Template lengkap untuk produk SaaS Business-to-Business dengan fitur multi-tenant, role-based access, dan subscription billing.', category: 'saas', templateContent: '', isOfficial: true, createdAt: new Date().toISOString() },
        { id: '2', name: 'E-Commerce Marketplace', description: 'Template untuk platform jual-beli online dengan fitur keranjang, checkout, payment gateway, dan manajemen produk.', category: 'ecommerce', templateContent: '', isOfficial: true, createdAt: new Date().toISOString() },
        { id: '3', name: 'Mobile App MVP', description: 'Template ringkas untuk Minimum Viable Product aplikasi mobile dengan fokus core feature dan rapid iteration.', category: 'mobile', templateContent: '', isOfficial: true, createdAt: new Date().toISOString() },
        { id: '4', name: 'REST API Service', description: 'Template untuk dokumentasi API RESTful dengan endpoint mapping, request/response schema, dan authentication flow.', category: 'api', templateContent: '', isOfficial: true, createdAt: new Date().toISOString() },
        { id: '5', name: 'AI/ML Service', description: 'Template untuk layanan berbasis AI/ML dengan model pipeline, inference API, dan monitoring metrics.', category: 'ai', templateContent: '', isOfficial: true, createdAt: new Date().toISOString() },
      ];
    } finally {
      loading = false;
    }
  });

  const filtered = $derived(
    activeCategory === 'all'
      ? templates
      : templates.filter((t) => t.category === activeCategory)
  );
</script>

<div class="space-y-6">
  <div>
    <h1 class="text-xl font-black text-white">Template PRD</h1>
    <p class="text-sm text-slate-500 mt-1">Pilih template untuk mempercepat pembuatan PRD</p>
  </div>

  <!-- Category Filter -->
  <div class="flex items-center gap-2 overflow-x-auto pb-2">
    {#each categories as cat}
      <button
        onclick={() => activeCategory = cat.value}
        class="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all
          {activeCategory === cat.value
            ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
            : 'text-slate-500 hover:text-slate-300 bg-white/[0.02] border border-white/[0.06]'}"
      >
        {cat.label}
      </button>
    {/each}
  </div>

  <!-- Templates Grid -->
  {#if loading}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {#each Array(6) as _}
        <div class="rounded-2xl bg-[#0a0e17] border border-white/[0.06] p-6 animate-pulse">
          <div class="w-12 h-12 rounded-xl bg-white/[0.05] mb-4"></div>
          <div class="h-5 bg-white/[0.05] rounded-lg w-2/3 mb-3"></div>
          <div class="space-y-2">
            <div class="h-3 bg-white/[0.03] rounded-lg w-full"></div>
            <div class="h-3 bg-white/[0.03] rounded-lg w-4/5"></div>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {#each filtered as template (template.id)}
        <div class="group relative rounded-2xl bg-[#0a0e17] border border-white/[0.06] p-6 hover:border-orange-500/20 transition-all duration-300 overflow-hidden">
          <!-- Category accent line -->
          <div class="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r {categoryColors[template.category] || 'from-orange-500 to-amber-500'} opacity-40 group-hover:opacity-100 transition-opacity"></div>

          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br {categoryColors[template.category] || 'from-orange-500 to-amber-500'} bg-opacity-10 flex items-center justify-center" style="background: linear-gradient(135deg, rgba(255,107,0,0.1), rgba(245,158,11,0.1))">
              <span class="text-sm font-black text-orange-400">{categoryIcons[template.category] || 'T'}</span>
            </div>
            {#if template.isOfficial}
              <span class="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold">
                <Check class="w-3 h-3" /> Official
              </span>
            {/if}
          </div>

          <h3 class="text-base font-bold text-white group-hover:text-orange-300 transition-colors mb-2">{template.name}</h3>
          <p class="text-xs text-slate-500 leading-relaxed mb-5 line-clamp-3">{template.description}</p>

          <a
            href="/try?template={template.id}"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-orange-400 bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/20 transition-all"
          >
            Gunakan Template <ArrowRight class="w-3 h-3" />
          </a>
        </div>
      {/each}
    </div>
  {/if}
</div>
