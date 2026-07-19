<script lang="ts">
	import { BaseEdge, getBezierPath, type EdgeProps } from '@xyflow/svelte';
	import { flowStore } from '$lib/stores/flow.store.svelte';

	let props = $props() as EdgeProps;
	const isSelected = $derived(flowStore.selectedEdgeId === props.id);

	const pathData = $derived(
		getBezierPath({
			sourceX: props.sourceX,
			sourceY: props.sourceY,
			sourcePosition: props.sourcePosition,
			targetX: props.targetX,
			targetY: props.targetY,
			targetPosition: props.targetPosition
		})
	);
	const path = $derived(pathData[0]);
	const labelX = $derived(pathData[1]);
	const labelY = $derived(pathData[2]);
</script>

<BaseEdge
	id={props.id}
	path={path}
	markerEnd={props.markerEnd}
	style={isSelected ? 'stroke: #fb923c; stroke-width: 2.5;' : 'stroke: #f97316; stroke-width: 1.5;'}
/>

{#if props.label}
	<foreignObject x={labelX - 26} y={labelY - 12} width="52" height="24" class="overflow-visible pointer-events-none">
		<div class="erd-edge-label {isSelected ? 'erd-edge-selected' : ''}">{props.label}</div>
	</foreignObject>
{/if}

<style>
	:global(.erd-edge-label) {
		display: inline-flex;
		align-items: center;
		justify-content: center;
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
