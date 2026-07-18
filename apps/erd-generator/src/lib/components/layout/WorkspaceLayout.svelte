<script lang="ts">
	let { children }: { children: any } = $props();
</script>

<div class="fixed inset-0 flex flex-col bg-slate-950">
	{@render children()}
</div>
