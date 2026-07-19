<script lang="ts">
	import { ArrowLeft, AlertTriangle } from 'lucide-svelte';
	import { enhance } from '$app/forms';
	let { form } = $props();

	let confirmed = $state(false);
</script>

<div class="p-6 max-w-lg mx-auto space-y-6">
	<div class="flex items-center gap-3">
		<a href="/settings/billing" class="btn btn-sm btn-ghost rounded-xl text-slate-400 hover:text-white">
			<ArrowLeft class="w-4 h-4" /> Cancel
		</a>
		<h1 class="text-xl font-bold text-white">Cancel Subscription</h1>
	</div>

	{#if form?.error}
		<div class="alert alert-error bg-red-950/20 border-red-800 text-red-200 rounded-xl p-4 text-xs font-medium">
			{form.error}
		</div>
	{/if}

	<div class="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4 backdrop-blur-sm">
		<div class="flex gap-3 bg-red-950/15 border border-red-900/30 p-4 rounded-xl text-red-200">
			<AlertTriangle class="w-5 h-5 shrink-0 text-red-500" />
			<div class="text-xs space-y-1">
				<p class="font-bold">Are you sure you want to downgrade?</p>
				<p class="text-slate-400">Your account will revert to the Free plan. You will lose version history, custom API key options, and your monthly generate quota limit will reset to 10 generates.</p>
			</div>
		</div>

		<form use:enhance method="POST" class="space-y-4">
			<div class="form-control">
				<label class="label cursor-pointer flex gap-3 justify-start">
					<input type="checkbox" bind:checked={confirmed} class="checkbox checkbox-orange rounded-md border-slate-700 bg-slate-950" />
					<span class="text-xs text-slate-300 font-medium">I understand the downgrade terms and confirm.</span>
				</label>
			</div>

			<div class="flex gap-3">
				<button type="submit" disabled={!confirmed} class="flex-1 btn btn-sm bg-red-600 hover:bg-red-755 text-white font-semibold rounded-xl border-none disabled:opacity-30">
					Confirm Downgrade
				</button>
				<a href="/settings/billing" class="btn btn-sm btn-ghost hover:bg-slate-800 rounded-xl text-xs text-slate-400">
					Nevermind
				</a>
			</div>
		</form>
	</div>
</div>
