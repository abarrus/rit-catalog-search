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

export enum SearchOption {
    ALL = "All of the following",
    NONE = "None of the following",
    ANY = "Any (at least one) of the following",
    ONE = "Just one of the following"
};

export class Option {
    private type: SearchOption;
    private optKey: keyof CatalogItem;
    public optVal: (string|number)[];

    constructor(type: SearchOption,
            optKey: keyof CatalogItem,
            optVal: (string|number)[]) {
        this.type = type;
        this.optKey = optKey;
        this.optVal = optVal;
    }

    check(item: CatalogItem) {
        const val: (string|number)[] | string | number = item[this.optKey];
        const valToCheck: (string|number)[] =
            Array.isArray(val) ?
            val :
            [val];

        const matchLen = this.optVal.filter(opt => {
            return valToCheck.includes(opt);
        }).length;

        if (this.type == SearchOption.ALL) {
            return matchLen == this.optVal.length;
        } else if (this.type == SearchOption.NONE) {
            return matchLen == 0;
        } else if (this.type == SearchOption.ANY) {
            return matchLen >= 1;
        } else {
            // ONE
            return matchLen == 1;
        }
    }

    getOptions(): (string|number)[] {
        return options[this.optKey];
    }

    getLabel(): string {
        return `${this.optKey} ${this.type} ${this.optVal}`;
    }
}

export class Container {
    private type: SearchOption;
    private opts: (Container|Option)[];
    private parent: Container|undefined;
    private parentOptsIndex: number; // what number this item is at in the parent's opts list 
    private done = false;

    constructor(type: SearchOption, opts: (Container|Option)[] = [], parent: Container|undefined = undefined) {
        this.type = type;
        this.opts = opts;
        this.parent = parent;
        if (parent) {
            this.parentOptsIndex = parent.kids().length - 1;
        } else {
            this.parentOptsIndex = 0;
        }
        console.log("done: ",this.done);
    }

    add(opt: Container|Option) {
        console.log("new opt added - this one shouldn't be used anymore");
        this.done = true;
        if (this.parent) {
            this.parent.remove(this.parentOptsIndex);
            this.parent.secretAdd(this);
        }
        return new Container(this.type, [...this.opts, opt]);
    }

    secretAdd(opt: Container|Option) {
        this.opts.push(opt);
    }

    remove(i: number) {
        this.opts.splice(i, 1);
    }

    check(item: CatalogItem): boolean {
        const print = item.code == "DDDD-101"
        if (print) {
            console.log("intro 3d model", this.type)
            console.log("done: ",this.done);
        }

        const matchLen = this.opts.filter(opt => opt.check(item)).length;
        let res: boolean;
        if (print) {console.log("matchLen is ",matchLen);}
        if (this.type == SearchOption.ALL) {
            res = matchLen == this.opts.length;
        } else if (this.type == SearchOption.NONE) {
            res = matchLen == 0;
        } else if (this.type == SearchOption.ANY) {
            res = matchLen >= 1;
        } else {
            // ONE
            res = matchLen == 1;
        }
        if (print) {console.log("returning ",res);}
        return res;
    }

    getLabel(): string {
        return this.type;
    }

    kids() {
        return this.opts;
    }

    addGeneric() {
        return this.add(new Option(SearchOption.ALL, "credits", [1]));
    }
}

let big = new Container(SearchOption.ALL);

export const node = big;