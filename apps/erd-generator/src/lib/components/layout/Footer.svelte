<script lang="ts">
	import { Database } from 'lucide-svelte';
</script>

<footer class="border-t border-slate-950 bg-slate-950/80 py-8 relative z-10">
	<div
		class="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500"
	>
		<div class="flex items-center gap-2">
			<Database class="w-4 h-4 text-orange-600/50" />
			<span>© 2026 AiKanAja. Hak cipta dilindungi undang-undang.</span>
		</div>
		<div class="flex gap-6">
			<a href="#features" class="hover:text-slate-400">Fitur</a>
			<a href="#comparison" class="hover:text-slate-400">Komparasi</a>
			<a href="#orbit" class="hover:text-slate-400">Integrasi</a>
		</div>
	</div>
</footer>
