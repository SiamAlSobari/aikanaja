<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import {
		ShieldCheck,
		Trash2,
		Check,
		ChevronLeft,
		AlertTriangle,
		FolderKanban,
		CreditCard
	} from 'lucide-svelte';
	import AdminHeader from '$lib/components/features/admin/AdminHeader.svelte';
	import { adminApi, type AdminRole, type AdminUser } from '$lib/api/admin';
	import { addToast } from '$lib/stores/ui.store.svelte';

	let { data } = $props();
	const user = $derived(data.user as (AdminUser & { erdProjects: any[]; payments: any[] }) | null);

	const roles: AdminRole[] = ['admin', 'user', 'free', 'pro', 'team'];
	let selectedRole = $state<AdminRole>('free');
	let savingRole = $state(false);

	const plans: AdminRole[] = ['free', 'pro', 'team'];
	let selectedPlan = $state<AdminRole>('free');
	let savingPlan = $state(false);

	let showDelete = $state(false);
	let deleting = $state(false);

	$effect(() => {
		if (user) {
			selectedRole = user.role;
			selectedPlan = (['free', 'pro', 'team'].includes(user.role) ? user.role : 'free') as AdminRole;
		}
	});

	async function saveRole() {
		if (!user || selectedRole === user.role) return;
		savingRole = true;
		try {
			await adminApi.updateUserRole(user.id, selectedRole);
			addToast('success', `Role ${user.name} diubah ke ${selectedRole}`);
			goto(page.url.pathname, { invalidateAll: true });
		} catch (e: any) {
			addToast('error', e.message || 'Gagal mengubah role');
		} finally {
			savingRole = false;
		}
	}

	async function savePlan() {
		if (!user) return;
		savingPlan = true;
		try {
			await adminApi.updateUserRole(user.id, selectedPlan);
			addToast('success', `Plan ${user.name} diatur ke ${selectedPlan}`);
			goto(page.url.pathname, { invalidateAll: true });
		} catch (e: any) {
			addToast('error', e.message || 'Gagal mengatur plan');
		} finally {
			savingPlan = false;
		}
	}

	async function deleteUser() {
		if (!user) return;
		deleting = true;
		try {
			await adminApi.deleteUser(user.id);
			addToast('success', 'User dihapus');
			goto('/admin/users');
		} catch (e: any) {
			addToast('error', e.message || 'Gagal menghapus user');
			deleting = false;
		}
	}

	function fmtDate(iso: string) {
		return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
	}
</script>

<AdminHeader title={user?.name ?? 'User'}>
	<a
		href="/admin/users"
		class="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/60 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:border-orange-600/40 transition-colors"
	>
		<ChevronLeft class="w-4 h-4" /> Users
	</a>
</AdminHeader>

