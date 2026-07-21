<script lang="ts">
  import { prd } from '$lib/stores/prd.store';
  import MarkdownPreviewPane from './MarkdownPreviewPane.svelte';
  import SectionActionToolbar from '../copilot/SectionActionToolbar.svelte';
  import SelectionPopover from '../copilot/SelectionPopover.svelte';

  let editorEl = $state<HTMLTextAreaElement | undefined>();
  let selectedText = $state('');
  let selectionPos = $state({ x: 0, y: 0 });
  let showPopover = $state(false);
  let activeSection = $state('');
  let splitRatio = $state(50);

  function handleInput() {
    // rawMarkdown is bound directly
  }

  function handleSelect() {
    if (!editorEl) return;
    const textarea = editorEl;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start !== end) {
      selectedText = $prd.rawMarkdown.slice(start, end);

      // Get caret position for popover
      const rect = textarea.getBoundingClientRect();
      const lines = $prd.rawMarkdown.slice(0, start).split('\n');
      const lineHeight = 24;
      const x = rect.left + 40;
      const y = rect.top + (lines.length * lineHeight) - textarea.scrollTop;

      selectionPos = { x: Math.min(x, window.innerWidth - 300), y: Math.min(y, window.innerHeight - 100) };
      showPopover = true;
    } else {
      selectedText = '';
      showPopover = false;
    }

    // Detect active section from cursor position
    const beforeCursor = $prd.rawMarkdown.slice(0, start);
    const sections = beforeCursor.match(/^#{1,3}\s+.+$/gm) || [];
    activeSection = sections[sections.length - 1] || '';
  }

  function handleKeyDown(e: KeyboardEvent) {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      // Trigger save via parent
    }

    // Tab handling
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = editorEl;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = $prd.rawMarkdown;
      $prd.rawMarkdown = value.slice(0, start) + '  ' + value.slice(end);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  }

  function handleDrag(e: MouseEvent) {
    const startX = e.clientX;
    const startRatio = splitRatio;

    function onMove(ev: MouseEvent) {
      const delta = ev.clientX - startX;
      const containerWidth = window.innerWidth;
      splitRatio = Math.max(25, Math.min(75, startRatio + (delta / containerWidth) * 100));
    }

    function onUp() {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  function insertAtCursor(text: string) {
    if (!editorEl) return;
    const start = editorEl.selectionStart;
    const value = $prd.rawMarkdown;
    $prd.rawMarkdown = value.slice(0, start) + text + value.slice(start);
    const el = editorEl;
    setTimeout(() => {
      el.selectionStart = el.selectionEnd = start + text.length;
      el.focus();
    }, 0);
  }

  function replaceSelection(newText: string) {
    if (!editorEl) return;
    const start = editorEl.selectionStart;
    const end = editorEl.selectionEnd;
    const value = $prd.rawMarkdown;
    $prd.rawMarkdown = value.slice(0, start) + newText + value.slice(end);
    showPopover = false;
    const el = editorEl;
    setTimeout(() => {
      el.selectionStart = start;
      el.selectionEnd = start + newText.length;
      el.focus();
    }, 0);
  }
</script>

<div class="h-full flex">
  <!-- Editor Pane -->
  <div class="flex flex-col h-full overflow-hidden" style="width: {splitRatio}% ">
    <div class="flex items-center justify-between px-4 py-2 border-b border-white/[0.04] bg-[#060a12]/30">
      <span class="text-[10px] font-mono text-slate-600 uppercase tracking-wider">Markdown Source</span>
      <span class="text-[10px] font-mono text-slate-600">{$prd.rawMarkdown.length} chars</span>
    </div>
    <div class="relative flex-1">
      <textarea
        bind:this={editorEl}
        bind:value={$prd.rawMarkdown}
        oninput={handleInput}
        onselect={handleSelect}
        onmouseup={handleSelect}
        onkeyup={handleSelect}
        onkeydown={handleKeyDown}
        spellcheck="false"
        class="absolute inset-0 w-full h-full resize-none bg-[#030712] text-slate-300 text-[13px] leading-relaxed font-mono p-5 focus:outline-none placeholder:text-slate-700 selection:bg-orange-500/20"
        placeholder="Mulai menulis markdown PRD Anda di sini...&#10;&#10;# Judul Section&#10;&#10;Deskripsi section..."
      ></textarea>

      <!-- Section Action Toolbar -->
      {#if activeSection}
        <SectionActionToolbar section={activeSection} oninsert={insertAtCursor} />
      {/if}

      <!-- Selection Popover -->
      {#if showPopover && selectedText}
        <SelectionPopover
          x={selectionPos.x}
          y={selectionPos.y}
          text={selectedText}
          onreplace={replaceSelection}
          onclose={() => showPopover = false}
        />
      {/if}
    </div>
  </div>

  <!-- Drag Handle -->
  <div
    class="w-1 hover:w-1.5 bg-white/[0.04] hover:bg-orange-500/30 cursor-col-resize transition-all shrink-0 relative group"
    role="separator"
    onmousedown={handleDrag}
  >
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-8 rounded-full bg-white/10 group-hover:bg-orange-400/50 transition-colors"></div>
  </div>

  <!-- Preview Pane -->
  <div class="flex flex-col h-full overflow-hidden" style="width: {100 - splitRatio}% ">
    <div class="flex items-center justify-between px-4 py-2 border-b border-white/[0.04] bg-[#060a12]/30">
      <span class="text-[10px] font-mono text-slate-600 uppercase tracking-wider">Live Preview</span>
      <span class="text-[10px] font-mono text-emerald-500/60">● rendering</span>
    </div>
    <div class="flex-1 overflow-y-auto">
      <MarkdownPreviewPane content={$prd.rawMarkdown} />
    </div>
  </div>
</div>
