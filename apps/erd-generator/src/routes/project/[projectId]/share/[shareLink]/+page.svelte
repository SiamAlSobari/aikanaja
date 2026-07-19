<script lang="ts">
	import ERDCanvas from '$lib/components/flow/ERDCanvas.svelte';
	import { Database, LogIn } from 'lucide-svelte';
	let { data } = $props();

	// Construct nodes/edges read-only data for ERDCanvas
	const nodes = $derived(data.project?.schema?.tables?.map((table: any) => ({
		id: table.id,
		type: 'table',
		position: table.position || { x: 0, y: 0 },
		data: { table }
	})) ?? []);

	const edges = $derived(data.project?.schema?.relations?.map((rel: any) => ({
		id: rel.id,
		source: rel.sourceTableId,
		target: rel.targetTableId,
		sourceHandle: rel.sourceColumn,
		targetHandle: rel.targetColumn,
		type: 'relation',
		label: rel.type === 'one-to-one' ? '1:1' : rel.type === 'one-to-many' ? '1:N' : 'N:M',
		animated: rel.type === 'many-to-many',
		style: 'stroke: #f97316; stroke-width: 1.5;',
		labelStyle: 'fill: #f97316; font-size: 10px; font-weight: 600;',
		data: { label: rel.type === 'one-to-one' ? '1:1' : rel.type === 'one-to-many' ? '1:N' : 'N:M' }
	})) ?? []);
</script>

<div class="h-screen w-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden" id="shared-page-container">
	<!-- Read Only Navbar -->
	<header class="h-14 border-b border-slate-800/60 bg-slate-900/40 backdrop-blur-md flex items-center justify-between px-6 z-10" id="shared-navbar">
		<div class="flex items-center gap-2">
			<div class="w-8 h-8 rounded-lg bg-orange-600/10 border border-orange-500/30 flex items-center justify-center" id="shared-logo-container">
				<Database class="w-4 h-4 text-orange-500" />
			</div>
			<div>
				<span class="text-xs font-bold text-white" id="shared-project-name">{data.project.name}</span>
				<span class="ml-2 bg-slate-800 text-[10px] text-slate-400 border border-slate-700 px-1.5 py-0.5 rounded" id="view-only-badge">View Only</span>
			</div>
		</div>
		<a href="/auth/login" id="signin-btn" class="btn btn-xs bg-orange-600 hover:bg-orange-700 text-white rounded-lg border-none font-medium gap-1">
			<LogIn class="w-3.5 h-3.5" /> Sign In to Fork
		</a>
	</header>

	<!-- Diagram Canvas Area -->
	<div class="flex-1 min-h-0 relative" id="shared-canvas-area">
		<ERDCanvas {nodes} {edges} isReadOnly={true} />
	</div>
</div>
