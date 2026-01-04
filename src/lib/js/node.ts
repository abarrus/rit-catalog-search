import type { CatalogItem } from "$lib/js/consts";
import { NONE } from "$lib/js/consts";

export enum MatchMode {
    ALL = "All of the following",
    NONE = "None of the following",
    ANY = "Any (at least one) of the following",
    ONE = "Just one of the following"
};

export function matchModeToString(node: Node, capitalize: boolean = false): string {
    const mode: MatchMode = node.matchMode;
    const matches = {
        "All of the following": "all",
        "None of the following": "none",
        "Any (at least one) of the following": "any",
        "Just one of the following": "one"
    }
    const res: string = matches[mode];
    return capitalize
        ? res.charAt(0).toUpperCase() + res.slice(1)
        : res;
}

/**
 * Helper function for the check() function of a Node
 * @param mode MatchMode of the Node
 * @param matches how many of the Node's children/selected are matched by the item being checked
 * @param total how many children/selected that the Node has
 * @returns if the item satisfies the conditions of the Node
 */
function applyMatchMode(mode: MatchMode, matches: number, total: number): boolean {
    switch (mode) {
        case MatchMode.ALL:
            return matches === total;
        case MatchMode.NONE:
            return matches === 0;
        case MatchMode.ANY:
            return matches >= 1;
        case MatchMode.ONE:
            return matches === 1;
    }
}

export type Node = Branch | Leaf;

export class Branch {
    public matchMode: MatchMode;

    public children: Node[];

    /**
     * @param opt the SearchOption this represents
     * @param children this node's children if it already has them
     */
    constructor(matchMode: MatchMode, children: Node[] = []) {
        this.matchMode = matchMode;
        this.children = children;
    }

    private getChild(path: number[],
            editBranch: (child: Branch) => Branch,
            makeChild: (childIndex: number) => Node): Branch {
        const [index, ...rest] = path;

        if (rest.length > 0) {
            const child: Node = this.children[index];
            if (child instanceof Leaf) {
                throw new Error("Cannot descend into Leaf. If you got this error your path list is probably too long.");
            }

            const updatedChild: Branch = editBranch(child);

            return new Branch(
                this.matchMode,
                [
                    ...this.children.slice(0,index),
                    updatedChild,
                    ...this.children.slice(index+1)
                ]
            );
        } else {
            const child: Node = makeChild(index);
            return new Branch(
                this.matchMode,
                [
                    ...this.children.slice(0, path[0]),
                    child,
                    ...this.children.slice(path[0]+1)
                ]
            );
        }
    }

    // change or add branch
    changeBranch(path: number[], matchMode: MatchMode, children: Node[] = []): Branch {
        function editBranch(child: Branch): Branch {
            return child.changeBranch(path.slice(1), matchMode);
        }
        function makeChild(): Branch {
            return new Branch(matchMode, children);
        }
        return this.getChild(path, editBranch, makeChild);
    }

    // change or add leaf
    changeLeaf(
        path: number[],
        matchMode: MatchMode,
        field: keyof CatalogItem,
        selected: (string|number)[]
    ): Branch {
        function editBranch(child: Branch): Branch {
            return child.changeLeaf(path.slice(1), matchMode, field, selected);
        }
        function makeChild(): Leaf {
            return new Leaf(matchMode, field, selected);
        }
        return this.getChild(path, editBranch, makeChild);
    }

    getNodeAtPath(path: number[]): Node {
        if (path.length == 0) return this;
        
        const child: Node = this.children[path[0]];
        return child instanceof Branch
            ? child.getNodeAtPath(path.slice(1)) 
            : child;
    }

    childrenToString() {
        return this.children.map(child => {return child.childFirstString();}).join(", ");
    }

    childFirstString() {
        return matchModeToString(this, true);
    }

    nextIndex(): number {
        return this.children.length;
    }

    toString(): string {
        return `${this.matchMode}:`;
    }

    check(item: CatalogItem): boolean {
        const matchLen = this.children.filter(child => child.check(item)).length;
        return applyMatchMode(this.matchMode, matchLen, this.children.length);
    }
}

export class Leaf {
    public matchMode: MatchMode;
    public field: keyof CatalogItem;
    public selected: (string|number)[];

    /**
     * @param opt the SearchOption this represents
     * @param field what we're searching, eg. "typically_offered"
     * @param selected the value we want the search to be at, eg. "fall"
     */
    constructor(
        matchMode: MatchMode,
        field: keyof CatalogItem,
        selected: (string|number)[] = []
    ) {
        this.matchMode = matchMode;
        this.field = field;
        this.selected = selected;
    }

    check(item: CatalogItem): boolean {
        // the item we're checking's value
        const val: (string|number)[] | string | number = item[this.field];
        // the values we're checking it against
        const valToCheck: (string|number)[] =
            Array.isArray(val) ?
            val :
            [val];
        
        const matchLen = this.selected.filter(opt => {
            return valToCheck.includes(opt);
        }).length;
        return applyMatchMode(this.matchMode, matchLen, this.selected.length);
    }

    childFirstString() {
        return this.field;
    }

    selectedToString(): string {
        console.log("good")
        return this.selected.join(", ");
    }

    toString(): string {
        console.log("this tostring called")
        return `${this.field} ${this.matchMode} ${this.selected}`;
    }
}

// make example tree
export const tree = new Branch(MatchMode.ALL);