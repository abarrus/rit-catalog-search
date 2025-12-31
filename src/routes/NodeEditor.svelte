<script lang="ts">
    import NodeEditor from "./NodeEditor.svelte";
    import { Leaf, type Node } from "$lib/js/node";
    let { tree, path } = $props();

    // svelte-ignore state_referenced_locally
        const node: Node = tree.getNodeAtPath(path);
</script>

<p>{node.toString()}</p>
{#if node instanceof Leaf}
    leaf!!
{:else}
    <div style="border-left: 1px solid black; padding-left: 1rem;">
        {#each node.children as child, i }
            <NodeEditor tree={tree} path={[...path, i]}/>
        {/each}
    </div>
{/if}