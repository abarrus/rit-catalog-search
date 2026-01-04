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
</style>
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
                </div>
            <!-- end container and row -->
            </div></div>
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