<script lang="ts">
	import type { Snippet } from 'svelte';
	import { X } from 'lucide-svelte';

	type Size = 'sm' | 'md' | 'lg' | 'xl';

	let {
		open = $bindable(false),
		title,
		size = 'md',
		onclose,
		children,
		footer,
	}: {
		open?: boolean;
		title?: string;
		size?: Size;
		onclose?: () => void;
		children: Snippet;
		footer?: Snippet;
	} = $props();

	const sizeClasses: Record<Size, string> = {
		sm: 'max-w-sm',
		md: 'max-w-lg',
		lg: 'max-w-2xl',
		xl: 'max-w-4xl',
	};

	function close() {
		open = false;
		onclose?.();
	}

	function handleBackdrop(e: MouseEvent) {
		if (e.target === e.currentTarget) close();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') close();
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
		onclick={handleBackdrop}
		onkeydown={handleKeydown}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<div
			class="w-full {sizeClasses[size]} bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-black/50 flex flex-col max-h-[90vh] animate-in"
		>
			{#if title}
				<div class="flex items-center justify-between px-6 py-4 border-b border-slate-800">
					<h3 class="text-lg font-semibold text-white">{title}</h3>
					<button
						onclick={close}
						class="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
					>
						<X class="w-5 h-5" />
					</button>
				</div>
			{/if}

			<div class="px-6 py-5 overflow-y-auto flex-1">
				{@render children()}
			</div>

			{#if footer}
				<div class="px-6 py-4 border-t border-slate-800 flex items-center justify-end gap-3">
					{@render footer()}
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	@keyframes animate-in {
		from {
			opacity: 0;
			transform: scale(0.95) translateY(10px);
		}
		to {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}
	.animate-in {
		animation: animate-in 0.2s ease-out;
	}
</style>
