<script lang="ts">
  // import vars
  import { presentableKeys } from "$lib/js/consts";
  import { Branch, Leaf } from "$lib/js/node";

  // import components
  import SelectMatchMode from "$lib/components/node_editor/SelectMatchMode.svelte";
  import SelectField from "$lib/components/node_editor/SelectField.svelte";
  import SelectValues from "$lib/components/node_editor/SelectValues.svelte";
  import NodeDropdown from "$lib/components/node_editor/NodeDropdown.svelte";

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

<div class="card">
  <div class="d-flex">
    <!-- Close button -->
    <button class="btn-close me-2" aria-label="Close" onclick={() => remove(i)}
    ></button>

    <!-- Dropdown toggle -->
    <button
      class="p-0 border-0 bg-transparent flex-grow-1 text-start"
      style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#submenu-{i}"
      aria-expanded="false"
    >
      {#if node instanceof Leaf}
        <b>{presentableKeys[node.field]}</b> has {node.matchMode}:
        <b>{node.selectedToString()}</b>
      {:else if node instanceof Branch}
        <b>{node.matchMode}: {node.childrenToString()}</b>
      {/if}
    </button>
  </div>
</div>

<!-- Dropdown menu -->
<div class="collapse" id="submenu-{i}">
  <div class="card">
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
      <div class="ps-2">
        {#each node.children as child}
          <NodeDropdown
            node={child}
            {updateField}
            {updateMatchMode}
            {updateSelected}
            {remove}
            {i}
            {matchModes}
            {fields}
          />
        {/each}
      </div>
    {/if}
  </div>
</div>
