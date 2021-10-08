import { stringify, parse } from "./json-utils";

export function scrubCircularReferences(obj: object) {
  return parse(stringify(obj));
}
