<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { getUiState, removeToast } from '$lib/stores/ui.store.svelte';
	import QuotaExceededModal from '$lib/components/QuotaExceededModal.svelte';

	let { children } = $props();

	const toasts = $derived(getUiState().toasts);

	const toastClass: Record<string, string> = {
		success: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
		error: 'bg-red-500/15 border-red-500/30 text-red-300',
		info: 'bg-sky-500/15 border-sky-500/30 text-sky-300',
		warning: 'bg-amber-500/15 border-amber-500/30 text-amber-300'
	};
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}

<!-- Global Toaster -->
<div class="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-[300px] max-w-[calc(100vw-2rem)]">
	{#each toasts as t (t.id)}
		<button
			type="button"
			aria-label="Dismiss notification"
			onclick={() => removeToast(t.id)}
			class="px-4 py-3 rounded-xl border backdrop-blur-md shadow-lg shadow-black/30 text-[13px] font-medium cursor-pointer text-left animate-toast {toastClass[t.type] || toastClass.info}"
		>
			{t.message}
		</button>
	{/each}
</div>

<!-- Global Quota Exceeded Modal -->
<QuotaExceededModal />

<style>
	@keyframes toast-in {
		from { transform: translateY(12px); opacity: 0; }
		to { transform: translateY(0); opacity: 1; }
	}
	:global(.animate-toast) { animation: toast-in 0.25s ease-out; }
</style>
