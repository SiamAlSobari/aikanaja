<script lang="ts">
	import { ArrowLeft, Save, Trash2 } from 'lucide-svelte';
	import { enhance } from '$app/forms';
	let { data, form } = $props();
</script>

<div class="min-h-screen bg-slate-950 text-slate-100 p-6 max-w-2xl mx-auto space-y-6">
	<div class="flex items-center gap-3">
		<a href="/project/{data.project.id}" class="btn btn-sm btn-ghost rounded-xl text-slate-400 hover:text-white" id="back-to-canvas-btn">
			<ArrowLeft class="w-4 h-4" /> Back to Canvas
		</a>
		<h1 class="text-xl font-bold text-white">Project Settings</h1>
	</div>

	{#if form?.error}
		<div class="alert alert-error bg-red-950/20 border-red-800 text-red-200 rounded-xl p-4 text-xs font-medium" id="settings-error-alert">
			{form.error}
		</div>
	{/if}
	{#if form?.success}
		<div class="alert alert-success bg-emerald-950/20 border-emerald-800 text-emerald-200 rounded-xl p-4 text-xs font-medium" id="settings-success-alert">
			Changes saved successfully.
		</div>
	{/if}

	<div class="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4 backdrop-blur-sm">
		<form use:enhance action="?/update" method="POST" class="space-y-4" id="update-project-form">
			<div class="form-control">
				<label class="label text-xs font-semibold text-slate-400 uppercase tracking-wider" for="name-field">Project Name</label>
				<input id="name-field" type="text" name="name" value={data.project.name} required class="input input-bordered bg-slate-950 border-slate-800 rounded-xl text-sm w-full focus:border-orange-500/50" />
			</div>

			<div class="form-control">
				<label class="label text-xs font-semibold text-slate-400 uppercase tracking-wider" for="desc-field">Description</label>
				<textarea id="desc-field" name="description" rows="3" class="textarea textarea-bordered bg-slate-950 border-slate-800 rounded-xl text-sm w-full focus:border-orange-500/50">{data.project.description ?? ''}</textarea>
			</div>

			<div class="form-control">
				<label class="label text-xs font-semibold text-slate-400 uppercase tracking-wider" for="visibility-field">Visibility</label>
				<select id="visibility-field" name="visibility" class="select select-bordered bg-slate-950 border-slate-800 rounded-xl text-sm w-full focus:border-orange-500/50">
					<option value="private" selected={data.project.visibility === 'private'}>Private (Only invited members)</option>
					<option value="public" selected={data.project.visibility === 'public'}>Public (Anyone with link can view)</option>
				</select>
			</div>

			<button type="submit" id="save-settings-btn" class="btn btn-sm bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold gap-2 border-none">
				<Save class="w-4 h-4" /> Save Changes
			</button>
		</form>
	</div>

	<!-- Danger Zone -->
	<div class="border border-red-900/30 bg-red-950/5 rounded-2xl p-6 space-y-4" id="danger-zone-card">
		<div>
			<h3 class="text-sm font-bold text-red-500 uppercase tracking-wider">Danger Zone</h3>
			<p class="text-xs text-slate-500">Permanently delete this project. Once deleted, it cannot be recovered.</p>
		</div>
		<form use:enhance action="?/delete" method="POST" onsubmit={(e) => { if (!confirm('Apakah Anda yakin ingin menghapus proyek ini?')) e.preventDefault(); }} id="delete-project-form">
			<button type="submit" id="delete-project-btn" class="btn btn-sm bg-red-600 hover:bg-red-700 text-white border-none font-semibold rounded-xl gap-2">
				<Trash2 class="w-4 h-4" /> Delete Project
			</button>
		</form>
	</div>
</div>
