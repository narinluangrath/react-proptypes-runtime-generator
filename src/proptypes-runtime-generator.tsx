import * as React from "react";
import { saveAs } from "file-saver";

import { stringify } from "./json-utils";
import { collectFiberNodeData } from "./collect-fiber-node-data";
import { createExportedData } from "./create-exported-data";
import { traverseDomBfs } from "./traverse-dom-bfs";
import { getFiberNodeName } from "./get-fiber-node-data";
import { reactFiberRecur } from "./react-fiber-recur";
import type { FiberNodeData } from "./types";
import { Fiber } from "react-reconciler";

const data: FiberNodeData[] = [];

export const PropTypesRuntimeGenerator: React.FC = ({ children }) => {
  const [selfNode, setSelfNode] = React.useState<Fiber | null>(null);

  React.useEffect(() => {
    // @ts-expect-error
    const root = traverseDomBfs(
      document.body,
      (node) => !!node?._reactRootContainer?._internalRoot?.current
    );
    if (!root) {
      console.error("Failed to find React root node");
      return;
    }

    // @ts-expect-error
    const rootNode: Fiber = root?._reactRootContainer?._internalRoot?.current;
    const self = reactFiberRecur(
      rootNode,
      (node) => getFiberNodeName(node) === "PropTypesRuntimeGenerator"
    );
    setSelfNode(self);
  }, []);

  React.useEffect(() => {
    if (!selfNode) {
      console.error("Failed to collect data");
      return;
    }

    // @ts-expect-error
    window.collectData = () => {
      data.push(...collectFiberNodeData(selfNode));
      console.log({ data });
    };

    // @ts-expect-error
    window.exportData = () => {
      const exportedData = createExportedData(data);
      console.log({ exportedData });
      const formattedData = stringify(exportedData);
      console.log({ formattedData });
      const blob = new Blob([formattedData], {
        type: "text/plain;charset=utf-8",
      });
      console.log({ blob });
      saveAs(blob, "data.json");
    };
  }, [selfNode]);

  return <>{children}</>;
};
