<script lang="ts">
	import { flowStore } from '$lib/stores/flow.store.svelte';

	let isOpen = $state(true);

	function toggle() {
		isOpen = !isOpen;
	}
</script>

<button
	onclick={toggle}
	class="absolute bottom-4 right-4 p-2 rounded-xl bg-slate-950/90 border border-slate-800/80 backdrop-blur-sm shadow-lg shadow-black/40 text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all z-10"
	title={isOpen ? 'Hide minimap' : 'Show minimap'}
>
	<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
		<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
	</svg>
</button>

{#if isOpen}
	<div class="absolute bottom-14 right-4 w-48 h-32 rounded-xl border border-slate-700/50 bg-slate-950/90 backdrop-blur-sm shadow-xl overflow-hidden z-10">
		<div class="w-full h-full p-1">
			<!-- Minimap content placeholder — actual minimap renders via Svelte Flow -->
			<div class="w-full h-full rounded-lg bg-slate-900/50 flex items-center justify-center">
				<span class="text-[9px] text-slate-600 font-mono">
					{flowStore.nodes.length} tables · {flowStore.edges.length} relations
				</span>
			</div>
		</div>
	</div>
{/if}
