<script lang="ts">
  import { onMount } from 'svelte';
  
  // Define interface for User
  interface User {
    email: string;
    uid: string;
    displayName?: string;
    photoURL?: string;
  }
  
  let user: User | null = null;
  
  onMount(async () => {
    try {
      const res = await fetch('/api/auth/verify');
      const data = await res.json();
      if (data.authenticated) {
        user = data.user as User;
      }
    } catch (error) {
      console.error('Error verifying authentication:', error);
    }
  });
</script>

<svelte:head>
  <title>NMCore Admin</title>
</svelte:head>

<div class="bg-white p-8 rounded-lg shadow-md">
  <h1 class="text-2xl font-bold mb-6 text-center">NMCore Admin Dashboard</h1>
  
  <div class="mb-6">
    {#if user}
      <div class="text-center">
        <p class="font-medium">{user.email}</p>
        <p class="text-gray-600 text-sm">User ID: {user.uid}</p>
      </div>
    {:else}
      <p class="text-center text-gray-600">Loading user information...</p>
    {/if}
  </div>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <a href="/admin/products" class="block bg-gray-50 hover:bg-gray-100 p-4 rounded-lg border border-gray-200">
      <h3 class="font-medium text-lg">Products</h3>
      <p class="text-gray-600">Manage product catalog</p>
    </a>
    <a href="/admin/users" class="block bg-gray-50 hover:bg-gray-100 p-4 rounded-lg border border-gray-200">
      <h3 class="font-medium text-lg">Users</h3>
      <p class="text-gray-600">Manage system users</p>
    </a>
    <a href="/admin/email-logs" class="block bg-gray-50 hover:bg-gray-100 p-4 rounded-lg border border-gray-200">
      <h3 class="font-medium text-lg">Email Logs</h3>
      <p class="text-gray-600">Monitor and resend emails</p>
    </a>
    <a href="/admin/settings" class="block bg-gray-50 hover:bg-gray-100 p-4 rounded-lg border border-gray-200">
      <h3 class="font-medium text-lg">Settings</h3>
      <p class="text-gray-600">System configuration</p>
    </a>
  </div>
</div>