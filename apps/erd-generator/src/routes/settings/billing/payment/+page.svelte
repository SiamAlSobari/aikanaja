<script lang="ts">
	import { ArrowLeft, Clock, CheckCircle2 } from 'lucide-svelte';
	let { data } = $props();
</script>

<div class="p-6 max-w-4xl mx-auto space-y-6">
	<div class="flex items-center gap-3">
		<a href="/settings/billing" class="btn btn-sm btn-ghost rounded-xl text-slate-400 hover:text-white">
			<ArrowLeft class="w-4 h-4" /> Back
		</a>
		<h1 class="text-xl font-bold text-white">Payment History Logs</h1>
	</div>

	<div class="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm">
		{#if data.payments && data.payments.length > 0}
			<div class="overflow-x-auto">
				<table class="table w-full text-slate-300">
					<thead>
						<tr class="border-b border-slate-800 text-slate-400">
							<th class="py-3 px-4 font-semibold text-xs text-left">Date</th>
							<th class="py-3 px-4 font-semibold text-xs text-left">Plan</th>
							<th class="py-3 px-4 font-semibold text-xs text-left">Amount</th>
							<th class="py-3 px-4 font-semibold text-xs text-left">Status</th>
						</tr>
					</thead>
					<tbody>
						{#each data.payments as pay}
							<tr class="border-b border-slate-800/40 hover:bg-slate-800/10 transition-colors">
								<td class="py-3.5 px-4 text-xs font-medium">{new Date(pay.createdAt).toLocaleDateString('id-ID')}</td>
								<td class="py-3.5 px-4 text-xs uppercase font-bold text-slate-200">{pay.plan}</td>
								<td class="py-3.5 px-4 text-xs">Rp {pay.amount.toLocaleString('id-ID')}</td>
								<td class="py-3.5 px-4">
									{#if pay.status === 'pending'}
										<span class="inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-md text-[10px] font-medium">
											<Clock class="w-3 h-3" /> Pending
										</span>
									{:else}
										<span class="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md text-[10px] font-medium">
											<CheckCircle2 class="w-3 h-3" /> Verified
										</span>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<div class="text-slate-500 text-center py-12 text-xs">No payment history found.</div>
		{/if}
	</div>
</div>
