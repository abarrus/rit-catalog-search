<script lang="ts">
    import { Container, SingleSearchOption, keys } from "$lib/js/consts";
    let { node } = $props();
    import Nested from "./Nested.svelte";
    import SelectNewCriteria from "./SelectNewCriteria.svelte";
</script>

{#if node instanceof Container}
<div style="border:1px solid black; margin:1rem;">
    <p>{node.getLabel()}:</p>
    {#each node.kids() as child}
        <Nested node={child} />
    {/each}
    <SelectNewCriteria node={node}/>
</div>
{:else}
<p>{node.getLabel()}</p>
{/if}