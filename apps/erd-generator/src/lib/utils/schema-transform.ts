import type { ErdSchema, ErdTable, ErdRelation } from '$lib/types/erd';
import type { Node, Edge } from '@xyflow/svelte';

const COLUMN_TYPE_COLORS: Record<string, string> = {
	UUID: 'text-purple-400',
	VARCHAR: 'text-sky-400',
	TEXT: 'text-sky-400',
	INT: 'text-amber-400',
	INTEGER: 'text-amber-400',
	BIGINT: 'text-amber-400',
	FLOAT: 'text-amber-400',
	DECIMAL: 'text-amber-400',
	BOOLEAN: 'text-emerald-400',
	DATE: 'text-orange-400',
	DATETIME: 'text-orange-400',
	TIMESTAMP: 'text-orange-400',
	JSON: 'text-pink-400',
	JSONB: 'text-pink-400',
	BLOB: 'text-slate-400',
};

export function getColumnColor(type: string): string {
	const upper = type.toUpperCase();
	return COLUMN_TYPE_COLORS[upper] || 'text-slate-400';
}

export function schemaToFlowNodes(schema: ErdSchema): { nodes: Node[]; edges: Edge[] } {
	const nodes: Node[] = schema.tables.map((table) => ({
		id: table.id,
		type: 'table',
		position: table.position || { x: 0, y: 0 },
		data: { table },
	}));

	const edges: Edge[] = schema.relations.map((rel) => ({
		id: rel.id,
		source: rel.sourceTableId,
		target: rel.targetTableId,
		sourceHandle: rel.sourceColumn,
		targetHandle: rel.targetColumn,
		type: 'smoothstep',
		label: getRelationLabel(rel.type),
		animated: rel.type === 'many-to-many',
		style: 'stroke: #f97316; stroke-width: 1.5;',
		labelStyle: 'fill: #f97316; font-size: 10px; font-weight: 600;',
	}));

	return { nodes, edges };
}

function getRelationLabel(type: string): string {
	switch (type) {
		case 'one-to-one': return '1:1';
		case 'one-to-many': return '1:N';
		case 'many-to-many': return 'N:M';
		default: return type;
	}
}
