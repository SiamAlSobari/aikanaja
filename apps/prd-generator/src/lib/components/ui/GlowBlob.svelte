<script lang="ts">
	let { position, size, color }: { position: string; size: string; color: string } = $props();
</script>

<div
	class="absolute {position} {size} rounded-full {color} glow-blur pointer-events-none"
></div>
