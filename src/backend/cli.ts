import yargs from "yargs/yargs";
import { init } from "./init";
import { startServer } from "./start-server";
import { generateStories } from "./generate-stories";

const { argv } = yargs(process.argv.slice(2));
const commands = argv._;

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
    init(argv.componentFiles, argv.babelConfig);
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
