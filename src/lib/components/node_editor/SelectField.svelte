<script lang="ts">
  const { update, i, value } = $props();
  import { keys, presentableKeys } from "$lib/js/consts";
</script>

<select
  onchange={(e: Event) => {
    update([i], (e.currentTarget as HTMLSelectElement).value);
  }}
  value={value}
>
  {#each keys as opt}
    <option value={opt}>{presentableKeys[opt]}</option>
  {/each}
</select>