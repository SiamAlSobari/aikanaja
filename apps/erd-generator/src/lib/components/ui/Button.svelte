<script lang="ts">
	import type { Snippet } from 'svelte';
	import Spinner from './Spinner.svelte';

	type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
	type Size = 'sm' | 'md' | 'lg';

	let {
		variant = 'primary',
		size = 'md',
		loading = false,
		disabled = false,
		type = 'button',
		onclick,
		icon,
		children,
		class: className = '',
		...rest
	}: {
		variant?: Variant;
		size?: Size;
		loading?: boolean;
		disabled?: boolean;
		type?: 'button' | 'submit' | 'reset';
		onclick?: (e: MouseEvent) => void;
		icon?: Snippet;
		children: Snippet;
		class?: string;
		[key: string]: unknown;
	} = $props();

	const variantClasses: Record<Variant, string> = {
		primary:
			'bg-orange-600 hover:bg-orange-700 text-slate-950 font-semibold shadow-lg shadow-orange-600/20 border-none',
		secondary:
			'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700',
		ghost:
			'bg-transparent hover:bg-slate-800/50 text-slate-300 hover:text-white border-none',
		danger:
			'bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg shadow-red-600/20 border-none',
		outline:
			'bg-transparent hover:bg-slate-800/50 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600'
	};

	const sizeClasses: Record<Size, string> = {
		sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
		md: 'px-4 py-2 text-sm rounded-xl gap-2',
		lg: 'px-6 py-3 text-base rounded-xl gap-2.5'
	};
</script>

<button
	{type}
	{onclick}
	disabled={disabled || loading}
	class="inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed {variantClasses[variant]} {sizeClasses[size]} {className}"
	{...rest}
>
	{#if loading}
		<Spinner size="sm" />
	{/if}
	{#if icon}
		{@render icon()}
	{/if}
	{@render children()}
</button>
