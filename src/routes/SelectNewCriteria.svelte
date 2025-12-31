<script lang="ts">
    import { Container, SingleSearchOption, keys } from "$lib/js/consts";
    let { node } = $props();
    
    function newCriteria() {
        return;
    }

    let searchOpt: string = $state("");
    let optKey: string = $state("");
    let optVal: string = $state("");
</script>
<form onsubmit={newCriteria}>
    <select value={optKey}>
        {#each keys as opt}
            <option value={opt}>{opt}</option>
        {/each}
    </select>
    <select value={searchOpt}>
        {#each Object.values(SingleSearchOption) as opt}
            <option value={opt}>{opt}</option>
        {/each}
    </select>
    <input value={optVal}>
</form>
<button onclick={() => {
    if (node instanceof Container) { // it has to be, this is so TS won't be mad
        node = node.addGeneric();
    }
}}>+</button>