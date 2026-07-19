<script lang="ts">
	import { ArrowLeft, Clock, CheckCircle2, XCircle } from 'lucide-svelte';
	let { data } = $props();
</script>

<div class="mx-auto max-w-4xl space-y-6 p-6">
	<div class="flex items-center gap-3">
		<a
			href="/settings/billing"
			class="btn rounded-xl btn-ghost text-slate-400 btn-sm hover:text-white"
		>
			<ArrowLeft class="h-4 w-4" /> Back
		</a>
		<h1 class="text-xl font-bold text-white">Payment History Logs</h1>
	</div>

	<div class="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm">
		{#if data.payments && data.payments.length > 0}
			<div class="overflow-x-auto">
				<table class="table w-full text-slate-300">
					<thead>
						<tr class="border-b border-slate-800 text-slate-400">
							<th class="px-4 py-3 text-left text-xs font-semibold">Date</th>
							<th class="px-4 py-3 text-left text-xs font-semibold">Plan</th>
							<th class="px-4 py-3 text-left text-xs font-semibold">Amount</th>
							<th class="px-4 py-3 text-left text-xs font-semibold">Status</th>
						</tr>
					</thead>
					<tbody>
						{#each data.payments as pay}
							<tr class="border-b border-slate-800/40 transition-colors hover:bg-slate-800/10">
								<td class="px-4 py-3.5 text-xs font-medium"
									>{new Date(pay.createdAt).toLocaleDateString('id-ID')}</td
								>
								<td class="px-4 py-3.5 text-xs font-bold text-slate-200 uppercase">{pay.plan}</td>
								<td class="px-4 py-3.5 text-xs">Rp {pay.amount.toLocaleString('id-ID')}</td>
								<td class="px-4 py-3.5">
									{#if pay.status === 'pending'}
										<span
											class="inline-flex items-center gap-1 rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400"
										>
											<Clock class="h-3 w-3" /> Pending
										</span>
									{:else if pay.status === 'rejected'}
										<span
											class="inline-flex items-center gap-1 rounded-md border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-[10px] font-medium text-red-400"
										>
											<XCircle class="h-3 w-3" /> Rejected
										</span>
									{:else}
										<span
											class="inline-flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400"
										>
											<CheckCircle2 class="h-3 w-3" /> Verified
										</span>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<div class="py-12 text-center text-xs text-slate-500">No payment history found.</div>
		{/if}
	</div>
</div>
