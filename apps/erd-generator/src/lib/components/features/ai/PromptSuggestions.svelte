<script lang="ts">
	import { Database, ShoppingCart, PenLine, Boxes, Receipt, Users } from 'lucide-svelte';

	let { onSelect }: { onSelect: (text: string) => void } = $props();

	const suggestions = [
		{
			icon: ShoppingCart,
			text: 'Buat sistem e-commerce dengan user, product, order, order_item, dan payment',
			tag: 'E-Commerce'
		},
		{
			icon: PenLine,
			text: 'Sistem blog dengan user, post, comment, category, dan tag',
			tag: 'Blog'
		},
		{
			icon: Boxes,
			text: 'Inventory management dengan product, warehouse, stock_movement, supplier',
			tag: 'Inventory'
		},
		{
			icon: Users,
			text: 'Platform sosial media dengan user, post, like, follow, comment',
			tag: 'Social'
		},
		{
			icon: Receipt,
			text: 'SaaS billing dengan tenant, subscription, invoice, dan usage_log',
			tag: 'SaaS'
		}
	];
</script>

<div class="flex flex-col gap-2">
	<span class="text-[10px] text-slate-600 uppercase tracking-wider font-medium px-1">Contoh prompt</span>
	{#each suggestions as s}
		<button
			onclick={() => onSelect(s.text)}
			class="group text-left flex items-center gap-3 text-xs text-slate-400 hover:text-orange-400
				px-3 py-2.5 rounded-xl bg-slate-950/40 hover:bg-slate-800/40
				border border-slate-800/40 hover:border-orange-600/25 transition-all duration-200"
		>
			<span class="w-7 h-7 shrink-0 rounded-lg bg-slate-900/80 border border-slate-800/60 flex items-center justify-center group-hover:border-orange-600/30 transition-colors">
				{@render s.icon({ class: 'w-3.5 h-3.5 text-slate-500 group-hover:text-orange-500 transition-colors' })}
			</span>
			<span class="flex-1 leading-relaxed">{s.text}</span>
			<span class="shrink-0 text-[9px] font-mono text-slate-600 bg-slate-900/60 px-1.5 py-0.5 rounded group-hover:text-orange-500/70">{s.tag}</span>
		</button>
	{/each}
</div>
