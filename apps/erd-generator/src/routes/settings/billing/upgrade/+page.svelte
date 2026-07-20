<script lang="ts">
	import { goto } from '$app/navigation';
	import { Sparkles, Check, Loader2, Crown, Users } from 'lucide-svelte';
	import { erdApi, type PlanTier } from '$lib/api/erd';
	import { addToast } from '$lib/stores/ui.store.svelte';

	let { data }: { data: { billing: any } } = $props();
	let current = $derived(data.billing?.plan ?? 'free');

	const PLANS: { tier: PlanTier; name: string; price: string; period: string; desc: string; features: string[]; icon: any; highlight?: boolean }[] = [
		{ tier: 'free', name: 'Free', price: 'Rp 0', period: 'selamanya', desc: 'Untuk eksplorasi.', icon: Sparkles, features: ['5 generate/bulan', 'Export SQL/Prisma', '1 project aktif'] },
		{ tier: 'pro', name: 'Pro', price: 'Rp 7.000', period: '/ bulan', desc: 'Untuk developer solo.', icon: Crown, highlight: true, features: ['20 generate/bulan', 'Project unlimited', 'Custom API key', 'Priority support'] },
		{ tier: 'team', name: 'Team', price: 'Rp 15.000', period: '/ bulan', desc: 'Untuk tim.', icon: Users, features: ['50 generate/bulan', 'Semua fitur Pro', 'Kolaborasi tim', 'Share & role'] }
	];

	let loading = $state<PlanTier | null>(null);
	async function choose(tier: PlanTier) {
		if (tier === 'free' || tier === current) return;
		loading = tier;
		try {
			const res = await erdApi.requestUpgrade(tier);
			addToast('success', `Permintaan ${tier} dibuat. Upload bukti transfer.`);
			goto(`/settings/billing/payment/${res.payment.id}`);
		} catch (e: any) {
			addToast('error', e.message || 'Gagal memproses');
		} finally {
			loading = null;
		}
	}
</script>

<div class="max-w-5xl mx-auto px-6 py-8 md:py-12">
	<div class="text-center mb-10">
		<h1 class="text-2xl font-bold text-white">Pilih Plan</h1>
		<p class="text-sm text-slate-500 mt-1">Upgrade untuk tabel & generate unlimited.</p>
	</div>

	<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
		{#each PLANS as p}
			{@const active = p.tier === current}
			{@const isLoading = loading === p.tier}
			<div class="relative flex flex-col p-6 rounded-2xl border transition-all {p.highlight ? 'border-orange-600/40 bg-orange-600/[0.06] shadow-lg shadow-orange-600/10' : 'border-slate-800/60 bg-slate-900/40'} {active ? 'ring-1 ring-orange-500/40' : ''}">
				{#if p.highlight}
					<span class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-950 bg-orange-500">Populer</span>
				{/if}
				<div class="w-10 h-10 rounded-xl flex items-center justify-center {p.highlight ? 'bg-orange-600/15 text-orange-500' : 'bg-slate-800 text-slate-400'}">
					<p.icon class="w-5 h-5" />
				</div>
				<h3 class="mt-4 text-lg font-bold text-white">{p.name}</h3>
				<p class="text-[11px] text-slate-500">{p.desc}</p>
				<div class="mt-3 flex items-baseline gap-1">
					<span class="text-2xl font-bold text-white">{p.price}</span>
					<span class="text-xs text-slate-500">{p.period}</span>
				</div>
				<ul class="mt-5 space-y-2 flex-1">
					{#each p.features as f}
						<li class="flex items-center gap-2 text-sm text-slate-300"><Check class="w-4 h-4 text-orange-500 shrink-0" />{f}</li>
					{/each}
				</ul>
				<button
					onclick={() => choose(p.tier)}
					disabled={active || isLoading}
					class="mt-6 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-[0.98] disabled:cursor-default
						{active
							? 'bg-slate-800 text-slate-500'
							: p.highlight
								? 'bg-orange-600 hover:bg-orange-700 text-slate-950 shadow-lg shadow-orange-600/20'
								: 'bg-slate-800 hover:bg-slate-700 text-white'}"
				>
					{#if isLoading}
						<Loader2 class="w-4 h-4 animate-spin" />
					{:else if active}
						Plan Aktif
					{:else if p.tier === 'free'}
						Pilih Free
					{:else}
						Upgrade ke {p.name}
					{/if}
				</button>
			</div>
		{/each}
	</div>

	<div class="mt-8 p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 text-center text-xs text-slate-500">
		Pembayaran via <span class="text-slate-300 font-medium">Dana 08826545202</span> · Konfirmasi otomatis setelah admin verifikasi.
	</div>
</div>
