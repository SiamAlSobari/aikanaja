<script lang="ts">
  import { Bell, Mail, BellOff } from 'lucide-svelte';

  let emailNotif = $state(true);
  let prdUpdates = $state(true);
  let marketing = $state(false);
</script>

<div class="space-y-6 max-w-lg">
  <div>
    <h2 class="text-lg font-black text-white tracking-tight">Notifications</h2>
    <p class="text-[11px] text-slate-500 mt-0.5">Kelola notifikasi email dan in-app</p>
  </div>

  <div class="rounded-2xl bg-[#0b0f18] border border-white/[0.04] p-6 space-y-4">
    {#each [
      { label: 'Email Notifications', desc: 'Notifikasi umum via email', bind: emailNotif, icon: Mail },
      { label: 'PRD Updates', desc: 'Notifikasi saat PRD selesai di-generate', bind: prdUpdates, icon: Bell },
      { label: 'Marketing', desc: 'Tips, fitur baru, dan promosi', bind: marketing, icon: BellOff },
    ] as notif}
      <div class="flex items-center justify-between py-2">
        <div class="flex items-center gap-3">
          <notif.icon class="w-4 h-4 text-slate-400" />
          <div>
            <p class="text-xs font-semibold text-white">{notif.label}</p>
            <p class="text-[10px] text-slate-500">{notif.desc}</p>
          </div>
        </div>
        <button
          onclick={() => notif.bind = !notif.bind}
          class="relative w-10 h-5 rounded-full transition-colors {notif.bind ? 'bg-orange-500' : 'bg-white/[0.08]'}"
        >
          <div class="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform {notif.bind ? 'translate-x-5' : ''}"></div>
        </button>
      </div>
    {/each}
  </div>
</div>
