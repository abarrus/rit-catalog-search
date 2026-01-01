<script lang="ts">
    import NodeEditor from "./NodeEditor.svelte";
    import { Leaf, SearchOption, type Node } from "$lib/js/node";
    let { tree, path, onChange } = $props();

    // svelte-ignore state_referenced_locally
    let node = $derived(tree.getNodeAtPath(path));</script>

<p>{node.toString()}</p>
{#if node instanceof Leaf}
    leaf!! 
{:else}
    <div style="border-left: 1px solid black; padding-left: 1rem;">
        {#each node.children as child, i }
            <NodeEditor tree={tree} path={[...path, i]} onChange={onChange}/>
        {/each}
    </div>
{/if}
    <button onclick={() => {onChange(tree.changeBranch([0,1], SearchOption.ONE));console.log("it ran")}}>one</button>