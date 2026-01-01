import type { CatalogItem } from "./consts";

export enum SearchOption {
    ALL = "All of the following",
    NONE = "None of the following",
    ANY = "Any (at least one) of the following",
    ONE = "Just one of the following"
};

export type Node = Branch | Leaf;

export class Branch {
    private opt: SearchOption;

    public children: Node[];
    private edits: number = 0;

    /**
     * @param opt the SearchOption this represents
     * @param children this node's children if it already has them
     */
    constructor(opt: SearchOption, children: Node[] = [], edits:number =0) {
        this.opt = opt;
        this.children = children;
        this.edits=edits;
    }

    private getChild(path: number[],
            editBranch: (child: Branch) => Branch,
            makeChild: (childIndex: number) => Node,
            change = false): Branch {
        if (path.length > 1) {
            const childIndex: number = path[0];
            const child: Node = this.children[childIndex];
            if (child instanceof Leaf) {
                throw "what r u doing";
            }
            const newChild: Branch = editBranch(child);
            return new Branch(
                this.opt,
                [
                    ...this.children.slice(0,childIndex),
                    newChild,
                    ...this.children.slice(childIndex+1)
                ]
            );
        } else {
            const childIndex = this.children.length;
            const child: Node = makeChild(childIndex);
            return new Branch(
                this.opt,
                [
                    ...this.children.slice(0, path[0]),
                    child,
                    ...this.children.slice(path[0]+1)
                ]
            );
        }
    }

    // change or add branch
    changeBranch(path: number[], opt: SearchOption): Branch {
        this.edits += 1;
        console.log("edits is",this.edits)
        function editBranch(child: Branch): Branch {
            return child.changeBranch(path.slice(1), opt);
        }
        const edits = this.edits;
        function makeChild(): Branch {
            return new Branch(opt, [], edits);
        }
        return this.getChild(path, editBranch, makeChild);
    }

    // change or add leaf
    changeLeaf(
        path: number[],
        opt: SearchOption,
        optKey: keyof CatalogItem,
        optVal: (string|number)[]
    ): Branch {
        function editBranch(child: Branch): Branch {
            return child.changeLeaf(path.slice(1), opt, optKey, optVal);
        }
        function makeChild(): Leaf {
            return new Leaf(opt, optKey, optVal);
        }
        return this.getChild(path, editBranch, makeChild);
    }

    getNodeAtPath(path: number[]): Node {
        if (path.length == 0) {
            return this;
        } else {
            const child: Node = this.children[path[0]];
            if (child instanceof Leaf) {
                return child;
            } else {
                return child.getNodeAtPath(path.slice(1));
            }
        }
    }

    nextIndex(): number {
        return this.children.length;
    }

    toString(): string {
        return `${this.opt}:`;
    }
}

export class Leaf {
    private opt: SearchOption;
    private optKey: keyof CatalogItem;
    private optVal: (string|number)[];

    /**
     * @param opt the SearchOption this represents
     * @param optKey what we're searching, eg. "typically_offered"
     * @param optVal the value we want the search to be at, eg. "fall"
     */
    constructor(
        opt: SearchOption,
        optKey: keyof CatalogItem,
        optVal: (string|number)[] = []
    ) {
        this.opt = opt;
        this.optKey = optKey;
        this.optVal = optVal;
    }

    toString(): string {
        return `${this.optKey} ${this.opt} ${this.optVal}`;
    }
}

// make example tree
let a1 = new Branch(SearchOption.ALL);
a1 = a1.changeBranch([0], SearchOption.NONE);
a1 = a1.changeLeaf([0, 0], SearchOption.ALL, "typically_offered", []);
export let tree = a1;