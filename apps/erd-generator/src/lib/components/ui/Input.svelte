<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		label,
		error,
		placeholder = '',
		value = $bindable(''),
		type = 'text',
		disabled = false,
		readonly = false,
		iconLeft,
		iconRight,
		class: className = '',
		...rest
	}: {
		label?: string;
		error?: string;
		placeholder?: string;
		value?: string;
		type?: 'text' | 'email' | 'password' | 'number';
		disabled?: boolean;
		readonly?: boolean;
		iconLeft?: Snippet;
		iconRight?: Snippet;
		class?: string;
		[key: string]: unknown;
	} = $props();
</script>

<div class="form-control w-full {className}">
	{#if label}
		<!-- svelte-ignore a11y_label_has_associated_control -->
		<label class="label">
			<span class="label-text text-slate-300 text-sm">{label}</span>
		</label>
	{/if}
	<div class="relative">
		{#if iconLeft}
			<span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
				{@render iconLeft()}
			</span>
		{/if}
		<input
			{type}
			{placeholder}
			bind:value
			{disabled}
			{readonly}
			class="w-full bg-slate-900/60 border border-slate-800 text-slate-200 text-sm rounded-xl
				focus:outline-none focus:border-orange-600/50 focus:ring-1 focus:ring-orange-600/20
				placeholder:text-slate-600 transition-colors
				disabled:opacity-50 disabled:cursor-not-allowed
				read-only:bg-slate-900/30 read-only:cursor-default
				{iconLeft ? 'pl-10' : 'pl-4'} {iconRight ? 'pr-10' : 'pr-4'} py-2.5"
			{...rest}
		/>
		{#if iconRight}
			<span class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
				{@render iconRight()}
			</span>
		{/if}
	</div>
	{#if error}
		<!-- svelte-ignore a11y_label_has_associated_control -->
		<label class="label">
			<span class="label-text-alt text-red-400 text-xs">{error}</span>
		</label>
	{/if}
</div>
