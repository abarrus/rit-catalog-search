<script lang="ts">
  import favicon from "$lib/assets/favicon.png";
  import "bootstrap/dist/css/bootstrap.min.css";
  import "bootstrap-icons/font/bootstrap-icons.css";

  import { onMount } from "svelte";
  import "bootstrap/dist/css/bootstrap.min.css";

  onMount(async () => {
    const { Popover } = await import(
      "bootstrap/dist/js/bootstrap.bundle.min.js"
    ); // browser only
    document
      .querySelectorAll('[data-bs-toggle="popover"]')
      .forEach((el) => new Popover(el));
  });
  let { children } = $props();
</script>

<svelte:head>
  <title>RIT Catalog Search</title>
  <link rel="icon" href={favicon} />
</svelte:head>
{@render children()}
