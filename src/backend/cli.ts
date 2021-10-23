import fs from "fs";

import yargs from "yargs/yargs";
import { init } from "./init";
import { startServer } from "./start-server";
import { generateStories } from "./generate-stories";

const { argv } = yargs(process.argv.slice(2));
const commands = argv._;

if (!fs.existsSync("./package.json")) {
  throw Error(
    "react-storystrap should only be called in the package root directory. Could not find package.json in current working directory"
  );
}

if (!fs.existsSync("./node_modules")) {
  throw Error(
    "react-storystrap should only be called in the package root directory. Could not find node_modules in current working directory"
  );
}

if (!commands.length) {
  throw Error(
    'Missing command, expected one of "init", "start-server", "generate-stories"'
  );
}

if (commands.length > 1) {
  throw Error(
    `Only one command can be passed, received ${commands.join(", ")}`
  );
}

const command = commands[0];
switch (command) {
  case "init":
    init(String(argv.componentFiles), String(argv.babelConfig));
    break;
  case "start-server":
    startServer();
    break;
  case "generate-stories":
    generateStories();
    break;
  default:
    throw Error(`Unknown command "${command}"`);
}
