<script lang="ts">
  import { X, Share2, Copy, Check, ExternalLink, Clock, Loader2 } from 'lucide-svelte';
  import { prd } from '$lib/stores/prd.store';
  import { prdApi } from '$lib/api/prd';
  import { ui } from '$lib/stores/ui.store';
  import Spinner from '$lib/components/ui/Spinner.svelte';

  let { open = $bindable(false) }: { open?: boolean } = $props();
  let shareLink = $state('');
  let isGenerating = $state(false);
  let copied = $state(false);
  let expiresIn = $state('7 hari');

  const projectId = $derived($prd.currentProject?.id);

  async function generateLink() {
    if (!projectId) return;
    isGenerating = true;
    try {
      const token = await prdApi.share(projectId, 7);
      shareLink = `${window.location.origin}/share/${token}`;
    } catch {
      ui.addToast('Gagal generate share link', 'error');
    } finally {
      isGenerating = false;
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareLink);
      copied = true;
      ui.addToast('Link disalin!', 'success');
      setTimeout(() => copied = false, 2000);
    } catch {
      ui.addToast('Gagal menyalin link', 'error');
    }
  }

  function handleClose() {
    open = false;
    shareLink = '';
    copied = false;
  }

  $effect(() => {
    if (open && projectId && !shareLink) {
      generateLink();
    }
  });
</script>

{#if open}
  <div
    class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    onclick={handleClose}
    onkeydown={(e) => e.key === 'Escape' && handleClose()}
    role="presentation"
  >
    <div
      class="w-full max-w-md rounded-3xl bg-[#0c1019] border border-white/[0.08] shadow-2xl overflow-hidden"
      onclick={(e) => e.stopPropagation()}
      role="document"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
            <Share2 class="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 class="text-base font-bold text-white">Share PRD</h2>
            <p class="text-xs text-slate-500">Buat tautan read-only publik</p>
          </div>
        </div>
        <button onclick={handleClose} class="p-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/[0.06] transition-all">
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 space-y-5">
        {#if isGenerating}
          <div class="flex items-center justify-center py-8">
            <Spinner size="md" />
          </div>
        {:else if shareLink}
          <!-- Link Display -->
          <div class="relative">
            <div class="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#0a0e17] border border-white/[0.06]">
              <ExternalLink class="w-4 h-4 text-slate-500 shrink-0" />
              <span class="text-xs text-slate-300 truncate flex-1 font-mono">{shareLink}</span>
              <button
                onclick={copyLink}
                class="p-1.5 rounded-lg transition-all {copied ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 hover:text-white hover:bg-white/[0.06]'}"
              >
                {#if copied}
                  <Check class="w-4 h-4" />
                {:else}
                  <Copy class="w-4 h-4" />
                {/if}
              </button>
            </div>
          </div>

          <!-- Info -->
          <div class="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/5 border border-amber-500/10">
            <Clock class="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <p class="text-[11px] text-amber-300">Link berlaku selama {expiresIn}. Siapapun dengan link bisa melihat PRD ini.</p>
          </div>

          <!-- Actions -->
          <div class="flex gap-3">
            <button
              onclick={copyLink}
              class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-white bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.06] transition-all"
            >
              {copied ? 'Tersalin!' : 'Salin Link'}
            </button>
            <a
              href={shareLink}
              target="_blank"
              rel="noopener"
              class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-300 hover:to-amber-300 transition-all"
            >
              Buka Link
            </a>
          </div>
        {/if}

        <!-- Regenerate -->
        {#if shareLink && !isGenerating}
          <button
            onclick={() => { shareLink = ''; generateLink(); }}
            class="w-full text-center text-[11px] text-slate-500 hover:text-orange-400 transition-colors"
          >
            Generate link baru
          </button>
        {/if}
      </div>
    </div>
  </div>
{/if}
