<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button"; // Import the shadcn button component
  import { toast } from "svelte-sonner";
  import { db } from '$lib/firebase';
  import { collection, writeBatch, doc } from 'firebase/firestore';

  let firstName = '';
  let lastName = '';
  let email = '';

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    console.log('Form submitted');
    console.log('First Name:', firstName);
    console.log('Last Name:', lastName);
    console.log('Email:', email);
    try {
      const batch = writeBatch(db);
      const userRef = doc(collection(db, 'users'));
      batch.set(userRef, { firstName, lastName, email });
      await batch.commit();
      toast.success('User information saved successfully');
      firstName = '';
      lastName = '';
      email = '';
    } catch (e) {
      console.error('Error adding document: ', e);
      toast.error('Error adding document');
    }
  };
</script>

<form on:submit={handleSubmit} class="space-y-4 max-w-lg mx-auto">
  <div>
    <Input id="firstName" type="text" bind:value={firstName} placeholder="First Name" required />
  </div>
  <div>
    <Input id="lastName" type="text" bind:value={lastName} placeholder="Last Name" required />
  </div>
  <div>
    <Input id="email" type="email" bind:value={email} placeholder="Email" required />
  </div>
  <Button type="submit">Submit</Button> <!-- Use the shadcn button component -->
</form>