<div class="px-6 lg:px-10 pb-10 grid grid-cols-1 lg:grid-cols-3 gap-5">
	<!-- Profile -->
	<div class="lg:col-span-2 space-y-5">
		<div class="rounded-2xl border border-slate-800/70 bg-slate-900/40 p-6">
			<div class="flex items-center gap-4">
				<div class="w-14 h-14 rounded-2xl bg-orange-600/12 border border-orange-600/25 flex items-center justify-center text-lg font-bold text-orange-500">
					{user?.name?.charAt(0)?.toUpperCase() || '?'}
				</div>
				<div>
					<p class="text-lg font-bold text-white flex items-center gap-2">
						{user?.name}
						{#if user?.role === 'admin'}<ShieldCheck class="w-4 h-4 text-orange-500" />{/if}
					</p>
					<p class="text-sm text-slate-400">{user?.email}</p>
					<p class="text-[11px] text-slate-500 mt-0.5">Bergabung {user ? fmtDate(user.createdAt) : ''}</p>
				</div>
			</div>
		</div>

		<!-- Projects -->
		<div class="rounded-2xl border border-slate-800/70 bg-slate-900/40 p-6">
			<h2 class="flex items-center gap-2 text-sm font-semibold text-white">
				<FolderKanban class="w-4 h-4 text-orange-500" /> Projects ({user?.erdProjects?.length ?? 0})
			</h2>
			<div class="mt-3 space-y-2">
				{#each user?.erdProjects ?? [] as p}
					<div class="flex items-center justify-between rounded-xl border border-slate-800/60 bg-slate-950/40 px-4 py-3">
						<div>
							<p class="text-sm font-medium text-white">{p.name}</p>
							<p class="text-[11px] text-slate-500">{fmtDate(p.createdAt)}</p>
						</div>
						<span class="rounded-full border border-slate-700/60 px-2.5 py-0.5 text-[11px] capitalize text-slate-400">{p.status}</span>
					</div>
				{:else}
					<p class="text-sm text-slate-500">Belum ada project.</p>
				{/each}
			</div>
		</div>

		<!-- Payments -->
		<div class="rounded-2xl border border-slate-800/70 bg-slate-900/40 p-6">
			<h2 class="flex items-center gap-2 text-sm font-semibold text-white">
				<CreditCard class="w-4 h-4 text-orange-500" /> Payments ({user?.payments?.length ?? 0})
			</h2>
			<div class="mt-3 space-y-2">
				{#each user?.payments ?? [] as p}
					<div class="flex items-center justify-between rounded-xl border border-slate-800/60 bg-slate-950/40 px-4 py-3">
						<div>
							<p class="text-sm font-medium text-white capitalize">{p.plan}</p>
							<p class="text-[11px] text-slate-500">{fmtDate(p.createdAt)}</p>
						</div>
						<span class="rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize
							{p.status === 'verified' ? 'border-emerald-500/30 text-emerald-300' : p.status === 'pending' ? 'border-amber-500/30 text-amber-300' : 'border-red-500/30 text-red-300'}">
							{p.status}
						</span>
					</div>
				{:else}
					<p class="text-sm text-slate-500">Belum ada payment.</p>
				{/each}
			</div>
		</div>
	</div>

	<!-- Actions -->
	<div class="space-y-5">
		<div class="rounded-2xl border border-slate-800/70 bg-slate-900/40 p-6">
			<h2 class="text-sm font-semibold text-white">Role & Akses</h2>
			<p class="mt-1 text-[11px] text-slate-500">Atur hak akses akun ini.</p>
			<div class="mt-4">
				<label for="user-role" class="text-[11px] font-medium uppercase tracking-wider text-slate-500">Role</label>
				<select id="user-role" bind:value={selectedRole} class="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-orange-600/50">
					{#each roles as r}<option value={r}>{r}</option>{/each}
				</select>
				<button
					onclick={saveRole}
					disabled={savingRole || !user || selectedRole === user.role}
					class="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-bold text-slate-950 hover:bg-orange-700 disabled:opacity-40 transition-colors"
				>
					{#if savingRole}<span class="w-3.5 h-3.5 border-2 border-slate-950/40 border-t-slate-950 rounded-full animate-spin"></span>{:else}<Check class="w-4 h-4" />{/if}
					Simpan Role
				</button>
			</div>

			<div class="mt-5 border-t border-slate-800/60 pt-5">
				<label for="user-plan" class="text-[11px] font-medium uppercase tracking-wider text-slate-500">Plan Langsung (override)</label>
				<select id="user-plan" bind:value={selectedPlan} class="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-orange-600/50">
					{#each plans as pl}<option value={pl}>{pl}</option>{/each}
				</select>
				<button
					onclick={savePlan}
					disabled={savingPlan || !user}
					class="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:border-orange-600/40 hover:bg-slate-800/50 disabled:opacity-40 transition-colors"
				>
					{#if savingPlan}<span class="w-3.5 h-3.5 border-2 border-slate-400/40 border-t-slate-200 rounded-full animate-spin"></span>{:else}<Check class="w-4 h-4" />{/if}
					Terapkan Plan
				</button>
			</div>
		</div>

		<div class="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
			<h2 class="flex items-center gap-2 text-sm font-semibold text-red-300">
				<AlertTriangle class="w-4 h-4" /> Danger Zone
			</h2>
			<p class="mt-1 text-[11px] text-slate-500">Hapus user secara permanen. Tindakan tidak bisa dibatalkan.</p>
			{#if !showDelete}
				<button
					onclick={() => (showDelete = true)}
					class="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-red-500/30 px-4 py-2.5 text-sm font-semibold text-red-300 hover:bg-red-500/10 transition-colors"
				>
					<Trash2 class="w-4 h-4" /> Hapus User
				</button>
			{:else}
				<p class="mt-3 text-xs text-slate-400">Yakin hapus <span class="font-semibold text-white">{user?.name}</span>?</p>
				<div class="mt-3 flex gap-2">
					<button
						onclick={deleteUser}
						disabled={deleting}
						class="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-40 transition-colors"
					>
						{#if deleting}<span class="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>{:else}Ya, Hapus{/if}
					</button>
					<button
						onclick={() => (showDelete = false)}
						class="rounded-xl border border-slate-700 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800/50 transition-colors"
					>
						Batal
					</button>
				</div>
			{/if}
		</div>
	</div>
</div>
