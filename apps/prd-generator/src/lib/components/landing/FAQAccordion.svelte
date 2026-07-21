<script lang="ts">
  import { slide } from 'svelte/transition';

  const faqs = [
    {
      q: 'Apa itu AiKanAja PRD Generator?',
      a: 'Platform AI-powered yang membantu Product Manager, System Architect, dan Developer menyusun PRD komprehensif secara otomatis melalui AI-Guided PRD Wizard & Live Editor.',
    },
    {
      q: 'Apakah saya perlu login untuk mencoba?',
      a: 'Tidak! Anda bisa mencoba langsung di halaman /try tanpa login. Draft tersimpan di browser Anda. Login diperlukan untuk menyimpan ke cloud dan mengakses fitur lengkap.',
    },
    {
      q: 'AI Provider apa yang digunakan?',
      a: 'Kami menggunakan Google Gemini 2.0 Flash sebagai provider utama dan Groq Llama 3.3 70B sebagai fallback. Anda juga bisa menggunakan API Key sendiri.',
    },
    {
      q: 'Apakah API Key saya aman?',
      a: 'Ya! API Key hanya disimpan di localStorage browser Anda dan tidak pernah dikirim ke server kami. Ini adalah Zero-Persistence security policy kami.',
    },
    {
      q: 'Format export apa saja yang didukung?',
      a: 'Markdown (.md), PDF, JSON Spec, dan AI Coding Agent Prompt (AGENTS.md / PROMPT.md) untuk Cursor, Claude Code, dan Antigravity.',
    },
  ];

  let openIndex = $state<number | null>(null);

  function toggle(index: number) {
    openIndex = openIndex === index ? null : index;
  }
</script>

<section class="py-20 px-4">
  <div class="max-w-3xl mx-auto">
    <h2 class="text-3xl font-bold text-center mb-12">Pertanyaan Umum</h2>

    <div class="space-y-3">
      {#each faqs as faq, i}
        <div class="collapse collapse-plus bg-base-200/50 border border-base-300/50">
          <button
            class="collapse-title text-left font-medium"
            onclick={() => toggle(i)}
          >
            {faq.q}
          </button>
          {#if openIndex === i}
            <div class="collapse-content" transition:slide={{ duration: 200 }}>
              <p class="text-base-content/70">{faq.a}</p>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</section>
