<script lang="ts">
    import { Container, Option, SearchOption, keys, type CatalogItem } from "$lib/js/consts";
  import { passive } from "svelte/legacy";
    let { node, submit } = $props();
    console.log("submit is",submit)
    import Nested from "./Nested.svelte";
    let newVal: string = $state("----");
    let optVal: string[] = $state([]);

    function newItem() {
        let newThing: Container | Option;
        if (Object.values(SearchOption).includes(newVal as SearchOption)) {
            newThing = new Container(newVal as SearchOption);
        } else {
            newThing = new Option(SearchOption.ALL, newVal as keyof CatalogItem, []);
        }
        node = node.add(newThing);
        newVal = "----";
    }

    function search() {
        node.optVal = optVal;
        submit();
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
    <p>{node.getLabel()}:
        {#if node instanceof Option}
            <select multiple onchange={search} bind:value={optVal}>
                {#each node.getOptions() as opt}
                    <option value={opt}>{opt}</option>
                {/each}
            </select>
        {/if}
    </p>
</div>
{#if node instanceof Container}
<div style="border-left: 1px solid black; padding-left: 1rem;">
    {#each node.kids() as child}
        <Nested node={child} submit={submit} />
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