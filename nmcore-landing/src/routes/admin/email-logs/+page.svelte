<script lang="ts">
  import { onMount } from 'svelte';
  
  // Define the EmailLog type to match your Firestore structure
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
  
  let logs: EmailLog[] = [];
  let loading: boolean = true;
  let error: string | null = null;
  let statusFilter: string = 'all';
  let openDropdownId: string | null = null;
 
  // Add this function to toggle dropdown visibility
  function toggleDropdown(id: string, event: MouseEvent) {
    event.stopPropagation(); // Prevent document click from immediately closing it
    openDropdownId = openDropdownId === id ? null : id;
  }
  
  // Add this function to close all dropdowns
  function closeDropdowns() {
    openDropdownId = null;
  }
  
  // Add this onMount to handle document clicks
  onMount(() => {
    const handleDocumentClick = () => {
      closeDropdowns();
    };
    
    document.addEventListener('click', handleDocumentClick);
    
    // Clean up the event listener when component is destroyed
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  });

  // Load email logs
  onMount(async () => {
    try {
      const response = await fetch('/api/email-logs');
      if (!response.ok) {
        throw new Error(`Failed to fetch logs: ${response.statusText}`);
      }
      logs = await response.json();
    } catch (err: any) {
      error = `Error loading email logs: ${err.message}`;
      console.error(error);
    } finally {
      loading = false;
    }
  });

  async function updateEmailStatus(id: string, newStatus: 'sent' | 'pending' | 'failed'): Promise<void> {
    try {
      const response = await fetch(`/api/email-logs/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      
      // Update the log status in the UI without refreshing
      logs = logs.map(log => 
        log.id === id ? { ...log, status: newStatus } : log
      );
      
    } catch (error: any) {
      console.error('Error updating status:', error);
      alert('Failed to update status: ' + error.message);
    }
  }

  // Function to resend an email
  async function resendEmail(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/email-logs/${id}/resend`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to resend: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      // Update the log status in the UI
      logs = logs.map(log => 
        log.id === id ? { ...log, status: 'pending', attempts: log.attempts + 1 } : log
      );
      
      alert('Email queued for resending');
    } catch (err: any) {
      alert(`Error resending email: ${err.message}`);
    }
  }
  
  // Filter logs by status
  $: filteredLogs = statusFilter === 'all' 
    ? logs 
    : logs.filter(log => log.status === statusFilter);
    
    // Improved format date function
    function formatDate(timestamp: any): string {
      if (!timestamp) return 'N/A';
      
      try {
        // If timestamp is a Firebase Timestamp object
        if (timestamp.seconds !== undefined && timestamp.nanoseconds !== undefined) {
          return new Date(timestamp.seconds * 1000).toLocaleString();
        }
        
        // If timestamp is a Date object
        if (timestamp instanceof Date) {
          return timestamp.toLocaleString();
        }
        
        // If timestamp is an ISO string or other format
        const date = new Date(timestamp);
        if (!isNaN(date.getTime())) {
          return date.toLocaleString();
        }
        
        // If we get here, we couldn't parse the date
        console.warn('Unparseable date format:', timestamp);
        return 'Invalid Date';
      } catch (err) {
        console.error('Error formatting date:', err, timestamp);
        return 'Error';
      }
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
  <title>NMCore Admin - Email Logs</title>
</svelte:head>

<!-- Rest of your HTML stays the same -->
<div class="bg-white p-6 rounded-lg shadow-md">
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-2xl font-bold">Email Logs</h1>
    <a href="/admin" class="text-blue-500 hover:underline">← Back to Dashboard</a>
  </div>
  
  <!-- Update the filter dropdown styling -->
  <div class="mb-6 flex gap-4 items-center">
    <label for="statusFilter" class="text-sm font-medium text-gray-700">Filter by status:</label>
    <select 
      id="statusFilter"
      bind:value={statusFilter}
      class="border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
      <option value="all">All</option>
      <option value="sent">Sent</option>
      <option value="pending">Pending</option>
      <option value="failed">Failed</option>
    </select>
  </div>
  
  {#if loading}
    <div class="text-center py-8">
      <p class="text-gray-500">Loading email logs...</p>
    </div>
  {:else if error}
    <div class="text-center py-8">
      <p class="text-red-500">{error}</p>
    </div>
  {:else if filteredLogs.length === 0}
    <div class="text-center py-8">
      <p class="text-gray-500">No email logs found</p>
    </div>
  {:else}
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each filteredLogs as log}
            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">{log.to}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <a href={`/admin/email-logs/${log.id}`} class="text-blue-500 hover:underline">
                  {log.subject}
                </a>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">{log.orderId}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                  {log.status}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">{formatDate(log.createdAt)}</td>
              
              <!-- In your table, update the Actions column: -->
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <a href={`/admin/email-logs/${log.id}`} class="text-blue-500 hover:underline mr-4">
                  View
                </a>
                
                <div class="inline-block relative">
                  <button 
                    class="text-gray-600 hover:text-gray-800"
                    on:click={(e) => toggleDropdown(log.id, e)}>
                    Update Status ▼
                  </button>
                  
                  <div class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                      class:hidden={openDropdownId !== log.id}
                      role="menu" aria-orientation="vertical">
                    <div class="py-1" role="none">
                      <button on:click={() => updateEmailStatus(log.id, 'sent')}
                              class="block w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-100">
                        Mark as Sent
                      </button>
                      <button on:click={() => updateEmailStatus(log.id, 'pending')}
                              class="block w-full text-left px-4 py-2 text-sm text-yellow-700 hover:bg-yellow-100">
                        Mark as Pending
                      </button>
                      <button on:click={() => updateEmailStatus(log.id, 'failed')}
                              class="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-100">
                        Mark as Failed
                      </button>
                    </div>
                  </div>
                </div>
                
                {#if log.status === 'failed'}
                  <button 
                    on:click={() => resendEmail(log.id)} 
                    class="text-green-500 hover:underline ml-4">
                    Resend
                  </button>
                {/if}
              </td>

            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>