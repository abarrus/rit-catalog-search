<!-- mainNode MUST be a Branch -->
<script lang="ts">
  // import types
  import type { ASTNode } from "$lib/js/node";
  import type { CatalogItem } from "$lib/js/consts";

  // import vars
  import { Branch, Leaf, MatchMode } from "$lib/js/node";
  import { keys, presentableKeys, options } from "$lib/js/consts";

  // import components
  import NodeDropdown from "$lib/components/node_editor/NodeDropdown.svelte";

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
        <div class="container card">
          <div class="row">
            <NodeDropdown node={child} {updateField} {updateMatchMode} {updateSelected} {i} {remove} {matchModes} {fields}/>
          </div>
        </div>
      </div>
    {/each}
    <div class="col-1">
      <div class="dropdown d-flex align-items-center">
        <div class="container card">
          <div class="row">
            <!-- Dropdown toggle -->
            <button
              class="dropdown-toggle p-0 border-0 bg-transparent flex-grow-1 text-start"
              style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="bi bi-plus-circle mx-2"></i><b>Add</b>
            </button>

            <!-- Dropdown menu placeholder -->
            <ul class="dropdown-menu">
              {#each keys as opt}
                <li>
                  <button
                    onclick={() => {
                      add(opt);
                    }}
                    class="dropdown-item"
                    type="button">{presentableKeys[opt]}</button
                  >
                </li>
              {/each}
              <li class="dropdown-item disabled">----</li>
              {#each Object.values(MatchMode) as opt}
                <li>
                  <button
                    onclick={() => {
                      add(opt);
                    }}
                    class="dropdown-item"
                    type="button">{opt}</button
                  >
                </li>
              {/each}
            </ul>
          </div>
          <!-- end container and row -->
        </div>
      </div>
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
