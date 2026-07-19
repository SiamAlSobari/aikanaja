<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title,
		subtitle,
		children
	}: { title: string; subtitle?: string; children?: Snippet } = $props();
</script>

<div class="flex flex-wrap items-end justify-between gap-4 px-6 lg:px-10 pt-8 pb-6">
	<div>
		<h1 class="text-2xl font-bold text-white tracking-tight">{title}</h1>
		{#if subtitle}
			<p class="mt-1 text-sm text-slate-400">{subtitle}</p>
		{/if}
	</div>
	{#if children}
		<div class="flex items-center gap-2">{@render children()}</div>
	{/if}
</div>
