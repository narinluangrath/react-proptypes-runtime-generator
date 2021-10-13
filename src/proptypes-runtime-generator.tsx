import * as React from "react";
import type { Fiber } from "react-reconciler";

import { stringify } from "./json-utils";
import { collectFiberNodeData } from "./collect-fiber-node-data";
import { traverseDomBfs } from "./traverse-dom-bfs";
import { getFiberNodeName } from "./get-fiber-node-data";
import { traverseReactFiber } from "./traverse-react-fiber";

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
    const self = traverseReactFiber(
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
      const sendNodeData = collectFiberNodeData(selfNode?.child)
        .map((datum) => {
          try {
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
      Promise.allSettled(sendNodeData);
    };
  }, [selfNode]);

  return <>{children}</>;
};
