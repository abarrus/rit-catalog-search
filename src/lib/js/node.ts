import type { CatalogItem } from "$lib/js/consts";
import { NONE } from "$lib/js/consts";

export enum MatchMode {
  ALL = "all",
  NONE = "none",
  ANY = "any",
  ONE = "one",
}

// "Abstract Syntax Tree Node"
// Because just "Node" is already a thing in HTML
export type ASTNode = Branch | Leaf;

/**
 * Helper function for the check() function of an ASTNode
 * @param mode MatchMode of the ASTNode
 * @param matches how many of the ASTNode's children/selected are matched by the item being checked
 * @param total how many children/selected that the ASTNode has
 * @returns if the item satisfies the conditions of the ASTNode
 */
function applyMatchMode(
  mode: MatchMode,
  matches: number,
  total: number
): boolean {
  if (total == 0) return true;
  
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

export class Branch {
  public matchMode: MatchMode;

  public children: ASTNode[];

  /**
   * @param opt the SearchOption this represents
   * @param children this node's children if it already has them
   */
  constructor(matchMode: MatchMode, children: ASTNode[] = []) {
    this.matchMode = matchMode;
    this.children = children;
  }

  private getChild(
    path: number[],
    editBranch: (child: Branch) => Branch,
    makeChild: (childIndex: number) => ASTNode
  ): Branch {
    const [index, ...rest] = path;

    if (rest.length > 0) {
      const child: ASTNode = this.children[index];
      if (child instanceof Leaf) {
        throw new Error("Bad path for editing/adding ASTNode.");
      }

      const updatedChild: Branch = editBranch(child);

      return new Branch(this.matchMode, [
        ...this.children.slice(0, index),
        updatedChild,
        ...this.children.slice(index + 1),
      ]);
    } else {
      const child: ASTNode = makeChild(index);
      return new Branch(this.matchMode, [
        ...this.children.slice(0, path[0]),
        child,
        ...this.children.slice(path[0] + 1),
      ]);
    }
  }

  // change or add branch
  changeBranch(
    path: number[],
    matchMode: MatchMode,
    children: ASTNode[] = []
  ): Branch {
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
    selected: (string | number)[]
  ): Branch {
    function editBranch(child: Branch): Branch {
      return child.changeLeaf(path.slice(1), matchMode, field, selected);
    }
    function makeChild(): Leaf {
      return new Leaf(matchMode, field, selected);
    }
    return this.getChild(path, editBranch, makeChild);
  }

  deleteNode(path: number[]): Branch {
    if (path.length > 1) {
      const child = this.children[path[0]];
      if (child instanceof Branch) {
        return child.deleteNode(path.slice(1));
      } else {
        throw new Error("Bad path for deleting Node");
      }
    } else {
      const index: number = path[0];
      const newChildren: ASTNode[] = this.children.slice(0, index);
      const secondHalf: ASTNode[] = this.children.slice(index + 1);
      newChildren.push(...secondHalf);
      return new Branch(this.matchMode, newChildren);
    }
  }

  getNodeAtPath(path: number[]): ASTNode {
    if (path.length == 0) return this;

    const child: ASTNode = this.children[path[0]];
    return child instanceof Branch ? child.getNodeAtPath(path.slice(1)) : child;
  }

  childrenToString() {
    return this.children
      .map((child) => {
        return child.matchMode;
      })
      .join(", ");
  }

  nextIndex(): number {
    return this.children.length;
  }

  toString(): string {
    return `${this.matchMode}:`;
  }

  check(item: CatalogItem): boolean {
    const matchLen = this.children.filter((child) => child.check(item)).length;
    return applyMatchMode(this.matchMode, matchLen, this.children.length);
  }
}

export class Leaf {
  public matchMode: MatchMode;
  public field: keyof CatalogItem;
  public selected: (string | number)[];

  /**
   * @param opt the SearchOption this represents
   * @param field what we're searching, eg. "typically_offered"
   * @param selected the value we want the search to be at, eg. "fall"
   */
  constructor(
    matchMode: MatchMode,
    field: keyof CatalogItem,
    selected: (string | number)[] = []
  ) {
    this.matchMode = matchMode;
    this.field = field;
    this.selected = selected;
  }

  check(item: CatalogItem): boolean {
    // the item we're checking's value
    const val: (string | number)[] | string | number = item[this.field];
    // the values we're checking it against
    const valToCheck: (string | number)[] = Array.isArray(val) ? val : [val];

    const matchLen = this.selected.filter((opt) => {
      return valToCheck.includes(opt);
    }).length;
    return applyMatchMode(this.matchMode, matchLen, this.selected.length);
  }

  childFirstString() {
    return this.field;
  }

  selectedToString(): string {
    return this.selected.join(", ");
  }

  toString(): string {
    return `${this.field} ${this.matchMode} ${this.selected}`;
  }
}

// make example tree
export const tree = new Branch(MatchMode.ALL);
