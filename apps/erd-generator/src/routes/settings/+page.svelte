<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	onMount(() => {
		goto('/settings/profile', { replaceState: true });
	});
</script>

<div class="min-h-[60vh] flex items-center justify-center">
	<span class="text-xs text-slate-600 animate-pulse">Redirecting…</span>
</div>
