<script lang="ts">
	import { SvelteFlow, Background, Controls } from '@xyflow/svelte';
	import '@xyflow/svelte/dist/style.css';
	import TableNode from './TableNode.svelte';
	import RelationEdge from './RelationEdge.svelte';
	import CanvasControls from './CanvasControls.svelte';
	import { flowStore } from '$lib/stores/flow.store.svelte';

	let {
		readonly = false,
		isReadOnly = false,
		onNodeClick,
		nodes,
		edges,
	}: {
		readonly?: boolean;
		isReadOnly?: boolean;
		onNodeClick?: (nodeId: string) => void;
		nodes?: any[];
		edges?: any[];
	} = $props();

	const activeReadOnly = $derived(readonly || isReadOnly);

	const mappedNodes = $derived((nodes ?? flowStore.nodes).map(n => ({
		...n,
		data: { ...n.data, isReadOnly: activeReadOnly }
	})));

	const nodeTypes = { table: TableNode };
	const edgeTypes = { relation: RelationEdge };

	function handleNodeClick(_: any, node: any) {
		flowStore.selectNode(node.id);
		onNodeClick?.(node.id);
	}

	function handleEdgeClick(_: any, edge: any) {
		flowStore.selectEdge(edge.id);
	}

	function handlePaneClick() {
		flowStore.deselectAll();
	}

	function handleConnect(params: any) {
		const newEdge = {
			id: `e-${Date.now()}`,
			source: params.source,
			target: params.target,
			sourceHandle: params.sourceHandle,
			targetHandle: params.targetHandle,
			type: 'relation',
			label: '1:N',
			animated: false,
			style: 'stroke: #f97316; stroke-width: 1.5;',
			labelStyle: 'fill: #f97316; font-size: 10px; font-weight: 600;',
		};
		flowStore.addEdge(newEdge);
	}
</script>

<div class="w-full h-full relative" class:select-none={!activeReadOnly}>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<SvelteFlow
		nodes={mappedNodes}
		edges={edges ?? flowStore.edges}
		{nodeTypes}
		{edgeTypes}
		fitView
		panOnDrag={!activeReadOnly}
		zoomOnScroll
		connectOnDrag={!activeReadOnly}
		onConnect={handleConnect}
		minZoom={0.2}
		maxZoom={3}
		onnodeclick={handleNodeClick}
		onedgeclick={handleEdgeClick}
		onpaneClick={handlePaneClick}
		proOptions={{ hideAttribution: true }}
		className="erd-canvas"
	>
		<Background
			gap={20}
			size={1}
			color="rgba(148, 163, 184, 0.08)"
		/>
		<Controls showInteractive={false} />
	</SvelteFlow>

	<CanvasControls />
</div>

<style>
	:global(.erd-canvas .svelte-flow__pane) {
		cursor: grab;
		background-color: transparent;
	}

	:global(.erd-canvas .svelte-flow__pane:active) {
		cursor: grabbing;
	}

	:global(.erd-canvas .svelte-flow__edge-path) {
		stroke: #f97316 !important;
		stroke-width: 1.5 !important;
	}

	:global(.erd-canvas .svelte-flow__edge.selected .svelte-flow__edge-path) {
		stroke: #fb923c !important;
		stroke-width: 2.5 !important;
		filter: drop-shadow(0 0 6px rgba(249, 115, 22, 0.4));
	}

	:global(.erd-canvas .svelte-flow__edge-label) {
		font-size: 10px !important;
		font-weight: 600 !important;
		fill: #f97316 !important;
	}

	:global(.erd-canvas .svelte-flow__connectionpath) {
		stroke: #f97316 !important;
		stroke-width: 2 !important;
		stroke-dasharray: 5 5 !important;
		animation: dash 1s linear infinite;
	}

	@keyframes dash {
		to { stroke-dashoffset: -10; }
	}
</style>
