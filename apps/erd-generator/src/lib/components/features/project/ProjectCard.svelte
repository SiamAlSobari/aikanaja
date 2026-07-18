<script lang="ts">
	import { Table2, Clock, ExternalLink, Trash2 } from 'lucide-svelte';

	let {
		project,
		onDelete,
		animationDelay = 0,
	}: {
		project: any;
		onDelete?: (id: string, name: string) => void;
		animationDelay?: number;
	} = $props();

	function formatDate(dateStr: string): string {
		const date = new Date(dateStr);
		const now = new Date();
		const diff = now.getTime() - date.getTime();
		const hours = Math.floor(diff / 3600000);
		const days = Math.floor(diff / 86400000);
		if (hours < 1) return 'Just now';
		if (hours < 24) return `${hours}h ago`;
		if (days < 7) return `${days}d ago`;
		return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
	}

	function truncate(str: string, len: number): string {
		if (!str) return '';
		return str.length > len ? str.slice(0, len) + '...' : str;
	}

	// Generate mini ERD preview SVG from schema
	function generatePreviewSvg(schema: any): string {
		if (!schema?.tables?.length) return '';
		const tables = schema.tables.slice(0, 5);
		const w = 200, h = 120;
		const tableW = 36, tableH = 20;
		const positions = tables.map((_: any, i: number) => {
			const cols = Math.min(tables.length, 3);
			const row = Math.floor(i / cols);
			const col = i % cols;
			return {
				x: 10 + col * (tableW + 20),
				y: 10 + row * (tableH + 15),
			};
		});

		let svg = `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg">`;

		// Draw relations as lines
		if (schema.relations) {
			for (const rel of schema.relations) {
				const srcIdx = tables.findIndex((t: any) => t.id === rel.sourceTableId);
				const tgtIdx = tables.findIndex((t: any) => t.id === rel.targetTableId);
				if (srcIdx >= 0 && tgtIdx >= 0) {
					const sx = positions[srcIdx].x + tableW / 2;
					const sy = positions[srcIdx].y + tableH;
					const tx = positions[tgtIdx].x + tableW / 2;
					const ty = positions[tgtIdx].y;
					svg += `<line x1="${sx}" y1="${sy}" x2="${tx}" y2="${ty}" stroke="#f97316" stroke-width="0.8" stroke-opacity="0.3"/>`;
				}
			}
		}

		// Draw tables as rectangles
		for (let i = 0; i < tables.length; i++) {
			const { x, y } = positions[i];
			svg += `<rect x="${x}" y="${y}" width="${tableW}" height="${tableH}" rx="3" fill="#0f172a" stroke="#334155" stroke-width="0.8"/>`;
			svg += `<rect x="${x}" y="${y}" width="${tableW}" height="5" rx="3" fill="#1e293b"/>`;
		}

		svg += '</svg>';
		return svg;
	}

	const previewSvg = $derived(generatePreviewSvg(project.schema));

	function handleCardMouseMove(e: MouseEvent) {
		const card = e.currentTarget as HTMLElement;
		const rect = card.getBoundingClientRect();
		card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
		card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
	}
</script>

<div
	onmousemove={handleCardMouseMove}
	role="presentation"
	class="group relative rounded-xl overflow-hidden transition-all duration-300 animate-fade-in-up"
	style="animation-delay: {animationDelay}ms;"
>
	<div class="absolute inset-0 bg-slate-900/30 border border-slate-800/40 rounded-xl group-hover:border-orange-600/20 group-hover:bg-slate-900/50 transition-all"></div>
	<div
		class="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
		style="background: radial-gradient(circle 250px at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(255, 62, 0, 0.04), transparent 80%);"
	></div>

	<a href="/project/{project.id}" class="relative block p-4">
		<div class="flex items-start gap-3.5">
			<!-- ERD Preview Thumbnail -->
			{#if previewSvg}
				<div class="w-16 h-12 rounded-lg bg-slate-950/80 border border-slate-800/60 flex items-center justify-center shrink-0 overflow-hidden">
					{@html previewSvg}
				</div>
			{:else}
				<div class="w-16 h-12 rounded-lg bg-slate-900/60 border border-slate-800/40 flex items-center justify-center shrink-0">
					<Table2 class="w-5 h-5 text-slate-700" />
				</div>
			{/if}

			<div class="flex-1 min-w-0">
				<h3 class="text-sm font-bold text-white group-hover:text-orange-400 transition-colors truncate">
					{truncate(project.name, 30)}
				</h3>
				<p class="text-[11px] text-slate-500 truncate mt-0.5">
					{project.description || 'No description'}
				</p>
				<div class="flex items-center gap-3 mt-2">
					<span class="flex items-center gap-1 text-[10px] text-slate-600">
						<Clock class="w-3 h-3" /> {formatDate(project.updatedAt)}
					</span>
					<span class="text-[10px] text-slate-700">
						{project._count?.versions || 0} v
					</span>
				</div>
			</div>

			<div class="flex flex-col items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
				<button
					onclick={(e) => { e.preventDefault(); window.location.href = `/project/${project.id}`; }}
					class="p-1.5 rounded-lg text-slate-500 hover:text-orange-400 hover:bg-slate-800/50 transition-colors"
					title="Open"
				>
					<ExternalLink class="w-3.5 h-3.5" />
				</button>
				{#if onDelete}
					<button
						onclick={(e) => { e.preventDefault(); onDelete(project.id, project.name); }}
						class="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800/50 transition-colors"
						title="Delete"
					>
						<Trash2 class="w-3.5 h-3.5" />
					</button>
				{/if}
			</div>
		</div>
	</a>
</div>

<style>
	@keyframes fade-in-up {
		from { opacity: 0; transform: translateY(10px); }
		to { opacity: 1; transform: translateY(0); }
	}
	.animate-fade-in-up {
		opacity: 0;
		animation: fade-in-up 0.4s ease-out forwards;
	}
</style>
