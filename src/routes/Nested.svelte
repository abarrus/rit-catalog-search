<script lang="ts">
    import { Container, Option, SearchOption, SingleSearchOption, keys, type CatalogItem } from "$lib/js/consts";
    let { node } = $props();
    import Nested from "./Nested.svelte";
    let newVal: string = $state("");

    function newItem() {
        let newThing: Container | Option;
        if (Object.values(SearchOption).includes(newVal as SearchOption)) {
            newThing = new Container(newVal as SearchOption);
        } else {
            newThing = new Option(SingleSearchOption.HAS, newVal as keyof CatalogItem, "");
        }
        node.add(newThing);
        node = node; // force Svelte to redo the thing
    }
</script>
<style>
    .double {
        display: flex;
    }
    button {
        background: pink;
        height: 1.5rem;
        width: 1.5rem;
    }
</style>
<div class="double">
    <button>-</button>
    <p>{node.getLabel()}:</p>
</div>
{#if node instanceof Container}
<div style="border-left: 1px solid black; padding-left: 1rem;">
    {#each node.kids() as child}
        <Nested node={child} />
    {/each}
    <div class="double">
        <p>+</p>
        <select onchange={newItem} bind:value={newVal}>
            {#each Object.values(SearchOption) as opt}
                <option value={opt}>{opt}</option>
            {/each}
            <option disabled>----</option>
            {#each keys as opt}
                <option value={opt}>{opt}</option>
            {/each}
        </select>
    </div>
</div>
{/if}