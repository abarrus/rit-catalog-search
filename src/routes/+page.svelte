<script lang="ts">
    // todo: account for things being null. like nothing for "typically offered"


    // imports
    import Nested from "./Nested.svelte";

    import type { CatalogItem } from "$lib/js/consts";
    import { keys, catalog, options, choices, filterfunc, node, Container } from "$lib/js/consts";

    // empty states
    let results = $state<number>(0);
    let filteredCatalog : CatalogItem[] = $state<CatalogItem[]>([]);
    let bigNode = $state<Container>(node);
    
    function handleSubmit(event: Event | null = null) {
        event?.preventDefault();
        filteredCatalog = catalog.filter(filterfunc);
        results = filteredCatalog.length;
    }
    handleSubmit();
</script>
<Nested node={bigNode}/>
<form onchange={handleSubmit}>
    {#each keys as key}
        <p>{key}</p>
        <select multiple bind:value={choices[key]}>
            {#each options[key] as item}
                <option value={item}>
                    {item}
                </option>
            {/each}
        </select>
    {/each}
</form>

<h2>Results: {results}</h2>
<div>
    <ol>
    {#each filteredCatalog as item}
        <li><a href="/view/{item.code}">{item.code} {item.name}</a></li>
    {/each}
    </ol>
</div>