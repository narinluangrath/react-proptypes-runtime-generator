import globby from "globby";

import fs from "fs";
import path from "path";
import reactDocs from 'react-docgen';
import { sync as pkgDirSync } from "pkg-dir";

const pkgDir = pkgDirSync();
if (!pkgDir) {
  console.error("Failed to find root package directory.");
}

const rprgDir = path.resolve(pkgDir!, "./.rprg");
fs.mkdirSync(rprgDir);

async function main(pattern = "**/*.{js,jsx,ts,tsx}") {
  const reactDocsData = [];
  const files = await globby(pattern);
  files.forEach(file => {
    fs.readFile(file, (error, data) => {
      if (error) {
        console.error('Failed to read file')
        console.error(error);
        process.exit(1);
      } else {
        const { displayName, props } = reactDocs.parse(data, reactDocs.resolver.findAllExportedComponentDefinitions);
        reactDocsData.push({ displayName, props, file });
      }
    })
  });

  const theImports = reactDocsData
    .map(({ file }, i) => `import DefaultExport${i}, * as NamedExports${i} from '${file}';`)
    .join("\n");

  const theTryCatch = reactDocsData
    .map(({ file, i }) => `
      try {
        DefaultExport.__filename = '${file}';
        Object.keys(NamedExports).forEach(key => {
          NamedExports[key].__filename = '${file}';
        });
      } catch (e) {
        console.warning('Failed to modify React component for tracking purposes');
        console.warning(e);
      }
    `)
    .join("\n")

main();
