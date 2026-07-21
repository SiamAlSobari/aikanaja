<script lang="ts">
  import { Sparkles, Wand2, GitBranch, BarChart3, RefreshCw } from 'lucide-svelte';

  let { section, oninsert }: { section: string; oninsert?: (text: string) => void } = $props();
  let expanded = $state(false);

  const actions = [
    { label: 'Refine AC', icon: RefreshCw, prompt: 'Refine the acceptance criteria for this section using Given-When-Then format' },
    { label: 'Expand', icon: Wand2, prompt: 'Expand this section with more details and sub-sections' },
    { label: 'Add User Stories', icon: Sparkles, prompt: 'Generate user stories for this section with story points' },
    { label: 'Add Diagram', icon: GitBranch, prompt: 'Generate a Mermaid.js diagram for this section' },
    { label: 'Quality Check', icon: BarChart3, prompt: 'Review this section for ambiguity and suggest improvements' },
  ];
</script>

<div class="absolute top-2 right-4 z-10">
  <button
    onclick={() => expanded = !expanded}
    class="p-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500/20 transition-all"
    title="Section Actions"
  >
    <Sparkles class="w-3.5 h-3.5" />
  </button>

  {#if expanded}
    <div class="absolute right-0 top-full mt-1 w-52 rounded-xl bg-[#111827] border border-white/[0.08] shadow-2xl z-20 overflow-hidden">
      <div class="px-3 py-2 border-b border-white/[0.06]">
        <p class="text-[10px] font-mono text-slate-500 truncate">{section}</p>
      </div>
      <div class="p-1">
        {#each actions as action}
          <button
            onclick={() => {
              oninsert?.(`\n\n<!-- AI: ${action.prompt} -->\n`);
              expanded = false;
            }}
            class="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-orange-300 hover:bg-orange-500/10 transition-all"
          >
            <action.icon class="w-3.5 h-3.5" />
            <span>{action.label}</span>
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>
