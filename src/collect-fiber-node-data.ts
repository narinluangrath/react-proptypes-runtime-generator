import type { Fiber } from "react-reconciler";

import { traverseReactFiber } from "./traverse-react-fiber";
import { getFiberNodeData } from "./get-fiber-node-data";
import type { FiberNodeData } from "./types";

export function collectFiberNodeData(root: Fiber): FiberNodeData[] {
  const data: FiberNodeData[] = [];
  traverseReactFiber(root, (node) => {
    const datum = getFiberNodeData(node);
    if (
      datum.componentId.split(":").filter((s) => s !== "").length === 2 &&
      !datum.isDOM
    ) {
      data.push(datum);
    }
  });
  return data;
}
