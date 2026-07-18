<script lang="ts">
	import {
		Sparkles,
		Send,
		Loader2,
		PanelLeftClose,
		PanelLeftOpen,
		KeyRound,
		Infinity as InfinityIcon,
		Coins,
		AlertCircle
	} from 'lucide-svelte';
	import { erdApi } from '$lib/api/erd';
	import { flowStore } from '$lib/stores/flow.store.svelte';
	import type { ErdSchema } from '$lib/types/erd';
	import AIMessage from './AIMessage.svelte';
	import PromptSuggestions from './PromptSuggestions.svelte';

	let {
		collapsed = $bindable(false),
		onGenerated
	}: {
		collapsed?: boolean;
		onGenerated?: (schema: ErdSchema) => void;
	} = $props();

	interface ChatMsg {
		id: string;
		role: 'user' | 'ai';
		content: string;
		timestamp: string;
		tableCount?: number;
	}

	let prompt = $state('');
	let isGenerating = $state(false);
	let error = $state('');
	let messages = $state<ChatMsg[]>([]);
	let usage = $state<{ count: number; limit: number; remaining: number | string; isUnlimited: boolean } | null>(null);
	let hasApiKey = $state(false);
	let scrollEl = $state<HTMLDivElement | null>(null);

	$effect(() => {
		hasApiKey = !!localStorage.getItem('sf_api_key');
		loadUsage();
	});

	$effect(() => {
		if (scrollEl && messages.length) {
			scrollEl.scrollTop = scrollEl.scrollHeight;
		}
	});

	async function loadUsage() {
		try {
			const res = await erdApi.getUsage();
			if (res.data) usage = res.data;
		} catch {
			usage = null;
		}
	}

	function nowTime() {
		return new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
	}

	async function handleGenerate() {
		if (!prompt.trim() || isGenerating) return;
		isGenerating = true;
		error = '';

		const userMsg: ChatMsg = {
			id: crypto.randomUUID(),
			role: 'user',
			content: prompt.trim(),
			timestamp: nowTime()
		};
		messages = [...messages, userMsg];
		const sentPrompt = prompt.trim();
		prompt = '';

		try {
			const apiKey = localStorage.getItem('sf_api_key') || undefined;
			const provider = localStorage.getItem('sf_provider') || undefined;
			const res = await erdApi.generate(sentPrompt, apiKey, provider);
			const schema = res.data as ErdSchema;

			flowStore.loadFromSchema(schema);
			onGenerated?.(schema);

			messages = [
				...messages,
				{
					id: crypto.randomUUID(),
					role: 'ai',
					content: `Berhasil membuat ERD dari deskripsi "${sentPrompt.slice(0, 40)}${sentPrompt.length > 40 ? '…' : ''}".`,
					timestamp: nowTime(),
					tableCount: schema.tables.length
				}
			];

			await loadUsage();
		} catch (err: any) {
			error = err.message || 'Gagal generate schema';
			messages = [
				...messages,
				{
					id: crypto.randomUUID(),
					role: 'ai',
					content: 'Maaf, terjadi kesalahan saat generate. Coba lagi atau periksa quota Anda.',
					timestamp: nowTime()
				}
			];
		} finally {
			isGenerating = false;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			handleGenerate();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if collapsed}
	<!-- Collapsed rail -->
	<button
		onclick={() => (collapsed = false)}
		class="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-xl bg-slate-900/80 border border-slate-800/60 text-slate-400 hover:text-orange-400 hover:border-orange-600/30 transition-all shadow-lg shadow-black/30"
		title="Buka AI Chat"
	>
		<PanelLeftOpen class="w-4 h-4" />
	</button>
{:else}
	<aside class="absolute left-0 top-0 bottom-0 w-[340px] z-20 flex flex-col bg-slate-950/95 border-r border-slate-800/60 backdrop-blur-xl animate-slide-in">
		<!-- Header -->
		<div class="flex items-center justify-between px-4 py-3.5 border-b border-slate-800/60">
			<div class="flex items-center gap-2.5">
				<div class="w-7 h-7 rounded-lg bg-orange-600/10 border border-orange-600/20 flex items-center justify-center">
					<Sparkles class="w-3.5 h-3.5 text-orange-500" />
				</div>
				<h2 class="text-sm font-bold text-white">AI Generator</h2>
			</div>
			<button
				onclick={() => (collapsed = true)}
				class="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800/60 transition-all"
				title="Tutup"
			>
				<PanelLeftClose class="w-4 h-4" />
			</button>
		</div>

		<!-- Quota indicator -->
		<div class="px-4 py-2.5 border-b border-slate-800/40">
			{#if hasApiKey}
				<div class="flex items-center gap-2 text-[11px] text-emerald-400">
					<KeyRound class="w-3.5 h-3.5" />
					<span>API key aktif — generate unlimited</span>
				</div>
			{:else if usage}
				<div class="flex items-center gap-2 text-[11px] text-slate-500">
					{#if usage.isUnlimited}
						<InfinityIcon class="w-3.5 h-3.5 text-teal-400" />
						<span class="text-teal-400">Unlimited generate</span>
					{:else}
						<Coins class="w-3.5 h-3.5 text-orange-500/70" />
						<span>Sisa <span class="text-slate-300 font-semibold">{usage.remaining}</span> generate bulan ini</span>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Messages -->
		<div bind:this={scrollEl} class="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
			{#if messages.length === 0}
				<div class="flex flex-col items-center gap-3 text-center mt-6">
					<div class="w-12 h-12 rounded-2xl bg-slate-900/80 border border-slate-800/60 flex items-center justify-center">
						<Sparkles class="w-5 h-5 text-orange-500/60" />
					</div>
					<p class="text-[11px] text-slate-500 leading-relaxed px-4">
						Deskripsikan database yang ingin dibuat. AI akan menyusun ERD lengkap dengan relasi antar tabel.
					</p>
				</div>
				<PromptSuggestions onSelect={(t) => (prompt = t)} />
			{:else}
				{#each messages as msg}
					<AIMessage role={msg.role} content={msg.content} timestamp={msg.timestamp} tableCount={msg.tableCount} />
				{/each}
			{/if}

			{#if error}
				<div class="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-red-600/10 border border-red-600/20">
					<AlertCircle class="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
					<p class="text-[11px] text-red-300 leading-relaxed">{error}</p>
				</div>
			{/if}
		</div>

		<!-- Input -->
		<div class="px-4 py-3.5 border-t border-slate-800/60">
			{#if messages.length === 0}
				<div class="mb-2.5">
					<PromptSuggestions onSelect={(t) => (prompt = t)} />
				</div>
			{/if}
			<div class="relative">
				<textarea
					bind:value={prompt}
					rows="3"
					placeholder="Deskripsikan database… (⌘+Enter untuk generate)"
					class="w-full bg-slate-900/60 border border-slate-800 text-slate-200 text-[13px] rounded-xl
						pl-3.5 pr-3.5 py-3 focus:outline-none focus:border-orange-600/50 focus:ring-1 focus:ring-orange-600/20
						placeholder:text-slate-600 transition-all resize-none"
				></textarea>
				<button
					onclick={handleGenerate}
					disabled={!prompt.trim() || isGenerating}
					class="absolute bottom-2.5 right-2.5 p-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-slate-950
						transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-orange-600/20"
					title="Generate"
				>
					{#if isGenerating}
						<Loader2 class="w-4 h-4 animate-spin" />
					{:else}
						<Send class="w-4 h-4" />
					{/if}
				</button>
			</div>
		</div>
	</aside>
{/if}

<style>
	@keyframes slide-in {
		from { transform: translateX(-100%); opacity: 0; }
		to { transform: translateX(0); opacity: 1; }
	}
	:global(.animate-slide-in) { animation: slide-in 0.25s ease-out; }
</style>
