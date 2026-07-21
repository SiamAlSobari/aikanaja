<script lang="ts">
  import { X, Download, FileText, FileCode2, Braces, FileJson, Loader2 } from 'lucide-svelte';
  import { prd } from '$lib/stores/prd.store';
  import { prdApi } from '$lib/api/prd';
  import { ui } from '$lib/stores/ui.store';
  import Spinner from '$lib/components/ui/Spinner.svelte';

  let { open = $bindable(false) }: { open?: boolean } = $props();
  let exporting = $state('');
  let isExporting = $state(false);

  const formats = [
    { id: 'markdown', label: 'Markdown', ext: '.md', icon: FileText, desc: 'Dokumen PRD murni tanpa watermark', color: 'from-orange-500 to-amber-500' },
    { id: 'pdf', label: 'PDF', ext: '.pdf', icon: FileText, desc: 'Tata letak profesional dengan diagram ter-render', color: 'from-red-500 to-pink-500' },
    { id: 'agents', label: 'AGENTS.md', ext: '.md', icon: FileCode2, desc: 'Spesifikasi untuk AI Coding Agents', color: 'from-amber-500 to-yellow-500' },
    { id: 'json', label: 'JSON Spec', ext: '.json', icon: Braces, desc: 'Struktur data JSON terintegrasi', color: 'from-violet-500 to-purple-500' },
  ];

  async function handleExport(format: string) {
    if (!$prd.rawMarkdown.trim()) {
      ui.addToast('Tidak ada konten untuk di-export', 'warning');
      return;
    }

    isExporting = true;
    exporting = format;

    try {
      if (format === 'markdown') {
        downloadFile('prd.md', $prd.rawMarkdown, 'text/markdown');
      } else if (format === 'agents') {
        const result = await prdApi.exportAgentPrompt($prd.rawMarkdown);
        downloadFile('AGENTS.md', result, 'text/markdown');
      } else if (format === 'json') {
        const result = await prdApi.exportJsonSpec($prd.rawMarkdown);
        downloadFile('prd-spec.json', JSON.stringify(result, null, 2), 'application/json');
      } else if (format === 'pdf') {
        // PDF export via jsPDF + html2canvas
        const { default: jsPDF } = await import('jspdf');
        const { default: html2canvas } = await import('html2canvas');
        const previewEl = document.querySelector('.prose');
        if (previewEl) {
          const canvas = await html2canvas(previewEl as HTMLElement, { backgroundColor: '#030712' });
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save('prd.pdf');
        }
      }
      ui.addToast(`Export ${format} berhasil!`, 'success');
    } catch (err: any) {
      ui.addToast(`Gagal export: ${err.message}`, 'error');
    } finally {
      isExporting = false;
      exporting = '';
    }
  }

  function downloadFile(filename: string, content: string, type: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleClose() {
    open = false;
  }
</script>

{#if open}
  <div
    class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    onclick={handleClose}
    onkeydown={(e) => e.key === 'Escape' && handleClose()}
    role="presentation"
  >
    <div
      class="w-full max-w-lg rounded-3xl bg-[#0c1019] border border-white/[0.08] shadow-2xl overflow-hidden"
      onclick={(e) => e.stopPropagation()}
      role="document"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
            <Download class="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 class="text-base font-bold text-white">Export PRD</h2>
            <p class="text-xs text-slate-500">Pilih format ekspor dokumen</p>
          </div>
        </div>
        <button onclick={handleClose} class="p-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/[0.06] transition-all">
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Formats -->
      <div class="p-6 space-y-3">
        {#each formats as fmt}
          <button
            onclick={() => handleExport(fmt.id)}
            disabled={isExporting}
            class="w-full flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-orange-500/20 transition-all text-left group disabled:opacity-50"
          >
            <div class="w-11 h-11 rounded-xl bg-gradient-to-br {fmt.color} bg-opacity-10 flex items-center justify-center shrink-0" style="background: linear-gradient(135deg, rgba(255,107,0,0.1), rgba(245,158,11,0.1))">
              <fmt.icon class="w-5 h-5 text-orange-400" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-white group-hover:text-orange-300 transition-colors">{fmt.label}</p>
              <p class="text-[11px] text-slate-500">{fmt.desc}</p>
            </div>
            {#if exporting === fmt.id}
              <Spinner size="sm" />
            {:else}
              <span class="text-[10px] font-mono text-slate-600">{fmt.ext}</span>
            {/if}
          </button>
        {/each}
      </div>
    </div>
  </div>
{/if}
