import * as React from "react";
import { saveAs } from "file-saver";

import { stringify } from "./json-utils";
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
  }, [children]);

  return <>{children}</>;
};
