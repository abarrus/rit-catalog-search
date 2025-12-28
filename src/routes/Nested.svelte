<script lang="ts">
    import { Container, SingleSearchOption } from "$lib/js/consts";
    let { node } = $props();
    import Nested from "./Nested.svelte";

    function newCriteria() {
        return;
    }

    let optKey: string = $state("");
</script>

{#if node instanceof Container}
<div style="border:1px solid black; margin:1rem;">
    <p>{node.getLabel()}:</p>
    {#each node.kids() as child}
        <Nested node={child} />
    {/each}
    <form onsubmit={newCriteria}>
        <select value={optKey}>
            {#each Object.values(SingleSearchOption) as opt}
                <option value={opt}>{opt}</option>
            {/each}
        </select>
    </form>
    <button onclick={() => {
        if (node instanceof Container) { // it has to be, this is so TS won't be mad
            node.addGeneric();
            node = node; // force svelte to wake up
        }
    }}>+</button>
</div>
{:else}
<p>{node.getLabel()}</p>
{/if}