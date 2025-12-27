<script lang="ts">
    import rawCatalog from "$lib/data/catalog.json";
    type CatalogItem = {
        code: string;
        name: string;
        credits: number;
        prereq: string;
        coreq: string;
        contact_hrs: string;
        typically_offered: string;
        attributes: string[];
        section_name: string;
    }
    const catalog = rawCatalog as CatalogItem[];

    const seasons = ["Fall", "Spring", "Summer"];
    let seasonSelected = $state();

    let filteredCatalog : CatalogItem[] = $state<CatalogItem[]>([]);

    function handleSubmit(event: SubmitEvent) {
        event.preventDefault();
        filteredCatalog = catalog.filter(c => c.typically_offered === seasonSelected);
    }
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<form onsubmit={handleSubmit}>
    <select bind:value={seasonSelected}>
        {#each seasons as season}
            <option value={season}>
                {season}
            </option>
        {/each}
    </select>
    <button type="submit">Search</button>
</form>

<p>selected {seasonSelected}</p>

<div><p>all classes will go here</p>
    <br>
    {#each filteredCatalog as item}
        <p>{item.name}</p>
    {/each}
</div>