<script lang="ts">
  import { capitalizeFirstLetter } from "$lib/js/consts";
  const { update, path, value, caps } = $props();
  import { MatchMode } from "$lib/js/node";
  import { choices } from "$lib/actions/choices";

  function format(opt: string): string {
    return caps ? capitalizeFirstLetter(opt) : opt;
  }
</script>

<select use:choices={{ multiselect:false }}
  onchange={(e: Event) => {
    update(path, (e.currentTarget as HTMLSelectElement).value);
  }}
  {value}
>
  {#each Object.values(MatchMode) as opt}
    <option value={opt}>{format(opt)}</option>
  {/each}
</select>
