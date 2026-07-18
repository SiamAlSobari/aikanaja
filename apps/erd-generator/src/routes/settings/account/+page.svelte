<script lang="ts">
	import { enhance } from '$app/forms';
	import {
		UserCog,
		Mail,
		BadgeCheck,
		AlertTriangle,
		Trash2,
		X,
		Loader2
	} from 'lucide-svelte';
	import type { User } from '$lib/types/user';

	let { data, form }: { data: { user: User | null }; form: { error?: string } | null } =
		$props();

	let showDelete = $state(false);
	let confirmEmail = $state('');
	let deleting = $state(false);

	const emailMatch = $derived(
		confirmEmail.trim().toLowerCase() === (data.user?.email ?? '').toLowerCase()
	);
</script>

<div class="max-w-2xl mx-auto px-6 py-8 md:py-12">
	<!-- Header -->
	<div class="flex items-center gap-3 mb-8">
		<div class="w-10 h-10 rounded-xl bg-orange-600/10 border border-orange-600/20 flex items-center justify-center">
			<UserCog class="w-5 h-5 text-orange-500" />
		</div>
		<div>
			<h1 class="text-xl font-bold text-white">Account</h1>
			<p class="text-xs text-slate-500">Kelola email & keamanan akun</p>
		</div>
	</div>

	<!-- Email -->
	<div class="flex flex-col gap-1.5 mb-6">
		<label for="email" class="text-[11px] text-slate-400 font-medium">Email</label>
		<input
			id="email"
			value={data.user?.email ?? ''}
			readonly
			class="w-full bg-slate-950/60 border border-slate-800/60 text-slate-500 text-sm rounded-xl px-3.5 py-2.5 cursor-not-allowed"
		/>
		<p class="text-[10px] text-slate-600">Email dikelola oleh Google.</p>
	</div>

	<!-- Connected accounts -->
	<div class="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/60 mb-8">
		<h2 class="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Connected Accounts</h2>
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-3">
				<div class="w-9 h-9 rounded-xl bg-slate-800/60 flex items-center justify-center text-sm font-bold text-slate-300">G</div>
				<div>
					<p class="text-sm font-medium text-white">Google</p>
					<p class="text-[10px] text-slate-500">{data.user?.email ?? ''}</p>
				</div>
			</div>
			<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
				<BadgeCheck class="w-3.5 h-3.5" /> Connected
			</span>
		</div>
	</div>

	<!-- Danger zone -->
	<div class="p-5 rounded-2xl bg-red-950/20 border border-red-900/40">
		<div class="flex items-start gap-3">
			<AlertTriangle class="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
			<div class="flex-1">
				<h2 class="text-sm font-bold text-red-300">Danger Zone</h2>
				<p class="text-xs text-slate-400 mt-1 mb-4 leading-relaxed">
					Hapus akun secara permanen. Semua project, template, dan data terkait akan dihapus
					dan tidak dapat dikembalikan.
				</p>
				<button
					type="button"
					onclick={() => (showDelete = true)}
					class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-all active:scale-[0.98]"
				>
					<Trash2 class="w-4 h-4" /> Hapus Akun
				</button>
			</div>
		</div>
	</div>
</div>

<!-- Confirm modal -->
{#if showDelete}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
		<button
			type="button"
			aria-label="Close"
			onclick={() => (showDelete = false)}
			class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
		></button>

		<div class="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6">
			<button
				type="button"
				onclick={() => (showDelete = false)}
				class="absolute top-4 right-4 p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800/60 transition-colors"
			>
				<X class="w-4 h-4" />
			</button>

			<div class="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
				<AlertTriangle class="w-5 h-5 text-red-400" />
			</div>
			<h3 class="text-base font-bold text-white mb-1.5">Hapus Akun Permanen</h3>
			<p class="text-xs text-slate-400 mb-5 leading-relaxed">
				Tindakan ini tidak dapat dibatalkan. Ketik email Anda untuk konfirmasi:
				<span class="block mt-1.5 font-mono text-[11px] text-orange-400 bg-orange-500/10 px-2 py-1 rounded-lg inline-block">
					{data.user?.email ?? ''}
				</span>
			</p>

			{#if form?.error}
				<p class="text-xs text-red-400 mb-3">{form.error}</p>
			{/if}

			<input
				type="email"
				bind:value={confirmEmail}
				placeholder="Ketik email di sini"
				class="w-full bg-slate-950/60 border border-slate-800 text-slate-200 text-sm rounded-xl px-3.5 py-2.5
					focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all mb-4"
			/>

			<form
				method="POST"
				action="?/delete"
				use:enhance={() => {
					deleting = true;
					return async ({ update }) => {
						deleting = false;
						await update();
					};
				}}
				class="flex items-center justify-end gap-3"
			>
				<button
					type="button"
					onclick={() => (showDelete = false)}
					class="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
				>
					Batal
				</button>
				<button
					type="submit"
					disabled={!emailMatch || deleting}
					class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
				>
					{#if deleting}
						<Loader2 class="w-4 h-4 animate-spin" />
					{:else}
						<Trash2 class="w-4 h-4" />
					{/if}
					Hapus Akun
				</button>
			</form>
		</div>
	</div>
{/if}
