import type { Node, Edge } from '@xyflow/svelte';
import type { ErdTable, ErdRelation, ErdColumn, ErdSchema } from '$lib/types/erd';

type FlowSnapshot = { nodes: Node[]; edges: Edge[] };

let nodes = $state.raw<Node[]>([]);
let edges = $state.raw<Edge[]>([]);
let selectedNodeId = $state<string | null>(null);
let selectedEdgeId = $state<string | null>(null);
let undoStack = $state<FlowSnapshot[]>([]);
let redoStack = $state<FlowSnapshot[]>([]);
let isDirty = $state(false);

const MAX_UNDO = 50;

function pushSnapshot() {
	undoStack = [...undoStack.slice(-MAX_UNDO), { nodes: [...nodes], edges: [...edges] }];
	redoStack = [];
	isDirty = true;
}

function selectNode(id: string | null) {
	selectedNodeId = id;
	if (id) selectedEdgeId = null;
}

function selectEdge(id: string | null) {
	selectedEdgeId = id;
	if (id) selectedNodeId = null;
}

function deselectAll() {
	selectedNodeId = null;
	selectedEdgeId = null;
}

function addNode(node: Node) {
	pushSnapshot();
	nodes = [...nodes, node];
}

function updateNode(id: string, data: Partial<Node>) {
	pushSnapshot();
	nodes = nodes.map((n) => (n.id === id ? { ...n, ...data } : n));
}

function deleteNode(id: string) {
	pushSnapshot();
	nodes = nodes.filter((n) => n.id !== id);
	edges = edges.filter((e) => e.source !== id && e.target !== id);
	if (selectedNodeId === id) selectedNodeId = null;
}

function addEdge(edge: Edge) {
	pushSnapshot();
	edges = [...edges, edge];
}

function updateEdge(id: string, data: Partial<Edge>) {
	pushSnapshot();
	edges = edges.map((e) => (e.id === id ? { ...e, ...data } : e));
}

function deleteEdge(id: string) {
	pushSnapshot();
	edges = edges.filter((e) => e.id !== id);
	if (selectedEdgeId === id) selectedEdgeId = null;
}

function undo() {
	if (undoStack.length === 0) return;
	redoStack = [{ nodes: [...nodes], edges: [...edges] }, ...redoStack];
	const prev = undoStack[undoStack.length - 1];
	undoStack = undoStack.slice(0, -1);
	nodes = prev.nodes;
	edges = prev.edges;
	selectedNodeId = null;
	selectedEdgeId = null;
	isDirty = false;
}

function redo() {
	if (redoStack.length === 0) return;
	undoStack = [...undoStack, { nodes: [...nodes], edges: [...edges] }];
	const next = redoStack[0];
	redoStack = redoStack.slice(1);
	nodes = next.nodes;
	edges = next.edges;
	selectedNodeId = null;
	selectedEdgeId = null;
	isDirty = false;
}

function loadFromSchema(schema: ErdSchema) {
	const flowNodes: Node[] = schema.tables.map((t: ErdTable) => ({
		id: t.id,
		type: 'table',
		position: t.position || { x: 0, y: 0 },
		data: { table: t },
	}));

	const flowEdges: Edge[] = schema.relations.map((r: ErdRelation) => ({
		id: r.id,
		source: r.sourceTableId,
		target: r.targetTableId,
		sourceHandle: r.sourceColumn,
		targetHandle: r.targetColumn,
		type: 'relation',
		label: r.type === 'one-to-one' ? '1:1' : r.type === 'one-to-many' ? '1:N' : 'N:M',
		animated: r.type === 'many-to-many',
		style: 'stroke: #f97316; stroke-width: 1.5;',
		labelStyle: 'fill: #f97316; font-size: 10px; font-weight: 600;',
	}));

	nodes = flowNodes;
	edges = flowEdges;
	undoStack = [];
	redoStack = [];
	isDirty = false;
	selectedNodeId = null;
	selectedEdgeId = null;
}

