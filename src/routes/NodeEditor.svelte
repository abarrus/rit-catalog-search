<script lang="ts">
    import NodeEditor from "./NodeEditor.svelte";
    import { Branch, Leaf, SearchOption } from "$lib/js/node";
    import { keys, options } from "$lib/js/consts";
    let { tree, path, onChange } = $props();

    // svelte-ignore state_referenced_locally
    let node = $derived(tree.getNodeAtPath(path));
    
    // svelte-ignore state_referenced_locally
    let newOpt = $state<string>(node instanceof Branch ? node.opt : node.optKey);
    // svelte-ignore state_referenced_locally
    let newOptLeaf = $state<SearchOption|undefined>(node instanceof Leaf ? node.opt : undefined);
    // svelte-ignore state_referenced_locally
    let selectedVals = $state<(string|number)[] | undefined>(node instanceof Leaf ? node.optVal : undefined);
    function update() {
        const newOptIsSearchOpt: boolean = Object.values(SearchOption).includes(newOpt as SearchOption)
        if (newOptIsSearchOpt) {
            if (node instanceof Branch) {
                onChange(tree.changeBranch(path, newOpt, node.children));
            } else if (node instanceof Leaf) {
                onChange(tree.changeBranch(path, newOpt));
            }
        } else {
            if (node instanceof Leaf) {
                onChange(tree.changeLeaf(path, newOptLeaf, newOpt, selectedVals));
            } else if (node instanceof Branch) {
                onChange(tree.changeLeaf(path, SearchOption.ALL, newOpt, []));
            }
        }
    }
</script>

<select onchange={update} bind:value={newOpt}>
    {#each Object.values(SearchOption) as opt}
        <option value={opt}>{opt}</option>
    {/each}
    <option disabled>----</option>
    {#each keys as opt}
        <option value={opt}>{opt}</option>
    {/each}
</select>
<p>{node.toString()}</p>
{#if node instanceof Leaf}
    <select onchange={update} bind:value={newOptLeaf}>
        {#each Object.values(SearchOption) as opt}
            <option value={opt}>{opt}</option>
        {/each}
    </select>
    <select multiple onchange={update} bind:value={selectedVals}>
        {#each options[newOpt] as opt}
            <option value={opt}>{opt}</option>
        {/each}
    </select>
{:else}
    <div style="border-left: 1px solid black; padding-left: 1rem;">
        {#each node.children as child, i }
            <NodeEditor tree={tree} path={[...path, i]} onChange={onChange}/>
            <p>----</p>
        {/each}
        <button onclick={() => {onChange(tree.changeBranch([...path, node.nextIndex()], SearchOption.ALL));}}>+</button>
    </div>
{/if}