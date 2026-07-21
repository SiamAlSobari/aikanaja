<script lang="ts">
  import { onMount } from 'svelte';
  import { Users, Mail, Calendar, Shield } from 'lucide-svelte';

  interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: string;
    plan: string;
    createdAt: string;
    _count?: { prdProjects: number };
  }

  let users = $state<AdminUser[]>([]);
  let loading = $state(true);

  onMount(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/admin/prd/users`, {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        users = data.data ?? [];
      }
    } catch { /* silent */ }
    loading = false;
  });

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  }
</script>

<div class="space-y-6">
  <div>
    <h2 class="text-lg font-black text-white tracking-tight">Users</h2>
    <p class="text-[11px] text-slate-500 mt-0.5">Daftar pengguna dan aktivitas PRD mereka</p>
  </div>

  <div class="rounded-2xl bg-[#0b0f18] border border-white/[0.04] overflow-hidden">
    {#if loading}
      <div class="p-12 text-center"><span class="loading loading-spinner loading-sm text-orange-400"></span></div>
    {:else if users.length === 0}
      <div class="p-12 text-center">
        <Users class="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <p class="text-xs text-slate-500">Tidak ada data user</p>
      </div>
    {:else}
      <!-- Table header -->
      <div class="grid grid-cols-12 gap-4 px-5 py-2.5 border-b border-white/[0.04] text-[10px] text-slate-500 font-medium uppercase tracking-wider">
        <div class="col-span-3">User</div>
        <div class="col-span-3">Email</div>
        <div class="col-span-2">Role</div>
        <div class="col-span-2">Plan</div>
        <div class="col-span-2">Projects</div>
      </div>
      <div class="divide-y divide-white/[0.03]">
        {#each users as user}
          <div class="grid grid-cols-12 gap-4 px-5 py-3 hover:bg-white/[0.01] transition-colors items-center">
            <div class="col-span-3 flex items-center gap-2.5">
              <div class="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                <span class="text-[10px] font-bold text-orange-400">{(user.name || 'U')[0].toUpperCase()}</span>
              </div>
              <span class="text-xs font-semibold text-white truncate">{user.name}</span>
            </div>
            <div class="col-span-3 text-xs text-slate-400 truncate">{user.email}</div>
            <div class="col-span-2">
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold
                {user.role === 'admin' ? 'text-orange-300 bg-orange-500/10 border border-orange-500/15' : 'text-slate-400 bg-white/[0.03] border border-white/[0.06]'}">
                <Shield class="w-2.5 h-2.5" /> {user.role}
              </span>
            </div>
            <div class="col-span-2">
              <span class="text-[10px] font-mono text-slate-400 uppercase">{user.plan}</span>
            </div>
            <div class="col-span-2 text-xs font-mono text-slate-400">{user._count?.prdProjects ?? 0}</div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
