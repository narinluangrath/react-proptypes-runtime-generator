import { defaults, omit, isPlainObject } from "lodash";
import type { Fiber } from "react-reconciler";

import type { FiberNodeData } from "../types";

export const getFiberNodeName = (node: Fiber): string => {
  const defaultName = "(Unknown Name)";

  // Handle nodes cooresponding to Context, Memo, ForwardRef, etc.
  const sym = node?.elementType?.$$typeof ?? node?.type?.$$typeof;
  if (typeof sym === "symbol") {
    return Symbol.keyFor(sym) || defaultName;
  }

  // Handle "normal" nodes (function/class component instances)
  const componentName =
    node?.elementType?.displayName ??
    node?.elementType?.name ??
    node?.type?.displayName ??
    node?.type?.name;
  if (typeof componentName === "string") {
    return componentName;
  }

  // Handle native dom nodes
  const domNodeName = node?.elementType ?? node?.type;
  if (typeof domNodeName === "string") {
    return domNodeName;
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

  // Sometimes _.defaults doesn't handle "read only" properties
  // It will attempt to assign to "read only" properties and
  // cause a TypeError to be thrown
  let props = node.memoizedProps ?? node.pendingProps ?? {};
  try {
    props = defaults(node.memoizedProps, node.pendingProps, {});
  } catch (e) {}

  return omit(props, "children");
};

export const getComponentFromId = (id: string) => {
  const [fileName, exportName, componentName] = id.split(":");
  return {
    fileName,
    exportName,
    componentName,
  };
};

// Provided by backend/init.ts
const getFileName = (node: Fiber): string => {
  const component = node?.elementType ?? node?.type;
  return component?.__fileName ?? "";
};

// Provided by backend/init.ts
const getExportName = (node: Fiber): string => {
  const component = node?.elementType ?? node?.type;
  return component?.__exportName ?? "";
};

export const getFiberNodeData = (node: Fiber): FiberNodeData => ({
  componentId: `${getFileName(node)}:${getExportName(node)}:${getFiberNodeName(
    node
  )}`,
  propsInstance: getFiberPropsInstance(node),
  isDOM: typeof node?.elementType === "string",
});

// ._debugSource
// .elementType
// .memoizedProps
// .pendingProps
// .stateNode
