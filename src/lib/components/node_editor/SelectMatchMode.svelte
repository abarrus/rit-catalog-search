<script lang="ts">
  const { update, i, value } = $props();
  import { MatchMode } from "$lib/js/node";
</script>

<select
  onchange={(e: Event) => {
    update([i], (e.currentTarget as HTMLSelectElement).value);
  }}
  {value}
>
  {#each Object.values(MatchMode) as opt}
    <option value={opt}>{opt}</option>
  {/each}
</select>