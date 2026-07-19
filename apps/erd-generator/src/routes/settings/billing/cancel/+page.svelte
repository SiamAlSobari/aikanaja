<script lang="ts">
	import { ArrowLeft, AlertTriangle } from 'lucide-svelte';
	import { enhance } from '$app/forms';
	let { form } = $props();

	let confirmed = $state(false);
</script>

<div class="mx-auto max-w-lg space-y-6 p-6">
	<div class="flex items-center gap-3">
		<a
			href="/settings/billing"
			class="btn rounded-xl btn-ghost text-slate-400 btn-sm hover:text-white"
		>
			<ArrowLeft class="h-4 w-4" /> Cancel
		</a>
		<h1 class="text-xl font-bold text-white">Cancel Subscription</h1>
	</div>

	{#if form?.error}
		<div
			class="alert rounded-xl border-red-800 bg-red-950/20 p-4 text-xs font-medium alert-error text-red-200"
		>
			{form.error}
		</div>
	{/if}

	<div class="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm">
		<div class="flex gap-3 rounded-xl border border-red-900/30 bg-red-950/15 p-4 text-red-200">
			<AlertTriangle class="h-5 w-5 shrink-0 text-red-500" />
			<div class="space-y-1 text-xs">
				<p class="font-bold">Are you sure you want to downgrade?</p>
				<p class="text-slate-400">
					Your account will revert to the Free plan. You will lose version history, custom API key
					options, and your monthly generate quota limit will reset to 10 generates.
				</p>
			</div>
		</div>

		<form use:enhance method="POST" class="space-y-4">
			<div class="form-control">
				<label class="label flex cursor-pointer justify-start gap-3">
					<input
						type="checkbox"
						bind:checked={confirmed}
						class="checkbox-orange checkbox rounded-md border-slate-700 bg-slate-950"
					/>
					<span class="text-xs font-medium text-slate-300"
						>I understand the downgrade terms and confirm.</span
					>
				</label>
			</div>

			<div class="flex gap-3">
				<button
					type="submit"
					disabled={!confirmed}
					class="btn flex-1 rounded-xl border-none bg-red-600 font-semibold text-white btn-sm hover:bg-red-700 disabled:opacity-30"
				>
					Confirm Downgrade
				</button>
				<a
					href="/settings/billing"
					class="btn rounded-xl btn-ghost text-xs text-slate-400 btn-sm hover:bg-slate-800"
				>
					Nevermind
				</a>
			</div>
		</form>
	</div>
</div>
