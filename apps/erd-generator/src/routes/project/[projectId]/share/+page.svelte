<script lang="ts">
	import { ArrowLeft, UserPlus, Link, Copy, Check, Trash } from 'lucide-svelte';
	import { enhance } from '$app/forms';
	let { data, form } = $props();

	let copied = $state(false);

	function copyToClipboard(linkStr: string) {
		const fullLink = `${window.location.origin}/project/${data.project.id}/share/${linkStr}`;
		navigator.clipboard.writeText(fullLink);
		copied = true;
		setTimeout(() => copied = false, 2000);
	}
</script>

<div class="min-h-screen bg-slate-950 text-slate-100 p-6 max-w-3xl mx-auto space-y-6">
	<div class="flex items-center gap-3">
		<a href="/project/{data.project.id}" class="btn btn-sm btn-ghost rounded-xl text-slate-400 hover:text-white" id="back-to-canvas-btn">
			<ArrowLeft class="w-4 h-4" /> Back to Canvas
		</a>
		<h1 class="text-xl font-bold text-white">Share Project</h1>
	</div>

	{#if form?.error}
		<div class="alert alert-error bg-red-950/20 border-red-800 text-red-200 rounded-xl p-4 text-xs font-medium" id="share-error-alert">
			{form.error}
		</div>
	{/if}

	<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
		<!-- Left Column: Invite Form & Public Link -->
		<div class="md:col-span-2 space-y-6">
			<!-- Invite via Email -->
			<div class="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4 backdrop-blur-sm" id="invite-collaborator-card">
				<h3 class="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
					<UserPlus class="w-4 h-4 text-orange-500" /> Invite Collaborator
				</h3>
				<form use:enhance action="?/invite" method="POST" class="flex flex-col sm:flex-row gap-3" id="invite-form">
					<input type="email" name="email" required placeholder="name@email.com" id="invite-email-input" class="input input-bordered bg-slate-950 border-slate-800 rounded-xl text-sm flex-1 focus:border-orange-500/50" />
					<select name="role" id="invite-role-select" class="select select-bordered bg-slate-950 border-slate-800 rounded-xl text-sm focus:border-orange-500/50">
						<option value="view">Can View</option>
						<option value="edit">Can Edit</option>
					</select>
					<button type="submit" id="invite-submit-btn" class="btn btn-sm bg-orange-600 hover:bg-orange-700 text-white rounded-xl border-none font-semibold px-4">
						Invite
					</button>
				</form>
			</div>

			<!-- Public Link -->
			<div class="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4 backdrop-blur-sm" id="public-share-link-card">
				<h3 class="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
					<Link class="w-4 h-4 text-orange-500" /> Public Share Link
				</h3>
				{#if data.shareLink}
					<div class="flex gap-2">
						<input type="text" readonly id="share-link-input" value="{window.location.origin}/project/{data.project.id}/share/{data.shareLink.link}" class="input input-bordered bg-slate-950 border-slate-800 rounded-xl text-xs flex-1 text-slate-400 select-all" />
						<button onclick={() => copyToClipboard(data.shareLink.link)} id="copy-share-link-btn" class="btn btn-sm bg-slate-800 hover:bg-slate-700 text-white rounded-xl border-none gap-1">
							{#if copied}
								<Check class="w-3.5 h-3.5 text-emerald-500" /> Copied
							{:else}
								<Copy class="w-3.5 h-3.5" /> Copy
							{/if}
						</button>
					</div>
				{:else}
					<form use:enhance action="?/generateLink" method="POST" id="generate-link-form">
						<button type="submit" id="generate-link-btn" class="btn btn-sm bg-slate-800 hover:bg-slate-700 text-slate-200 border-none font-semibold rounded-xl">
							Generate Share Link
						</button>
					</form>
				{/if}
			</div>
		</div>

		<!-- Right Column: Collaborators List -->
		<div class="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm h-fit" id="collaborators-list-card">
			<h3 class="text-sm font-bold text-white uppercase tracking-wider mb-4">Collaborators</h3>
			{#if data.collaborators && data.collaborators.length > 0}
				<div class="divide-y divide-slate-800/60" id="collaborators-list-container">
					{#each data.collaborators as member}
						<div class="py-3 flex items-center justify-between gap-2 text-xs" id="collaborator-item-{member.userId}">
							<div class="min-w-0">
								<p class="font-semibold text-slate-200 truncate">{member.user.name}</p>
								<p class="text-[10px] text-slate-500 truncate">{member.user.email}</p>
								<span class="inline-block bg-slate-800 text-orange-400 text-[9px] px-1.5 py-0.5 rounded capitalize font-medium mt-1">{member.role}</span>
							</div>
							<form use:enhance action="?/remove" method="POST" id="remove-collaborator-form-{member.userId}">
								<input type="hidden" name="userId" value={member.userId} />
								<button type="submit" id="remove-collaborator-btn-{member.userId}" class="btn btn-xs btn-ghost text-red-500 hover:bg-red-950/20 rounded-lg p-1.5">
									<Trash class="w-3.5 h-3.5" />
								</button>
							</form>
						</div>
					{/each}
				</div>
			{:else}
				<p class="text-xs text-slate-500 text-center py-6" id="no-collaborators-text">No collaborators invited.</p>
			{/if}
		</div>
	</div>
</div>
