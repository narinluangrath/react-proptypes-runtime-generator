import { Fiber } from "react-reconciler";

export function reactFiberRecur(rootNode: Fiber, cb: (node: Fiber) => void) {
  cb(rootNode);

  if (rootNode.child) {
    reactFiberRecur(rootNode.child, cb);
  }

  if (rootNode.sibling) {
    reactFiberRecur(rootNode.sibling, cb);
  }
}
