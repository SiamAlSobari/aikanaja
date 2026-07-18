<script lang="ts">
	let {
		label,
		error,
		placeholder = '',
		value = $bindable(''),
		rows = 3,
		maxLength,
		disabled = false,
		class: className = '',
		...rest
	}: {
		label?: string;
		error?: string;
		placeholder?: string;
		value?: string;
		rows?: number;
		maxLength?: number;
		disabled?: boolean;
		class?: string;
		[key: string]: unknown;
	} = $props();

	let textareaEl = $state<HTMLTextAreaElement>();

	function autoResize() {
		if (!textareaEl) return;
		textareaEl.style.height = 'auto';
		textareaEl.style.height = textareaEl.scrollHeight + 'px';
	}

	$effect(() => {
		value;
		autoResize();
	});
</script>

<div class="form-control w-full {className}">
	{#if label}
		<!-- svelte-ignore a11y_label_has_associated_control -->
		<label class="label">
			<span class="label-text text-slate-300 text-sm">{label}</span>
		</label>
	{/if}
	<textarea
		bind:this={textareaEl}
		{placeholder}
		bind:value
		{rows}
		maxlength={maxLength}
		{disabled}
		oninput={autoResize}
		class="w-full bg-slate-900/60 border border-slate-800 text-slate-200 text-sm rounded-xl
			focus:outline-none focus:border-orange-600/50 focus:ring-1 focus:ring-orange-600/20
			placeholder:text-slate-600 transition-colors resize-none overflow-hidden
			disabled:opacity-50 disabled:cursor-not-allowed
			pl-4 pr-4 py-2.5"
		{...rest}
	></textarea>
	{#if maxLength || error}
		<!-- svelte-ignore a11y_label_has_associated_control -->
		<label class="label">
			{#if error}
				<span class="label-text-alt text-red-400 text-xs">{error}</span>
			{:else if maxLength}
				<span class="label-text-alt text-slate-600 text-xs">{value.length}/{maxLength}</span>
			{/if}
		</label>
	{/if}
</div>
