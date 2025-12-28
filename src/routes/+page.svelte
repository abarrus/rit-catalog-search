<script lang="ts">
    // todo: account for things being null. like nothing for "typically offered"


    // imports
    import type { CatalogItem } from "$lib/js/consts";
    import { keys, catalog, options, choices, filterfunc } from "$lib/js/consts";

    // empty states
    let results = $state<number>(0);
    let filteredCatalog : CatalogItem[] = $state<CatalogItem[]>([]);
    
    function handleSubmit(event: Event | null = null) {
        event?.preventDefault();
        filteredCatalog = catalog.filter(filterfunc);
        results = filteredCatalog.length;
    }
    handleSubmit();
</script>

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
    {#each filteredCatalog as item}
        <p>{item.code} {item.name}</p>
    {/each}
</div>