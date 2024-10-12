<script>
    import NotifyForm from '$lib/components/NotifyForm.svelte';
</script>

<div class="container">
    <div class="logo">
        <img src="/favicon.png" alt="NanoGrowTech Logo">
    </div>
    <h1>nmCORE - Unlock More Yield with Revolutionary Nano Fertilizer</h1>
    <p>Finally, a breakthrough solution that enhances photosynthesis, cuts fertilizer usage by 25%, and transforms your farm’s productivity. Stay tuned!</p>
    <NotifyForm />
</div>

<style>
    .container {
        text-align: center;
        background: white;
        padding: 50px;
        border-radius: 10px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    }
    h1 {
        margin-bottom: 20px;
        font-size: 2.5em;
    }
    p {
        margin-bottom: 30px;
        font-size: 1.2em;
    }
    .logo {
        margin-bottom: 20px;
    }
    .logo img {
        width: 150px;
    }
</style>