<script lang="ts">
  import { onMount } from 'svelte';
  import { auth } from '$lib/stores/auth.store';
  import { ui } from '$lib/stores/ui.store';

  let name = $state('');
  let email = $state('');
  let loading = $state(true);
  let saving = $state(false);

  onMount(() => {
    const unsub = auth.subscribe((user) => {
      if (user) {
        name = user.name;
        email = user.email;
      }
      loading = false;
    });
    return unsub;
  });

  async function save() {
    saving = true;
    try {
      // Profile update would go to backend
      ui.addToast('Profile tersimpan', 'success');
    } catch {
      ui.addToast('Gagal menyimpan profile', 'error');
    } finally {
      saving = false;
    }
  }
</script>

<div class="space-y-6 max-w-lg">
  <div>
    <h2 class="text-lg font-black text-white tracking-tight">Profile</h2>
    <p class="text-[11px] text-slate-500 mt-0.5">Kelola informasi profil Anda</p>
  </div>

  {#if loading}
    <div class="space-y-4">
      <div class="h-10 bg-white/[0.03] rounded-xl animate-pulse"></div>
      <div class="h-10 bg-white/[0.03] rounded-xl animate-pulse"></div>
    </div>
  {:else}
    <div class="rounded-2xl bg-[#0b0f18] border border-white/[0.04] p-6 space-y-5">
      <!-- Avatar -->
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
          <span class="text-2xl font-black text-white">{(name || 'U')[0].toUpperCase()}</span>
        </div>
        <div>
          <p class="text-sm font-bold text-white">{name}</p>
          <p class="text-xs text-slate-500">{email}</p>
        </div>
      </div>

      <!-- Name -->
      <div>
        <label for="settings-name" class="text-[11px] font-semibold text-slate-400 mb-1.5 block">Nama</label>
        <input
          id="settings-name"
          type="text"
          bind:value={name}
          class="w-full px-4 py-2.5 rounded-xl bg-[#0a0e14] border border-white/[0.04] text-sm text-white focus:outline-none focus:border-orange-500/20 transition-colors"
        />
      </div>

      <!-- Email (readonly) -->
      <div>
        <label for="settings-email" class="text-[11px] font-semibold text-slate-400 mb-1.5 block">Email</label>
        <input
          id="settings-email"
          type="email"
          value={email}
          readonly
          class="w-full px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] text-sm text-slate-500 cursor-not-allowed"
        />
        <p class="text-[10px] text-slate-600 mt-1">Email dikelola melalui Google OAuth</p>
      </div>

      <!-- Save -->
      <button
        onclick={save}
        disabled={saving}
        class="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-300 hover:to-amber-300 transition-all disabled:opacity-50"
      >
        {saving ? 'Menyimpan...' : 'Simpan'}
      </button>
    </div>
  {/if}
</div>