function addColumnToTable(tableId: string, column: ErdColumn) {
	pushSnapshot();
	nodes = nodes.map((n) => {
		if (n.id !== tableId) return n;
		const table = { ...(n.data as any).table };
		table.columns = [...table.columns, column];
		return { ...n, data: { table } };
	});
}

function updateColumnInTable(tableId: string, columnId: string, updates: Partial<ErdColumn>) {
	pushSnapshot();
	nodes = nodes.map((n) => {
		if (n.id !== tableId) return n;
		const table = { ...(n.data as any).table };
		table.columns = table.columns.map((c: ErdColumn) =>
			c.id === columnId ? { ...c, ...updates } : c
		);
		return { ...n, data: { table } };
	});
}

function deleteColumnFromTable(tableId: string, columnId: string) {
	pushSnapshot();
	nodes = nodes.map((n) => {
		if (n.id !== tableId) return n;
		const table = { ...(n.data as any).table };
		table.columns = table.columns.filter((c: ErdColumn) => c.id !== columnId);
		return { ...n, data: { table } };
	});
}

function renameTable(tableId: string, name: string) {
	pushSnapshot();
	nodes = nodes.map((n) => {
		if (n.id !== tableId) return n;
		const table = { ...(n.data as any).table, name };
		return { ...n, data: { table } };
	});
}

function updateRelationType(edgeId: string, type: 'one-to-one' | 'one-to-many' | 'many-to-many') {
	const label = type === 'one-to-one' ? '1:1' : type === 'many-to-many' ? 'N:M' : '1:N';
	updateEdge(edgeId, {
		label,
		animated: type === 'many-to-many',
		style: `stroke: #f97316; stroke-width: 1.5;`,
		labelStyle: 'fill: #f97316; font-size: 10px; font-weight: 600;',
	});
}

const selectedNode = $derived(
	selectedNodeId ? (nodes.find((n) => n.id === selectedNodeId)?.data as any)?.table ?? null : null
);

const selectedEdge = $derived(
	selectedEdgeId ? edges.find((e) => e.id === selectedEdgeId) ?? null : null
);

const tableList = $derived(
	nodes.map((n) => ({ id: n.id, name: (n.data as any).table.name }))
);

let onSave: ((schema: ErdSchema) => void) | null = null;

function setSaveCallback(fn: (schema: ErdSchema) => void) {
	onSave = fn;
}

function toSchema(): ErdSchema {
	const tables: ErdTable[] = nodes.map((n) => ({
		id: n.id,
		name: (n.data as any).table.name,
		position: n.position,
		columns: (n.data as any).table.columns,
	}));

	const relations: ErdRelation[] = edges.map((e) => ({
		id: e.id,
		sourceTableId: e.source,
		targetTableId: e.target,
		sourceColumn: (e.sourceHandle as string) || 'id',
		targetColumn: (e.targetHandle as string) || 'id',
		type: (e.label as string) === '1:1' ? 'one-to-one' : (e.label as string) === 'N:M' ? 'many-to-many' : 'one-to-many',
	}));

	return { tables, relations };
}

function saveToSchema(): ErdSchema {
	const schema = toSchema();
	onSave?.(schema);
	isDirty = false;
	return schema;
}

export const flowStore = {
	get nodes() { return nodes; },
	get edges() { return edges; },
	get selectedNodeId() { return selectedNodeId; },
	get selectedEdgeId() { return selectedEdgeId; },
	get canUndo() { return undoStack.length > 0; },
	get canRedo() { return redoStack.length > 0; },
	get isDirty() { return isDirty; },
	get selectedNode() { return selectedNode; },
	get selectedEdge() { return selectedEdge; },
	get tableList() { return tableList; },
	selectNode,
	selectEdge,
	deselectAll,
	addNode,
	updateNode,
	deleteNode,
	addEdge,
	updateEdge,
	deleteEdge,
	undo,
	redo,
	loadFromSchema,
	addColumnToTable,
	updateColumnInTable,
	deleteColumnFromTable,
	renameTable,
	updateRelationType,
	setSaveCallback,
	saveToSchema,
	toSchema,
};
