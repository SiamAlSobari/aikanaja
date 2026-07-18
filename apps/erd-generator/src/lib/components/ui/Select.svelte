<script lang="ts">
	import { ChevronDown, Check, Search } from 'lucide-svelte';

	interface Option {
		value: string;
		label: string;
		group?: string;
	}

	let {
		label,
		error,
		options,
		value = $bindable(''),
		placeholder = 'Select...',
		searchable = false,
		disabled = false,
		class: className = '',
	}: {
		label?: string;
		error?: string;
		options: Option[];
		value?: string;
		placeholder?: string;
		searchable?: boolean;
		disabled?: boolean;
		class?: string;
	} = $props();

	let open = $state(false);
	let search = $state('');
	let containerEl = $state<HTMLDivElement>();

	const filteredOptions = $derived(
		search
			? options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
			: options
	);

	const groupedOptions = $derived(() => {
		const groups: Record<string, Option[]> = {};
		for (const opt of filteredOptions) {
			const g = opt.group || '';
			if (!groups[g]) groups[g] = [];
			groups[g].push(opt);
		}
		return groups;
	});

	const selectedLabel = $derived(options.find((o) => o.value === value)?.label || placeholder);

	function select(val: string) {
		value = val;
		open = false;
		search = '';
	}

	function handleClickOutside(e: MouseEvent) {
		if (containerEl && !containerEl.contains(e.target as Node)) {
			open = false;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') open = false;
	}
</script>

<svelte:window on:click={handleClickOutside} on:keydown={handleKeydown} />

<div class="form-control w-full {className}" bind:this={containerEl}>
	{#if label}
		<!-- svelte-ignore a11y_label_has_associated_control -->
		<label class="label">
			<span class="label-text text-slate-300 text-sm">{label}</span>
		</label>
	{/if}

	<div class="relative">
		<button
			type="button"
			{disabled}
			onclick={() => { if (!disabled) open = !open; }}
			class="w-full bg-slate-900/60 border border-slate-800 text-sm rounded-xl
				focus:outline-none focus:border-orange-600/50 focus:ring-1 focus:ring-orange-600/20
				transition-colors cursor-pointer flex items-center justify-between
				disabled:opacity-50 disabled:cursor-not-allowed
				pl-4 pr-3 py-2.5 {value ? 'text-slate-200' : 'text-slate-600'}"
		>
			<span class="truncate">{selectedLabel}</span>
			<ChevronDown class="w-4 h-4 text-slate-500 transition-transform {open ? 'rotate-180' : ''}" />
		</button>

		{#if open}
			<div
				class="absolute z-50 w-full mt-1.5 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl shadow-black/50 overflow-hidden"
			>
				{#if searchable}
					<div class="p-2 border-b border-slate-800">
						<div class="relative">
							<Search class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
							<input
								type="text"
								bind:value={search}
								placeholder="Search..."
								class="w-full bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-lg
									focus:outline-none focus:border-orange-600/50 pl-8 pr-3 py-2"
							/>
						</div>
					</div>
				{/if}
				<div class="max-h-60 overflow-y-auto py-1">
					{#each Object.entries(groupedOptions()) as [group, opts]}
						{#if group}
							<div class="px-3 py-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{group}</div>
						{/if}
						{#each opts as opt}
							<button
								type="button"
								onclick={() => select(opt.value)}
								class="w-full px-3 py-2 text-sm text-left flex items-center justify-between
									hover:bg-slate-800/60 transition-colors
									{opt.value === value ? 'text-orange-400 bg-orange-600/5' : 'text-slate-300'}"
							>
								<span>{opt.label}</span>
								{#if opt.value === value}
									<Check class="w-4 h-4 text-orange-500" />
								{/if}
							</button>
						{/each}
					{/each}
				</div>
			</div>
		{/if}
	</div>

	{#if error}
		<!-- svelte-ignore a11y_label_has_associated_control -->
		<label class="label">
			<span class="label-text-alt text-red-400 text-xs">{error}</span>
		</label>
	{/if}
</div>
