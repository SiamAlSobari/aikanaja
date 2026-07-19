<script lang="ts">
	import { enhance } from '$app/forms';
	import { ArrowLeft, Zap } from 'lucide-svelte';
	let { form } = $props();

	let isCreating = $state(false);
</script>

<div class="min-h-screen bg-slate-950 text-slate-100 p-6 max-w-lg mx-auto flex flex-col justify-center space-y-6">
	<div class="flex items-center gap-3">
		<a href="/dashboard/projects" class="btn btn-sm btn-ghost rounded-xl text-slate-400 hover:text-white" id="back-to-projects-btn">
			<ArrowLeft class="w-4 h-4" /> Back to Projects
		</a>
		<h1 class="text-xl font-bold text-white">Create New Project</h1>
	</div>

	{#if form?.error}
		<div class="alert alert-error bg-red-950/20 border-red-800 text-red-200 rounded-xl p-4 text-xs font-medium" id="new-project-error">
			{form.error}
		</div>
	{/if}

	<div class="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 space-y-4 backdrop-blur-sm">
		<form
			use:enhance={() => {
				isCreating = true;
				return async ({ update }) => {
					await update();
					isCreating = false;
				};
			}}
			method="POST"
			class="space-y-4"
			id="new-project-form"
		>
			<div class="form-control">
				<label class="label text-xs font-semibold text-slate-400 uppercase tracking-wider" for="project-name-input">Project Name</label>
				<input
					id="project-name-input"
					type="text"
					name="name"
					required
					placeholder="e.g., E-Commerce Database"
					class="input input-bordered bg-slate-950 border-slate-800 rounded-xl text-sm w-full focus:border-orange-500/50"
				/>
			</div>

			<div class="form-control">
				<label class="label text-xs font-semibold text-slate-400 uppercase tracking-wider" for="project-desc-input">Description (Optional)</label>
				<textarea
					id="project-desc-input"
					name="description"
					rows="3"
					placeholder="Describe what this database will model..."
					class="textarea textarea-bordered bg-slate-950 border-slate-800 rounded-xl text-sm w-full focus:border-orange-500/50"
				></textarea>
			</div>

			<div class="flex gap-3 pt-2">
				<button
					type="submit"
					disabled={isCreating}
					id="create-project-submit-btn"
					class="flex-1 btn btn-sm bg-gradient-to-r from-brand-orange to-brand-amber text-slate-950 border-none font-semibold rounded-xl gap-2 shadow-[0_0_15px_rgba(255,62,0,0.2)] hover:opacity-90 disabled:opacity-50"
				>
					{#if isCreating}
						<span class="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></span>
						Creating...
					{:else}
						<Zap class="w-4 h-4 text-slate-950" />
						Create Project
					{/if}
				</button>
				<a href="/dashboard/projects" class="btn btn-sm btn-ghost hover:bg-slate-800 rounded-xl text-xs text-slate-400">Cancel</a>
			</div>
		</form>
	</div>
</div>
