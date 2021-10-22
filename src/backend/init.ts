import fs from "fs";
import util from "util";
// import path from "path";

import globby from "globby";
import * as reactDocs from "react-docgen";
import type { Result } from "react-docgen";
// import { sync as pkgDirSync } from "pkg-dir";

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

// const rprgDir = path.resolve(pkgDir!, "./.rprg");

const handleError = (e: Error, message: string) => {
  console.error(message);
  console.error(e);
  process.exit(1);
};

async function writeComponentMap(
  componentFiles = "./packages/**/*.{js,jsx,ts,tsx}",
  babelConfig = "./babel.config.js"
) {
  const reactDocsData: Record<string, Result[]> = {};
  const files = await globby(componentFiles);
  for (const file of files) {
    try {
      const fileData = await readFile(file);
      try {
        const componentDefs = reactDocs.parse(
          fileData,
          reactDocs.resolver.findAllExportedComponentDefinitions,
          undefined,
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
    await writeFile("./component-map.js", `export default ${stringified}`);
    return reactDocsData;
  } catch (error) {
    handleError(error, "\n\nFailed to write component-map.js file");
  }
}

async function writeRegisterFunctions(componentMap: Record<string, Result[]>) {
  const registerFunctions = `import componentMap from './component-map';
${Object.keys(componentMap)
  .map(
    (file, i) =>
      `import DefaultExport${i}, * as NamedExports${i} from './${file}';`
  )
  .join("\n")}

function registerExports(defaultExport, namedExports, file) {
  const displayNames = componentMap[file].map(({ displayName }) => displayName);
  try {
    if (displayNames.includes(defaultExport.displayName)) {
      defaultExport.__filename = file;
      defaultExport.__exportPosition = 'default';
    }
    Object.keys(namedExports).sort().forEach((key, exportPosition) => {
      if (displayNames.includes(namedExports[key].displayName)) {
        namedExports[key].__filename = file;
        namedExports[key].__exportPosition = exportPosition;
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
      `registerExports(DefaultExport${i}, NamedExports${i}, './${file}');`
  )
  .join("\n")}
`;
  try {
    await writeFile("./register-functions.js", registerFunctions);
  } catch (error) {
    handleError(error, "\n\nFailed to write register-functions.js");
  }
}

export async function init(componentFiles, babelConfig) {
  if (fs.existsSync(".storybook")) {
    throw Error(
      "Project already initialized, .storybook directory already exists"
    );
  }

  const componentMap = await writeComponentMap(componentFiles, babelConfig);
  await writeRegisterFunctions(componentMap!);
}
