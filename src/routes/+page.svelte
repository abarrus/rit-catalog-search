<script lang="ts">
    // todo: account for things being null. like nothing for "typically offered"

    // imports
    import NodeEditor from "$lib/components/NodeEditor.svelte";
    import Results from "$lib/components/Results.svelte";
    import type { CatalogItem } from "$lib/js/consts";
    import { catalog } from "$lib/js/consts";
    import { Branch, tree } from "$lib/js/node";

    // empty states
    let filteredCatalog : CatalogItem[] = $state<CatalogItem[]>([]);

    let myTree: Branch = $state<Branch>(tree);
    
    function handleSubmit() {
        console.log("SEARCHINGGGG");
        filteredCatalog = catalog.filter((item) => { return myTree.check(item); });
        console.log(filteredCatalog.length)
    }
    handleSubmit();
</script>

<style>
    .card-link-hover {
        transition: background-color 0.2s;
    }

    .card-link-hover:hover {
        background-color: #f1f3f5;
        cursor: pointer;
    }
</style>
<NodeEditor tree={myTree} path={[]} onChange={(newTree: Branch) => {myTree=newTree;}}/>
<button onclick={handleSubmit}>Submit</button>
<Results filteredCatalog={filteredCatalog}/>