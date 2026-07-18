<script lang="ts">
	import {
		Plus,
		Sparkles,
		FileCode,
		Share2,
		Clock,
		Table2,
		Trash2,
		RotateCcw,
		Activity as ActivityIcon,
		Download,
		Edit3,
	} from 'lucide-svelte';

	let { data } = $props();
	const activities = $derived((data.activities || []) as any[]);

	const typeConfig: Record<string, { icon: typeof Plus; color: string; bg: string; border: string; label: string }> = {
		create: { icon: Plus, color: 'text-emerald-400', bg: 'bg-emerald-600/10', border: 'border-emerald-600/20', label: 'Created' },
		generate: { icon: Sparkles, color: 'text-orange-400', bg: 'bg-orange-600/10', border: 'border-orange-600/20', label: 'Generated' },
		edit: { icon: Edit3, color: 'text-blue-400', bg: 'bg-blue-600/10', border: 'border-blue-600/20', label: 'Edited' },
		export: { icon: Download, color: 'text-purple-400', bg: 'bg-purple-600/10', border: 'border-purple-600/20', label: 'Exported' },
		share: { icon: Share2, color: 'text-teal-400', bg: 'bg-teal-600/10', border: 'border-teal-600/20', label: 'Shared' },
		delete: { icon: Trash2, color: 'text-red-400', bg: 'bg-red-600/10', border: 'border-red-600/20', label: 'Deleted' },
		restore: { icon: RotateCcw, color: 'text-amber-400', bg: 'bg-amber-600/10', border: 'border-amber-600/20', label: 'Restored' },
	};

	function getConfig(type: string) {
		return typeConfig[type] || { icon: ActivityIcon, color: 'text-slate-400', bg: 'bg-slate-800/40', border: 'border-slate-700/40', label: type };
	}

	function formatTime(dateStr: string): string {
		const date = new Date(dateStr);
		const now = new Date();
		const diff = now.getTime() - date.getTime();
		const mins = Math.floor(diff / 60000);
		const hours = Math.floor(diff / 3600000);
		const days = Math.floor(diff / 86400000);
		if (mins < 1) return 'Just now';
		if (mins < 60) return `${mins}m ago`;
		if (hours < 24) return `${hours}h ago`;
		if (days < 7) return `${days}d ago`;
		return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
	}

	function formatDateGroup(dateStr: string): string {
		const date = new Date(dateStr);
		const now = new Date();
		const diff = now.getTime() - date.getTime();
		const days = Math.floor(diff / 86400000);
		if (days === 0) return 'Today';
		if (days === 1) return 'Yesterday';
		if (days < 7) return `${days} days ago`;
		return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
	}

	const groupedActivities = $derived(() => {
		const groups: { label: string; items: any[] }[] = [];
		let currentLabel = '';
		for (const act of activities) {
			const label = formatDateGroup(act.createdAt);
			if (label !== currentLabel) {
				currentLabel = label;
				groups.push({ label, items: [] });
			}
			groups[groups.length - 1].items.push(act);
		}
		return groups;
	});
</script>

<svelte:head>
	<title>Activity — SchemaFlow</title>
</svelte:head>

<div class="relative min-h-full">
	<div class="relative p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
		<div>
			<h1 class="text-2xl font-extrabold text-white tracking-tight">Activity</h1>
			<p class="text-sm text-slate-500 mt-1">Your recent activity across all projects.</p>
		</div>

		{#if activities.length > 0}
			<div class="space-y-8">
				{#each groupedActivities() as group, gi}
					<div class="space-y-1 animate-fade-in-up" style="animation-delay: {gi * 100}ms;">
						<h3 class="text-xs font-semibold text-slate-500 uppercase tracking-wider px-1 mb-3">{group.label}</h3>
						<div class="relative">
							<!-- Timeline line -->
							<div class="absolute left-[18px] top-2 bottom-2 w-px bg-slate-800/60"></div>

							<div class="space-y-1">
								{#each group.items as act, i}
									{@const config = getConfig(act.type)}
									{@const Icon = config.icon}
									<div
										class="relative flex items-start gap-4 px-1 py-2.5 rounded-lg hover:bg-slate-900/20 transition-colors group animate-fade-in-up"
										style="animation-delay: {gi * 100 + i * 40}ms;"
									>
										<!-- Timeline dot -->
										<div class="relative z-10 w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 {config.bg} {config.border}">
											<Icon class="w-4 h-4 {config.color}" />
										</div>

										<div class="flex-1 min-w-0 pt-1">
											<p class="text-sm text-slate-300 leading-relaxed">
												<span class="font-medium {config.color}">{config.label}</span>
												{act.message?.replace(config.label, '').trim() || act.message}
											</p>
											{#if act.projectName}
												<p class="text-[11px] text-slate-600 mt-0.5 flex items-center gap-1.5">
													<Table2 class="w-3 h-3" /> {act.projectName}
												</p>
											{/if}
										</div>

										<div class="flex items-center gap-1.5 text-[10px] text-slate-600 shrink-0 pt-1.5">
											<Clock class="w-3 h-3" />
											<span>{formatTime(act.createdAt)}</span>
										</div>
									</div>
								{/each}
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="relative rounded-2xl overflow-hidden">
				<div class="absolute inset-0 bg-grid-pattern opacity-20"></div>
				<div class="absolute inset-0 border border-slate-800/30 rounded-2xl"></div>
				<div class="relative py-20 px-8 text-center">
					<div class="relative inline-block mb-4">
						<div class="w-14 h-14 rounded-2xl bg-slate-900/60 border border-slate-800/50 flex items-center justify-center">
							<ActivityIcon class="w-6 h-6 text-slate-700" />
						</div>
					</div>
					<p class="text-sm font-medium text-slate-400 mb-1">No activity yet</p>
					<p class="text-xs text-slate-600 max-w-xs mx-auto">Your activity will appear here when you create projects, generate schemas, or export.</p>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	@keyframes fade-in-up {
		from { opacity: 0; transform: translateY(10px); }
		to { opacity: 1; transform: translateY(0); }
	}
	.animate-fade-in-up {
		opacity: 0;
		animation: fade-in-up 0.4s ease-out forwards;
	}
</style>
