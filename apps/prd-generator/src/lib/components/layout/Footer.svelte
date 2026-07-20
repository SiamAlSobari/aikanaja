<script lang="ts">
	import { FileText } from 'lucide-svelte';
	import { base } from '$app/paths';
</script>

<footer class="relative border-t border-white/5 bg-slate-950">
	<div class="max-w-6xl mx-auto px-5 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
		<div class="flex items-center gap-2 text-sm text-slate-500">
			<FileText class="w-4 h-4 text-orange-600/60" />
			<span>© 2026 AiKanAja</span>
		</div>
		<div class="flex items-center gap-8 text-xs text-slate-600">
			<a href="#features" class="hover:text-slate-400 transition-colors">Fitur</a>
			<a href="#demo" class="hover:text-slate-400 transition-colors">Demo</a>
			<a href="#faq" class="hover:text-slate-400 transition-colors">FAQ</a>
			<a href="{base}/auth/login" class="hover:text-slate-400 transition-colors">Masuk</a>
		</div>
	</div>
</footer>
