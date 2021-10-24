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

async function getComponentMap(componentFiles: string, babelConfig: string) {
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

  return reactDocsData;
}

async function writeRegisterComponents(componentMap: Record<string, Result[]>) {
  function getRelative(file: string) {
    return path.relative(path.join(process.cwd(), ".storystrap"), file);
  }

  const registerComponents = `${Object.keys(componentMap)
    .map(
      (file, i) =>
        `import DefaultExport${i}, * as NamedExports${i} from '${getRelative(
          file
        )}';`
    )
    .join("\n")}

function registerExports(defaultExport, namedExports, file) {
  try {
    defaultExport.__fileName = file;
    defaultExport.__exportName = 'default';
    Object.keys(namedExports).forEach((key) => {
      namedExports[key].__fileName = file;
      namedExports[key].__exportName = key;
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
  const componentMap = await getComponentMap(componentFiles, babelConfig);
  await writeRegisterComponents(componentMap!);
}
