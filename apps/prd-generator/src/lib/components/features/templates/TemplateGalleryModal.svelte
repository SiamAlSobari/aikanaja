<script lang="ts">
  import { onMount } from 'svelte';
  import { LayoutTemplate, X, Check, ArrowRight } from 'lucide-svelte';
  import { prdApi } from '$lib/api/prd';
  import { ui } from '$lib/stores/ui.store';
  import type { PrdTemplate } from '$lib/types/prd';

  let { open = $bindable(false), onselect }: {
    open?: boolean;
    onselect?: (template: PrdTemplate) => void;
  } = $props();

  let templates = $state<PrdTemplate[]>([]);
  let loading = $state(true);
  let activeCategory = $state('all');

  const categories = [
    { value: 'all', label: 'Semua', icon: '📋' },
    { value: 'saas', label: 'SaaS', icon: '☁️' },
    { value: 'ecommerce', label: 'E-Commerce', icon: '🛒' },
    { value: 'mobile', label: 'Mobile', icon: '📱' },
    { value: 'api', label: 'API', icon: '🔌' },
    { value: 'ai', label: 'AI/ML', icon: '🤖' },
  ];

  const categoryColors: Record<string, string> = {
    saas: 'from-orange-500 to-amber-500',
    ecommerce: 'from-amber-500 to-yellow-500',
    mobile: 'from-emerald-500 to-teal-500',
    api: 'from-violet-500 to-purple-500',
    ai: 'from-cyan-500 to-blue-500',
  };

  onMount(async () => {
    if (!open) return;
    try {
      templates = await prdApi.getTemplates();
    } catch {
      templates = [
        { id: '1', name: 'SaaS B2B Platform', description: 'Multi-tenant, RBAC, subscription billing', category: 'saas', templateContent: '', isOfficial: true, createdAt: '' },
        { id: '2', name: 'E-Commerce Marketplace', description: 'Keranjang, checkout, payment gateway', category: 'ecommerce', templateContent: '', isOfficial: true, createdAt: '' },
        { id: '3', name: 'Mobile App MVP', description: 'Core feature, rapid iteration', category: 'mobile', templateContent: '', isOfficial: true, createdAt: '' },
        { id: '4', name: 'REST API Service', description: 'Endpoint mapping, auth flow', category: 'api', templateContent: '', isOfficial: true, createdAt: '' },
        { id: '5', name: 'AI/ML Service', description: 'Model pipeline, inference API', category: 'ai', templateContent: '', isOfficial: true, createdAt: '' },
      ];
    }
    loading = false;
  });

  const filtered = $derived(
    activeCategory === 'all' ? templates : templates.filter((t) => t.category === activeCategory)
  );

  function handleSelect(t: PrdTemplate) {
    onselect?.(t);
    open = false;
  }

  function handleClose() {
    open = false;
  }
</script>

{#if open}
  <div
    class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    onclick={handleClose}
    onkeydown={(e) => e.key === 'Escape' && handleClose()}
    role="presentation"
  >
    <div
      class="w-full max-w-2xl max-h-[80vh] rounded-2xl bg-[#0a0e14] border border-white/[0.08] shadow-2xl flex flex-col overflow-hidden"
      onclick={(e) => e.stopPropagation()}
      role="document"
    >
      <!-- Header -->
      <div class="shrink-0 flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
            <LayoutTemplate class="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-white">Template Gallery</h3>
            <p class="text-[10px] text-slate-500">Pilih template untuk mempercepat pembuatan PRD</p>
          </div>
        </div>
        <button onclick={handleClose} class="p-1.5 rounded-md text-slate-500 hover:text-white hover:bg-white/[0.06] transition-colors">
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Category tabs -->
      <div class="shrink-0 flex items-center gap-1.5 px-6 py-3 border-b border-white/[0.04] overflow-x-auto">
        {#each categories as cat}
          <button
            onclick={() => activeCategory = cat.value}
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all
              {activeCategory === cat.value
                ? 'bg-orange-500/10 text-orange-400 border border-orange-500/15'
                : 'text-slate-500 hover:text-slate-300 bg-white/[0.02] border border-white/[0.04]'}"
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        {/each}
      </div>

      <!-- Templates grid -->
      <div class="flex-1 overflow-y-auto p-6">
        {#if loading}
          <div class="text-center py-12">
            <span class="loading loading-spinner loading-sm text-orange-400"></span>
          </div>
        {:else}
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {#each filtered as template (template.id)}
              <button
                onclick={() => handleSelect(template)}
                class="group text-left p-4 rounded-xl bg-white/[0.015] border border-white/[0.04] hover:border-orange-500/15 transition-all relative overflow-hidden"
              >
                <!-- Top accent -->
                <div class="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r {categoryColors[template.category] || 'from-orange-500 to-amber-500'} opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div class="flex items-start justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <span class="text-lg">{categories.find(c => c.value === template.category)?.icon || '📋'}</span>
                    <div>
                      <p class="text-xs font-bold text-white group-hover:text-orange-200 transition-colors">{template.name}</p>
                      <p class="text-[10px] text-slate-500 uppercase tracking-wider">{template.category}</p>
                    </div>
                  </div>
                  {#if template.isOfficial}
                    <span class="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8px] font-bold text-emerald-300 bg-emerald-500/8 border border-emerald-500/15">
                      <Check class="w-2.5 h-2.5" /> Official
                    </span>
                  {/if}
                </div>

                <p class="text-[11px] text-slate-500 leading-relaxed line-clamp-2 mb-3">{template.description}</p>

                <div class="flex items-center gap-1 text-[10px] text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Gunakan</span>
                  <ArrowRight class="w-3 h-3" />
                </div>
              </button>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}
