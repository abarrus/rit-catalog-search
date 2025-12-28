import rawCatalog from "$lib/data/catalog.json";

export const catalog = rawCatalog as CatalogItem[];

const NONE = "NONE";

export type CatalogItem = {
    code: string;
    desc: string,
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
        options[key] = [];
    })

    catalog.forEach((item: CatalogItem) => {
        for(const key of keys) {
            const value = item[key];
            let arrayVal: (number|string)[] = Array.isArray(value) ? value : [value];
            if (arrayVal.length == 0) {
                if (!options[key].includes(NONE)) {
                    options[key].push(NONE);
                }
            } else {
                arrayVal.forEach(val => {
                    if (val != null && !options[key].includes(val)) {
                        options[key].push(val);
                    }
                });
            }
        }
    });

    Object.keys(options).forEach(key => {
        const arr: (string|number)[] = options[key];

        arr.sort();

        // make sure NONE is at the front
        if (arr.includes(NONE)) {
            const index = arr.indexOf(NONE);
            arr.splice(index, 1);
            arr.unshift(NONE);
        }
    })
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

enum SearchOption {
    ALL = "All of the following",
    NONE = "None of the following",
    ANY = "Any (at least one) of the following",
    ONE = "Just one of the following"
};

enum SingleSearchOption {
    CONTAINS_TEXT = "Contains this text:",
    HAS = "Has",
    HASNT = "Doesn't have",
    CREDIT_BTWN = "Credits between",
    CREDIT_UNDER = "Credits below",
    CREDIT_OVER = "Credits above"
}

class Option {
    private type: SingleSearchOption;

    constructor(type: SingleSearchOption) {
        this.type = type;
    }

    // todo: this is nonsense atm.
    check(item: CatalogItem) {
        if (this.type == SingleSearchOption.HAS) {
            return false;
        }
        return true;
    }
}

class Container {
    private type: SearchOption;
    private opts: (Container|Option)[];

    constructor(type: SearchOption) {
        this.type = type;
        this.opts = [];
    }

    add(opt: Container|Option) {
        this.opts.push(opt);
    }

    remove(i: number) {
        this.opts.splice(i, 1);
    }

    check(item: CatalogItem): boolean {
        const matchLen = this.opts.filter(opt => opt.check(item)).length;
        if (this.type == SearchOption.ALL) {
            return matchLen == this.opts.length;
        } else if (this.type == SearchOption.NONE) {
            return matchLen == 0;
        } else if (this.type == SearchOption.ANY) {
            return matchLen >= 1;
        } else {
            // ONE
            return matchLen == 1;
        }
    }
}