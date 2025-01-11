<!-- src/lib/components/seo/Meta.svelte -->
<script lang="ts">

  // Destructure props using $props
  let { title, description, keywords, url, image } = $props<{
    title: string;
    description: string;
    keywords: string;
    url: string;
    image: string;
  }>();
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta name="keywords" content={keywords} />

  <!-- Open Graph -->
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={image} />
  <meta property="og:url" content={url} />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="NMCORE" />
  <meta property="og:locale" content="en_US" />
  <!-- Twitter Card -->
  <!-- <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={image} /> -->
</svelte:head>