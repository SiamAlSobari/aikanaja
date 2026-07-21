<script lang="ts">
  import { onMount } from 'svelte';
  import { auth } from '$lib/stores/auth.store';
  import { ui } from '$lib/stores/ui.store';
  import { Shield, Trash2, LogOut } from 'lucide-svelte';

  let user = $state<any>(null);

  onMount(() => {
    const unsub = auth.subscribe((u) => { user = u; });
    return unsub;
  });

  async function handleLogout() {
    await auth.logout();
    window.location.href = '/';
  }
</script>

<div class="space-y-6 max-w-lg">
  <div>
    <h2 class="text-lg font-black text-white tracking-tight">Account</h2>
    <p class="text-[11px] text-slate-500 mt-0.5">Keamanan dan pengaturan akun</p>
  </div>

  <div class="rounded-2xl bg-[#0b0f18] border border-white/[0.04] p-6 space-y-5">
    <!-- Auth provider -->
    <div class="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
      <Shield class="w-4 h-4 text-emerald-400" />
      <div>
        <p class="text-xs font-semibold text-white">Google OAuth</p>
        <p class="text-[10px] text-slate-500">Akun terautentikasi melalui Google</p>
      </div>
      <span class="ml-auto px-2 py-0.5 rounded-md text-[10px] font-bold text-emerald-300 bg-emerald-500/8 border border-emerald-500/15">Connected</span>
    </div>

    <!-- Plan -->
    <div class="px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
      <p class="text-xs font-semibold text-white mb-1">Plan: <span class="text-orange-400 uppercase">{user?.plan || 'free'}</span></p>
      <p class="text-[10px] text-slate-500">Free tier: 10 PRDs/bulan</p>
    </div>

    <!-- Danger zone -->
    <div class="border-t border-white/[0.04] pt-5 space-y-3">
      <p class="text-[10px] font-bold text-red-400 uppercase tracking-wider">Danger Zone</p>
      <button
        onclick={handleLogout}
        class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-400 bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 transition-colors"
      >
        <LogOut class="w-3.5 h-3.5" /> Logout
      </button>
    </div>
  </div>
</div>
