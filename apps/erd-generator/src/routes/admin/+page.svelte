<script lang="ts">
	import { Users, FolderKanban, CreditCard, Clock, ArrowRight } from 'lucide-svelte';
	import AdminHeader from '$lib/components/features/admin/AdminHeader.svelte';

	let { data } = $props();
	const stats = $derived(data.stats);

	const cards = $derived([
		{ label: 'Total Users', value: stats?.userCount ?? 0, icon: Users, href: '/admin/users', tone: 'text-sky-400', ring: 'from-sky-500/10' },
		{ label: 'Active Projects', value: stats?.projectCount ?? 0, icon: FolderKanban, href: '/admin/projects', tone: 'text-orange-400', ring: 'from-orange-500/10' },
		{ label: 'Total Payments', value: stats?.paymentCount ?? 0, icon: CreditCard, href: '/admin/payments', tone: 'text-emerald-400', ring: 'from-emerald-500/10' },
		{ label: 'Pending Payments', value: stats?.pendingPayments ?? 0, icon: Clock, href: '/admin/payments?status=pending', tone: 'text-amber-400', ring: 'from-amber-500/10' },
	]);
</script>

<AdminHeader title="Admin Dashboard" subtitle="Ringkasan aktivitas AiKanAja" />

<div class="px-6 lg:px-10 pb-10">
	<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
		{#each cards as card}
			<a
				href={card.href}
				class="group relative overflow-hidden rounded-2xl border border-slate-800/70 bg-slate-900/40 p-5 transition-all duration-200 hover:border-orange-600/40 hover:bg-slate-900/70"
			>
				<div class="absolute inset-0 bg-gradient-to-br {card.ring} to-transparent opacity-60 pointer-events-none"></div>
				<div class="relative flex items-start justify-between">
					<div>
						<p class="text-[11px] font-medium uppercase tracking-wider text-slate-500">{card.label}</p>
						<p class="mt-2 text-3xl font-bold text-white tabular-nums">{card.value}</p>
					</div>
					<div class="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
						<card.icon class="w-5 h-5 {card.tone}" />
					</div>
				</div>
				<div class="relative mt-4 flex items-center gap-1 text-[11px] font-semibold text-slate-500 group-hover:text-orange-400 transition-colors">
					Lihat <ArrowRight class="w-3.5 h-3.5" />
				</div>
			</a>
		{/each}
	</div>

	<div class="mt-6 rounded-2xl border border-slate-800/70 bg-slate-900/40 p-6">
		<h2 class="text-sm font-semibold text-white">Mulai dari sini</h2>
		<p class="mt-1 text-sm text-slate-400">
			Review pembayaran yang menunggu verifikasi, kelola user, dan pantau project di seluruh platform.
		</p>
		{#if stats && stats.pendingPayments > 0}
			<a
				href="/admin/payments?status=pending"
				class="mt-4 inline-flex items-center gap-2 rounded-xl bg-amber-500/15 border border-amber-500/30 px-4 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/25 transition-colors"
			>
				<Clock class="w-4 h-4" />
				{stats.pendingPayments} pembayaran perlu diverifikasi
			</a>
		{/if}
	</div>
</div>
