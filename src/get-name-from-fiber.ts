import { Fiber } from "react-reconciler";

export const getNameFromFiber = (
  node: Fiber,
  fallback = "(Unknown Name)"
): string => {
  // Handle nodes cooresponding to Context, Memo, ForwardRef, etc.
  const sym = node?.elementType?.$$typeof;
  if (typeof sym === "symbol") {
    return Symbol.keyFor(node?.elementType?.$$typeof) || fallback;
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
  return fallback;
};
