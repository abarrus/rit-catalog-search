<!-- mainNode MUST be a Branch -->
<script lang="ts">
  import type { ASTNode } from "$lib/js/node";
  import type { CatalogItem } from "$lib/js/consts";
  import { Branch, Leaf, MatchMode } from "$lib/js/node";
  import { keys, presentableKeys, options } from "$lib/js/consts";
  let { tree, path, onChange } = $props();
  const children: ASTNode[] = $derived(tree.children);

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
      onChange(tree.changeLeaf([...path, tree.nextIndex()], MatchMode.ALL, field, []));
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
</script>

<div class="container-fluid">
  <div class="row g-3">
    {#each children as child, i}
      <div class="col-1 col-md-2 col-lg-3">
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
                  <b>{presentableKeys[child.field]}</b> has {child.matchMode}:
                  <b>{child.selectedToString()}</b>
                {:else if child instanceof Branch}
                  <b>{child.matchMode}: {child.childrenToString()}</b>
                {/if}
              </button>

              <!-- Dropdown menu placeholder -->
              <div class="dropdown-menu">
                <div
                  class="d-flex justify-content-center align-items-center gap-2"
                >
                  {#if child instanceof Leaf}
                    <select
                      onchange={(e: Event) => {
                        updateField(
                          [i],
                          (e.currentTarget as HTMLSelectElement).value
                        );
                      }}
                      value={fields[i]}
                    >
                      {#each keys as opt}
                        <option value={opt}>{presentableKeys[opt]}</option>
                      {/each}
                    </select>
                    has
                    <select
                      onchange={(e: Event) => {
                        updateMatchMode(
                          [i],
                          (e.currentTarget as HTMLSelectElement).value
                        );
                      }}
                      value={matchModes[i]}
                    >
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
                  <select
                    class="w-100"
                    multiple
                    onchange={(e: Event) => {
                      updateSelected(
                        [i],
                        Array.from(
                          (e.currentTarget as HTMLSelectElement).selectedOptions
                        ).map((o) => o.value)
                      );
                    }}
                    value={child.selected}
                  >
                    {#each options[child.field] as opt}
                      <option value={opt}>{opt}</option>
                    {/each}
                  </select>
                  <button><i class="bi bi-trash3-fill"></i>Delete</button>
                  <button><i class="bi bi-check-circle-fill"></i>Done</button>
                {:else if child instanceof Branch}
                  uh
                {/if}
              </div>
            </div>
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
                  <button onclick={()=>{add(opt)}} class="dropdown-item" type="button">{presentableKeys[opt]}</button>
                </li>
              {/each}
              <li class="dropdown-item disabled">----</li>
              {#each Object.values(MatchMode) as opt}
                <li>
                  <button onclick={()=>{add(opt)}} class="dropdown-item" type="button">{opt}</button>
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
