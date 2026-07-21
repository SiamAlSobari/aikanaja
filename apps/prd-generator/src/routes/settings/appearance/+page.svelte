<script lang="ts">
  import { ui } from '$lib/stores/ui.store';

  type Theme = 'dark' | 'light' | 'system';
  let currentTheme = $state<Theme>('dark');

  const themes = [
    { id: 'dark' as const, label: 'Dark', desc: 'Tema gelap (default)' },
    { id: 'light' as const, label: 'Light', desc: 'Tema terang' },
    { id: 'system' as const, label: 'System', desc: 'Ikuti pengaturan OS' },
  ];

  function setTheme(t: Theme) {
    currentTheme = t;
    localStorage.setItem('prd_theme', t);
    ui.addToast(`Tema ${t} dipilih`, 'info');
  }
</script>

<div class="space-y-6 max-w-lg">
  <div>
    <h2 class="text-lg font-black text-white tracking-tight">Appearance</h2>
    <p class="text-[11px] text-slate-500 mt-0.5">Sesuaikan tampilan aplikasi</p>
  </div>

  <div class="rounded-2xl bg-[#0b0f18] border border-white/[0.04] p-6 space-y-5">
    <p class="text-xs font-bold text-white">Theme</p>
    <div class="space-y-2">
      {#each themes as theme}
        <button
          onclick={() => setTheme(theme.id)}
          class="w-full flex items-center gap-4 px-4 py-3 rounded-xl border transition-all text-left
            {currentTheme === theme.id
              ? 'bg-orange-500/[0.04] border-orange-500/15'
              : 'bg-white/[0.01] border-white/[0.04] hover:border-white/[0.08]'}"
        >
          <div class="w-4 h-4 rounded-full border-2 flex items-center justify-center
            {currentTheme === theme.id ? 'border-orange-400' : 'border-slate-600'}">
            {#if currentTheme === theme.id}
              <div class="w-2 h-2 rounded-full bg-orange-400"></div>
            {/if}
          </div>
          <div>
            <p class="text-xs font-semibold text-white">{theme.label}</p>
            <p class="text-[10px] text-slate-500">{theme.desc}</p>
          </div>
        </button>
      {/each}
    </div>
  </div>
</div>
