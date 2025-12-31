export enum SearchOption {
    ALL = "All of the following",
    NONE = "None of the following",
    ANY = "Any (at least one) of the following",
    ONE = "Just one of the following"
};

export type Node = Branch | Leaf;

export class Branch {
    private opt: SearchOption;
    private path: number[];

    public children: Node[];

    constructor(opt: SearchOption, children: Node[] = [], path: number[] = []) {
        this.opt = opt;
        this.path = path;
        this.children = children;
    }

    private getChild(path: number[],
            editBranch: (child: Branch) => Branch,
            makeChild: (childIndex: number) => Node): Branch {
        if (path.length > 0) {
            const childIndex: number = path[0];
            const child: Node = this.children[childIndex];
            if (child instanceof Leaf) {
                throw "what r u doing";
            }
            const newChild: Branch = editBranch(child);
            return new Branch(this.opt, [...this.children.slice(0,childIndex), newChild, ...this.children.slice(childIndex+1)], this.path);
        } else {
            const childIndex = this.children.length;
            const child: Node = makeChild(childIndex);
            return new Branch(this.opt, [...this.children, child], this.path);
        }
    }

    addBranch(path: number[], opt: SearchOption): Branch {
        function editBranch(child: Branch): Branch {
            return child.addBranch(path.slice(1), opt);
        }
        function makeChild(childIndex: number): Branch {
            return new Branch(opt, [], [...path, childIndex]);
        }
        return this.getChild(path, editBranch, makeChild);
    }

    addLeaf(path: number[], opt: SearchOption, optKey: string, optVal: (string|number)[]): Branch {
        function editBranch(child: Branch): Branch {
            return child.addLeaf(path.slice(1), opt, optKey, optVal);
        }
        function makeChild(childIndex: number): Leaf {
            return new Leaf([...path, childIndex], opt, optKey, optVal);
        }
        return this.getChild(path, editBranch, makeChild);
    }

    getNodeAtPath(path: number[]): Node {
        if (path.length == 0) {
            return this;
        } else {
            const child: Node = this.children[path[0]];
            return child.getNodeAtPath(path.slice(1));
        }
    }

    toString(): string {
        return `${this.opt}:`;
    }
}

export class Leaf {
    private path: number[];
    private opt: SearchOption;
    private optKey: string;
    private optVal: (string|number)[];

    constructor(path: number[], opt: SearchOption, optKey: string, optVal: (string|number)[] = []) {
        this.path = path;
        this.opt = opt;
        this.optKey = optKey;
        this.optVal = optVal;
    }

    getNodeAtPath() {
        return this;
    }

    toString(): string {
        return `${this.optKey} ${this.opt} ${this.optVal}`;
    }
}

let a1 = new Branch(SearchOption.ALL);
a1 = a1.addBranch([], SearchOption.NONE);
a1 = a1.addLeaf([0], SearchOption.ALL, "typically_offered", []);
export let tree = a1;