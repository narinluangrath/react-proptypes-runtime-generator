import { createInterface } from "readline";
import { createReadStream } from "fs";
import reactDocs from 'react-docgen';

import { parse } from "./json-utils";
import { createExportedData } from "./create-exported-data";
import { getComponentFromId } from './get-fiber-node-data';
import type { FiberNodeData } from './types';

const lineReader = createInterface({ input: createReadStream("./data.json") });

const fiberNodeData: Omit<FiberNodeData, 'isDOM'>[] = [];
// Convert JSON file to FiberNodeData
lineReader.on("line", (line) => {
  const datum = parse(line);
  fiberNodeData.push(datum);
});

// Convert FiberNodeData to ComponentData and PropTypeData
lineReader.on("close", () => {
  const { componentData, propTypeData } = createExportedData(fiberNodeData);
  
  componentData.forEach(({ propTypes, propsInstances }, componentId) => {
    const { componentName, fileName } = getComponentFromId(componentId);
    const componentInfo = reactDocs.parse(fileName, reactDocs.resolver.findAllExportedComponentDefinitions);
  })  
});

