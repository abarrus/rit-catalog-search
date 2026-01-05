<script lang="ts">
  const { update, path, node } = $props();
  import { options } from "$lib/js/consts";
</script>

<select
  class="w-100"
  multiple
  onchange={(e: Event) => {
    update(
      path,
      Array.from((e.currentTarget as HTMLSelectElement).selectedOptions).map(
        (o) => o.value
      )
    );
  }}
  value={node.selected}
>
  {#each options[node.field] as opt}
    <option value={opt}>{opt}</option>
  {/each}
</select>
