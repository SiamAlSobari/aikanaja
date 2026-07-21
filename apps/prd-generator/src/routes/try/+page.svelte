<script lang="ts">
  import { onMount } from 'svelte';
  import { marked } from 'marked';
  import { prdApi } from '$lib/api/prd';
  import { ui } from '$lib/stores/ui.store';
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Textarea from '$lib/components/ui/Textarea.svelte';
  import Select from '$lib/components/ui/Select.svelte';
  import Spinner from '$lib/components/ui/Spinner.svelte';

  let markdown = $state('');
  let isGenerating = $state(false);
  let title = $state('');
  let description = $state('');
  let targetUser = $state('');
  let techStack = $state('');
  let templateType = $state<'saas' | 'ecommerce' | 'mobile' | 'api' | 'custom'>('saas');
  let step = $state(1);
  let controller: AbortController | null = null;

  const STORAGE_KEY = 'prd_guest_draft';

  const templateOptions = [
    { value: 'saas', label: 'SaaS B2B' },
    { value: 'ecommerce', label: 'E-Commerce Platform' },
    { value: 'mobile', label: 'Mobile App MVP' },
    { value: 'api', label: 'API Service' },
    { value: 'custom', label: 'Custom' },
  ];

  onMount(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        markdown = data.markdown ?? '';
        title = data.title ?? '';
        description = data.description ?? '';
        targetUser = data.targetUser ?? '';
        techStack = data.techStack ?? '';
        templateType = data.templateType ?? 'saas';
        if (markdown) step = 3;
      } catch {
        // ignore
      }
    }
  });

  function saveDraft() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ markdown, title, description, targetUser, techStack, templateType })
    );
  }

  async function generate() {
    if (!title.trim()) {
      ui.addToast('Judul wajib diisi', 'warning');
      return;
    }

    isGenerating = true;
    markdown = '';
    controller = new AbortController();

    try {
      await prdApi.generate(
        { title, description, templateType, targetUser, techStack },
        (chunk) => {
          markdown += chunk;
          saveDraft();
        },
        controller.signal
      );
      step = 3;
      saveDraft();
      ui.addToast('PRD berhasil digenerate!', 'success');
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        ui.addToast(`Gagal generate: ${err.message}`, 'error');
      }
    } finally {
      isGenerating = false;
      controller = null;
    }
  }

  function cancelGenerate() {
    controller?.abort();
    isGenerating = false;
  }

  function resetDraft() {
    if (confirm('Yakin ingin mereset draft? Semua perubahan akan hilang.')) {
      markdown = '';
      title = '';
      description = '';
      targetUser = '';
      techStack = '';
      templateType = 'saas';
      step = 1;
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  function renderMarkdown(md: string): string {
    return marked.parse(md) as string;
  }
</script>

<svelte:head>
  <title>Try PRD Generator | AiKanAja</title>
</svelte:head>

<div class="min-h-screen bg-base-200">
  <header class="bg-base-100 border-b border-base-300 sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
      <a href="/" class="text-xl font-bold text-primary">AiKanAja</a>
      <div class="flex items-center gap-2">
        <span class="badge badge-warning badge-sm">Guest Mode</span>
        <Button variant="primary" size="sm" onclick={() => (window.location.href = '/auth/login')}>
          Save to Account
        </Button>
      </div>
    </div>
  </header>

  <div class="bg-warning/10 border-b border-warning/20">
    <div class="max-w-7xl mx-auto px-4 py-2 text-center text-sm">
      Draft tersimpan di browser Anda. <strong>Login</strong> untuk menyimpan ke cloud secara permanen.
    </div>
  </div>

  <div class="max-w-7xl mx-auto px-4 py-6">
    {#if step === 1 || step === 2}
      <div class="max-w-2xl mx-auto">
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title text-2xl mb-4">
              {step === 1 ? 'Langkah 1: Detail Proyek' : 'Langkah 2: Target & Tech Stack'}
            </h2>

            {#if step === 1}
              <Input
                label="Judul Proyek *"
                placeholder="Contoh: Sistem Manajemen Inventaris"
                bind:value={title}
              />
              <Textarea
                label="Deskripsi Singkat"
                placeholder="Jelaskan visi dan tujuan produk Anda..."
                rows={3}
                bind:value={description}
              />
              <Select
                label="Template Type"
                options={templateOptions}
                bind:value={templateType}
              />
            {:else}
              <Textarea
                label="Target User *"
                placeholder="Siapa pengguna utama produk ini? (contoh: Admin gudang, End customer B2C)"
                rows={2}
                bind:value={targetUser}
              />
              <Textarea
                label="Tech Stack (opsional)"
                placeholder="Contoh: SvelteKit, Bun, PostgreSQL, Redis"
                rows={2}
                bind:value={techStack}
              />
            {/if}

            <div class="flex justify-between mt-4">
              {#if step === 2}
                <Button variant="ghost" onclick={() => (step = 1)}>Kembali</Button>
              {:else}
                <div></div>
              {/if}
              {#if step === 1}
                <Button
                  variant="primary"
                  onclick={() => {
                    if (title.trim()) step = 2;
                    else ui.addToast('Judul wajib diisi', 'warning');
                  }}
                >
                  Selanjutnya
                </Button>
              {:else}
                <Button
                  variant="primary"
                  loading={isGenerating}
                  onclick={generate}
                >
                  Generate PRD
                </Button>
              {/if}
            </div>
          </div>
        </div>
      </div>

    {:else}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <div class="flex items-center justify-between mb-4">
              <h2 class="card-title">PRD Preview</h2>
              <div class="flex gap-2">
                <Button variant="ghost" size="sm" onclick={() => (step = 1)}>
                  Edit Input
                </Button>
                <Button variant="ghost" size="sm" onclick={resetDraft}>
                  Reset
                </Button>
              </div>
            </div>
            <div class="prose prose-sm max-w-none">
              {@html renderMarkdown(markdown)}
            </div>
            {#if isGenerating}
              <div class="flex items-center gap-2 mt-4 text-primary">
                <Spinner size="sm" />
                <span>Generating PRD...</span>
                <Button variant="error" size="xs" onclick={cancelGenerate}>
                  Cancel
                </Button>
              </div>
            {/if}
          </div>
        </div>

        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title mb-4">Markdown Source</h2>
            <textarea
              class="textarea textarea-bordered w-full h-[600px] font-mono text-sm"
              bind:value={markdown}
              oninput={saveDraft}
              placeholder="Markdown PRD akan muncul di sini..."
              disabled={isGenerating}
            ></textarea>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
