<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { onMount } from 'svelte';

  // Add type definition for user
  interface User {
    email: string;
    uid: string;
    // Add other properties your user object might have
  }
  
  let user: User | null = null;
  let loading: boolean = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      const response = await fetch('/api/auth/verify');
      const data = await response.json();
      
      if (!data.authenticated) {
        const currentPath = page.url.pathname;
        goto(`/login?redirectTo=${encodeURIComponent(currentPath)}`);
        return;
      }
      
      user = data.user;
    } catch (err) {
      error = 'Error verifying authentication';
      console.error(error, err);
    } finally {
      loading = false;
    }
  });

  async function handleLogout() {
    try {
      await fetch('/api/logout', { method: 'POST' });
      goto('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  }
</script>

{#if loading}
  <div class="min-h-screen flex items-center justify-center">
    <p class="text-gray-500">Loading...</p>
  </div>
{:else if error}
  <div class="min-h-screen flex items-center justify-center">
    <p class="text-red-500">{error}</p>
  </div>
{:else if user}
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 class="text-xl font-semibold">NMCore Admin</h1>
        {#if user}
          <div class="flex items-center gap-4">
            <span class="text-gray-600">{user.email}</span>
            <button on:click={handleLogout} class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">
              Logout
            </button>
          </div>
        {/if}
      </div>
    </header>
    
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>
  </div>
{/if}