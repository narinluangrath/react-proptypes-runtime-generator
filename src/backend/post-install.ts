import util from "util";
import fs from "fs";
// import path from "path";

import globby from "globby";
import reactDocs from "react-docgen";
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

async function writeComponentMap(pattern = "**/*.{js,jsx,ts,tsx}") {
  const reactDocsData: Record<string, Result[]> = {};
  const files = await globby(pattern);
  for (const file of files) {
    try {
      const fileData = await readFile(file);
      const componentDefs = reactDocs.parse(
        fileData,
        reactDocs.resolver.findAllExportedComponentDefinitions
      );
      if (componentDefs.length) {
        reactDocsData[file] = componentDefs;
      }
    } catch (error) {
      handleError(error, `Failed to read file ${file}`);
    }
  }

  const stringified = JSON.stringify(reactDocsData, null, 2);
  try {
    await writeFile("./component-map.js", `export default ${stringified}`);
    return reactDocsData;
  } catch (error) {
    handleError(error, "Failed to write component-map.js file");
  }
}

async function writeRegisterFunctions(componentMap: Record<string, Result[]>) {
  const registerFunctions = `import componentMap from './component-map';
${Object.keys(componentMap)
  .map(
    (file, i) =>
      `import DefaultExport${i}, * as NamedExports${i} from '${file}';`
  )
  .join("\n")}

function registerExports(defaultExport, namedExports, file) {
  const displayNames = componentMap[file].map(({ displayName }) => displayName);
  try {
    if (displayNames.includes(defaultExport.displayName)) {
      defaultExport.__filename = file;
      defaultExport.__exportPosition = 'default';
    }
    Object.keys(namedExports).forEach((key, exportPosition) => {
      if (displayNames.includes(namedExports[key].displayName)) {
        namedExports[key].__filename = file;
        namedExports[key].__exportPosition = exportPosition;
      }
    });
  } catch (e) {
    console.warning('Failed to modify React component for tracking purposes');
    console.warning(e);
  }

${Object.keys(componentMap)
  .map(
    (file, i) =>
      `registerExports(DefaultExport${i}, NamedExports${i}, ${file});`
  )
  .join("\n")}
`;
  try {
    await writeFile("./register-functions.js", registerFunctions);
  } catch (error) {
    handleError(error, "Failed to write register-functions.js");
  }
}

async function main() {
  // const pkgDir = pkgDirSync();
  // if (!pkgDir) {
  //   console.error("Failed to find root package directory.");
  // }

  const componentMap = await writeComponentMap();
  await writeRegisterFunctions(componentMap!);
}

main();
