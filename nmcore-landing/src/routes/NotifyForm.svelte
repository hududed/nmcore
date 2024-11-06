<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button"; 
  import { toast } from "svelte-sonner";
  import { collection, doc, writeBatch } from "firebase/firestore";
  import { db } from "$lib/firebase";

  let fullName = '';
  let email = '';
  let number = '';

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    console.log('Form submitted');
    console.log('Full Name:', fullName);
    console.log('Email:', email);
    console.log('Mobile:', number);
    try {
      const batch = writeBatch(db);
      const userRef = doc(collection(db, 'users'));
      batch.set(userRef, { fullName, email, number });
      await batch.commit();
      toast.success('User information saved successfully');

      const response = await fetch('https://us-central1-nanogrowtech-609bc.cloudfunctions.net/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, fullName }),
      });



      fullName = '';
      email = '';
      number = '';

    } catch (e) {
      console.error('Error adding document: ', e);
      toast.error('Error adding document');
    }
  };

</script>

<form on:submit={handleSubmit} class="space-y-4 max-w-lg mx-auto">
  <div>
    <Input id="fullName" type="text" bind:value={fullName} placeholder="Full Name" required />
  </div>
  <div>
    <Input id="email" type="email" bind:value={email} placeholder="Email" required />
  </div>
  <div>
    <Input id="number" type="tel" bind:value={number} placeholder="Mobile Number" required />
  </div>
  <Button type="submit">Submit</Button> <!-- Use the shadcn button component -->
</form>