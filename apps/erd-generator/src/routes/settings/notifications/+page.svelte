<script lang="ts">
	import { Bell, Mail, Users, Gauge, CreditCard } from 'lucide-svelte';
	import { getUiState, setNotifications, addToast } from '$lib/stores/ui.store.svelte';
	import type { NotificationPrefs } from '$lib/stores/ui.store.svelte';

	const ui = getUiState();

	const items: { key: keyof NotificationPrefs; label: string; desc: string; icon: any }[] = [
		{ key: 'email', label: 'Email Notifications', desc: 'Terima notifikasi via email', icon: Mail },
		{ key: 'projectShared', label: 'Project Shared', desc: 'Saat ada yang share proyek ke Anda', icon: Users },
		{ key: 'quotaWarning', label: 'Quota Warning', desc: 'Peringatan 80%, 90%, 100% kuota', icon: Gauge },
		{ key: 'billing', label: 'Billing', desc: 'Update tagihan & langganan', icon: CreditCard }
	];

	let saving = $state(false);

	function toggle(key: keyof NotificationPrefs) {
		setNotifications({ [key]: !ui.notifications[key] });
	}

	function save() {
		saving = true;
		setNotifications(ui.notifications);
		addToast('success', 'Preferensi notifikasi tersimpan');
		saving = false;
	}
</script>

<div class="max-w-2xl mx-auto px-6 py-8 md:py-12">
	<div class="flex items-center gap-3 mb-8">
		<div class="w-10 h-10 rounded-xl bg-amber-600/10 border border-amber-600/20 flex items-center justify-center">
			<Bell class="w-5 h-5 text-amber-500" />
		</div>
		<div>
			<h1 class="text-xl font-bold text-white">Notifications</h1>
			<p class="text-xs text-slate-500">Atur notifikasi yang Anda inginkan</p>
		</div>
	</div>

	<section class="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/60 mb-6 divide-y divide-slate-800/60">
		{#each items as item}
			{@const on = ui.notifications[item.key]}
			<div class="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
				<div class="w-9 h-9 rounded-xl bg-slate-800/60 border border-slate-700 flex items-center justify-center shrink-0">
					<item.icon class="w-4 h-4 text-slate-400" />
				</div>
				<div class="flex-1 min-w-0">
					<p class="text-sm font-medium text-white">{item.label}</p>
					<p class="text-[11px] text-slate-500">{item.desc}</p>
				</div>
				<button
					type="button"
					role="switch"
					aria-checked={on}
					aria-label={item.label}
					onclick={() => toggle(item.key)}
					class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0
						{on ? 'bg-amber-500' : 'bg-slate-700'}"
				>
					<span
						class="inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform
							{on ? 'translate-x-5' : 'translate-x-0.5'}"
					></span>
				</button>
			</div>
		{/each}
	</section>

	<div class="flex justify-end">
		<button
			type="button"
			onclick={save}
			disabled={saving}
			class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-slate-950 text-sm font-bold shadow-lg shadow-amber-600/20 transition-all active:scale-[0.98] disabled:opacity-50"
		>
			Simpan Preferensi
		</button>
	</div>
</div>
