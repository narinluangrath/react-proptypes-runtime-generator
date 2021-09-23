import { Fiber } from 'react-reconciler';

export function ReactFiberRecur(rootNode: Fiber, cb: (node: Fiber) => void) {
  cb(rootNode);
  
  if (rootNode.child) {
    ReactFiberRecur(rootNode.child, cb);
  }

  if (rootNode.sibling) {
    ReactFiberRecur(rootNode.sibling, cb);
  }
}