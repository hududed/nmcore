<script lang="ts">
    import { db } from '../firebase';
    import { collection, addDoc } from 'firebase/firestore';
    let email: string = '';

    const handleSubmit = async (event: Event) => {
        event.preventDefault();
        try {
            await addDoc(collection(db, 'emails'), { email });
            alert('Email subscribed successfully');
            email = '';
        } catch (e) {
            console.error('Error adding document: ', e);
        }
    };
</script>

<form on:submit={handleSubmit}>
    <input type="email" bind:value={email} placeholder="Enter your email" required />
    <button type="submit">Notify Me</button>
</form>

<style>
    form {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    input {
        padding: 10px;
        margin-bottom: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        width: 100%;
        max-width: 300px;
    }
    button {
        text-decoration: none;
        color: white;
        background-color: #007BFF;
        padding: 10px 20px;
        border-radius: 5px;
        font-size: 1em;
        border: none;
        cursor: pointer;
    }
</style>