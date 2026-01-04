<!-- mainNode MUST be a Branch -->
<script lang="ts">
  import type { ASTNode } from "$lib/js/node";
  import { Branch, Leaf, MatchMode } from "$lib/js/node";
  import { keys } from "$lib/js/consts";
  let { tree, path, onChange } = $props();
  const children: ASTNode[] = $derived(tree.children);

  function remove(i: number) {
    onChange(tree.deleteNode([...path, i]));
  }

  function add() {
    onChange(tree.changeBranch([...path, tree.nextIndex()], MatchMode.ALL));
  }

  function updateField(path: number[], newField: string) {
    const node = tree.getNodeAtPath(path);

    if (!(node instanceof Leaf)) {
      throw new Error("Called updateField() with a Branch (or some non-Leaf). Only Leaf has field.");
    }
    const newTree = tree.changeLeaf(path, node.matchMode, newField, node.selected);
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

  let fields = $derived<string[]>(
    tree.children.map(
      (child: ASTNode) => {
        if (child instanceof Branch) {
          return undefined;
        } else if (child instanceof Leaf) {
          return child.field;
        }
      }
    )
  );

  let matchModes = $derived<string[]>(
    tree.children.map(
      (child: ASTNode) => child.matchMode
    )
  );
</script>

<div class="dropdown">
  <button
    class="btn btn-sm btn-outline-primary dropdown-toggle"
    type="button"
    data-bs-toggle="dropdown"
  >
    More Info
  </button>

  <ul class="dropdown-menu">
    <li><button class="dropdown-item" type="button">Action 1</button></li>
    <li><button class="dropdown-item" type="button">Action 2</button></li>
    <li><button class="dropdown-item" type="button">Action 3</button></li>
  </ul>
</div>
<div class="container-fluid">
  <div class="row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-3 g-3">
    {#each children as child, i}
      <div class="col">
        <div class="container card">
          <div class="row">
            <div class="dropdown d-flex align-items-center">
              <!-- Close button -->
              <button
                class="btn-close me-2"
                aria-label="Close"
                onclick={() => remove(i)}
              ></button>

              <!-- Dropdown toggle -->
              <button
                class="dropdown-toggle p-0 border-0 bg-transparent flex-grow-1 text-start"
                style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {#if child instanceof Leaf}
                  <b>{child.field}</b> has {child.matchMode}:
                  <b>{child.selectedToString()}</b>
                {:else if child instanceof Branch}
                  <b
                    >{child.matchMode}: {child.childrenToString()}</b
                  >
                {/if}
              </button>

              <!-- Dropdown menu placeholder -->
              <div class="dropdown-menu">
                <div class="d-flex justify-content-center align-items-center gap-2">
                  {#if child instanceof Leaf}
                    <select onchange={(e: Event)=>{updateField([i], (e.currentTarget as HTMLSelectElement).value)}} value={fields[i]}>
                      {#each keys as opt}
                          <option value={opt}>{opt}</option>
                      {/each}
                    </select>
                    has
                    <select onchange={(e: Event)=>{updateMatchMode([i], (e.currentTarget as HTMLSelectElement).value)}} value={matchModes[i]}>
                        {#each Object.values(MatchMode) as opt}
                            <option value={opt}>{opt}</option>
                        {/each}
                    </select>
                  {:else if child instanceof Branch}
                    <button>{child.matchMode}</button>
                    of the following:
                  {/if}
                </div>
                {#if child instanceof Leaf}
                  <div class="d-flex justify-content-center">
                    of the following:
                  </div>
                {:else if child instanceof Branch}
                  uh
                {/if}
              </div>
            </div>
          </div>
        </div>
      </div>
    {/each}
    <div class="col">
      <div class="container"><div class="row">
          <button class="col-6 card" onclick={add}>
            <b>Add</b>
          </button>
      <!-- end container and row -->
      </div></div>
    </div>
  </div>
</div>

<style>
  .card {
    transition: background-color 0.2s;
  }

  .card:hover {
    background-color: #f1f3f5;
    cursor: pointer;
  }

  /* no arrow on dropdown */
  .dropdown-toggle::after {
    display: none;
  }
</style>
