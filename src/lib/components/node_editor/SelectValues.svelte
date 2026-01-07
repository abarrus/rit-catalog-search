<script lang="ts">
  const { update, path, node } = $props();
  import { options } from "$lib/js/consts";
  import { choices } from "$lib/actions/choices";
</script>

<select use:choices={{ multiselect:true }}
  multiple
  onchange={(e: Event) => {
    const isNumbers: boolean = node.field == "credits";
    update(
      path,
      Array.from((e.currentTarget as HTMLSelectElement).selectedOptions).map(
        (o) => (isNumbers ? parseInt(o.value, 10) : o.value)
      )
    );
  }}
  value={node.selected}
>
  {#each options[node.field] as opt}
    <option class="p-3" value={opt}>{opt}</option>
  {/each}
</select>
