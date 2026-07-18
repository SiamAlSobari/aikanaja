<script lang="ts">
	import { enhance } from '$app/forms';
	import { User as UserIcon, Loader2, ImageUp, Check } from 'lucide-svelte';
	import { api } from '$lib/api/client';
	import { addToast } from '$lib/stores/ui.store.svelte';
	import type { User } from '$lib/types/user';

	let { data, form }: { data: { user: User | null }; form: { success?: boolean; error?: string } | null } = $props();

	let name = $state(data.user?.name ?? '');
	let bio = $state(data.user?.bio ?? '');
	let avatarUrl = $state(data.user?.avatar ?? '');
	let uploading = $state(false);

	$effect(() => {
		if (form?.success) addToast('success', 'Profil tersimpan');
		else if (form?.error) addToast('error', form.error);
	});

	async function onFile(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		uploading = true;
		try {
			const dataUrl = await new Promise<string>((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = () => resolve(reader.result as string);
				reader.onerror = reject;
				reader.readAsDataURL(file);
			});
			const res = await api.post<{ data: { url: string } }>('/session/upload/avatar', { file: dataUrl });
			avatarUrl = res.data.url;
			addToast('success', 'Avatar diunggah');
		} catch (err: any) {
			addToast('error', err.message || 'Gagal unggah avatar');
		} finally {
			uploading = false;
			input.value = '';
		}
	}

	const initial = $derived((data.user?.name ?? '').charAt(0).toUpperCase() || '?');
</script>

<div class="max-w-2xl mx-auto px-6 py-8 md:py-12">
	<!-- Header -->
	<div class="flex items-center gap-3 mb-8">
		<div class="w-10 h-10 rounded-xl bg-orange-600/10 border border-orange-600/20 flex items-center justify-center">
			<UserIcon class="w-5 h-5 text-orange-500" />
		</div>
		<div>
			<h1 class="text-xl font-bold text-white">Profile</h1>
			<p class="text-xs text-slate-500">Kelola informasi akun Anda</p>
		</div>
	</div>

	<form
		method="POST"
		use:enhance
		class="space-y-6"
	>
		<input type="hidden" name="avatar" value={avatarUrl} />

		<!-- Avatar -->
		<div class="flex items-center gap-4 p-5 rounded-2xl bg-slate-900/40 border border-slate-800/60">
			{#if avatarUrl}
				<img src={avatarUrl} alt="" class="w-16 h-16 rounded-2xl object-cover border border-slate-800" />
			{:else}
				<div class="w-16 h-16 rounded-2xl bg-orange-600/12 border border-orange-600/25 flex items-center justify-center text-xl font-bold text-orange-500">
					{initial}
				</div>
			{/if}

			<div class="flex-1">
				<label
					class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-orange-400 hover:text-orange-300 bg-orange-600/10 hover:bg-orange-600/15 border border-orange-600/20 transition-all cursor-pointer"
				>
					{#if uploading}
						<Loader2 class="w-3.5 h-3.5 animate-spin" />
					{:else}
						<ImageUp class="w-3.5 h-3.5" />
					{/if}
					{uploading ? 'Mengunggah…' : 'Ubah Avatar'}
					<input type="file" accept="image/*" class="hidden" onchange={onFile} />
				</label>
				<p class="text-[10px] text-slate-600 mt-1.5">PNG/JPG, maks 5MB. Disimpan di Cloudinary.</p>
			</div>
		</div>

		<!-- Name -->
		<div class="flex flex-col gap-1.5">
			<label for="name" class="text-[11px] text-slate-400 font-medium">Nama</label>
			<input
				id="name"
				name="name"
				bind:value={name}
				class="w-full bg-slate-900/60 border border-slate-800 text-slate-200 text-sm rounded-xl px-3.5 py-2.5
					focus:outline-none focus:border-orange-600/50 focus:ring-1 focus:ring-orange-600/20 transition-all"
			/>
		</div>

		<!-- Email (readonly) -->
		<div class="flex flex-col gap-1.5">
			<label for="email" class="text-[11px] text-slate-400 font-medium">Email</label>
			<input
				id="email"
				value={data.user?.email ?? ''}
				readonly
				class="w-full bg-slate-950/60 border border-slate-800/60 text-slate-500 text-sm rounded-xl px-3.5 py-2.5 cursor-not-allowed"
			/>
			<p class="text-[10px] text-slate-600">Email dikelola oleh Google.</p>
		</div>

		<!-- Bio -->
		<div class="flex flex-col gap-1.5">
			<label for="bio" class="text-[11px] text-slate-400 font-medium">Bio</label>
			<textarea
				id="bio"
				name="bio"
				bind:value={bio}
				rows="4"
				placeholder="Ceritakan sedikit tentang Anda…"
				class="w-full bg-slate-900/60 border border-slate-800 text-slate-200 text-sm rounded-xl px-3.5 py-2.5
					focus:outline-none focus:border-orange-600/50 focus:ring-1 focus:ring-orange-600/20 transition-all resize-none placeholder:text-slate-600"
			></textarea>
		</div>

		<!-- Save -->
		<div class="flex items-center gap-3 pt-2">
			<button
				type="submit"
				class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-slate-950 text-sm font-bold shadow-lg shadow-orange-600/20 transition-all active:scale-[0.98]"
			>
				<Check class="w-4 h-4" /> Simpan Perubahan
			</button>
		</div>
	</form>
</div>
