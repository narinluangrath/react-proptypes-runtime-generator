import { defaults, omit } from "lodash";
import type { Fiber } from "react-reconciler";
import fclone from "fclone";

import type { FiberNodeData } from "./types";

const getFiberNodeName = (node: Fiber): string => {
  console.info(node);
  const defaultName = "(Unknown Name)";

  // Handle nodes cooresponding to Context, Memo, ForwardRef, etc.
  const sym = node?.elementType?.$$typeof;
  if (typeof sym === "symbol") {
    return Symbol.keyFor(node?.elementType?.$$typeof) || defaultName;
  }

  // Handle "normal" nodes (function/class component instances)
  let str = node?.elementType?.name;
  if (typeof str === "string") {
    return str;
  }

  // Handle native dom nodes
  str = node?.elementType;
  if (typeof str === "string") {
    return str;
  }

  console.warn("Failed to determine node name", node);
  return defaultName;
};

export const getFiberNodeData = (node: Fiber): FiberNodeData => ({
  componentId: `${node._debugSource?.fileName ?? ""}:${getFiberNodeName(node)}`,
  propsInstance: fclone(
    omit(defaults(node.memoizedProps, node.pendingProps, {}), "children")
  ),
  isDOM: typeof node?.elementType === "string",
});
