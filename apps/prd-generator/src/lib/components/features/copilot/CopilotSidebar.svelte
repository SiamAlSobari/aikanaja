<script lang="ts">
  import { onMount } from 'svelte';
  import { Send, Sparkles, User, Bot, Loader2, Trash2, StopCircle } from 'lucide-svelte';
  import { prdApi } from '$lib/api/prd';
  import { prd } from '$lib/stores/prd.store';
  import { ui } from '$lib/stores/ui.store';
  import type { PrdChatMessage } from '$lib/types/prd';

  let messages = $state<PrdChatMessage[]>([]);
  let input = $state('');
  let isStreaming = $state(false);
  let chatContainer = $state<HTMLElement | undefined>();
  let abortController: AbortController | null = null;
  let typingDots = $state('');

  const projectId = $derived($prd.currentProject?.id);

  onMount(async () => {
    if (!projectId) return;
    try {
      messages = await prdApi.getChatMessages(projectId, { limit: 50 });
    } catch { /* silent */ }
  });

  $effect(() => {
    if (chatContainer) {
      requestAnimationFrame(() => {
        chatContainer!.scrollTop = chatContainer!.scrollHeight;
      });
    }
  });

  // Typing indicator animation
  $effect(() => {
    if (!isStreaming) { typingDots = ''; return; }
    const frames = ['', '.', '..', '...'];
    let i = 0;
    const interval = setInterval(() => {
      typingDots = frames[i % frames.length];
      i++;
    }, 400);
    return () => clearInterval(interval);
  });

  async function sendMessage() {
    if (!input.trim() || !projectId || isStreaming) return;

    const userMsg: PrdChatMessage = {
      id: crypto.randomUUID(),
      projectId,
      userId: '',
      role: 'user',
      actionType: 'chat',
      content: input.trim(),
      createdAt: new Date().toISOString(),
    };

    messages = [...messages, userMsg];
    const instruction = input.trim();
    input = '';
    isStreaming = true;

    let assistantContent = '';

    try {
      abortController = new AbortController();

      await prdApi.copilot(
        $prd.rawMarkdown,
        instruction,
        (chunk) => {
          assistantContent += chunk;
          prd.updateContent($prd.rawMarkdown + chunk);

          const lastMsg = messages[messages.length - 1];
          if (lastMsg?.role === 'assistant' && lastMsg.id === 'streaming') {
            messages = [...messages.slice(0, -1), { ...lastMsg, content: assistantContent }];
          } else {
            messages = [...messages, {
              id: 'streaming',
              projectId,
              userId: '',
              role: 'assistant',
              actionType: 'chat',
              content: assistantContent,
              createdAt: new Date().toISOString(),
            }];
          }
        },
        abortController.signal
      );

      if (assistantContent) {
        await prdApi.saveChatMessage(projectId, {
          role: 'assistant',
          content: assistantContent,
          modelUsed: 'gemini-2.0-flash',
        });
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        ui.addToast('Copilot error', 'error');
      }
    } finally {
      isStreaming = false;
      abortController = null;
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function stopGeneration() {
    abortController?.abort();
    isStreaming = false;
  }

  const starters = [
    { text: 'Tambahkan Risk Analysis', icon: '⚡' },
    { text: 'Refine AC jadi Given-When-Then', icon: '🎯' },
    { text: 'Buat Mermaid diagram autentikasi', icon: '🔀' },
    { text: 'Tambahkan NFR (Performance & Security)', icon: '🛡️' },
  ];
</script>

<div class="flex flex-col h-full">
  <!-- Header -->
  <div class="shrink-0 px-4 py-3 border-b border-white/[0.04]">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2.5">
        <div class="relative">
          <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
            <Sparkles class="w-3.5 h-3.5 text-white" />
          </div>
          <span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#060a12]"></span>
        </div>
        <div>
          <p class="text-[11px] font-bold text-white leading-none">AI Copilot</p>
          <p class="text-[9px] text-emerald-400/80 font-mono mt-0.5">online · gemini-2.0-flash</p>
        </div>
      </div>
      {#if messages.length > 0}
        <button
          onclick={() => messages = []}
          class="p-1.5 rounded-md text-slate-600 hover:text-red-400 hover:bg-red-500/8 transition-colors"
          title="Clear"
        >
          <Trash2 class="w-3.5 h-3.5" />
        </button>
      {/if}
    </div>
  </div>

  <!-- Messages -->
  <div bind:this={chatContainer} class="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin">
    {#if messages.length === 0}
      <div class="h-full flex flex-col items-center justify-center text-center px-2">
        <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/15 to-amber-500/5 flex items-center justify-center mb-4 border border-orange-500/10">
          <Sparkles class="w-6 h-6 text-orange-400/80" />
        </div>
        <p class="text-xs font-semibold text-white mb-1">Mulai percakapan</p>
        <p class="text-[11px] text-slate-500 max-w-[200px] mb-5">Instruksikan AI untuk merevisi, menambah, atau memperjelas PRD Anda</p>

        <div class="w-full space-y-2">
          {#each starters as s}
            <button
              onclick={() => { input = s.text; sendMessage(); }}
              class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-orange-500/15 hover:bg-orange-500/[0.03] transition-all text-left group"
            >
              <span class="text-sm">{s.icon}</span>
              <span class="text-[11px] text-slate-500 group-hover:text-slate-300 transition-colors">{s.text}</span>
            </button>
          {/each}
        </div>
      </div>
    {:else}
      {#each messages as msg, i (msg.id + i)}
        {#if msg.role === 'user'}
          <div class="flex justify-end">
            <div class="max-w-[85%] px-3.5 py-2.5 rounded-2xl rounded-br-md bg-orange-500/10 border border-orange-500/15 text-[12px] text-orange-100/90 leading-relaxed">
              <p class="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        {:else}
          <div class="flex gap-2">
            <div class="w-6 h-6 rounded-md bg-orange-500/10 flex items-center justify-center shrink-0 mt-0.5">
              <Bot class="w-3 h-3 text-orange-400" />
            </div>
            <div class="max-w-[85%] px-3.5 py-2.5 rounded-2xl rounded-bl-md bg-white/[0.025] border border-white/[0.04] text-[12px] text-slate-300 leading-relaxed">
              <p class="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        {/if}
      {/each}

      {#if isStreaming}
        <div class="flex gap-2">
          <div class="w-6 h-6 rounded-md bg-orange-500/10 flex items-center justify-center shrink-0 mt-0.5">
            <Bot class="w-3 h-3 text-orange-400" />
          </div>
          <div class="px-3.5 py-2.5 rounded-2xl rounded-bl-md bg-white/[0.025] border border-white/[0.04]">
            <span class="text-[11px] text-slate-500 font-mono">mengetik{typingDots}</span>
          </div>
        </div>
      {/if}
    {/if}
  </div>

  <!-- Input -->
  <div class="shrink-0 px-3 py-3 border-t border-white/[0.04]">
    {#if isStreaming}
      <button
        onclick={stopGeneration}
        class="w-full mb-2 py-2 rounded-xl text-[11px] font-semibold text-red-400 bg-red-500/8 border border-red-500/15 hover:bg-red-500/15 transition-colors flex items-center justify-center gap-1.5"
      >
        <StopCircle class="w-3.5 h-3.5" /> Stop
      </button>
    {/if}

    <div class="flex items-end gap-2">
      <textarea
        bind:value={input}
        onkeydown={handleKeydown}
        placeholder="Instruksikan AI..."
        rows="1"
        disabled={isStreaming}
        class="flex-1 px-3.5 py-2.5 rounded-xl bg-[#0a0e14] border border-white/[0.04] text-[12px] text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500/20 resize-none transition-colors disabled:opacity-40 leading-relaxed"
      ></textarea>
      <button
        onclick={sendMessage}
        disabled={!input.trim() || isStreaming}
        class="p-2.5 rounded-xl bg-orange-500 text-white disabled:bg-white/[0.04] disabled:text-slate-600 transition-all hover:bg-orange-400 active:scale-95"
      >
        <Send class="w-4 h-4" />
      </button>
    </div>
  </div>
</div>

<style>
  .scrollbar-thin::-webkit-scrollbar { width: 4px; }
  .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
  .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 9999px; }
</style>
