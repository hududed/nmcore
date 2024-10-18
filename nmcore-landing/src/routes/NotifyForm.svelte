<script lang="ts">
    import * as Form from "$lib/components/ui/form";
    import { Input } from "$lib/components/ui/input";
    import { formSchema, type FormSchema } from "./schema";
    import SuperDebug, {
      type SuperValidated,
      type Infer,
      superForm,
    } from "sveltekit-superforms";
    import { zodClient } from "sveltekit-superforms/adapters";
    import { toast } from "svelte-sonner";
    import { browser } from "$app/environment";
    import { db } from '$lib/firebase';
    import { collection, writeBatch, doc } from 'firebase/firestore';
  
    export let data: SuperValidated<Infer<FormSchema>>;
  
    const form = superForm(data, {
      validators: zodClient(formSchema),
      onUpdated: ({ form: f }) => {
        if (f.valid) {
          console.log(`Form data: ${JSON.stringify(f.data, null, 2)}`);
        }
      }
    });
  
    const { form: formData, enhance } = form;
  
    const handleSubmit = async (event: Event) => {
      event.preventDefault();
      console.log('Form submitted');
      console.log('First Name:', $formData.firstName);
      console.log('Last Name:', $formData.lastName);
      console.log('Email:', $formData.email);
      try {
        const batch = writeBatch(db);
        const userRef = doc(collection(db, 'users'));
        batch.set(userRef, { firstName: $formData.firstName, lastName: $formData.lastName, email: $formData.email });
        await batch.commit();
        toast.success('User information saved successfully');
        $formData.firstName = '';
        $formData.lastName = '';
        $formData.email = '';
      } catch (e) {
        console.error('Error adding document: ', e);
        toast.error('Error adding document');
      }
    };
  </script>
  
  <form method="POST" use:enhance on:submit={handleSubmit} class="space-y-4 max-w-lg mx-auto">
    <Form.Field {form} name="firstName">
      <Form.Control let:attrs>
        <Input {...attrs} bind:value={$formData.firstName} placeholder="First Name" required />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="lastName">
      <Form.Control let:attrs>
        <Input {...attrs} bind:value={$formData.lastName} placeholder="Last Name" required />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="email">
      <Form.Control let:attrs>
        <Input {...attrs} bind:value={$formData.email} placeholder="Email" required />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
    <Form.Button>Submit</Form.Button>
  </form>