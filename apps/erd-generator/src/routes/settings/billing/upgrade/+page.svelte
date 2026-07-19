<script lang="ts">
	import { Check, ArrowLeft, MessageSquare } from 'lucide-svelte';
	import { enhance } from '$app/forms';
	let { data, form } = $props();

	let selectedPlan = $state<'pro' | 'team'>('pro');
	let showInstructions = $state(false);

	$effect(() => {
		if (form?.success) {
			showInstructions = true;
		}
	});
</script>

<div class="p-6 max-w-4xl mx-auto space-y-6">
	<div class="flex items-center gap-3">
		<a href="/settings/billing" class="btn btn-sm btn-ghost rounded-xl text-slate-400 hover:text-white">
			<ArrowLeft class="w-4 h-4" /> Back
		</a>
		<h1 class="text-xl font-bold text-white">Upgrade Account Plan</h1>
	</div>

	{#if form?.error}
		<div class="alert alert-error bg-red-950/20 border-red-800 text-red-200 rounded-xl p-4 text-xs font-medium">
			{form.error}
		</div>
	{/if}

	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<!-- Pro Card -->
		<div class="bg-slate-900/40 border {selectedPlan === 'pro' ? 'border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.15)]' : 'border-slate-800'} rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between">
			<div>
				<h3 class="text-lg font-bold text-white mb-2">Pro Plan</h3>
				<p class="text-xs text-slate-400 mb-4">For power developers and independent creators.</p>
				<p class="text-3xl font-black text-white mb-6">Rp 99.000 <span class="text-xs font-normal text-slate-500">/ month</span></p>
				<ul class="space-y-2.5 text-xs text-slate-300">
					<li class="flex items-center gap-2"><Check class="w-4 h-4 text-orange-500" /> Unlimited AI Schema Generates</li>
					<li class="flex items-center gap-2"><Check class="w-4 h-4 text-orange-500" /> Unlimited Projects Saved</li>
					<li class="flex items-center gap-2"><Check class="w-4 h-4 text-orange-500" /> Version history snapshots</li>
					<li class="flex items-center gap-2"><Check class="w-4 h-4 text-orange-500" /> Custom API keys support</li>
				</ul>
			</div>
			<form use:enhance method="POST" class="mt-8">
				<input type="hidden" name="plan" value="pro" />
				<button type="submit" onclick={() => selectedPlan = 'pro'} class="w-full btn btn-sm {selectedPlan === 'pro' ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-300'} border-none font-semibold rounded-xl">
					Choose Pro Plan
				</button>
			</form>
		</div>

		<!-- Team Card -->
		<div class="bg-slate-900/40 border {selectedPlan === 'team' ? 'border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.15)]' : 'border-slate-800'} rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between">
			<div>
				<h3 class="text-lg font-bold text-white mb-2">Team Plan</h3>
				<p class="text-xs text-slate-400 mb-4">For engineering teams and collaborative setups.</p>
				<p class="text-3xl font-black text-white mb-6">Rp 299.000 <span class="text-xs font-normal text-slate-500">/ month</span></p>
				<ul class="space-y-2.5 text-xs text-slate-300">
					<li class="flex items-center gap-2"><Check class="w-4 h-4 text-orange-500" /> Everything in Pro Plan</li>
					<li class="flex items-center gap-2"><Check class="w-4 h-4 text-orange-500" /> Unlimited Collaborators</li>
					<li class="flex items-center gap-2"><Check class="w-4 h-4 text-orange-500" /> Team workspaces</li>
					<li class="flex items-center gap-2"><Check class="w-4 h-4 text-orange-500" /> Priority support</li>
				</ul>
			</div>
			<form use:enhance method="POST" class="mt-8">
				<input type="hidden" name="plan" value="team" />
				<button type="submit" onclick={() => selectedPlan = 'team'} class="w-full btn btn-sm {selectedPlan === 'team' ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-300'} border-none font-semibold rounded-xl">
					Choose Team Plan
				</button>
			</form>
		</div>
	</div>

	<!-- Payment Instructions Modal -->
	{#if showInstructions && form?.paymentInfo}
		<div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
			<div class="bg-slate-900 border border-slate-800 max-w-md w-full rounded-2xl p-6 space-y-4">
				<h3 class="text-lg font-bold text-white">Payment Request Created</h3>
				<div class="bg-slate-950 p-4 border border-slate-800 rounded-xl space-y-2 text-xs">
					{#each form.paymentInfo.instructions as instr}
						<p class="text-slate-300">{instr}</p>
					{/each}
				</div>
				<div class="flex gap-3">
					<a href="{form.paymentInfo.paymentInfo.whatsappUrl}" target="_blank" class="flex-1 btn btn-sm bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl border-none gap-2">
						<MessageSquare class="w-4 h-4" /> Send Proof on WhatsApp
					</a>
					<button onclick={() => showInstructions = false} class="btn btn-sm btn-ghost hover:bg-slate-800 rounded-xl text-xs text-slate-400">
						Close
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>
