<script lang="ts">
	import { ZoomIn, ZoomOut, Maximize, Lock, Unlock } from 'lucide-svelte';
	import { useStore } from '@xyflow/svelte';

	let store = $derived(useStore());
	let zoomLevel = $derived(((store as any).transform[2] * 100).toFixed(0));
	let isLocked = $state(false);

	function zoomIn() {
		(store as any).updateTransform((t: number[]) => [t[0], t[1], Math.min(t[2] * 1.2, 3)]);
	}

	function zoomOut() {
		(store as any).updateTransform((t: number[]) => [t[0], t[1], Math.max(t[2] * 0.8, 0.2)]);
	}

	function fitView() {
		(store as any).fitView();
	}

	function toggleLock() {
		isLocked = !isLocked;
	}
</script>

<div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-1.5 rounded-xl bg-slate-950/90 border border-slate-800/80 backdrop-blur-sm shadow-lg shadow-black/40 z-10">
	<button
		onclick={zoomOut}
		class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
		title="Zoom Out"
	>
		<ZoomOut class="w-3.5 h-3.5" />
	</button>

	<span class="text-[10px] font-mono text-slate-500 w-10 text-center tabular-nums">
		{parseFloat(zoomLevel) * 100}%
	</span>

	<button
		onclick={zoomIn}
		class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
		title="Zoom In"
	>
		<ZoomIn class="w-3.5 h-3.5" />
	</button>

	<div class="w-px h-4 bg-slate-800 mx-0.5"></div>

	<button
		onclick={fitView}
		class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
		title="Fit View"
	>
		<Maximize class="w-3.5 h-3.5" />
	</button>

	<div class="w-px h-4 bg-slate-800 mx-0.5"></div>

	<button
		onclick={toggleLock}
		class="p-1.5 rounded-lg transition-all {isLocked ? 'text-orange-400 bg-orange-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}"
		title={isLocked ? 'Unlock canvas' : 'Lock canvas'}
	>
		{#if isLocked}
			<Lock class="w-3.5 h-3.5" />
		{:else}
			<Unlock class="w-3.5 h-3.5" />
		{/if}
	</button>
</div>
