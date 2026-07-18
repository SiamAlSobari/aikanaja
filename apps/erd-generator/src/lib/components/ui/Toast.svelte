<script lang="ts">
	import { getUiState, removeToast } from '$lib/stores/ui.store.svelte';
	import type { ToastType } from '$lib/stores/ui.store.svelte';
	import { X, CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-svelte';

	const ui = getUiState();

	const icons: Record<ToastType, typeof CheckCircle> = {
		success: CheckCircle,
		error: XCircle,
		info: Info,
		warning: AlertTriangle,
	};

	const iconColors: Record<ToastType, string> = {
		success: 'text-emerald-400',
		error: 'text-red-400',
		info: 'text-blue-400',
		warning: 'text-amber-400',
	};
</script>

{#if ui.toasts.length > 0}
	<div class="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
		{#each ui.toasts as toast (toast.id)}
			<div
				class="pointer-events-auto bg-slate-900 border border-slate-800 rounded-xl shadow-2xl shadow-black/50 px-4 py-3 flex items-start gap-3 min-w-[300px] max-w-[420px] animate-slide-in"
			>
				{#if icons[toast.type]}
					{@const Icon = icons[toast.type]}
					<Icon class="w-5 h-5 {iconColors[toast.type]} shrink-0 mt-0.5" />
				{/if}
				<p class="text-sm text-slate-200 flex-1">{toast.message}</p>
				<button
					onclick={() => removeToast(toast.id)}
					class="p-0.5 rounded text-slate-600 hover:text-slate-300 transition-colors shrink-0"
				>
					<X class="w-4 h-4" />
				</button>
			</div>
		{/each}
	</div>
{/if}

<style>
	@keyframes slide-in {
		from {
			opacity: 0;
			transform: translateX(20px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}
	.animate-slide-in {
		animation: slide-in 0.25s ease-out;
	}
</style>
