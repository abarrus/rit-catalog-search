<script lang="ts">
    // todo: account for things being null. like nothing for "typically offered"


    // imports
    import NodeEditor from "./NodeEditor.svelte";
    import type { CatalogItem } from "$lib/js/consts";
    import { keys, catalog, options, choices } from "$lib/js/consts";
    import type { Node } from "$lib/js/node";
    import { SearchOption, Branch, Leaf } from "$lib/js/node";
  import SelectNewCriteria from "./SelectNewCriteria.svelte";

    // empty states
    let results = $state<number>(0);
    let filteredCatalog : CatalogItem[] = $state<CatalogItem[]>([]);

    let tree: Branch = new Branch(SearchOption.ALL);

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
<NodeEditor tree={tree} path={[]}/>
<h2>Results: {results}</h2>
<div>
    <ol>
    {#each filteredCatalog as item}
        <li><a href="/view/{item.code}">{item.code} {item.name}</a></li>
    {/each}
    </ol>
</div>