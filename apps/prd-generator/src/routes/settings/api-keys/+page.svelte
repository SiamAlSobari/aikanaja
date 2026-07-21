<script lang="ts">
  import { onMount } from 'svelte';
  import { Key, Eye, EyeOff, CheckCircle, AlertTriangle, Trash2 } from 'lucide-svelte';
  import { ui } from '$lib/stores/ui.store';

  const STORAGE_KEY = 'prd_custom_api_key';

  let apiKey = $state('');
  let showKey = $state(false);
  let saved = $state(false);

  onMount(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      apiKey = stored;
      saved = true;
    }
  });

  function saveKey() {
    if (!apiKey.trim()) {
      localStorage.removeItem(STORAGE_KEY);
      saved = false;
      ui.addToast('API Key dihapus', 'info');
      return;
    }
    localStorage.setItem(STORAGE_KEY, apiKey.trim());
    saved = true;
    ui.addToast('API Key tersimpan di browser', 'success');
  }

  function clearKey() {
    localStorage.removeItem(STORAGE_KEY);
    apiKey = '';
    saved = false;
    ui.addToast('API Key dihapus', 'info');
  }

  function maskedKey(key: string): string {
    if (key.length <= 12) return '••••••••';
    return key.slice(0, 6) + '••••••' + key.slice(-4);
  }
</script>

<div class="space-y-6 max-w-lg">
  <div>
    <h2 class="text-lg font-black text-white tracking-tight">API Keys</h2>
    <p class="text-[11px] text-slate-500 mt-0.5">Gunakan API Key sendiri untuk AI provider. Disimpan 100% di browser Anda.</p>
  </div>

  <!-- Security notice -->
  <div class="flex items-start gap-3 px-4 py-3 rounded-xl bg-emerald-500/[0.03] border border-emerald-500/10">
    <CheckCircle class="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
    <div>
      <p class="text-xs font-semibold text-emerald-300">Zero-Persistence Security</p>
      <p class="text-[10px] text-slate-500 mt-0.5">API Key hanya disimpan di localStorage browser Anda. Tidak pernah dikirim ke server AiKanAja.</p>
    </div>
  </div>

  <div class="rounded-2xl bg-[#0b0f18] border border-white/[0.04] p-6 space-y-5">
    <!-- Provider info -->
    <div class="space-y-2">
      <p class="text-xs font-bold text-white">Supported Providers</p>
      <div class="flex items-center gap-2">
        <span class="px-2 py-0.5 rounded-md text-[10px] font-mono text-blue-300 bg-blue-500/8 border border-blue-500/15">Google Gemini 2.0 Flash</span>
        <span class="px-2 py-0.5 rounded-md text-[10px] font-mono text-purple-300 bg-purple-500/8 border border-purple-500/15">Groq Llama 3.3 70B</span>
      </div>
    </div>

    <!-- API Key input -->
    <div>
      <label for="api-key-input" class="text-[11px] font-semibold text-slate-400 mb-1.5 block">Custom API Key</label>
      <div class="relative">
        <input
          id="api-key-input"
          type={showKey ? 'text' : 'password'}
          bind:value={apiKey}
          placeholder="AIza... atau gsk_..."
          class="w-full px-4 py-2.5 pr-20 rounded-xl bg-[#0a0e14] border border-white/[0.04] text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-orange-500/20 transition-colors"
        />
        <div class="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <button
            onclick={() => showKey = !showKey}
            class="p-1.5 rounded-md text-slate-500 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            {#if showKey}<EyeOff class="w-3.5 h-3.5" />{:else}<Eye class="w-3.5 h-3.5" />{/if}
          </button>
        </div>
      </div>
      {#if saved}
        <p class="text-[10px] text-emerald-400 mt-1.5 flex items-center gap-1">
          <CheckCircle class="w-3 h-3" /> Key aktif: {maskedKey(apiKey)}
        </p>
      {/if}
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-3">
      <button
        onclick={saveKey}
        class="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-300 hover:to-amber-300 transition-all"
      >
        {saved ? 'Update Key' : 'Simpan Key'}
      </button>
      {#if saved}
        <button
          onclick={clearKey}
          class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 transition-colors"
        >
          <Trash2 class="w-3 h-3" /> Hapus
        </button>
      {/if}
    </div>
  </div>

  <!-- How it works -->
  <div class="rounded-2xl bg-[#0b0f18] border border-white/[0.04] p-5 space-y-3">
    <p class="text-xs font-bold text-white">Cara Kerja</p>
    <div class="space-y-2 text-[11px] text-slate-400 leading-relaxed">
      <div class="flex items-start gap-2">
        <span class="text-orange-400 font-mono shrink-0">01</span>
        <span>API Key dikirim via header <code class="px-1 py-0.5 rounded bg-orange-500/10 text-orange-300 text-[10px] font-mono">x-custom-api-key</code> saat request</span>
      </div>
      <div class="flex items-start gap-2">
        <span class="text-orange-400 font-mono shrink-0">02</span>
        <span>Server mem-forward langsung ke provider (Gemini/Groq) tanpa menyimpan</span>
      </div>
      <div class="flex items-start gap-2">
        <span class="text-orange-400 font-mono shrink-0">03</span>
        <span>Jika tidak ada key, sistem menggunakan server key sebagai fallback</span>
      </div>
    </div>
  </div>
</div>
