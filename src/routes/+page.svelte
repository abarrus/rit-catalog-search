<script lang="ts">
    // todo: account for things being null. like nothing for "typically offered"

    // imports
    import NodeEditor from "./NodeEditor.svelte";
    import type { CatalogItem } from "$lib/js/consts";
    import { catalog } from "$lib/js/consts";
    import { Branch, tree } from "$lib/js/node";

    // empty states
    let results = $state<number>(0);
    let filteredCatalog : CatalogItem[] = $state<CatalogItem[]>([]);

    let myTree: Branch = $state<Branch>(tree);
    
    function handleSubmit() {
        console.log("SEARCHINGGGG");
        filteredCatalog = catalog.filter((item) => { return myTree.check(item); });
        results = filteredCatalog.length;
        console.log(filteredCatalog.length)
    }
    handleSubmit();
</script>
<NodeEditor tree={myTree} path={[]} onChange={(newTree: Branch) => {myTree=newTree;}}/>
<button onclick={handleSubmit}>Submit</button>
<h2>Results: {results}</h2>
<div class="container-fluid text-center">
    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
        {#each filteredCatalog as item}
            <div class="col border rounded">
                <a href="/view/{item.code}">{item.code} {item.name}</a>
            </div>
        {/each}
    </div>
</div>