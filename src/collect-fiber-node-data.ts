import type { Fiber } from "react-reconciler";

import { reactFiberRecur } from "./react-fiber-recur";
import { getFiberNodeData } from "./get-fiber-node-data";
import type { FiberNodeData } from "./types";

export function collectFiberNodeData(root: Fiber): FiberNodeData[] {
  console.info("collectFiberNodeData", root);
  const data: FiberNodeData[] = [];
  reactFiberRecur(root, (node) => {
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
