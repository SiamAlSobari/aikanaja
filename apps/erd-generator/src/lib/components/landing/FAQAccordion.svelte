<script lang="ts">
	import { HelpCircle, ChevronDown } from 'lucide-svelte';
	import { slide } from 'svelte/transition';

	let activeFaq = $state<number | null>(null);

	const faqs = [
		{
			q: 'Bagaimana AI SchemaFlow mengenali relasi database?',
			a: 'AI kami dilatih untuk memindai deskripsi teks dan mencari entitas yang memiliki hubungan logis (misal: "setiap User dapat memiliki banyak Order"). Hubungan tersebut secara otomatis diterjemahkan menjadi foreign key dan index pada tingkat database SQL/Prisma.'
		},
		{
			q: 'Apakah skema database saya aman dan bersifat privat?',
			a: 'Sangat aman. Skema database yang Anda buat hanya disimpan di dalam server pribadi Anda yang terautentikasi. Jika Anda menggunakan API Key sendiri, pemrosesan dilakukan langsung melalui browser dan token AI Anda dikirim secara aman, disimpan hanya pada browser Anda (localStorage).'
		},
		{
			q: 'Bagaimana cara kerja Custom API Keys di aplikasi ini?',
			a: 'Anda cukup pergi ke menu Settings -> API Keys dan menempelkan kunci OpenAI/Gemini Anda. Saat kunci terpasang, backend SchemaFlow akan memproses generate ERD menggunakan kuota token Anda sendiri. Hal ini menghilangkan batasan kuota gratis kami sepenuhnya.'
		},
		{
			q: 'Format database apa saja yang didukung untuk ekspor skema?',
			a: 'Saat ini kami mendukung sintaks SQL DDL standar industri untuk PostgreSQL, MySQL, SQLite, file skema Prisma ORM, serta interface TypeScript untuk model entity di sisi kode aplikasi Anda.'
		}
	];

	function toggleFaq(index: number) {
		activeFaq = activeFaq === index ? null : index;
	}
</script>

<section id="faq" class="relative z-10 py-24">
	<!-- Top border gradient -->
	<div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>

	<div class="max-w-4xl mx-auto px-6">
		<div class="text-center max-w-2xl mx-auto mb-16 space-y-4">
			<h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center justify-center gap-3">
				<div class="w-10 h-10 rounded-xl bg-orange-600/10 border border-orange-600/20 flex items-center justify-center">
					<HelpCircle class="w-5 h-5 text-orange-500" />
				</div>
				Pertanyaan Umum
			</h2>
			<p class="text-slate-400">
				Jawaban cepat atas keraguan Anda mengenai privasi, kuota token, dan dukungan database.
			</p>
		</div>

		<div class="space-y-3">
			{#each faqs as faq, i (faq.q)}
				<div
					class="rounded-2xl overflow-hidden transition-all duration-300 {activeFaq === i
						? 'bg-slate-900/60 border border-orange-600/20 shadow-lg shadow-orange-600/5'
						: 'bg-slate-900/20 border border-slate-800/60 hover:border-slate-700'}"
				>
					<button
						onclick={() => toggleFaq(i)}
						class="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none group"
					>
						<span class="text-sm font-semibold {activeFaq === i ? 'text-orange-400' : 'text-white group-hover:text-orange-400'} transition-colors">
							{faq.q}
						</span>
						<ChevronDown
							class="w-5 h-5 shrink-0 transition-all duration-300 {activeFaq === i
								? 'rotate-180 text-orange-500'
								: 'text-slate-600'}"
						/>
					</button>

					{#if activeFaq === i}
						<div
							transition:slide={{ duration: 250 }}
							class="px-6 pb-5 text-sm text-slate-400 leading-relaxed border-t border-slate-800/50 pt-4"
						>
							{faq.a}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</section>
