<!-- mainNode MUST be a Branch -->
<script lang="ts">
  // import types
  import type { ASTNode } from "$lib/js/node";
  import type { CatalogItem } from "$lib/js/consts";

  // import vars
  import { Branch, Leaf, MatchMode } from "$lib/js/node";

  // import components
  import NodeDropdown from "$lib/components/node_editor/NodeDropdown.svelte";
  import AddDropdown from "$lib/components/node_editor/AddDropdown.svelte";

  let { tree, path, onChange } = $props();
  const children: ASTNode[] = $derived(tree.children);

  let fields = $derived<string[]>(
    tree.children.map((child: ASTNode) => {
      if (child instanceof Branch) {
        return undefined;
      } else if (child instanceof Leaf) {
        return child.field;
      }
    })
  );

  let matchModes = $derived<string[]>(
    tree.children.map((child: ASTNode) => child.matchMode)
  );

  function remove(i: number) {
    onChange(tree.deleteNode([...path, i]));
  }

  function add(opt: keyof CatalogItem | MatchMode) {
    const addBranch = Object.values(MatchMode).includes(opt as MatchMode);
    if (addBranch) {
      const matchMode = opt;
      onChange(tree.changeBranch([...path, tree.nextIndex()], opt));
    } else {
      const field = opt;
      onChange(
        tree.changeLeaf([...path, tree.nextIndex()], MatchMode.ALL, field, [])
      );
    }
  }

  function updateField(path: number[], newField: string) {
    const node = tree.getNodeAtPath(path);

    if (!(node instanceof Leaf)) {
      throw new Error(
        "Called updateField() with a Branch (or some non-Leaf). Only Leaf has field."
      );
    }
    const newTree = tree.changeLeaf(path, node.matchMode, newField, []);
    onChange(newTree);
  }

  function updateSelected(path: number[], newSelected: string[]) {
    const node = tree.getNodeAtPath(path);

    if (!(node instanceof Leaf)) {
      throw new Error(
        "Called updateSelected() with a Branch (or some non-Leaf). Only Leaf has selected."
      );
    }
    const newTree = tree.changeLeaf(
      path,
      node.matchMode,
      node.field,
      newSelected
    );
    onChange(newTree);
  }

  function updateMatchMode(path: number[], newMatchMode: string) {
    const node = tree.getNodeAtPath(path);
    let newTree;

    if (node instanceof Branch) {
      newTree = tree.changeBranch(path, newMatchMode, node.children);
    } else if (node instanceof Leaf) {
      newTree = tree.changeLeaf(path, newMatchMode, node.field, node.selected);
    }
    onChange(newTree);
  }
</script>

<div class="container-fluid">
  <div class="row g-3">
    {#each children as child, i}
      <div class="col-1 col-md-2 col-lg-3">
        <NodeDropdown
          node={child}
          {updateField}
          {updateMatchMode}
          {updateSelected}
          {i}
          {remove}
          {matchModes}
          {fields}
        />
      </div>
    {/each}
    <div class="col-1">
      <AddDropdown {add} />
    </div>
  </div>
</div>

<style>
  :global(.card) {
    transition: background-color 0.2s;
  }

  :global(.card:hover) {
    background-color: #f1f3f5;
    cursor: pointer;
  }

  /* no arrow on dropdown */
  :global(.dropdown-toggle::after) {
    display: none;
  }
</style>
