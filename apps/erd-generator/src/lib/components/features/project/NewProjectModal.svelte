<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { Plus, Zap, X, Loader2 } from 'lucide-svelte';
	import { newProjectStore, closeNewProject } from '$lib/stores/new-project.store.svelte';
	import { erdApi } from '$lib/api/erd';
	import { addToast } from '$lib/stores/ui.store.svelte';
	import { goto } from '$app/navigation';

	let name = $state('');
	let description = $state('');
	let isCreating = $state(false);

	async function create() {
		if (!name.trim() || isCreating) return;
		isCreating = true;
		try {
			const res = await erdApi.create({ name: name.trim(), description: description.trim() });
			if (res.data?.id) {
				closeNewProject();
				goto(`/project/${res.data.id}`);
			} else {
				addToast('error', 'Gagal membuat project');
			}
		} catch (e: any) {
			addToast('error', e.message || 'Gagal membuat project');
		} finally {
			isCreating = false;
			name = '';
			description = '';
		}
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === 'Escape') closeNewProject();
	}
</script>

<svelte:window onkeydown={onKey} />

{#if newProjectStore.isOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
		transition:fade={{ duration: 150 }}
		onclick={closeNewProject}
		role="presentation"
	>
		<div
			tabindex="-1"
			class="w-full max-w-md bg-slate-900 border border-slate-800/80 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden"
			transition:scale={{ duration: 200, easing: cubicOut, start: 0.95 }}
			onclick={(e) => e.stopPropagation()}
			role="dialog"
			aria-modal="true"
		>
			<!-- Header -->
			<div class="relative px-6 py-5 border-b border-slate-800/60">
				<div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent"></div>
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-3">
						<div class="w-9 h-9 rounded-xl bg-orange-600/15 border border-orange-600/25 flex items-center justify-center">
							<Zap class="w-4 h-4 text-orange-500" />
						</div>
						<div>
							<h3 class="text-lg font-bold text-white">Buat ERD Baru</h3>
							<p class="text-xs text-slate-500 mt-0.5">Beri nama project untuk memulai.</p>
						</div>
					</div>
					<button onclick={closeNewProject} class="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800/60 transition-colors" aria-label="Tutup">
						<X class="w-4 h-4" />
					</button>
				</div>
			</div>

			<!-- Body -->
			<div class="px-6 py-5 space-y-4">
				<div class="flex flex-col gap-1.5">
					<label for="np-name" class="text-[11px] text-slate-400 font-medium">Nama Project</label>
					<input
						id="np-name"
						type="text"
						bind:value={name}
						placeholder="e.g., E-Commerce Database"
						class="w-full bg-slate-950/60 border border-slate-800 text-slate-200 text-sm rounded-xl
							focus:outline-none focus:border-orange-600/50 focus:ring-1 focus:ring-orange-600/20
							placeholder:text-slate-600 px-4 py-3 transition-colors"
						onkeydown={(e) => { if (e.key === 'Enter' && !description.trim()) create(); }}
					/>
				</div>
				<div class="flex flex-col gap-1.5">
					<label for="np-desc" class="text-[11px] text-slate-400 font-medium">Deskripsi <span class="text-slate-600">(opsional)</span></label>
					<textarea
						id="np-desc"
						bind:value={description}
						rows="3"
						placeholder="Jelaskan database yang ingin dimodelkan…"
						class="w-full bg-slate-950/60 border border-slate-800 text-slate-200 text-sm rounded-xl
							focus:outline-none focus:border-orange-600/50 focus:ring-1 focus:ring-orange-600/20
							placeholder:text-slate-600 px-4 py-3 resize-none transition-colors"
						onkeydown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) create(); }}
					></textarea>
					<p class="text-[10px] text-slate-600">Tekan Ctrl/⌘ + Enter untuk membuat.</p>
				</div>
			</div>

			<!-- Footer -->
			<div class="px-6 py-4 border-t border-slate-800/60 flex items-center justify-end gap-3">
				<button
					onclick={closeNewProject}
					class="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
				>Cancel</button>
				<button
					onclick={create}
					disabled={!name.trim() || isCreating}
					class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-slate-950 font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-orange-600/20 active:scale-[0.98]"
				>
					{#if isCreating}
						<Loader2 class="w-4 h-4 animate-spin" />
					{:else}
						<Plus class="w-4 h-4" />
					{/if}
					Buat Project
				</button>
			</div>
		</div>
	</div>
{/if}
