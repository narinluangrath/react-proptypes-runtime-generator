import type { Fiber } from "react-reconciler";

import { traverseReactFiber } from "./traverse-react-fiber";
import { getFiberNodeData, getComponentFromId } from "./get-fiber-node-data";
import type { FiberNodeData } from "./types";

export function collectFiberNodeData(
  root: Fiber
): Omit<FiberNodeData, "isDOM">[] {
  const data: Omit<FiberNodeData, "isDOM">[] = [];
  traverseReactFiber(root, (node) => {
    const { componentId, propsInstance, isDOM } = getFiberNodeData(node);
    const { componentName, fileName } = getComponentFromId(componentId);
    const isReactComponent = componentName && fileName;
    const notBuiltInComponent = !componentName.startsWith("react.");
    if (isReactComponent && notBuiltInComponent && !isDOM) {
      data.push({ componentId, propsInstance });
    }
  });
  return data;
}
