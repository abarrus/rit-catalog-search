<script lang="ts">
  // import vars
  import { presentableKeys } from "$lib/js/consts";
  import { Branch, Leaf } from "$lib/js/node";

  // import components
  import SelectMatchMode from "$lib/components/node_editor/SelectMatchMode.svelte";
  import SelectField from "$lib/components/node_editor/SelectField.svelte";
  import SelectValues from "$lib/components/node_editor/SelectValues.svelte";

  const {
    node,
    updateField,
    updateMatchMode,
    updateSelected,
    remove,
    i,
    matchModes,
    fields,
  } = $props();
</script>

<div class="dropdown d-flex align-items-center">
  <!-- Close button -->
  <button class="btn-close me-2" aria-label="Close" onclick={() => remove(i)}
  ></button>

  <!-- Dropdown toggle -->
  <button
    class="dropdown-toggle p-0 border-0 bg-transparent flex-grow-1 text-start"
    style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;"
    type="button"
    data-bs-toggle="dropdown"
    aria-expanded="false"
  >
    {#if node instanceof Leaf}
      <b>{presentableKeys[node.field]}</b> has {node.matchMode}:
      <b>{node.selectedToString()}</b>
    {:else if node instanceof Branch}
      <b>{node.matchMode}: {node.childrenToString()}</b>
    {/if}
  </button>

  <!-- Dropdown menu placeholder -->
  <div class="dropdown-menu">
    <div class="d-flex justify-content-center align-items-center gap-2">
      {#if node instanceof Leaf}
        <SelectField update={updateField} {i} value={fields[i]} />
        has
        <SelectMatchMode update={updateMatchMode} {i} value={matchModes[i]} />
      {:else if node instanceof Branch}
        <SelectMatchMode update={updateMatchMode} {i} value={matchModes[i]} />
        of the following:
      {/if}
    </div>
    {#if node instanceof Leaf}
      <div class="d-flex justify-content-center">of the following:</div>
      <SelectValues update={updateSelected} {node} {i} />
      <button><i class="bi bi-trash3-fill"></i>Delete</button>
      <button><i class="bi bi-check-circle-fill"></i>Done</button>
    {:else if node instanceof Branch}
      uh
    {/if}
  </div>
</div>
