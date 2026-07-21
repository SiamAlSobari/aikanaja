<script lang="ts">
  import { onMount } from 'svelte';
  import { CreditCard, Zap, Check } from 'lucide-svelte';
  import { prdApi } from '$lib/api/prd';

  let quota = $state({ count: 0, limit: null as number | null, remaining: null as number | null });
  let loading = $state(true);

  onMount(async () => {
    try {
      quota = await prdApi.getQuota();
    } catch { /* silent */ }
    loading = false;
  });

  const plans = [
    { name: 'Free', price: 'Rp 0', period: '/bulan', features: ['10 PRDs/bulan', 'AI Copilot', 'Basic Export', 'Community Support'], current: true },
    { name: 'Pro', price: 'Rp 99K', period: '/bulan', features: ['Unlimited PRDs', 'Priority AI', 'All Export Formats', 'Version History', 'Priority Support'], current: false },
  ];
</script>

<div class="space-y-6 max-w-2xl">
  <div>
    <h2 class="text-lg font-black text-white tracking-tight">Billing</h2>
    <p class="text-[11px] text-slate-500 mt-0.5">Kuota dan langganan PRD Generator</p>
  </div>

  <!-- Current usage -->
  <div class="rounded-2xl bg-[#0b0f18] border border-white/[0.04] p-5">
    <div class="flex items-center justify-between mb-3">
      <p class="text-xs font-bold text-white">Penggunaan Bulan Ini</p>
      <span class="text-[10px] font-mono text-slate-500">{new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</span>
    </div>
    {#if loading}
      <div class="h-4 bg-white/[0.03] rounded-full animate-pulse"></div>
    {:else}
      <div class="space-y-2">
        <div class="flex items-baseline justify-between">
          <span class="text-2xl font-black text-white">{quota.count}</span>
          <span class="text-xs text-slate-500">{quota.limit !== null ? `/ ${quota.limit} PRDs` : 'Unlimited'}</span>
        </div>
        {#if quota.limit !== null}
          <div class="h-2 rounded-full bg-white/[0.04] overflow-hidden">
            <div class="h-full rounded-full bg-orange-500" style="width: {Math.min((quota.count / quota.limit) * 100, 100)}%"></div>
          </div>
          <p class="text-[10px] text-slate-600">{quota.remaining ?? 0} PRDs tersisa</p>
        {:else}
          <p class="text-[10px] text-emerald-400/80">Tidak terbatas</p>
        {/if}
      </div>
    {/if}
  </div>

  <!-- Plans -->
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {#each plans as plan}
      <div class="rounded-2xl bg-[#0b0f18] border {plan.current ? 'border-orange-500/15' : 'border-white/[0.04]'} p-5 space-y-4 relative">
        {#if plan.current}
          <span class="absolute top-4 right-4 px-2 py-0.5 rounded-md text-[9px] font-bold text-orange-300 bg-orange-500/10 border border-orange-500/15">Current</span>
        {/if}
        <div>
          <p class="text-sm font-bold text-white">{plan.name}</p>
          <p class="text-xl font-black text-white mt-1">{plan.price}<span class="text-xs text-slate-500 font-normal">{plan.period}</span></p>
        </div>
        <div class="space-y-2">
          {#each plan.features as f}
            <div class="flex items-center gap-2">
              <Check class="w-3 h-3 text-emerald-400 shrink-0" />
              <span class="text-[11px] text-slate-400">{f}</span>
            </div>
          {/each}
        </div>
        {#if !plan.current}
          <button class="w-full py-2 rounded-xl text-xs font-bold text-white bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.06] transition-colors">
            Upgrade
          </button>
        {/if}
      </div>
    {/each}
  </div>
</div>
