import { defaults, omit, isPlainObject } from "lodash";
import type { Fiber } from "react-reconciler";
import fclone from "fclone";

import type { FiberNodeData } from "./types";

export const getFiberNodeName = (node: Fiber): string => {
  console.info("getFiberNodeName", node);
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

  // Handle dom nodes corresponding to strings
  // eslint-disable-next-line
  if (node?.stateNode?.__proto__?.constructor?.name?.toLowerCase() === "text") {
    return "Text";
  }

  console.warn("Failed to determine node name", node);
  return defaultName;
};

const getFiberPropsInstance = (node: Fiber): object => {
  if (!isPlainObject(node.memoizedProps || node.pendingProps)) {
    return {};
  }
  const props = defaults(node.memoizedProps, node.pendingProps, {});
  const propsWithoutChildren = omit(props, "children");
  return fclone(propsWithoutChildren);
};

export const getFiberNodeData = (node: Fiber): FiberNodeData =>
  // @ts-ignore
  console.info("getFiberNodeName", node) || {
    componentId: `${node._debugSource?.fileName ?? ""}:${getFiberNodeName(
      node
    )}`,
    propsInstance: getFiberPropsInstance(node),
    isDOM: typeof node?.elementType === "string",
  };
