<script lang="ts">
	import type { EdgeProps } from '@xyflow/svelte';
	import { flowStore } from '$lib/stores/flow.store.svelte';

	let props = $props() as EdgeProps;
	const isSelected = $derived(flowStore.selectedEdgeId === props.id);
</script>

<foreignObject
	width="100%"
	height="100"
	class="erd-edge {isSelected ? 'erd-edge-selected' : ''}"
	onclick={(e) => {
		e.stopPropagation();
		flowStore.selectEdge(props.id);
	}}
>
	<div xmlns="http://www.w3.org/1999/xhtml" class="erd-edge-wrapper">
		{#if props.data.label}
			<div class="erd-edge-label">
				{props.data.label}
			</div>
		{/if}
	</div>
</foreignObject>

<style>
	:global(.erd-edge) {
		opacity: 0.7;
		transition: opacity 0.15s;
	}

	:global(.erd-edge:hover) {
		opacity: 1;
	}

	:global(.erd-edge-selected) {
		opacity: 1;
	}

	:global(.erd-edge-wrapper) {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		width: 100%;
	}

	:global(.erd-edge-label) {
		background: rgba(15, 23, 42, 0.9);
		border: 1px solid rgba(249, 115, 22, 0.3);
		border-radius: 4px;
		padding: 1px 5px;
		font-size: 9px;
		font-weight: 600;
		color: #f97316;
		white-space: nowrap;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
		backdrop-filter: blur(4px);
	}

	:global(.erd-edge-selected .erd-edge-label) {
		background: rgba(249, 115, 22, 0.15);
		border-color: rgba(249, 115, 22, 0.6);
		color: #fb923c;
		box-shadow: 0 0 12px rgba(249, 115, 22, 0.2);
	}
</style>
