<script lang="ts">
	import { onMount } from 'svelte';
	import {
		KeyRound,
		Plus,
		Trash2,
		ShieldCheck,
		TestTube,
		Loader2
	} from 'lucide-svelte';
	import { addToast } from '$lib/stores/ui.store.svelte';

	interface LocalKey {
		id: string;
		provider: string;
		label: string;
		masked: string;
		key: string;
	}

	let provider = $state('groq');
	let newKey = $state('');
	let label = $state('');
	let testing = $state(false);
	let localKeys = $state<LocalKey[]>([]);

	const providerMeta: Record<string, { name: string; cls: string }> = {
		groq: { name: 'Groq', cls: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
		gemini: { name: 'Gemini', cls: 'text-sky-400 bg-sky-500/10 border-sky-500/20' }
	};

	onMount(() => {
		loadLocalKeys();
	});

	function loadLocalKeys() {
		try {
			const stored = localStorage.getItem('aikanaja_custom_keys');
			if (stored) {
				localKeys = JSON.parse(stored);
			}
		} catch (e) {
			console.error('Failed to load local API keys:', e);
		}
	}

	function saveLocalKeys() {
		try {
			localStorage.setItem('aikanaja_custom_keys', JSON.stringify(localKeys));
		} catch (e) {
			console.error('Failed to save local API keys:', e);
		}
	}

	function maskKey(key: string): string {
		if (key.length <= 8) return '••••••••';
		return `sk-...${key.slice(-4)}`;
	}

	function handleAddKey(e: Event) {
		e.preventDefault();
		if (newKey.trim().length < 8) {
			addToast('error', 'API key terlalu pendek (minimal 8 karakter)');
			return;
		}

		const keyObj: LocalKey = {
			id: 'key_' + Date.now(),
			provider,
			label: label.trim() || `${provider.toUpperCase()} Key`,
			key: newKey.trim(),
			masked: maskKey(newKey.trim())
		};

		localKeys = [keyObj, ...localKeys];
		saveLocalKeys();

		newKey = '';
		label = '';
		addToast('success', 'API key tersimpan di browser Anda (Zero-Persistence)');
	}

	function handleDelete(id: string) {
		localKeys = localKeys.filter((k) => k.id !== id);
		saveLocalKeys();
		addToast('success', 'API key berhasil dihapus dari browser');
	}

	async function testConn() {
		if (newKey.trim().length < 8) {
			addToast('error', 'Masukkan API Key terlebih dahulu');
			return;
		}
		testing = true;
		try {
			let ok = false;
			if (provider === 'groq') {
				const res = await fetch('https://api.groq.com/openai/v1/models', {
					headers: { Authorization: `Bearer ${newKey.trim()}` }
				});
				ok = res.ok;
			} else if (provider === 'gemini') {
				const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${newKey.trim()}`);
				ok = res.ok;
			}
			if (ok) addToast('success', 'Koneksi ke Provider berhasil!');
			else addToast('error', 'API Key tidak valid atau terdeteksi error');
		} catch (e: any) {
			addToast('error', e.message || 'Koneksi gagal');
		} finally {
			testing = false;
		}
	}
</script>

<div class="max-w-2xl mx-auto px-6 py-8 md:py-12">
	<!-- Header -->
	<div class="flex items-center gap-3 mb-8">
		<div class="w-10 h-10 rounded-xl bg-orange-600/10 border border-orange-600/20 flex items-center justify-center">
			<KeyRound class="w-5 h-5 text-orange-500" />
		</div>
		<div>
			<h1 class="text-xl font-bold text-white">API Keys (Zero-Persistence Security)</h1>
			<p class="text-xs text-slate-500">Kelola API key pribadi Anda di browser lokal</p>
		</div>
	</div>

	<!-- Info box -->
	<div class="flex items-start gap-3 p-4 rounded-2xl bg-orange-500/5 border border-orange-500/15 mb-8">
		<ShieldCheck class="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
		<p class="text-xs text-slate-400 leading-relaxed">
			API Key milik Anda <span class="text-orange-300 font-medium">100% tersimpan aman di LocalStorage browser</span> Anda (Zero-Persistence Server). Tidak pernah disimpan di database server. Penggunaan API Key pribadi memberikan akses <span class="text-orange-300 font-medium">Unlimited Generate</span> tanpa memotong kuota server.
		</p>
	</div>

	<!-- Add form -->
	<form
		onsubmit={handleAddKey}
		class="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/60 mb-8 space-y-4"
	>
		<h2 class="text-sm font-semibold text-white">Tambah API Key Lokal</h2>

		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<div class="flex flex-col gap-1.5">
				<label for="provider" class="text-[11px] text-slate-400 font-medium">Provider</label>
				<select
					id="provider"
					bind:value={provider}
					class="w-full bg-slate-950/60 border border-slate-800 text-slate-200 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-orange-600/50 focus:ring-1 focus:ring-orange-600/20 transition-all"
				>
					<option value="groq">Groq</option>
					<option value="gemini">Gemini</option>
				</select>
			</div>
			<div class="flex flex-col gap-1.5">
				<label for="label" class="text-[11px] text-slate-400 font-medium">Label (opsional)</label>
				<input
					id="label"
					bind:value={label}
					placeholder="mis. Key Groq Utama"
					class="w-full bg-slate-950/60 border border-slate-800 text-slate-200 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-orange-600/50 focus:ring-1 focus:ring-orange-600/20 transition-all"
				/>
			</div>
		</div>

		<div class="flex flex-col gap-1.5">
			<label for="key" class="text-[11px] text-slate-400 font-medium">API Key</label>
			<input
				id="key"
				type="password"
				bind:value={newKey}
				placeholder="Paste API key di sini"
				class="w-full bg-slate-950/60 border border-slate-800 text-slate-200 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-orange-600/50 focus:ring-1 focus:ring-orange-600/20 transition-all font-mono"
			/>
		</div>

		<div class="flex items-center gap-3 pt-1">
			<button
				type="button"
				onclick={testConn}
				disabled={testing}
				class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-slate-300 bg-slate-800/60 hover:bg-slate-800 border border-slate-700 transition-all disabled:opacity-50"
			>
				{#if testing}
					<Loader2 class="w-4 h-4 animate-spin" />
				{:else}
					<TestTube class="w-4 h-4" />
				{/if}
				Test Koneksi
			</button>
			<button
				type="submit"
				class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-slate-950 text-sm font-bold shadow-lg shadow-orange-600/20 transition-all active:scale-[0.98]"
			>
				<Plus class="w-4 h-4" /> Simpan di Browser
			</button>
		</div>
	</form>

	<!-- List -->
	<h2 class="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Key Tersimpan di LocalStorage</h2>

	{#if localKeys.length === 0}
		<div class="flex flex-col items-center justify-center gap-2 py-10 rounded-2xl border border-dashed border-slate-800 text-center">
			<KeyRound class="w-8 h-8 text-slate-700" />
			<p class="text-sm text-slate-500">Belum ada API key lokal.</p>
			<p class="text-xs text-slate-600">Tambah di atas untuk generate unlimited tanpa memotong kuota server.</p>
		</div>
	{:else}
		<div class="space-y-2.5">
			{#each localKeys as k (k.id)}
				<div class="flex items-center gap-3 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
					<div class="flex-1 min-w-0">
						<div class="flex items-center gap-2 mb-1">
							<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border {providerMeta[k.provider]?.cls ?? 'text-slate-400 bg-slate-800 border-slate-700'}">
								{providerMeta[k.provider]?.name ?? k.provider}
							</span>
						</div>
						<p class="font-mono text-sm text-slate-300">{k.masked}</p>
						{#if k.label}
							<p class="text-[10px] text-slate-500 mt-0.5">{k.label}</p>
						{/if}
					</div>

					<button
						type="button"
						onclick={() => handleDelete(k.id)}
						class="inline-flex items-center justify-center w-9 h-9 rounded-xl text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all shrink-0"
						aria-label="Hapus"
					>
						<Trash2 class="w-4 h-4" />
					</button>
				</div>
			{/each}
		</div>
	{/if}
</div>
