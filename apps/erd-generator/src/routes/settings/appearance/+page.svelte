<script lang="ts">
	import { Palette, Monitor, Sun, Moon, Type, Grid3x3 } from 'lucide-svelte';
	import { getUiState, setAppearance, addToast } from '$lib/stores/ui.store.svelte';
	import type { ThemeMode, FontSize, CanvasBg } from '$lib/stores/ui.store.svelte';

	const ui = getUiState();

	const themes: { value: ThemeMode; label: string; icon: any; desc: string }[] = [
		{ value: 'light', label: 'Light', icon: Sun, desc: 'Tema terang' },
		{ value: 'dark', label: 'Dark', icon: Moon, desc: 'Tema gelap' },
		{ value: 'system', label: 'System', icon: Monitor, desc: 'Ikut sistem' }
	];

	const fontSizes: { value: FontSize; label: string; sample: string }[] = [
		{ value: 'small', label: 'Small', sample: 'text-sm' },
		{ value: 'medium', label: 'Medium', sample: 'text-base' },
		{ value: 'large', label: 'Large', sample: 'text-lg' }
	];

	const canvasBgs: { value: CanvasBg; label: string; icon: any }[] = [
		{ value: 'dots', label: 'Dots', icon: Grid3x3 },
		{ value: 'lines', label: 'Lines', icon: Type },
		{ value: 'cross', label: 'Cross', icon: Grid3x3 }
	];

	let saving = $state(false);

	function save() {
		saving = true;
		setAppearance({ theme: ui.appearance.theme, fontSize: ui.appearance.fontSize, canvasBg: ui.appearance.canvasBg });
		addToast('success', 'Tampilan tersimpan');
		saving = false;
	}
</script>

<div class="max-w-2xl mx-auto px-6 py-8 md:py-12">
	<div class="flex items-center gap-3 mb-8">
		<div class="w-10 h-10 rounded-xl bg-fuchsia-600/10 border border-fuchsia-600/20 flex items-center justify-center">
			<Palette class="w-5 h-5 text-fuchsia-500" />
		</div>
		<div>
			<h1 class="text-xl font-bold text-white">Appearance</h1>
			<p class="text-xs text-slate-500">Sesuaikan tema &amp; tampilan</p>
		</div>
	</div>

	<!-- Theme -->
	<section class="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/60 mb-6">
		<h2 class="text-sm font-semibold text-white mb-4">Theme</h2>
		<div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
			{#each themes as t}
				{@const active = ui.appearance.theme === t.value}
				<button
					type="button"
					onclick={() => setAppearance({ theme: t.value })}
					class="flex flex-col gap-2 p-4 rounded-xl border text-left transition-all
						{active ? 'border-fuchsia-500/50 bg-fuchsia-500/10' : 'border-slate-800 hover:border-slate-700 bg-slate-950/40'}"
				>
					<t.icon class="w-5 h-5 {active ? 'text-fuchsia-400' : 'text-slate-400'}" />
					<span class="text-sm font-medium {active ? 'text-fuchsia-300' : 'text-slate-200'}">{t.label}</span>
					<span class="text-[11px] text-slate-500">{t.desc}</span>
				</button>
			{/each}
		</div>
	</section>

	<!-- Font size -->
	<section class="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/60 mb-6">
		<h2 class="flex items-center gap-2 text-sm font-semibold text-white mb-4">
			<Type class="w-4 h-4 text-slate-400" /> Font Size
		</h2>
		<div class="grid grid-cols-3 gap-3">
			{#each fontSizes as f}
				{@const active = ui.appearance.fontSize === f.value}
				<button
					type="button"
					onclick={() => setAppearance({ fontSize: f.value })}
					class="flex flex-col items-center gap-1.5 py-4 rounded-xl border transition-all
						{active ? 'border-fuchsia-500/50 bg-fuchsia-500/10' : 'border-slate-800 hover:border-slate-700 bg-slate-950/40'}"
				>
					<span class="{f.sample} font-semibold {active ? 'text-fuchsia-300' : 'text-slate-200'}">Ag</span>
					<span class="text-[11px] {active ? 'text-fuchsia-400' : 'text-slate-500'}">{f.label}</span>
				</button>
			{/each}
		</div>
	</section>

	<!-- Canvas background -->
	<section class="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/60 mb-6">
		<h2 class="flex items-center gap-2 text-sm font-semibold text-white mb-4">
			<Grid3x3 class="w-4 h-4 text-slate-400" /> Canvas Background
		</h2>
		<div class="grid grid-cols-3 gap-3">
			{#each canvasBgs as c}
				{@const active = ui.appearance.canvasBg === c.value}
				<button
					type="button"
					onclick={() => setAppearance({ canvasBg: c.value })}
					class="flex flex-col items-center gap-1.5 py-4 rounded-xl border transition-all
						{active ? 'border-fuchsia-500/50 bg-fuchsia-500/10' : 'border-slate-800 hover:border-slate-700 bg-slate-950/40'}"
				>
					<c.icon class="w-5 h-5 {active ? 'text-fuchsia-400' : 'text-slate-400'}" />
					<span class="text-[11px] {active ? 'text-fuchsia-400' : 'text-slate-500'}">{c.label}</span>
				</button>
			{/each}
		</div>
	</section>

	<div class="flex justify-end">
		<button
			type="button"
			onclick={save}
			disabled={saving}
			class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 text-slate-950 text-sm font-bold shadow-lg shadow-fuchsia-600/20 transition-all active:scale-[0.98] disabled:opacity-50"
		>
			Simpan Preferensi
		</button>
	</div>
</div>
