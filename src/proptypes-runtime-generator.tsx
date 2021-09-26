import * as React from "react";

import { collectFiberNodeData } from "./collect-fiber-node-data";
import { createExportedData } from "./create-exported-data";
import type { FiberNodeData } from "./types";

const data: FiberNodeData[] = [];

export const PropTypesRuntimeGenerator: React.FC = ({ children }) => {
  React.useEffect(() => {
    // @ts-expect-error
    if (!children?._owner) {
      console.warn("Failed to collect data");
      return;
    }

    // @ts-expect-error
    window.collectData = () => {
      // @ts-expect-error
      data.push(...collectFiberNodeData(children._owner));
    };

    // @ts-expect-error
    window.exportData = () => {
      // @TODO: Finish it
      createExportedData(data);
    };
  }, [children]);

  return <>{children}</>;
};
