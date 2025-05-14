// filepath: /Users/hfox/Developments/nmcore/nmcore-landing/src/lib/components/LogoutButton.svelte
<script lang="ts">
  import { goto } from '$app/navigation';
  import { auth } from '$lib/firebase';
  import { signOut } from 'firebase/auth';
  
  let loading = false;
  
  async function handleLogout() {
    loading = true;
    try {
      // Sign out from Firebase
      await signOut(auth);
      
      // Clear the session cookie
      await fetch('/api/logout', { method: 'POST' });
      
      // Redirect to home or login page
      goto('/');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      loading = false;
    }
  }
</script>

<button 
  on:click={handleLogout} 
  disabled={loading}
  class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
>
  {loading ? 'Signing out...' : 'Sign out'}
</button>