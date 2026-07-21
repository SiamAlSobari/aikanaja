<script lang="ts">
  import { X, FileText, ArrowRight } from 'lucide-svelte';
  import { prdApi } from '$lib/api/prd';
  import { ui } from '$lib/stores/ui.store';
  import Spinner from '$lib/components/ui/Spinner.svelte';

  let { open = $bindable(false), oncreated }: { open?: boolean; oncreated?: () => void } = $props();
  let title = $state('');
  let description = $state('');
  let templateType = $state('saas');
  let isSubmitting = $state(false);

  const templates = [
    { value: 'saas', label: 'SaaS B2B', emoji: 'S' },
    { value: 'ecommerce', label: 'E-Commerce', emoji: 'E' },
    { value: 'mobile', label: 'Mobile App', emoji: 'M' },
    { value: 'api', label: 'API Service', emoji: 'A' },
    { value: 'custom', label: 'Custom', emoji: 'C' },
  ];

  async function handleSubmit() {
    if (!title.trim()) {
      ui.addToast('Judul wajib diisi', 'warning');
      return;
    }
    isSubmitting = true;
    try {
      await prdApi.create({ title: title.trim(), description: description.trim(), templateType });
      ui.addToast('Proyek berhasil dibuat!', 'success');
      title = '';
      description = '';
      templateType = 'saas';
      oncreated?.();
    } catch {
      ui.addToast('Gagal membuat proyek', 'error');
    } finally {
      isSubmitting = false;
    }
  }

  function handleClose() {
    open = false;
    title = '';
    description = '';
    templateType = 'saas';
  }
</script>

{#if open}
  <!-- Backdrop -->
  <div
    class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    onclick={handleClose}
    onkeydown={(e) => e.key === 'Escape' && handleClose()}
    role="presentation"
  >
    <!-- Modal -->
    <div
      class="w-full max-w-lg rounded-3xl bg-[#0c1019] border border-white/[0.08] shadow-2xl overflow-hidden"
      onclick={(e) => e.stopPropagation()}
      role="document"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
            <FileText class="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 class="text-base font-bold text-white">Proyek Baru</h2>
            <p class="text-xs text-slate-500">Buat dokumen PRD baru</p>
          </div>
        </div>
        <button onclick={handleClose} class="p-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/[0.06] transition-all">
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Body -->
      <div class="px-6 py-5 space-y-5">
        <!-- Title -->
        <div>
          <label class="text-xs font-semibold text-slate-400 mb-2 block">Judul Proyek *</label>
          <input
            type="text"
            bind:value={title}
            placeholder="Contoh: Sistem Manajemen Inventaris"
            class="w-full px-4 py-3 rounded-xl bg-[#0a0e17] border border-white/[0.06] text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500/30 transition-colors"
          />
        </div>

        <!-- Description -->
        <div>
          <label class="text-xs font-semibold text-slate-400 mb-2 block">Deskripsi</label>
          <textarea
            bind:value={description}
            placeholder="Jelaskan visi produk Anda secara singkat..."
            rows="2"
            class="w-full px-4 py-3 rounded-xl bg-[#0a0e17] border border-white/[0.06] text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500/30 transition-colors resize-none"
          ></textarea>
        </div>

        <!-- Template Type -->
        <div>
          <label class="text-xs font-semibold text-slate-400 mb-2 block">Template</label>
          <div class="grid grid-cols-5 gap-2">
            {#each templates as tpl}
              <button
                onclick={() => templateType = tpl.value}
                class="flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all
                  {templateType === tpl.value
                    ? 'bg-orange-500/10 border-orange-500/30 text-orange-400'
                    : 'bg-white/[0.02] border-white/[0.06] text-slate-500 hover:text-slate-300 hover:border-white/[0.12]'}"
              >
                <span class="text-sm font-black">{tpl.emoji}</span>
                <span class="text-[10px] font-medium">{tpl.label}</span>
              </button>
            {/each}
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/[0.06] bg-white/[0.01]">
        <button
          onclick={handleClose}
          class="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-white/[0.04] border border-white/[0.06] transition-all"
        >
          Batal
        </button>
        <button
          onclick={handleSubmit}
          disabled={isSubmitting || !title.trim()}
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold text-slate-950 bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-300 hover:to-amber-300 shadow-lg shadow-orange-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {#if isSubmitting}
            <Spinner size="sm" />
          {:else}
            Buat Proyek <ArrowRight class="w-3.5 h-3.5" />
          {/if}
        </button>
      </div>
    </div>
  </div>
{/if}
