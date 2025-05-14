<script lang="ts">
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
// Import page from app/state in Svelte 5
  import { page } from '$app/state';
  import { onMount } from 'svelte';
// Import auth from centralized Firebase setup
  import { auth } from '$lib/firebase';
  import { signInWithEmailAndPassword } from 'firebase/auth';
  
  // Use regular variables instead of reactive declarations
  let email = '';
  let password = '';
  let error = '';
  let loading = false;
  let redirectTo = '/';
  
  onMount(() => {
    // Get the redirect URL from query string - using Svelte 5 state pattern
    if (browser && page.url.searchParams.has('redirectTo')) {
      redirectTo = page.url.searchParams.get('redirectTo') || '/';
    }
  });
  
  async function handleLogin() {
    error = '';
    loading = true;
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      // After successful login, get the ID token
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        
        // Send the token to your backend to create a session cookie
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });
        
        if (response.ok) {
          // Redirect to the original destination
          goto(redirectTo);
        } else {
          const data = await response.json();
          error = data.message || 'Failed to create session';
        }
      }
    } catch (err) {
      error = err instanceof Error ? err.message : 'Login failed';
    } finally {
      loading = false;
    }
  }
</script>

<div class="flex justify-center items-center min-h-screen bg-gray-100">
  <div class="bg-white p-8 rounded shadow-md w-full max-w-md">
    <h1 class="text-2xl font-bold mb-6">Admin Login</h1>
    
    {#if error}
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    {/if}
    
    <form on:submit|preventDefault={handleLogin}>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
          Email
        </label>
        <input 
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="email"
          type="email"
          placeholder="Email"
          bind:value={email}
          required
        />
      </div>
      
      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
          Password
        </label>
        <input 
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          id="password"
          type="password"
          placeholder="******************"
          bind:value={password}
          required
        />
      </div>
      
      <div class="flex items-center justify-between">
        <button 
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Sign In'}
        </button>
      </div>
    </form>
  </div>
</div>