import type { Fiber } from "react-reconciler";

export function reactFiberRecur(
  rootNode: Fiber,
  cb: (node: Fiber) => boolean | null | undefined | void
): Fiber | null {
  console.info("reactFiberRecur", rootNode);
  if (cb(rootNode)) {
    return rootNode;
  }

  if (rootNode.child) {
    const res = reactFiberRecur(rootNode.child, cb);
    if (res) {
      return res;
    }
  }

  if (rootNode.sibling) {
    const res = reactFiberRecur(rootNode.sibling, cb);
    if (res) {
      return res;
    }
  }

  return null;
}
