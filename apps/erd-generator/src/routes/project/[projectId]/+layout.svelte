<script lang="ts">
	import { goto } from '$app/navigation';
	import WorkspaceLayout from '$lib/components/layout/WorkspaceLayout.svelte';
	import type { LayoutData } from './$types';

	let { children, data }: { children: any; data: LayoutData } = $props();

	$effect(() => {
		if (!data?.project) {
			goto('/dashboard');
		}
	});
</script>

<WorkspaceLayout>
	{@render children()}
</WorkspaceLayout>
