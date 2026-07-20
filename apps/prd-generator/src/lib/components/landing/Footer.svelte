<script lang="ts">
	import { FileText } from 'lucide-svelte';
</script>

<footer class="border-t border-white/[0.06] bg-[#060911] py-10">
	<div class="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
		<div class="flex items-center gap-3">
			<div class="w-7 h-7 rounded-lg bg-orange-600/20 text-orange-400 flex items-center justify-center">
				<FileText class="w-3.5 h-3.5" />
			</div>
			<span class="text-slate-300 font-bold">AiKanAja PRD Generator</span>
			<span class="text-slate-600">-</span>
			<span>Ekosistem AiKanAja</span>
		</div>
		<p class="text-slate-600">&copy; 2026 AiKanAja. Zero-Persistence Enterprise Architecture.</p>
	</div>
</footer>
