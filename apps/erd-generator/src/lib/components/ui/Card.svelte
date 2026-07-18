<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		hover = false,
		clickable = false,
		onclick,
		header,
		children,
		footer,
		class: className = '',
	}: {
		hover?: boolean;
		clickable?: boolean;
		onclick?: () => void;
		header?: Snippet;
		children: Snippet;
		footer?: Snippet;
		class?: string;
	} = $props();
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex a11y_no_noninteractive_element_interactions -->
<div
	class="bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden
		{hover ? 'hover:border-slate-700 hover:bg-slate-900/60 transition-all duration-200' : ''}
		{clickable ? 'cursor-pointer hover:border-orange-600/30 active:scale-[0.99] transition-all' : ''}
		{className}"
	onclick={clickable ? onclick : undefined}
	onkeydown={clickable && onclick ? (e) => { if (e.key === 'Enter') onclick(); } : undefined}
	role={clickable ? 'button' : undefined}
	tabindex={clickable ? 0 : undefined}
>
	{#if header}
		<div class="px-5 py-4 border-b border-slate-800/80">
			{@render header()}
		</div>
	{/if}

	<div class="px-5 py-4">
		{@render children()}
	</div>

	{#if footer}
		<div class="px-5 py-3 border-t border-slate-800/80">
			{@render footer()}
		</div>
	{/if}
</div>
