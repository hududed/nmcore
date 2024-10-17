<script lang="ts">
    import { db } from '../firebase';
    import { collection, writeBatch, doc } from 'firebase/firestore';
    let firstName: string = '';
    let lastName: string = '';
    let email: string = '';

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
            alert('User information saved successfully');
            firstName = '';
            lastName = '';
            email = '';
        } catch (e) {
            console.error('Error adding document: ', e);
        }
    };
</script>

<form on:submit={handleSubmit} class="space-y-4 max-w-lg mx-auto">
    <label class="input input-bordered flex items-center gap-2 w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4 opacity-70">
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
        </svg>
        <input type="text" class="grow w-full" bind:value={firstName} placeholder="First Name" required />
    </label>
    <label class="input input-bordered flex items-center gap-2 w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4 opacity-70">
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
        </svg>
        <input type="text" class="grow w-full" bind:value={lastName} placeholder="Last Name" required />
    </label>
    <label class="input input-bordered flex items-center gap-2 w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4 opacity-70">
            <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
            <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
        </svg>
        <input type="email" class="grow w-full" bind:value={email} placeholder="Email" required />
    </label>
    <button type="submit" class="btn btn-primary w-full">Notify Me!</button>
</form>