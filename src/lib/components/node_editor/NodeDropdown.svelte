<script lang="ts">
  // import vars
  import {
    presentableKeys,
    capitalizeFirstLetter
  } from "$lib/js/consts";
  import { Branch, Leaf } from "$lib/js/node";

  // import components
  import SelectMatchMode from "$lib/components/node_editor/SelectMatchMode.svelte";
  import SelectField from "$lib/components/node_editor/SelectField.svelte";
  import SelectValues from "$lib/components/node_editor/SelectValues.svelte";
  import NodeDropdown from "$lib/components/node_editor/NodeDropdown.svelte";
  import AddDropdown from "$lib/components/node_editor/AddDropdown.svelte";
  import CreditSlider from "$lib/components/node_editor/CreditSlider.svelte";

  const {
    node,
    updateField,
    updateMatchMode,
    updateSelected,
    remove,
    path,
    addTo,
  } = $props();

  const field = $derived<string>(
    node instanceof Branch ? undefined : node.field
  );
  const matchMode = $derived<string>(node.matchMode);

  const creditsType: string = $derived<string>(
    node.field == "credits" ? node.creditsType() : null
  );
</script>

<div class="card">
  <div class="d-flex">
    <!-- Close button -->
    <button
      class="btn-close me-2"
      aria-label="Close"
      onclick={() => remove(path)}
    ></button>

    <!-- Dropdown toggle -->
    <button
      class="p-0 border-0 bg-transparent flex-grow-1 text-start"
      style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#submenu-{path.join('-')}"
      aria-expanded="false"
    >
      {#if node instanceof Leaf}
        <i class="bi bi-{presentableKeys[node.field].icon}"></i>
        <b>{presentableKeys[node.field].text}</b>
        {#if node.field == "credits"}
          is
          {#if creditsType == "above"}
            <b>above {node.min()}</b>
          {:else if creditsType == "below"}
            <b>below {node.max()}</b>
          {:else}
            <b>between {node.min()} and {node.max()}</b>
          {/if}
        {:else}
          has {node.matchMode}:
          <b>{node.selectedToString()}</b>
        {/if}
      {:else if node instanceof Branch}
        <b>{capitalizeFirstLetter(node.matchMode)}: {node.childrenToString()}</b
        >
      {/if}
    </button>
  </div>
</div>

<!-- Dropdown menu -->
<div class="collapse" id="submenu-{path.join('-')}">
  <div class="card">
    {#if node instanceof Leaf && node.field == "credits"}
      <CreditSlider update={updateSelected} {node} {path} />
    {:else}
      <div class="d-flex justify-content-center align-items-center gap-2">
        {#if node instanceof Leaf}
          <SelectField update={updateField} {path} value={field} />
          has
          <SelectMatchMode
            update={updateMatchMode}
            {path}
            value={matchMode}
            caps={false}
          />
        {:else if node instanceof Branch}
          <SelectMatchMode
            update={updateMatchMode}
            {path}
            value={matchMode}
            caps={true}
          />
          of the following:
        {/if}
      </div>
      {#if node instanceof Leaf}
        <div class="d-flex justify-content-center">of the following:</div>
        <SelectValues update={updateSelected} {node} {path} />
      {:else if node instanceof Branch}
        <div class="ps-2">
          {#each node.children as child, i}
            <NodeDropdown
              node={child}
              {updateField}
              {updateMatchMode}
              {updateSelected}
              {remove}
              path={[...path, i]}
              {addTo}
            />
          {/each}
        </div>
        <AddDropdown {addTo} {path} />
      {/if}
    {/if}
  </div>
</div>
