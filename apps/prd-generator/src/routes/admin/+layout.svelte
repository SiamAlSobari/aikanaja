<script lang="ts">
  import { page } from '$app/state';
  import { Shield, Users, FolderOpen, CreditCard, ArrowLeft, LayoutDashboard } from 'lucide-svelte';

  let { children } = $props();

  const navItems = [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/projects', label: 'Projects', icon: FolderOpen },
    { href: '/admin/payments', label: 'Payments', icon: CreditCard },
  ];

  function isActive(href: string): boolean {
    const path = String(page.url.pathname);
    if (href === '/admin') return path === '/admin';
    return path.startsWith(href);
  }
</script>

<div class="min-h-screen bg-[#030712] flex">
  <!-- Sidebar -->
  <aside class="hidden lg:flex flex-col fixed inset-y-0 left-0 w-56 z-30 border-r border-white/[0.06] bg-[#060a12]">
    <div class="flex items-center gap-2.5 px-4 h-14 border-b border-white/[0.06]">
      <a href="/dashboard" class="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.04] transition-colors">
        <ArrowLeft class="w-4 h-4" />
      </a>
      <div class="flex items-center gap-2">
        <Shield class="w-4 h-4 text-orange-400" />
        <span class="text-xs font-bold text-white">Admin Panel</span>
      </div>
    </div>

    <nav class="flex-1 py-3 px-2.5 space-y-0.5">
      {#each navItems as item}
        <a
          href={item.href}
          class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all
            {isActive(item.href)
              ? 'bg-orange-500/10 text-orange-400 border border-orange-500/15'
              : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.03] border border-transparent'}"
        >
          <item.icon class="w-4 h-4 shrink-0" />
          <span>{item.label}</span>
        </a>
      {/each}
    </nav>
  </aside>

  <!-- Main -->
  <div class="flex-1 lg:ml-56">
    <header class="sticky top-0 z-20 h-14 border-b border-white/[0.06] bg-[#030712]/80 backdrop-blur-xl flex items-center px-6">
      <h1 class="text-sm font-bold text-white">Admin Dashboard</h1>
    </header>
    <main class="p-6">
      {@render children()}
    </main>
  </div>
</div>
