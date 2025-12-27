<script lang="ts">
    import rawCatalog from "$lib/data/catalog.json";
    type CatalogItem = {
        code: string;
        name: string;
        credits: number;
        prereq: string;
        coreq: string;
        prereq_list: string[];
        coreq_list: string[];
        contact_hrs: string[];
        typically_offered: string;
        attributes: string[];
        section_name: string;
    }
    const catalog = rawCatalog as CatalogItem[];
    let results = $state<number>(0);

    const seasons = ["Fall", "Spring", "Summer"];
    const seasonsSelected = $state<Record<string, boolean>>({
        Fall: true,
        Spring: true,
        Summer: false
    })

    let filteredCatalog : CatalogItem[] = $state<CatalogItem[]>([]);

    function handleSubmit(event: Event | null = null) {
        event?.preventDefault();
        filteredCatalog = catalog.filter(c => seasonsSelected[c.typically_offered]);
        results = filteredCatalog.length;
    }

    const options: Record<string, (number|string)[]> = {};
    function getOptions() {
        const keys: (keyof CatalogItem)[] = ["credits", "prereq_list", "coreq_list", "contact_hrs", "typically_offered", "attributes", "section_name"];
        keys.forEach(key => {
            options[key] = [];
        })

        catalog.forEach((item: CatalogItem) => {
            for(const key of keys) {
                const value = item[key];
                let arrayVal: (number|string)[] = Array.isArray(value) ? value : [value];
                arrayVal.forEach(val => {
                    if (val != null && !options[key].includes(val)) {
                        options[key].push(val);
                    }
                });
            }
        });
        console.log(options);
    }
    getOptions();

    handleSubmit();
</script>

<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<form onchange={handleSubmit}>
    {#each seasons as season}
        <input type="checkbox"
        checked={seasonsSelected[season]}
        onchange={() => seasonsSelected[season] = !seasonsSelected[season]} />
        {season}
    {/each}
</form>

<h2>Results: {results}</h2>
<div>
    {#each filteredCatalog as item}
        <p>{item.code} {item.name}</p>
    {/each}
</div>