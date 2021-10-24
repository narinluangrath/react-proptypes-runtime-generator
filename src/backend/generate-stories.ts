import fs from "fs";
import path from "path";

import {
  getComponentFromId,
  getIdFromComponent,
} from "../frontend/get-fiber-node-data";
import type { ComponentId, PropsInstance } from "../types";

const dataFile = path.join(process.cwd(), ".storystrap/data.json");
export function generateStories() {
  let data: Record<ComponentId, PropsInstance> = {};
  if (fs.existsSync(dataFile)) {
    data = JSON.parse(fs.readFileSync(dataFile, { encoding: "utf-8" }));
  } else {
    throw Error("Could not find .storystrap/data.json file");
  }

  const byStoryFileName: Record<
    string,
    {
      name: string;
      fileName: string;
      componentName: string;
      exportName: string;
      propsInstance: PropsInstance;
    }[]
  > = {};
  Object.entries(data).forEach(([componentId, propsInstance]) => {
    const { componentName, exportName, fileName } = getComponentFromId(
      componentId
    );
    const { dir, root, name } = path.parse(fileName);
    const storyFileName = path.format({ dir, root, name, ext: ".stories.jsx" });
    if (!byStoryFileName[storyFileName]) {
      byStoryFileName[storyFileName] = [];
    }
    byStoryFileName[storyFileName].push({
      name,
      fileName,
      componentName,
      exportName,
      propsInstance,
    });
  });

  Object.entries(byStoryFileName).forEach(([storyFileName, values]) => {
    const defaultExport = values.find(
      ({ exportName }) => exportName === "default"
    );
    const namedExports = values.filter(
      ({ exportName }) => exportName !== "default"
    );

    if (!defaultExport && !namedExports.length) {
      console.warn("Skipping over blank story", storyFileName);
      return;
    }

    const { name } = defaultExport || namedExports[0];
    const storyTemplate = `import * as React from 'react';
import data from '${path.relative(path.parse(storyFileName).dir, dataFile)}';
import ${defaultExport ? "DefaultExport" : ""}${
      defaultExport && namedExports.length ? ", " : ""
    }${namedExports.length ? "* as NamedExports " : ""} from './${name}';

${
  defaultExport
    ? `export default {
  component: DefaultExport,
  title: ${storyFileName}
}

export const defaultExport = (args) => <DefaultExport {...args} />
defaultExport.args = data['${getIdFromComponent(
        defaultExport.fileName,
        defaultExport.exportName,
        defaultExport.componentName
      )}'];
`
    : ""
}

${namedExports.map(
  (namedExport, i) => `
const NamedExport${i} = NamedExports['${namedExport.exportName}'];
export const namedExport${i} = (args) => <NamedExport${i} {...args} />;
namedExport${i}.args = data['${getIdFromComponent(
    namedExport.fileName,
    namedExport.exportName,
    namedExport.componentName
  )}'];
`
)}
`;

    fs.writeFileSync(storyFileName, storyTemplate);
  });
}
