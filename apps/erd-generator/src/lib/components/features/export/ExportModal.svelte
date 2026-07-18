<script lang="ts">
	import {
		X,
		Download,
		Copy,
		FileCode,
		Loader2,
		Check,
		Database,
		Table2
	} from 'lucide-svelte';
	import { erdApi } from '$lib/api/erd';
	import { DB_TARGETS } from '$lib/utils/constants';
	import type { ErdSchema } from '$lib/types/erd';
	import { addToast } from '$lib/stores/ui.store.svelte';

	let {
		open = $bindable(false),
		schema,
		projectName = 'schema'
	}: {
		open?: boolean;
		schema: ErdSchema | null;
		projectName?: string;
	} = $props();

	let format = $state<'sql' | 'prisma'>('sql');
	let target = $state<'mysql' | 'postgresql' | 'sqlite'>('postgresql');
	let preview = $state('');
	let filename = $state('');
	let isLoading = $state(false);
	let copied = $state(false);

	$effect(() => {
		if (open && schema) fetchPreview();
	});

	async function fetchPreview() {
		if (!schema) return;
		isLoading = true;
		try {
			const res = await erdApi.export({
				schema,
				format,
				target: format === 'sql' ? target : undefined
			});
			preview = res.file;
			filename = res.filename;
		} catch (err: any) {
			preview = `-- Error: ${err.message}`;
		} finally {
			isLoading = false;
		}
	}

	function highlight(code: string, fmt: string): string {
		const esc = code
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');
		if (fmt === 'sql') {
			return esc
				.replace(/(--[^\n]*)/g, '<span class="tok-comment">$1</span>')
				.replace(/\b(CREATE TABLE|PRIMARY KEY|FOREIGN KEY|REFERENCES|NOT NULL|UNIQUE|DEFAULT|CONSTRAINT|AUTO_INCREMENT|IF NOT EXISTS)\b/g, '<span class="tok-keyword">$1</span>')
				.replace(/\b(VARCHAR|INT|INTEGER|BIGINT|FLOAT|DECIMAL|BOOLEAN|DATE|DATETIME|TIMESTAMP|TEXT|JSON|JSONB|BLOB|UUID|SERIAL)\b/g, '<span class="tok-type">$1</span>')
				.replace(/'([^']*)'/g, '<span class="tok-string">\'$1\'</span>');
		}
		return esc
			.replace(/(model |generator |datasource |\/\/|[{}])/g, '<span class="tok-comment">$1</span>')
			.replace(/\b(String|Int|BigInt|Float|Decimal|Boolean|DateTime|Json|Bytes|Uuid)\b/g, '<span class="tok-type">$1</span>')
			.replace(/(@id|@unique|@relation|@default|@updatedAt|@map|@@index|@@id)/g, '<span class="tok-keyword">$1</span>');
	}

	const highlighted = $derived(highlight(preview, format));

	async function download() {
		if (!schema) return;
		try {
			const res = await erdApi.export({
				schema,
				format,
				target: format === 'sql' ? target : undefined
			});
			const mime = format === 'sql' ? 'text/plain' : 'text/plain';
			const blob = new Blob([res.file], { type: mime });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = res.filename;
			a.click();
			URL.revokeObjectURL(url);
			addToast('success', `Diekspor sebagai ${res.filename}`);
		} catch (err: any) {
			addToast('error', err.message || 'Gagal export');
		}
	}

	async function copy() {
		try {
			await navigator.clipboard.writeText(preview);
			copied = true;
			setTimeout(() => (copied = false), 1500);
		} catch {
			addToast('error', 'Gagal menyalin');
		}
	}
</script>

