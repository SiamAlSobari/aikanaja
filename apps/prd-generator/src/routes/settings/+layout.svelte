<script lang="ts">
  import { page } from '$app/state';
  import { ArrowLeft, User, Shield, Key, Palette, CreditCard, Bell } from 'lucide-svelte';

  let { children } = $props();

  const navItems = [
    { href: '/settings/profile', label: 'Profile', icon: User },
    { href: '/settings/account', label: 'Account', icon: Shield },
    { href: '/settings/api-keys', label: 'API Keys', icon: Key },
    { href: '/settings/appearance', label: 'Appearance', icon: Palette },
    { href: '/settings/billing', label: 'Billing', icon: CreditCard },
    { href: '/settings/notifications', label: 'Notifications', icon: Bell },
  ];

  function isActive(href: string): boolean {
    return String(page.url.pathname) === href;
  }
</script>

<div class="min-h-screen bg-[#030712]">
  <!-- Top bar -->
  <header class="sticky top-0 z-20 h-14 border-b border-white/[0.06] bg-[#030712]/80 backdrop-blur-xl flex items-center px-6">
    <a href="/dashboard" class="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.04] transition-colors mr-3">
      <ArrowLeft class="w-4 h-4" />
    </a>
    <h1 class="text-sm font-bold text-white">Settings</h1>
  </header>

  <div class="max-w-5xl mx-auto px-6 py-8 flex gap-8">
    <!-- Sidebar Nav -->
    <nav class="w-44 shrink-0 space-y-0.5">
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

    <!-- Content -->
    <div class="flex-1 min-w-0">
      {@render children()}
    </div>
  </div>
</div>
