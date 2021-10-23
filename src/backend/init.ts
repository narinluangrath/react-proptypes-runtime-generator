import fs from "fs";
import util from "util";
import path from "path";

import globby from "globby";
// @ts-ignore
import * as reactDocs from "react-docgen";
// @ts-ignore
import type { Result } from "react-docgen";

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);

const handleError = (e: Error, message: string) => {
  console.error(message);
  console.error(e);
  process.exit(1);
};

async function writeComponentMap(componentFiles: string, babelConfig: string) {
  const reactDocsData: Record<string, Result[]> = {};
  const files = await globby(componentFiles);

  if (!files?.length) {
    throw Error(`No files match given componentFiles ${componentFiles}`);
  }

  for (const file of files) {
    try {
      const fileData = await readFile(file);
      try {
        const componentDefs = reactDocs.parse(
          fileData,
          reactDocs.resolver.findAllExportedComponentDefinitions,
          undefined,
          // @ts-ignore
          { configFile: babelConfig, filename: file }
        );
        if (componentDefs.length) {
          reactDocsData[file] = componentDefs;
        }
      } catch (error) {
        console.warn(
          `\n\nFailed to find component definitions in file ${file}`
        );
        console.warn(error);
      }
    } catch (error) {
      handleError(error, `\n\nFailed to read file ${file}`);
    }
  }

  const stringified = JSON.stringify(reactDocsData, null, 2);
  try {
    await writeFile(
      ".storystrap/component-map.js",
      `export default ${stringified}`
    );
    return reactDocsData;
  } catch (error) {
    handleError(error, "\n\nFailed to write component-map.js file");
  }
}

function getRelative(file: string) {
  return path.relative(path.join(process.cwd(), ".storystrap"), file);
}

async function writeRegisterComponents(componentMap: Record<string, Result[]>) {
  const registerComponents = `import componentMap from './component-map';
${Object.keys(componentMap)
  .map(
    (file, i) =>
      `import DefaultExport${i}, * as NamedExports${i} from '${getRelative(
        file
      )}';`
  )
  .join("\n")}

function registerExports(defaultExport, namedExports, file) {
  const displayNames = componentMap[file].map(({ displayName }) => displayName);
  try {
    if (displayNames.includes(defaultExport.displayName)) {
      defaultExport.__filename = file;
      defaultExport.__exportName = 'default';
    }
    Object.keys(namedExports).forEach((key) => {
      if (displayNames.includes(namedExports[key].displayName)) {
        namedExports[key].__filename = file;
        namedExports[key].__exportName = key;
      }
    });
  } catch (e) {
    console.warn('Failed to modify React component for tracking purposes');
    console.warn(e);
  }
}

${Object.keys(componentMap)
  .map(
    (file, i) =>
      `registerExports(DefaultExport${i}, NamedExports${i}, '${file}');`
  )
  .join("\n")}
`;
  try {
    await writeFile(".storystrap/register-components.js", registerComponents);
  } catch (error) {
    handleError(error, "\n\nFailed to write register-components.js");
  }
}

export async function init(
  componentFiles = "./src/**/*.{js,jsx,ts,tsx}",
  babelConfig = "./babel.config.js"
) {
  if (fs.existsSync(".storystrap")) {
    throw Error(
      "Project already initialized, .storystrap directory already exists"
    );
  }
  await mkdir(".storystrap");

  await writeFile(
    ".storystrap/config.js",
    "module.exports = " + JSON.stringify({ port: 1234 }, null, 2)
  );
  const componentMap = await writeComponentMap(componentFiles, babelConfig);
  await writeRegisterComponents(componentMap!);
}
