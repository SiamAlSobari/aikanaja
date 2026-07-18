<script lang="ts">
	import { Database, Bot, User, Check, Table2 } from 'lucide-svelte';

	let {
		role,
		content,
		timestamp = '',
		tableCount = 0
	}: {
		role: 'user' | 'ai';
		content: string;
		timestamp?: string;
		tableCount?: number;
	} = $props();

	const isUser = $derived(role === 'user');
</script>

<div class="flex gap-3 {isUser ? 'flex-row-reverse' : 'flex-row'} animate-fade-in">
	<!-- Avatar -->
	<div class="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center mt-0.5
		{isUser ? 'bg-orange-600/15 border border-orange-600/30' : 'bg-slate-800/60 border border-slate-700/60'}">
		{#if isUser}
			<User class="w-3.5 h-3.5 text-orange-400" />
		{:else}
			<Bot class="w-3.5 h-3.5 text-slate-400" />
		{/if}
	</div>

	<!-- Bubble -->
	<div class="max-w-[85%] flex flex-col gap-1 {isUser ? 'items-end' : 'items-start'}">
		<div class="px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed
			{isUser
				? 'bg-orange-600/90 text-slate-950 font-medium rounded-tr-sm'
				: 'bg-slate-900/80 border border-slate-800/60 text-slate-300 rounded-tl-sm'}">
			{content}
		</div>

		{#if !isUser && tableCount > 0}
			<div class="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-900/40 border border-slate-800/40">
				<Table2 class="w-3 h-3 text-orange-500/70" />
				<span class="text-[10px] text-slate-500">{tableCount} tabel dibuat</span>
				<Check class="w-3 h-3 text-emerald-500" />
			</div>
		{/if}

		{#if timestamp}
			<span class="text-[9px] text-slate-600 px-1">{timestamp}</span>
		{/if}
	</div>
</div>

<style>
	@keyframes fade-in {
		from { opacity: 0; transform: translateY(6px); }
		to { opacity: 1; transform: translateY(0); }
	}
	:global(.animate-fade-in) { animation: fade-in 0.25s ease-out; }
</style>
