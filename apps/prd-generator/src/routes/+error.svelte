<script lang="ts">
  import { page } from '$app/state';
</script>

<div class="min-h-screen flex items-center justify-center bg-base-100">
  <div class="text-center">
    <h1 class="text-6xl font-bold text-error mb-4">{page.status}</h1>
    <p class="text-xl text-base-content/70 mb-8">{page.error?.message || 'Terjadi kesalahan'}</p>
    <a href="/" class="btn btn-primary">Kembali ke Beranda</a>
  </div>
</div>
