<script lang="ts">
    // todo: account for things being null. like nothing for "typically offered"


    // imports
    import type { CatalogItem } from "$lib/js/consts";
    import { keys, catalog, options, choices } from "$lib/js/consts";

    // empty states
    let results = $state<number>(0);
    let filteredCatalog : CatalogItem[] = $state<CatalogItem[]>([]);

    function check(item: CatalogItem) {
        
    }
    
    function handleSubmit() {
        console.log("SEARCHINGGGG");
        filteredCatalog = catalog.filter((item) => { return check(item); });
        results = filteredCatalog.length;
        console.log(filteredCatalog.length)
    }
    handleSubmit();
</script>
<h2>Results: {results}</h2>
<div>
    <ol>
    {#each filteredCatalog as item}
        <li><a href="/view/{item.code}">{item.code} {item.name}</a></li>
    {/each}
    </ol>
</div>