{#if open}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
		role="presentation"
		onclick={() => (open = false)}
	>
		<!-- Modal -->
		<div
			class="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl shadow-black/60 overflow-hidden"
			role="dialog"
			aria-modal="true"
			tabindex="-1"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => { if (e.key === 'Escape') open = false; }}
		>
			<!-- Header -->
			<div class="flex items-center justify-between px-5 py-4 border-b border-slate-800/60">
				<div class="flex items-center gap-2.5">
					<div class="w-8 h-8 rounded-lg bg-orange-600/10 border border-orange-600/20 flex items-center justify-center">
						<FileCode class="w-4 h-4 text-orange-500" />
					</div>
					<div>
						<h3 class="text-sm font-bold text-white">Export Schema</h3>
						<p class="text-[11px] text-slate-500">{projectName}</p>
					</div>
				</div>
				<button
					onclick={() => (open = false)}
					class="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800/60 transition-all"
				>
					<X class="w-4 h-4" />
				</button>
			</div>

			<!-- Options -->
			<div class="px-5 py-4 flex flex-col gap-4 border-b border-slate-800/60">
				<!-- Format + target -->
				<div class="grid grid-cols-2 gap-3">
					<div class="flex flex-col gap-1.5">
						<span class="text-[11px] text-slate-500 font-medium">Format</span>
						<div class="flex gap-1.5">
							<button
								onclick={() => (format = 'sql')}
								class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium border transition-all {format === 'sql'
									? 'bg-orange-600/15 border-orange-600/30 text-orange-400'
									: 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'}"
							>
								<Database class="w-3.5 h-3.5" /> SQL DDL
							</button>
							<button
								onclick={() => (format = 'prisma')}
								class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium border transition-all {format === 'prisma'
									? 'bg-teal-500/15 border-teal-500/30 text-teal-400'
									: 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'}"
							>
								<Table2 class="w-3.5 h-3.5" /> Prisma
							</button>
						</div>
					</div>

					{#if format === 'sql'}
						<div class="flex flex-col gap-1.5">
							<span class="text-[11px] text-slate-500 font-medium">Target Database</span>
							<select
								bind:value={target}
								onchange={fetchPreview}
								class="w-full bg-slate-950/40 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-orange-600/40 cursor-pointer"
							>
								{#each DB_TARGETS as t}
									<option value={t.value}>{t.label}</option>
								{/each}
							</select>
						</div>
					{/if}
				</div>

				<!-- Toggles -->
				<div class="flex flex-wrap gap-2"></div>
			</div>

			<!-- Preview -->
			<div class="flex-1 overflow-auto bg-slate-950/60 p-4 min-h-[200px]">
				{#if isLoading}
					<div class="flex items-center justify-center h-full gap-2 text-slate-500 text-xs">
						<Loader2 class="w-4 h-4 animate-spin" /> Menyiapkan preview…
					</div>
				{:else}
					<pre class="text-[11px] leading-relaxed font-mono text-slate-300 whitespace-pre"><code>{@html highlighted}</code></pre>
				{/if}
			</div>

			<!-- Footer -->
			<div class="flex items-center justify-between px-5 py-3.5 border-t border-slate-800/60">
				<button
					onclick={copy}
					class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
				>
					{#if copied}
						<Check class="w-3.5 h-3.5 text-emerald-400" /> Tersalin
					{:else}
						<Copy class="w-3.5 h-3.5" /> Salin
					{/if}
				</button>
				<button
					onclick={download}
					class="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-slate-950 text-xs font-bold shadow-lg shadow-orange-600/20 transition-all active:scale-[0.98]"
				>
					<Download class="w-3.5 h-3.5" /> Download {filename || ''}
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	@keyframes fade-in {
		from { opacity: 0; }
		to { opacity: 1; }
	}
	:global(.animate-fade-in) { animation: fade-in 0.2s ease-out; }

	:global(.tok-keyword) { color: #fb923c; font-weight: 600; }
	:global(.tok-type) { color: #38bdf8; }
	:global(.tok-string) { color: #a7f3d0; }
	:global(.tok-comment) { color: #64748b; font-style: italic; }
</style>
