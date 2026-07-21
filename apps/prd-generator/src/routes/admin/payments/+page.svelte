<script lang="ts">
  import { CreditCard } from 'lucide-svelte';
</script>

<div class="space-y-6">
  <div>
    <h2 class="text-lg font-black text-white tracking-tight">Payments</h2>
    <p class="text-[11px] text-slate-500 mt-0.5">Riwayat pembayaran dan langganan</p>
  </div>

  <div class="rounded-2xl bg-[#0b0f18] border border-white/[0.04] p-16 text-center space-y-3">
    <CreditCard class="w-10 h-10 text-slate-600 mx-auto" />
    <p class="text-sm text-slate-400">Modul pembayaran belum tersedia</p>
    <p class="text-[11px] text-slate-600">Akan diintegrasikan dengan payment gateway</p>
  </div>
</div>
