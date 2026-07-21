<script lang="ts">
  import { onMount } from 'svelte';
  import { marked } from 'marked';
  import DOMPurify from 'dompurify';
  import mermaid from 'mermaid';

  let { content = '' }: { content?: string } = $props();
  let previewEl = $state<HTMLElement | undefined>();
  let renderedHtml = $state('');
  let mermaidCounter = 0;

  mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    themeVariables: {
      primaryColor: '#f97316',
      primaryTextColor: '#fff',
      primaryBorderColor: '#f97316',
      lineColor: '#f97316',
      secondaryColor: '#0a0e17',
      tertiaryColor: '#0c1019',
      fontFamily: 'monospace',
    },
  });

  marked.setOptions({ gfm: true, breaks: true });

  const renderer = new marked.Renderer();
  renderer.code = function ({ text, lang }: { text: string; lang?: string }) {
    if (lang === 'mermaid') {
      const id = `mermaid-${mermaidCounter++}`;
      return `<div class="mermaid-block" data-mermaid-id="${id}"><pre class="mermaid">${text}</pre></div>`;
    }
    return `<pre><code class="language-${lang || ''}">${text}</code></pre>`;
  };
  marked.use({ renderer });

  async function renderMarkdown(md: string) {
    if (!md.trim()) {
      renderedHtml = '<div class="flex items-center justify-center h-64 text-slate-600"><p class="text-sm">Mulai menulis untuk melihat preview...</p></div>';
      return;
    }
    try {
      const rawHtml = await marked.parse(md) as string;
      renderedHtml = DOMPurify.sanitize(rawHtml);
    } catch {
      renderedHtml = '<p class="text-red-400">Error rendering markdown</p>';
    }
  }

  async function renderMermaid() {
    if (!previewEl) return;
    const blocks = previewEl.querySelectorAll('.mermaid-block');
    for (const block of blocks) {
      const pre = block.querySelector('pre.mermaid');
      if (!pre || pre.getAttribute('data-rendered') === 'true') continue;
      const id = block.getAttribute('data-mermaid-id') || `mermaid-${Date.now()}`;
      const code = pre.textContent || '';
      try {
        const { svg } = await mermaid.render(id, code);
        pre.outerHTML = `<div class="my-4 p-4 rounded-xl bg-[#060911] border border-white/[0.06] overflow-x-auto">${svg}</div>`;
      } catch {
        pre.outerHTML = `<div class="my-4 p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400 text-xs font-mono">Mermaid render error</div>`;
      }
    }
  }

  onMount(() => {
    renderMermaid();
  });

  $effect(() => {
    const _ = content;
    renderMarkdown(content).then(() => {
      setTimeout(renderMermaid, 50);
    });
  });
</script>

<div
  bind:this={previewEl}
  class="prose prose-sm prose-invert max-w-none p-6
    prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight
    prose-h1:text-2xl prose-h1:mb-6 prose-h1:pb-3 prose-h1:border-b prose-h1:border-white/[0.06]
    prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-orange-300
    prose-h3:text-base prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-amber-300
    prose-p:text-slate-300 prose-p:leading-relaxed
    prose-a:text-orange-400 prose-a:no-underline hover:prose-a:underline
    prose-strong:text-white prose-strong:font-bold
    prose-code:text-orange-300 prose-code:bg-orange-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono
    prose-pre:bg-[#060911] prose-pre:border prose-pre:border-white/[0.06] prose-pre:rounded-xl
    prose-li:text-slate-300 prose-li:marker:text-orange-500
    prose-blockquote:border-orange-500/30 prose-blockquote:bg-orange-500/5 prose-blockquote:rounded-r-xl
    prose-table:border-white/[0.06]
    prose-th:text-orange-400 prose-th:text-xs prose-th:uppercase prose-th:tracking-wider
    prose-td:text-slate-400 prose-td:text-sm
    prose-hr:border-white/[0.06]"
>
  {@html renderedHtml}
</div>

<style>
  :global(.mermaid-block) {
    margin: 1rem 0;
  }
  :global(.mermaid-block svg) {
    max-width: 100%;
    height: auto;
  }
</style>
