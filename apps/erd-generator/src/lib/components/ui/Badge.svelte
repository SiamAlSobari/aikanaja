<script lang="ts">
	type Variant = 'info' | 'success' | 'warning' | 'error' | 'neutral';
	type Size = 'sm' | 'md';

	let {
		variant = 'neutral',
		size = 'sm',
		children,
		class: className = '',
	}: {
		variant?: Variant;
		size?: Size;
		children: import('svelte').Snippet;
		class?: string;
	} = $props();

	const variantClasses: Record<Variant, string> = {
		info: 'bg-blue-600/15 text-blue-400 border-blue-600/20',
		success: 'bg-emerald-600/15 text-emerald-400 border-emerald-600/20',
		warning: 'bg-amber-600/15 text-amber-400 border-amber-600/20',
		error: 'bg-red-600/15 text-red-400 border-red-600/20',
		neutral: 'bg-slate-700/40 text-slate-400 border-slate-700/50',
	};

	const sizeClasses: Record<Size, string> = {
		sm: 'px-2 py-0.5 text-[10px]',
		md: 'px-2.5 py-1 text-xs',
	};
</script>

<span
	class="inline-flex items-center font-semibold rounded-full border {variantClasses[variant]} {sizeClasses[size]} {className}"
>
	{@render children()}
</span>
