<script lang="ts">
  import { page } from '$app/state';
  import { FileText, LayoutDashboard, FolderOpen, LayoutTemplate, Activity, Trash2, Settings, LogOut, ChevronRight, Menu, X } from 'lucide-svelte';
  import { auth } from '$lib/stores/auth.store';

  let { children } = $props();
  let sidebarOpen = $state(true);
  let mobileOpen = $state(false);

  const navItems = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/projects', label: 'Proyek PRD', icon: FolderOpen },
    { href: '/dashboard/templates', label: 'Template', icon: LayoutTemplate },
    { href: '/dashboard/activity', label: 'Aktivitas', icon: Activity },
    { href: '/dashboard/trash', label: 'Sampah', icon: Trash2 },
  ];

  function isActive(href: string): boolean {
    const path = String(page.url.pathname);
    if (href === '/dashboard') return path === '/dashboard';
    return path.startsWith(href);
  }
</script>

<div class="min-h-screen bg-[#030712] flex">
  <!-- Sidebar Desktop -->
  <aside
    class="hidden lg:flex flex-col fixed inset-y-0 left-0 z-30 transition-all duration-300"
    class:w-64={sidebarOpen}
    class:w-20={!sidebarOpen}
  >
    <div class="flex flex-col h-full border-r border-white/[0.06] bg-[#060a12]">
      <!-- Brand -->
      <div class="flex items-center gap-3 px-5 h-16 border-b border-white/[0.06]">
        <a href="/" class="flex items-center gap-3 group">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 p-[1px] shrink-0">
            <div class="w-full h-full bg-[#060a12] rounded-[11px] flex items-center justify-center text-orange-400">
              <FileText class="w-4 h-4" />
            </div>
          </div>
          {#if sidebarOpen}
            <div class="flex flex-col min-w-0">
              <span class="font-extrabold text-sm text-white tracking-tight leading-none truncate">
                AiKanAja <span class="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">PRD</span>
              </span>
              <span class="text-[9px] text-slate-500 font-mono tracking-widest uppercase mt-0.5">Dashboard</span>
            </div>
          {/if}
        </a>
      </div>

      <!-- Nav -->
      <nav class="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {#each navItems as item}
          <a
            href={item.href}
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
              {isActive(item.href)
                ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] border border-transparent'}"
          >
            <item.icon class="w-5 h-5 shrink-0" />
            {#if sidebarOpen}
              <span class="truncate">{item.label}</span>
            {/if}
          </a>
        {/each}
      </nav>

      <!-- Footer -->
      <div class="px-3 py-4 border-t border-white/[0.06] space-y-1">
        <button
          onclick={() => sidebarOpen = !sidebarOpen}
          class="hidden lg:flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:text-slate-300 hover:bg-white/[0.03] transition-all"
        >
          <span class="transition-transform duration-300" class:rotate-180={sidebarOpen}><ChevronRight class="w-5 h-5 shrink-0" /></span>
          {#if sidebarOpen}
            <span>Collapse</span>
          {/if}
        </button>
        <a
          href="/settings"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:text-slate-300 hover:bg-white/[0.03] transition-all"
        >
          <Settings class="w-5 h-5 shrink-0" />
          {#if sidebarOpen}
            <span>Settings</span>
          {/if}
        </a>
      </div>
    </div>
  </aside>

  <!-- Mobile Sidebar Overlay -->
  {#if mobileOpen}
    <div
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
      onclick={() => mobileOpen = false}
      role="presentation"
    ></div>
  {/if}

  <!-- Mobile Sidebar -->
  <aside
    class="fixed inset-y-0 left-0 z-50 w-72 bg-[#060a12] border-r border-white/[0.06] transform transition-transform duration-300 lg:hidden"
    class:translate-x-0={mobileOpen}
    class:-translate-x-full={!mobileOpen}
  >
    <div class="flex items-center justify-between px-5 h-16 border-b border-white/[0.06]">
      <a href="/" class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 p-[1px]">
          <div class="w-full h-full bg-[#060a12] rounded-[11px] flex items-center justify-center text-orange-400">
            <FileText class="w-4 h-4" />
          </div>
        </div>
        <span class="font-extrabold text-sm text-white">AiKanAja <span class="text-orange-400">PRD</span></span>
      </a>
      <button onclick={() => mobileOpen = false} class="text-slate-400 hover:text-white">
        <X class="w-5 h-5" />
      </button>
    </div>
    <nav class="py-4 px-3 space-y-1">
      {#each navItems as item}
        <a
          href={item.href}
          onclick={() => mobileOpen = false}
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
            {isActive(item.href)
              ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] border border-transparent'}"
        >
          <item.icon class="w-5 h-5 shrink-0" />
          <span>{item.label}</span>
        </a>
      {/each}
    </nav>
  </aside>

  <!-- Main Content -->
  <div
    class="flex-1 flex flex-col min-h-screen transition-all duration-300"
    class:lg:ml-64={sidebarOpen}
    class:lg:ml-20={!sidebarOpen}
  >
    <!-- Top Header -->
    <header class="sticky top-0 z-20 h-16 border-b border-white/[0.06] bg-[#030712]/80 backdrop-blur-xl flex items-center justify-between px-6">
      <div class="flex items-center gap-4">
        <button
          onclick={() => mobileOpen = true}
          class="lg:hidden p-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-slate-300"
        >
          <Menu class="w-5 h-5" />
        </button>
        <div>
          <h1 class="text-sm font-bold text-white">
            {#if String(page.url.pathname) === '/dashboard'}
              Overview
            {:else if String(page.url.pathname).includes('/projects')}
              Proyek PRD
            {:else if String(page.url.pathname).includes('/templates')}
              Template
            {:else if String(page.url.pathname).includes('/activity')}
              Aktivitas
            {:else if String(page.url.pathname).includes('/trash')}
              Sampah
            {:else}
              Dashboard
            {/if}
          </h1>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <a
          href="/try"
          class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.04] border border-white/[0.06] transition-all hidden sm:flex"
        >
          + New PRD
        </a>
        <button class="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white text-xs font-black">
          A
        </button>
      </div>
    </header>

    <!-- Page Content -->
    <main class="flex-1 p-6">
      {@render children()}
    </main>
  </div>
</div>
