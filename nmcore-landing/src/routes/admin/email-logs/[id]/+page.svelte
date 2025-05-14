<script lang="ts">
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  
  // Define the EmailLog interface to match your Firestore structure
  interface EmailLog {
    id: string;
    to: string;
    from: string;
    subject: string;
    html: string;
    status: 'sent' | 'pending' | 'failed';
    orderId: string;
    createdAt: { seconds: number; nanoseconds: number } | Date;
    sentAt?: { seconds: number; nanoseconds: number } | Date;
    attempts: number;
    errorMessage?: string;
    errorDetails?: string;
    componentType?: string;
    props?: Record<string, any>;
    bcc?: string;
  }
  
  let log: EmailLog | null = null;
  let loading: boolean = true;
  let error: string | null = null;
  
  // Get the log ID from the URL parameter
  const id: string = page.params.id;
  
  onMount(async () => {
    try {
      const response = await fetch(`/api/email-logs/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch email log: ${response.statusText}`);
      }
      log = await response.json();
    } catch (err: any) {
      error = `Error loading email log: ${err.message}`;
      console.error(error);
    } finally {
      loading = false;
    }
  });
  
    // Update this function in your email log detail page
    async function resendEmail(): Promise<void> {
    if (!log) return;
    
    try {
        const response = await fetch(`/api/email-logs/${log.id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'resend' })
        });
        
        if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to resend');
        }
        
        const result = await response.json();
        
        // Update the log status in the UI
        log = { ...log, status: 'pending' as const, attempts: log.attempts + 1 };
        
        alert('Email queued for resending');
    } catch (err: any) {
        alert(`Error resending email: ${err.message}`);
    }
    }
  
  // Format date
  function formatDate(timestamp: any): string {
    if (!timestamp) return 'N/A';
    
    // If timestamp is a Firebase Timestamp object
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleString();
    }
    
    // If timestamp is a Date object or ISO string
    return new Date(timestamp).toLocaleString();
  }
  
  // Status badge color
  function getStatusColor(status: string): string {
    switch(status) {
      case 'sent': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
</script>

<svelte:head>
  <title>Email Log Details</title>
</svelte:head>

<div class="bg-white p-6 rounded-lg shadow-md">
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-2xl font-bold">Email Log Details</h1>
    <div>
      <a href="/admin/email-logs" class="text-blue-500 hover:underline mr-4">← Back to Logs</a>
      {#if log && log.status === 'failed'}
        <button 
          on:click={resendEmail} 
          class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md">
          Resend Email
        </button>
      {/if}
    </div>
  </div>
  
  {#if loading}
    <div class="text-center py-8">
      <p class="text-gray-500">Loading email log...</p>
    </div>
  {:else if error}
    <div class="text-center py-8">
      <p class="text-red-500">{error}</p>
    </div>
  {:else if log}
    <div class="bg-gray-50 p-6 rounded-lg mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p class="text-sm font-medium text-gray-500">To</p>
          <p class="mt-1">{log.to}</p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500">From</p>
          <p class="mt-1">{log.from}</p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500">Subject</p>
          <p class="mt-1">{log.subject}</p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500">Order ID</p>
          <p class="mt-1">{log.orderId}</p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500">Created At</p>
          <p class="mt-1">{formatDate(log.createdAt)}</p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500">Status</p>
          <p class="mt-1">
            <span class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
              {log.status}
            </span>
          </p>
        </div>
        {#if log.sentAt}
          <div>
            <p class="text-sm font-medium text-gray-500">Sent At</p>
            <p class="mt-1">{formatDate(log.sentAt)}</p>
          </div>
        {/if}
        <div>
          <p class="text-sm font-medium text-gray-500">Attempts</p>
          <p class="mt-1">{log.attempts}</p>
        </div>
      </div>
      
      {#if log.errorMessage}
        <div class="mt-6">
          <p class="text-sm font-medium text-gray-500">Error Message</p>
          <p class="mt-1 text-red-500">{log.errorMessage}</p>
        </div>
      {/if}
      
      {#if log.errorDetails}
        <div class="mt-6">
          <p class="text-sm font-medium text-gray-500">Error Details</p>
          <pre class="mt-1 text-red-500 text-sm bg-gray-100 p-2 rounded whitespace-pre-wrap">{log.errorDetails}</pre>
        </div>
      {/if}
    </div>
    
    <!-- Email Content Preview -->
    <div class="mt-8">
      <h2 class="text-lg font-medium mb-4">Email Content</h2>
      <div class="border rounded-lg overflow-hidden">
        <div class="bg-gray-50 px-4 py-2 border-b">
          <p class="font-medium">HTML Content</p>
        </div>
        <div class="p-4 max-h-[500px] overflow-auto">
          {#if log.html}
            <div class="prose max-w-none">
              <!-- Safe HTML rendering using Svelte's {@html} directive -->
              {@html log.html}
            </div>
          {:else}
            <p class="text-gray-500 italic">No content available</p>
          {/if}
        </div>
      </div>
    </div>
    
    <!-- Component Props -->
    {#if log.props && Object.keys(log.props).length > 0}
      <div class="mt-8">
        <h2 class="text-lg font-medium mb-4">Email Component Props</h2>
        <div class="bg-gray-50 p-4 rounded-lg">
          <pre class="text-sm overflow-auto">{JSON.stringify(log.props, null, 2)}</pre>
        </div>
      </div>
    {/if}
  {:else}
    <div class="text-center py-8">
      <p class="text-gray-500">Email log not found</p>
    </div>
  {/if}
</div>