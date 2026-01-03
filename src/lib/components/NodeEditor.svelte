<script lang="ts">
    import NodeEditor from "$lib/components/NodeEditor.svelte";
    import { Branch, Leaf, MatchMode } from "$lib/js/node";
    import { keys, options } from "$lib/js/consts";
    let { tree, path, onChange } = $props();

    // svelte-ignore state_referenced_locally
    let node = $derived(tree.getNodeAtPath(path));
    const isBranch = $derived(node instanceof Branch);
    const isLeaf = $derived(node instanceof Leaf);
    
    // svelte-ignore state_referenced_locally
    let mainOpt = $state<string>(node instanceof Branch ? node.matchMode : node.optKey);
    // svelte-ignore state_referenced_locally
    let newOptLeaf = $state<MatchMode|undefined>(node instanceof Leaf ? node.matchMode : undefined);
    // svelte-ignore state_referenced_locally
    let selected = $state<(string|number)[] | undefined>(node instanceof Leaf ? node.selected : undefined);
    function update() {
        const newOptIsSearchOpt: boolean = Object.values(MatchMode).includes(mainOpt as MatchMode)
        if (newOptIsSearchOpt) {
            if (node instanceof Branch) {
                onChange(tree.changeBranch(path, mainOpt, node.children));
            } else if (node instanceof Leaf) {
                onChange(tree.changeBranch(path, mainOpt));
            }
        } else {
            if (node instanceof Leaf) {
                onChange(tree.changeLeaf(path, newOptLeaf, mainOpt, selected));
            } else if (node instanceof Branch) {
                onChange(tree.changeLeaf(path, MatchMode.ALL, mainOpt, []));
            }
        }
    }
</script>

<select onchange={update} bind:value={mainOpt}>
    {#each Object.values(MatchMode) as opt}
        <option value={opt}>{opt}</option>
    {/each}
    <option disabled>----</option>
    {#each keys as opt}
        <option value={opt}>{opt}</option>
    {/each}
</select>
{#if node instanceof Leaf}
    <select onchange={update} bind:value={newOptLeaf}>
        {#each Object.values(MatchMode) as opt}
            <option value={opt}>{opt}</option>
        {/each}
    </select>
    <select multiple onchange={update} bind:value={selected}>
        {#each options[mainOpt] as opt}
            <option value={opt}>{opt}</option>
        {/each}
    </select>
{:else}
    <div style="border-left: 1px solid black; padding-left: 1rem;">
        {#each node.children as child, i }
            <NodeEditor tree={tree} path={[...path, i]} onChange={onChange}/>
            <p>----</p>
        {/each}
        <button onclick={() => {onChange(tree.changeBranch([...path, node.nextIndex()], MatchMode.ALL));}}>+</button>
    </div>
{/if}