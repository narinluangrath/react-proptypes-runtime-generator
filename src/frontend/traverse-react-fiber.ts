import type { Fiber } from "react-reconciler";

export function traverseReactFiber(
  rootNode: Fiber,
  cb: (node: Fiber) => boolean | null | undefined | void
): Fiber | null {
  if (cb(rootNode)) {
    return rootNode;
  }

  if (rootNode.child) {
    const res = traverseReactFiber(rootNode.child, cb);
    if (res) {
      return res;
    }
  }

  if (rootNode.sibling) {
    const res = traverseReactFiber(rootNode.sibling, cb);
    if (res) {
      return res;
    }
  }

  return null;
}
