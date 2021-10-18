import globby from "globby";

const fs = require("fs");
const path = require("path");
// const reactDocs = require('react-)docgen';
const { sync: pkgDirSync } = require("pkg-dir");

const pkgDir = pkgDirSync();
if (!pkgDir) {
  console.error("Failed to find root package directory.");
}

const rprgDir = path.resolve(pkgDir!, "./rprg");
fs.mkdirSync(rprgDir);

async function main() {
  const pattern = "**/*.{js,jsx,ts,tsx}";
  const res = await globby(pattern);
  console.log(res);
}

main();

// , (err, files) => {
//   if (err) {
//     console.error('Failed to find files using glob pattern:', pattern)
//     console.error(err);
//     process.exit(1);
//   }

//   files.forEach(file => {
//     fs.readFile(file, (error, data) => {
//       if (error) {
//         console.error(error);
//       } else {
//         const { displayName, props } = reactDocs.parse(data, reactDocs.resolver.findAllExportedComponentDefinitions);
//         console.log({ displayName, props });
//       }
//     })
//   })
// })
