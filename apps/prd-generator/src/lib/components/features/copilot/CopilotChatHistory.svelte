<script lang="ts">
  import { onMount } from 'svelte';
  import { MessageSquare, Clock, Bot, User, ChevronDown, ChevronUp, Trash2, RefreshCw } from 'lucide-svelte';
  import { prdApi } from '$lib/api/prd';
  import { prd } from '$lib/stores/prd.store';
  import type { PrdChatMessage } from '$lib/types/prd';

  let messages = $state<PrdChatMessage[]>([]);
  let loading = $state(true);
  let expanded = $state(false);
  let page = $state(0);
  const limit = 20;

  const projectId = $derived($prd.currentProject?.id);

  onMount(loadMessages);

  async function loadMessages() {
    if (!projectId) return;
    loading = true;
    try {
      const data = await prdApi.getChatMessages(projectId, { limit, skip: page * limit });
      messages = data;
    } catch { /* silent */ }
    loading = false;
  }

  function timeAgo(date: string): string {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'baru saja';
    if (mins < 60) return `${mins}m lalu`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}j lalu`;
    const days = Math.floor(hours / 24);
    return `${days}h lalu`;
  }

  function actionBadge(type: string): string {
    switch (type) {
      case 'inline_edit': return 'text-orange-300 bg-orange-500/8 border-orange-500/15';
      case 'selection_highlight': return 'text-amber-300 bg-amber-500/8 border-amber-500/15';
      case 'section_expand': return 'text-violet-300 bg-violet-500/8 border-violet-500/15';
      default: return 'text-slate-400 bg-white/[0.03] border-white/[0.06]';
    }
  }
</script>

<div class="space-y-4">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <MessageSquare class="w-4 h-4 text-orange-400" />
      <h3 class="text-xs font-bold text-white">Chat History</h3>
      {#if messages.length > 0}
        <span class="px-1.5 py-0.5 rounded text-[9px] font-mono text-slate-500 bg-white/[0.03]">{messages.length}</span>
      {/if}
    </div>
    <div class="flex items-center gap-1.5">
      <button
        onclick={loadMessages}
        class="p-1.5 rounded-md text-slate-600 hover:text-white hover:bg-white/[0.04] transition-colors"
        title="Refresh"
      >
        <RefreshCw class="w-3.5 h-3.5" />
      </button>
      <button
        onclick={() => expanded = !expanded}
        class="p-1.5 rounded-md text-slate-600 hover:text-white hover:bg-white/[0.04] transition-colors"
      >
        {#if expanded}<ChevronUp class="w-3.5 h-3.5" />{:else}<ChevronDown class="w-3.5 h-3.5" />{/if}
      </button>
    </div>
  </div>

  <!-- Content -->
  {#if expanded}
    <div class="rounded-xl bg-[#0b0f18] border border-white/[0.04] overflow-hidden">
      {#if loading}
        <div class="p-8 text-center">
          <span class="loading loading-spinner loading-sm text-orange-400"></span>
        </div>
      {:else if messages.length === 0}
        <div class="p-8 text-center space-y-2">
          <MessageSquare class="w-6 h-6 text-slate-600 mx-auto" />
          <p class="text-[11px] text-slate-500">Belum ada riwayat chat</p>
        </div>
      {:else}
        <div class="max-h-80 overflow-y-auto divide-y divide-white/[0.03]">
          {#each messages as msg}
            <div class="px-4 py-3 hover:bg-white/[0.01] transition-colors">
              <div class="flex items-start gap-2.5">
                <div class="w-5 h-5 rounded shrink-0 flex items-center justify-center mt-0.5
                  {msg.role === 'user' ? 'bg-white/[0.04]' : 'bg-orange-500/10'}">
                  {#if msg.role === 'user'}
                    <User class="w-3 h-3 text-slate-400" />
                  {:else}
                    <Bot class="w-3 h-3 text-orange-400" />
                  {/if}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-[10px] font-mono {msg.role === 'user' ? 'text-slate-400' : 'text-orange-400/80'}">{msg.role}</span>
                    {#if msg.actionType !== 'chat'}
                      <span class="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border {actionBadge(msg.actionType)}">{msg.actionType.replace('_', ' ')}</span>
                    {/if}
                    <span class="text-[9px] text-slate-600 font-mono ml-auto">{timeAgo(msg.createdAt)}</span>
                  </div>
                  <p class="text-[11px] text-slate-400 leading-relaxed line-clamp-3">{msg.content}</p>
                  {#if msg.modelUsed}
                    <p class="text-[9px] text-slate-600 font-mono mt-1">{msg.modelUsed}</p>
                  {/if}
                </div>
              </div>
            </div>
          {/each}
        </div>

        <!-- Pagination -->
        {#if messages.length >= limit}
          <div class="flex items-center justify-center gap-2 px-4 py-2.5 border-t border-white/[0.04]">
            <button
              onclick={() => { page = Math.max(0, page - 1); loadMessages(); }}
              disabled={page === 0}
              class="px-2.5 py-1 rounded-md text-[10px] text-slate-500 hover:text-white bg-white/[0.03] border border-white/[0.06] disabled:opacity-30 transition-colors"
            >
              Prev
            </button>
            <span class="text-[10px] text-slate-600 font-mono">{page + 1}</span>
            <button
              onclick={() => { page++; loadMessages(); }}
              class="px-2.5 py-1 rounded-md text-[10px] text-slate-500 hover:text-white bg-white/[0.03] border border-white/[0.06] transition-colors"
            >
              Next
            </button>
          </div>
        {/if}
      {/if}
    </div>
  {/if}
</div>
