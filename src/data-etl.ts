import { parse, stringify } from "./json-utils";
import { createExportedData } from "./create-exported-data";

const { createInterface } = require("readline");
const { createReadStream } = require("fs");

const lineReader = createInterface({ input: createReadStream("./data.json") });

const data = [];
lineReader.on("line", (line) => {
  const datum = parse(line);
  data.push(datum);
});

lineReader.on("close", () => {
  console.log(stringify(createExportedData(data)));
});
