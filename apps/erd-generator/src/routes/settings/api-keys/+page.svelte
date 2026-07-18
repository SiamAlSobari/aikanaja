<script lang="ts">
	import { enhance } from '$app/forms';
	import {
		KeyRound,
		Plus,
		Trash2,
		Check,
		Loader2,
		Star,
		TestTube,
		ShieldCheck,
		AlertTriangle
	} from 'lucide-svelte';
	import { api } from '$lib/api/client';
	import { addToast } from '$lib/stores/ui.store.svelte';

	let { data, form }: { data: { keys: any[] }; form: { success?: boolean; error?: string } | null } =
		$props();

	let provider = $state('groq');
	let newKey = $state('');
	let label = $state('');
	let testing = $state(false);

	const providerMeta: Record<string, { name: string; cls: string }> = {
		groq: { name: 'Groq', cls: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
		gemini: { name: 'Gemini', cls: 'text-sky-400 bg-sky-500/10 border-sky-500/20' }
	};

	$effect(() => {
		if (form?.success) addToast('success', 'API key tersimpan');
		else if (form?.error) addToast('error', form.error);
	});

	async function testConn() {
		if (newKey.trim().length < 10) {
			addToast('error', 'Masukkan key dulu (min 10 char)');
			return;
		}
		testing = true;
		try {
			await api.post('/api-keys/test', { provider, key: newKey.trim() });
			addToast('success', 'Koneksi berhasil');
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
			<h1 class="text-xl font-bold text-white">API Keys</h1>
			<p class="text-xs text-slate-500">Kelola API key provider Anda</p>
		</div>
	</div>

	<!-- Info box -->
	<div class="flex items-start gap-3 p-4 rounded-2xl bg-orange-500/5 border border-orange-500/15 mb-8">
		<ShieldCheck class="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
		<p class="text-xs text-slate-400 leading-relaxed">
			Pakai API key sendiri = <span class="text-orange-300 font-medium">generate unlimited</span>,
			tidak kena quota server. Key tersimpan di server & hanya tampil mask (sk-...xxxx).
		</p>
	</div>

	<!-- Add form -->
	<form
		method="POST"
		action="?/add"
		use:enhance
		class="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/60 mb-8 space-y-4"
	>
		<h2 class="text-sm font-semibold text-white">Tambah API Key</h2>

		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<div class="flex flex-col gap-1.5">
				<label for="provider" class="text-[11px] text-slate-400 font-medium">Provider</label>
				<select
					id="provider"
					name="provider"
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
					name="label"
					bind:value={label}
					placeholder="mis. Key utama"
					class="w-full bg-slate-950/60 border border-slate-800 text-slate-200 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-orange-600/50 focus:ring-1 focus:ring-orange-600/20 transition-all"
				/>
			</div>
		</div>

		<div class="flex flex-col gap-1.5">
			<label for="key" class="text-[11px] text-slate-400 font-medium">API Key</label>
			<input
				id="key"
				name="key"
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
				<Plus class="w-4 h-4" /> Simpan Key
			</button>
		</div>
	</form>

	<!-- List -->
	<h2 class="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Key Tersimpan</h2>

	{#if data.keys.length === 0}
		<div class="flex flex-col items-center justify-center gap-2 py-10 rounded-2xl border border-dashed border-slate-800 text-center">
			<KeyRound class="w-8 h-8 text-slate-700" />
			<p class="text-sm text-slate-500">Belum ada API key.</p>
			<p class="text-xs text-slate-600">Tambah di atas untuk generate unlimited.</p>
		</div>
	{:else}
		<div class="space-y-2.5">
			{#each data.keys as k (k.id)}
				<div class="flex items-center gap-3 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
					<div class="flex-1 min-w-0">
						<div class="flex items-center gap-2 mb-1">
							<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border {providerMeta[k.provider]?.cls ?? 'text-slate-400 bg-slate-800 border-slate-700'}">
								{providerMeta[k.provider]?.name ?? k.provider}
							</span>
							{#if k.isDefault}
								<span class="inline-flex items-center gap-1 text-[10px] font-semibold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full">
									<Star class="w-3 h-3" /> Default
								</span>
							{/if}
						</div>
						<p class="font-mono text-sm text-slate-300">{k.masked}</p>
						{#if k.label}
							<p class="text-[10px] text-slate-500 mt-0.5">{k.label}</p>
						{/if}
					</div>

					<div class="flex items-center gap-2 shrink-0">
						{#if !k.isDefault}
							<form method="POST" action="?/setDefault" use:enhance>
								<input type="hidden" name="id" value={k.id} />
								<button
									type="submit"
									class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 bg-slate-800/60 hover:bg-slate-800 border border-slate-700 transition-all"
								>
									<Star class="w-3.5 h-3.5" /> Default
								</button>
							</form>
						{/if}
						<form method="POST" action="?/delete" use:enhance>
							<input type="hidden" name="id" value={k.id} />
							<button
								type="submit"
								class="inline-flex items-center justify-center w-9 h-9 rounded-xl text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all"
								aria-label="Hapus"
							>
								<Trash2 class="w-4 h-4" />
							</button>
						</form>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
