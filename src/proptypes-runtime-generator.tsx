import * as React from "react";
import { saveAs } from "file-saver";

import { stringify } from "./json-utils";
import { collectFiberNodeData } from "./collect-fiber-node-data";
import { createExportedData } from "./create-exported-data";
import { traverseDomBfs } from "./traverse-dom-bfs";
import { getFiberNodeName } from "./get-fiber-node-data";
import { reactFiberRecur } from "./react-fiber-recur";
import type { FiberNodeData } from "./types";
import type { Fiber } from "react-reconciler";

const data: FiberNodeData[] = [];

export const PropTypesRuntimeGenerator: React.FC = ({ children }) => {
  const [selfNode, setSelfNode] = React.useState<Fiber | null>(null);

  React.useEffect(() => {
    const root = traverseDomBfs(
      document.body,
      // @ts-expect-error
      (node) => !!node?._reactRootContainer?._internalRoot?.current
    );
    if (!root) {
      console.error("Failed to find React root node");
      return;
    }

    const rootNode: Fiber =
      // @ts-expect-error
      root?._reactRootContainer?._internalRoot?.current;
    const self = reactFiberRecur(
      rootNode,
      (node) => getFiberNodeName(node) === "PropTypesRuntimeGenerator"
    );
    setSelfNode(self);
  }, []);

  React.useEffect(() => {
    // @ts-expect-error
    window.collectData = () => {
      if (!selfNode?.child) {
        console.error("Failed to collect data");
        return;
      }
      const d = collectFiberNodeData(selfNode?.child);
      const strings = d
        .map((datum) => {
          try {
            console.log(datum);
            const str = stringify(datum);
            return fetch("http://localhost:1234/", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: str,
            });
          } catch (e) {
            return null;
          }
        })
        .filter(Boolean);
      Promise.allSettled(strings);
      data.push(...d);
    };

    // @ts-expect-error
    window.exportData = () => {
      const exportedData = createExportedData(data);
      const formattedData = stringify(exportedData);
      const blob = new Blob([formattedData], {
        type: "text/plain;charset=utf-8",
      });
      saveAs(blob, "data.json");
    };
  }, [selfNode]);

  return <>{children}</>;
};
