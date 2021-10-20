import globby from "globby";

import util from "util";
import fs from "fs";
// import path from "path";
import reactDocs from "react-docgen";
import { sync as pkgDirSync } from "pkg-dir";

const pkgDir = pkgDirSync();
if (!pkgDir) {
  console.error("Failed to find root package directory.");
}

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

// const rprgDir = path.resolve(pkgDir!, "./.rprg");

async function main(pattern = "**/*.{js,jsx,ts,tsx}") {
  const files = await globby(pattern);

  const reactDocsData = [];
  for (const file of files) {
    try {
      const data = await readFile(file);
      reactDocs
        .parse(data, reactDocs.resolver.findAllExportedComponentDefinitions)
        .forEach(({ displayName, props }) =>
          reactDocsData.push({ displayName, props, file })
        );
    } catch (error) {
      console.error("Failed to read file");
      console.error(error);
      process.exit(1);
    }
  }

  const theImports = reactDocsData
    .map(
      ({ file }, i) =>
        `import DefaultExport${i}, * as NamedExports${i} from '${file}';`
    )
    .join("\n");

  const theFunctionDeclaration = `function registerExports(defaultExport, namedExports, file, id) {
  try {
    defaultExport.__filename = file;
    defaultExport.__id = id;
    Object.keys(namedExports).forEach(key => {
      namedExports[key].__filename = file;
      namedExports[key].__id = id;
    });
  } catch (e) {
    console.warning('Failed to modify React component for tracking purposes');
    console.warning(e);
  }
}`;

  const theFunctionCalls = reactDocsData
    .map(
      ({ file }, i) =>
        `registerExports(DefaultExport${i}, NamedExports${i}, ${file}, ${i})`
    )
    .join("\n");

  try {
    await writeFile(
      "register-functions.js",
      [theImports, theFunctionDeclaration, theFunctionCalls].join("\n\n")
    );
  } catch (error) {
    console.error("Failed to write register-functions.js");
    console.error(error);
    process.exit(1);
  }
}

main();
