<script lang="ts">
	let {
		values = [],
		color = '#f97316',
		height = 32,
		width = 80,
	}: {
		values?: number[];
		color?: string;
		height?: number;
		width?: number;
	} = $props();

	const points = $derived(() => {
		if (values.length < 2) return '';
		const max = Math.max(...values, 1);
		const min = Math.min(...values, 0);
		const range = max - min || 1;
		const stepX = width / (values.length - 1);
		return values
			.map((v, i) => `${i * stepX},${height - ((v - min) / range) * (height - 4) - 2}`)
			.join(' ');
	});

	const gradientId = $derived(`sparkline-${Math.random().toString(36).slice(2, 8)}`);
</script>

<svg {width} {height} class="overflow-visible">
	<defs>
		<linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
			<stop offset="0%" stop-color={color} stop-opacity="0.3" />
			<stop offset="100%" stop-color={color} stop-opacity="0" />
		</linearGradient>
	</defs>
	{#if points()}
		<polyline
			points={points()}
			fill="none"
			stroke={color}
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<polyline
			points="0,{height} {points()} {width},{height}"
			fill="url(#{gradientId})"
			stroke="none"
		/>
	{/if}
</svg>
