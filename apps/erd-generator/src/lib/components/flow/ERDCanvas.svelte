<script lang="ts">
	import { SvelteFlow, Background, Controls, SvelteFlowProvider } from '@xyflow/svelte';
	import '@xyflow/svelte/dist/style.css';
	import TableNode from './TableNode.svelte';
	import RelationEdge from './RelationEdge.svelte';
	import CanvasControls from './CanvasControls.svelte';
	import { flowStore } from '$lib/stores/flow.store.svelte';

	let {
		readonly = false,
		isReadOnly = false,
		onNodeClick,
		nodes = $bindable(),
		edges = $bindable()
	}: {
		readonly?: boolean;
		isReadOnly?: boolean;
		onNodeClick?: (nodeId: string) => void;
		nodes?: any[];
		edges?: any[];
	} = $props();

	const activeReadOnly = $derived(readonly || isReadOnly);

	const mappedNodes = $derived((nodes ?? flowStore.nodes).map((n) => ({
		...n,
		data: { ...n.data, isReadOnly: activeReadOnly }
	})));

	const nodeTypes: any = { table: TableNode };
	const edgeTypes: any = { relation: RelationEdge };
</script>

<SvelteFlowProvider>
	<div class="w-full h-full relative">
		<SvelteFlow
			nodes={mappedNodes}
			edges={edges ?? flowStore.edges}
			{nodeTypes}
			{edgeTypes}
			fitView
			colorMode="dark"
			minZoom={0.1}
			maxZoom={2}
			nodesConnectable={!activeReadOnly}
			nodesDraggable={!activeReadOnly}
			elementsSelectable={!activeReadOnly}
			onnodeclick={(...args: any[]) => onNodeClick?.(args[1]?.id)}
		>
			<Background gap={24} size={1} />
			<Controls position="bottom-right" />
		</SvelteFlow>
		<CanvasControls />
	</div>
</SvelteFlowProvider>
