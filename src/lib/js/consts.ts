import rawCatalog from "$lib/data/catalog.json";

export const catalog = rawCatalog as CatalogItem[];

export type CatalogItem = {
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

// everything one can search by
export const keys: (keyof CatalogItem)[] = [
    "credits",
    "prereq_list",
    "coreq_list",
    "contact_hrs",
    "typically_offered",
    "attributes",
    "section_name"
];

function setupOptions() {
    keys.forEach(key => {
        options[key] = ["NONE"];
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

export const options: Record<string, (number|string)[]> = {};
setupOptions();


export const choices: Record<string, (string | number)[]> = {};
keys.forEach(key => {
    choices[key] = [];
});

export function filterfunc(item: CatalogItem) {
    let ok: boolean = true;
    Object.keys(choices).forEach(optKey => {
        if (ok == false) return;
        if (choices[optKey].length == 0) return;

        const itemVal = item[(optKey as keyof CatalogItem)];
        if (Array.isArray(itemVal)) {
            if (itemVal.length == 0 && choices[optKey].includes("NONE")) return;

            let smallOk: boolean = false;
            itemVal.forEach(val => {
                if (choices[optKey].includes(val)) {
                    smallOk = true;
                    return;
                }
            });
            if (!smallOk) ok = false;
        } else {
            ok = choices[optKey].includes(itemVal);
            return;
        }
    })
    return ok;
}