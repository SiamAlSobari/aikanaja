<script lang="ts">
	type Size = 'sm' | 'md' | 'lg';

	let {
		size = 'md',
		class: className = '',
	}: {
		size?: Size;
		class?: string;
	} = $props();

	const sizeClasses: Record<Size, string> = {
		sm: 'w-4 h-4',
		md: 'w-6 h-6',
		lg: 'w-8 h-8',
	};
</script>

<span class="loading loading-spinner {sizeClasses[size]} text-orange-500 {className}"></span>
