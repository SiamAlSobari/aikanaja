<script lang="ts">
	import { getQuotaModalState, closeQuotaModal } from '$lib/stores/quota.store.svelte';
	import { Crown } from 'lucide-svelte';

	const { isOpen, message } = $derived(getQuotaModalState());
</script>

{#if isOpen}
	<div
		class="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
		role="presentation"
		onclick={(e) => {
			if (e.target === e.currentTarget) closeQuotaModal();
		}}
	>
		<div
			class="w-full max-w-md rounded-2xl border border-orange-500/30 bg-slate-900 shadow-2xl shadow-orange-900/30 overflow-hidden animate-modal"
		>
			<div class="bg-gradient-to-br from-orange-600/20 to-transparent p-6">
				<div class="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-600/20 text-orange-400">
					<Crown size={24} />
				</div>
				<h2 class="text-lg font-bold text-slate-100">Kuota Habis</h2>
				<p class="mt-2 text-sm leading-relaxed text-slate-400">{message}</p>
			</div>
			<div class="flex gap-3 p-4">
				<a
					href="/settings/billing/upgrade"
					class="flex-1 rounded-xl bg-orange-600 px-4 py-2.5 text-center text-sm font-bold text-slate-950 transition-all hover:bg-orange-500 active:scale-[0.98]"
				>
					Upgrade ke Pro
				</a>
				<a
					href="/settings/api-keys"
					class="flex-1 rounded-xl bg-slate-800 px-4 py-2.5 text-center text-sm font-medium text-slate-200 transition-all hover:bg-slate-700"
				>
					Pakai API Key
				</a>
				<button
					type="button"
					class="rounded-xl px-4 py-2.5 text-sm text-slate-500 transition-colors hover:text-slate-300"
					onclick={closeQuotaModal}
				>
					Tutup
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	@keyframes modal-in {
		from {
			transform: scale(0.95);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}
	:global(.animate-modal) {
		animation: modal-in 0.2s ease-out;
	}
</style>
