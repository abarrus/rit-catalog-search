export enum SearchOption {
    ALL = "All of the following",
    NONE = "None of the following",
    ANY = "Any (at least one) of the following",
    ONE = "Just one of the following"
};

export type Node = Branch | Leaf;

export class Branch {
    private opt: SearchOption;
    private parent: Branch|undefined;
    private path: number[];

    private children: Node[] | undefined;

    constructor(opt: SearchOption, parent: Branch|undefined = undefined, path: number[] = []) {
        this.opt = opt;
        this.parent = parent;
        this.path = path;
    }

    addSubtree(path: number[], opt: SearchOption) {
    }

    addLeaf(path: number[], optKey: string, optVal: (string|number)[]) {

    }
}

export class Leaf {
    private optKey: string;
    private optVal: (string|number)[];
    private parent: Branch;
    private path: number[];

    constructor(parent: Branch, path: number[], optKey: string, optVal: (string|number)[] = []) {
        this.optKey = optKey;
        this.optVal = optVal;
        this.parent = parent;
        this.path = path;
    }
}