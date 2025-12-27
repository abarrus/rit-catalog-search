<script lang="ts">
    // todo: account for things being null. like nothing for "typically offered"


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
        typically_offered: string[];
        attributes: string[];
        section_name: string;
    }
    const catalog = rawCatalog as CatalogItem[];
    let results = $state<number>(0);

    function filterfunc(item: CatalogItem) {
        return item.typically_offered == null || item.typically_offered.includes("Summer");
    }

    let filteredCatalog : CatalogItem[] = $state<CatalogItem[]>([]);

    function handleSubmit(event: Event | null = null) {
        event?.preventDefault();
        filteredCatalog = catalog.filter(filterfunc);
        results = filteredCatalog.length;
    }

    const options: Record<string, (number|string)[]> = {};
    const keys: (keyof CatalogItem)[] = ["credits", "prereq_list", "coreq_list", "contact_hrs", "typically_offered", "attributes", "section_name"];
    const choices = $state<Record<string, (string | number)[]>>({});
    keys.forEach(key => {
        choices[key] = [];
    });

    function getOptions() {
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
<form onchange={handleSubmit}>
    {#each keys as key}
        <p>{key}</p>
        <select multiple bind:value={choices[key]}>
            {#each options[key] as item}
                <option value={item}>
                    {item}
                </option>
            {/each}
        </select>
    {/each}
</form>

<h2>Results: {results}</h2>
<div>
    {#each filteredCatalog as item}
        <p>{item.code} {item.name}</p>
    {/each}
</div>