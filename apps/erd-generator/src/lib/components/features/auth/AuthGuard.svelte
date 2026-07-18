<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { getAuthState, fetchSession } from '$lib/stores/auth.store.svelte';

	let { children } = $props();

	const auth = getAuthState();

	onMount(async () => {
		await fetchSession();

		if (!auth.isAuthenticated && !auth.isLoading) {
			goto('/auth/login');
		}
	});
</script>

{#if auth.isLoading}
	<div class="min-h-screen bg-slate-950 flex items-center justify-center">
		<div class="flex flex-col items-center gap-4">
			<span class="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></span>
			<p class="text-sm text-slate-400">Memuat sesi...</p>
		</div>
	</div>
{:else if auth.isAuthenticated}
	{@render children()}
{/if}
