<script lang="ts">
	import { CreditCard, CheckCircle2, ArrowUpRight } from 'lucide-svelte';
	let { data } = $props();
	const billing = $derived(data.billing);
</script>

<div class="p-6 max-w-4xl mx-auto space-y-6">
	<div>
		<h1 class="text-2xl font-bold text-white mb-1">Billing & Quota</h1>
		<p class="text-sm text-slate-400">Manage your subscription, usage quotas, and payments.</p>
	</div>

	{#if billing}
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<!-- Current Plan Card -->
			<div class="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden">
				<div class="absolute top-0 right-0 w-24 h-24 bg-orange-600/5 rounded-full blur-2xl"></div>
				<div class="flex items-center gap-3 mb-4">
					<div class="w-10 h-10 rounded-xl bg-orange-600/10 border border-orange-600/20 flex items-center justify-center">
						<CreditCard class="w-5 h-5 text-orange-500" />
					</div>
					<div>
						<p class="text-xs text-slate-500 font-medium uppercase tracking-wider">Current Plan</p>
						<h3 class="text-xl font-bold text-white capitalize">{billing.plan}</h3>
					</div>
				</div>
				<div class="flex items-center gap-2 mb-6">
					<CheckCircle2 class="w-4 h-4 text-emerald-500" />
					<span class="text-xs text-slate-400">Subscription Status: <span class="text-slate-200 capitalize font-medium">{billing.status}</span></span>
				</div>
				<div class="flex gap-3">
					{#if billing.plan === 'free' || !billing.plan}
						<a id="upgrade-plan-btn" href="/settings/billing/upgrade" class="btn btn-sm bg-gradient-to-r from-orange-600 to-amber-500 border-none text-white font-semibold rounded-xl px-4 shadow-[0_0_15px_rgba(249,115,22,0.2)] hover:opacity-90 transition-opacity">
							Upgrade Plan <ArrowUpRight class="w-4 h-4" />
						</a>
					{:else}
						<a id="cancel-sub-link" href="/settings/billing/cancel" class="text-xs text-slate-500 hover:text-red-400 transition-colors font-medium self-center">
							Cancel Subscription
						</a>
					{/if}
				</div>
			</div>

			<!-- Usage Quotas Card -->
			<div class="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-6 backdrop-blur-sm">
				<h3 class="text-sm font-semibold text-white mb-4">Quota Usage (Monthly)</h3>
				<div class="space-y-4">
					<div>
						<div class="flex justify-between text-xs mb-1.5">
							<span class="text-slate-400">AI Schema Generates</span>
							<span class="font-medium text-slate-200">
								{billing.usage.count} / {billing.usage.limit === -1 ? '∞' : billing.usage.limit}
							</span>
						</div>
						{#if billing.usage.limit !== -1}
							<div class="w-full bg-slate-950 rounded-full h-2 border border-slate-800/60 overflow-hidden">
								<div class="bg-orange-500 h-full rounded-full" style="width: {Math.min(100, (billing.usage.count / billing.usage.limit) * 100)}%"></div>
							</div>
						{:else}
							<div class="w-full bg-slate-950 rounded-full h-2 border border-slate-800/60 overflow-hidden">
								<div class="bg-emerald-500 h-full rounded-full" style="width: 100%"></div>
							</div>
						{/if}
					</div>
					<p class="text-[11px] text-slate-500">
						{billing.usage.limit === -1 
							? 'You have unlimited AI generations.' 
							: `You have ${billing.usage.remaining} remaining generations this month.`}
					</p>
				</div>
			</div>
		</div>

		<!-- Secondary Nav Info -->
		<div class="flex gap-4 border-t border-slate-800/60 pt-6">
			<a id="payment-logs-link" href="/settings/billing/payment" class="text-xs text-orange-500 hover:text-orange-400 transition-colors font-semibold">
				View Payment Logs &rarr;
			</a>
		</div>
	{:else}
		<div class="text-slate-500 text-center py-12">Failed to load billing information.</div>
	{/if}
</div>
