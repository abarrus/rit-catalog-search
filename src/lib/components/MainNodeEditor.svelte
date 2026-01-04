<!-- mainNode MUST be a Branch -->
<script lang="ts">
    import { Branch, Leaf, MatchMode, matchModeToString } from "$lib/js/node";
    let { tree, path, onChange } = $props();
    const children: Node[] = $derived(tree.children)

    function remove(i: number) {
        onChange(
            tree.deleteNode([...path, i])
        );
    }

    function add() {
        onChange(
            tree.changeBranch(
                [...path, tree.nextIndex()],
                MatchMode.ALL
            )
        );
    }
</script>
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
                <div class="container card"><div class="row">
                    <div class="col-2 text-center">
                        <button type="button" class="btn-close" aria-label="Close"
                        onclick={() => {remove(i)}}></button>
                    </div>
                    <div class="col-10">
                    <div class="dropdown">
                    <button class="dropdown-toggle p-0 border-0 bg-transparent shadow-none" data-bs-toggle="dropdown">
                        <div class="text-truncate">
                            {#if child instanceof Leaf}
                                <b>{child.field}</b>
                                    has {matchModeToString(child)}:
                                <b>{child.selectedToString()}</b>
                            {:else if child instanceof Branch}
                                <b>
                                    {matchModeToString(child, true)}: {child.childrenToString()}
                                </b>
                            {/if}
                        </div>
                    </button>
                    <div class="dropdown-menu">
                        hi
                    </div>
                    <!-- end dropdown -->
                    </div>
                    <!-- end col-10 -->
                    </div>
                <!-- end container and row -->
                </div></div>
            <!-- end col -->
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