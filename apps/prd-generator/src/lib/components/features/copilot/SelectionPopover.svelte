<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Wand2, Sparkles, Languages, FileText, X } from 'lucide-svelte';

  let { x, y, text, onreplace, onclose }: {
    x: number;
    y: number;
    text: string;
    onreplace?: (newText: string) => void;
    onclose?: () => void;
  } = $props();

  let popoverEl = $state<HTMLElement | undefined>();

  const actions = [
    { label: 'Rephrase for Clarity', icon: Wand2, action: 'rephrase' },
    { label: 'Make More Technical', icon: FileText, action: 'technical' },
    { label: 'Generate User Story', icon: Sparkles, action: 'userstory' },
    { label: 'Translate to EN', icon: Languages, action: 'translate_en' },
  ];

  function handleClickOutside(e: MouseEvent) {
    if (popoverEl && !popoverEl.contains(e.target as Node)) {
      onclose?.();
    }
  }

  onMount(() => {
    document.addEventListener('mousedown', handleClickOutside);
  });

  onDestroy(() => {
    document.removeEventListener('mousedown', handleClickOutside);
  });

  function handleAction(action: string) {
    // These would normally call the AI copilot
    // For now, insert a placeholder instruction
    const prompts: Record<string, string> = {
      rephrase: `[AI: Rephrase for clarity]\n${text}`,
      technical: `[AI: Make more technical]\n${text}`,
      userstory: `[AI: Generate user story from]: ${text}`,
      translate_en: `[AI: Translate to English]: ${text}`,
    };
    onreplace?.(prompts[action] || text);
  }
</script>

<div
  bind:this={popoverEl}
  class="fixed z-50 w-52 rounded-xl bg-[#111827] border border-white/[0.1] shadow-2xl shadow-black/50 overflow-hidden"
  style="left: {Math.min(x, window.innerWidth - 220)}px; top: {Math.min(y, window.innerHeight - 200)}px;"
>
  <!-- Header -->
  <div class="px-3 py-2 border-b border-white/[0.06] flex items-center justify-between">
    <span class="text-[10px] font-mono text-slate-500 truncate max-w-[140px]">AI Action</span>
    <button onclick={onclose} class="text-slate-600 hover:text-white transition-colors">
      <X class="w-3 h-3" />
    </button>
  </div>

  <!-- Selected text preview -->
  <div class="px-3 py-2 border-b border-white/[0.04] bg-white/[0.02]">
    <p class="text-[10px] text-slate-500 line-clamp-2 italic">"{text.slice(0, 80)}{text.length > 80 ? '...' : ''}"</p>
  </div>

  <!-- Actions -->
  <div class="p-1">
    {#each actions as action}
      <button
        onclick={() => handleAction(action.action)}
        class="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-orange-300 hover:bg-orange-500/10 transition-all"
      >
        <action.icon class="w-3.5 h-3.5" />
        <span>{action.label}</span>
      </button>
    {/each}
  </div>
</div>
