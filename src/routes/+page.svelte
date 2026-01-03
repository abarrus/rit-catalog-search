<script lang="ts">
    // todo: account for things being null. like nothing for "typically offered"

    // imports
    import NodeEditor from "$lib/components/NodeEditor.svelte";
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

<style>
    .card-link-hover {
        transition: background-color 0.2s;
    }

    .card-link-hover:hover {
        background-color: #f1f3f5;
        cursor: pointer;
    }
</style>
<h1>TESTING!!!!!</h1>
<NodeEditor tree={myTree} path={[]} onChange={(newTree: Branch) => {myTree=newTree;}}/>
<button onclick={handleSubmit}>Submit</button>
<h2>Results: {results}</h2>
<div class="container-fluid text-center">
    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
        {#each filteredCatalog as item}
            <div class="col">
                <!--
                    text-decoration-none: no blue underline (since it's a link)
                -->
                <a href="/view/{item.code}" class="text-decoration-none">
                    <!--
                        border rounded: rounded border
                        h-100: fill height of column, regardless of content
                        p-2: padding 2
                        d-flex align-items-center justify-content-center: center items
                        card-link-hover: hover effect
                        text-dark: no blue text
                    -->
                    <div class="border rounded h-100 p-2 d-flex align-items-center justify-content-center card-link-hover text-dark">
                        <!-- m-0 because the paragraphs were throwing off my vertical centering -->
                        <p class="m-0"><strong>{item.code} {item.name}</strong></p>
                    </div>
                </a>
            </div>
        {/each}
    </div>
</div>