<script lang="ts">
  // todo: account for things being null. like nothing for "typically offered"

  // imports
  import MainNodeEditor from "$lib/components/MainNodeEditor.svelte";
  import Results from "$lib/components/Results.svelte";
  import SearchBar from "$lib/components/SearchBar.svelte";
  import type { CatalogItem } from "$lib/js/consts";
  import { catalog } from "$lib/js/consts";
  import { Branch, tree } from "$lib/js/node";

  // empty states
  let filteredCatalog: CatalogItem[] = $state<CatalogItem[]>([]);

  let myTree: Branch = $state<Branch>(tree);

  function handleSubmit() {
    filteredCatalog = catalog.filter((item) => {
      return myTree.check(item);
    });
  }
  handleSubmit();
</script>

<SearchBar />
<MainNodeEditor
  tree={myTree}
  onChange={(newTree: Branch) => {
    myTree = newTree;
    handleSubmit();
  }}
/>
<Results {filteredCatalog} />
