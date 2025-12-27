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
    let results = $state<number>(0);

    const seasons = ["Fall", "Spring", "Summer"];
    const seasonsSelected = $state<Record<string, boolean>>({
        Fall: false,
        Spring: false,
        Summer: false
    })

    let filteredCatalog : CatalogItem[] = $state<CatalogItem[]>([]);

    function handleSubmit(event: SubmitEvent) {
        event.preventDefault();
        filteredCatalog = catalog.filter(c => seasonsSelected[c.typically_offered]);
        results = filteredCatalog.length;
    }
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<form onsubmit={handleSubmit}>
    {#each seasons as season}
        <input type="checkbox"
        checked={seasonsSelected[season]}
        onchange={() => seasonsSelected[season] = !seasonsSelected[season]} />
        {season}
    {/each}
    <button type="submit">Search</button>
</form>

<h2>Results: {results}</h2>

<div><p>all classes will go here</p>
    <br>
    {#each filteredCatalog as item}
        <p>{item.name}</p>
    {/each}
</div>