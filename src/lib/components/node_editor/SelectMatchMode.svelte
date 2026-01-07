<script lang="ts">
  import { capitalizeFirstLetter } from "$lib/js/consts";
  import { select } from '$lib/actions/select';
  import { MatchMode } from "$lib/js/node";

  const { update, path, value, caps } = $props();

  function format(opt: string): string {
    return caps ? capitalizeFirstLetter(opt) : opt;
  }
</script>

<select use:select
  onchange={(e: Event) => {
    update(path, (e.currentTarget as HTMLSelectElement).value);
  }}
  {value}
>
  {#each Object.values(MatchMode) as opt}
    <option value={opt}>{format(opt)}</option>
  {/each}
</select>