<script>
  import { keys, presentableKeys } from "$lib/js/consts";
  import { MatchMode } from "$lib/js/node";

  const { add } = $props();
</script>

<div class="dropdown d-flex align-items-center">
  <div class="container card">
    <div class="row">
      <!-- Dropdown toggle -->
      <button
        class="dropdown-toggle p-0 border-0 bg-transparent flex-grow-1 text-start"
        style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <i class="bi bi-plus-circle mx-2"></i><b>Add</b>
      </button>

      <!-- Dropdown menu -->
      <ul class="dropdown-menu">
        {#each keys as opt}
          <li>
            <button
              onclick={() => {
                add(opt);
              }}
              class="dropdown-item"
              type="button">{presentableKeys[opt]}</button
            >
          </li>
        {/each}
        <li class="dropdown-item disabled">----</li>
        {#each Object.values(MatchMode) as opt}
          <li>
            <button
              onclick={() => {
                add(opt);
              }}
              class="dropdown-item"
              type="button">{opt}</button
            >
          </li>
        {/each}
      </ul>
    </div>
    <!-- end container and row -->
  </div>
</div>