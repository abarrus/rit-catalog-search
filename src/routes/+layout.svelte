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
<div class="page-container">
  <main class="content">
    {@render children()}
  </main>
  <footer class="bg-dark text-light p-4 mt-4">
    <p>
      <a title="github link" href="https://github.com/abarrus"
        ><i class="bi bi-github"></i></a
      >
    </p>
    <hr />
    <p>
      <a
        href="https://www.flaticon.com/free-icons/definition"
        title="definition icons">Favicon created by Freepik - Flaticon</a
      >
    </p>
  </footer>
</div>

<style>
  /* these make the footer stick to the bottom */
  .page-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column; /* stack main + footer vertically */
  }

  .content {
    flex: 1; /* takes up all remaining space */
  }
</style>
