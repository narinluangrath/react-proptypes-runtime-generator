const safeStringify = require("fast-safe-stringify");

// Adapted from https://stackoverflow.com/a/56150320

function replacer(_: string, value: any) {
  if (value instanceof Map) {
    return {
      dataType: "Map",
      value: Array.from(value.entries()),
    };
  }
  if (value instanceof Set) {
    return {
      dataType: "Set",
      value: Array.from(value.values()),
    };
  }
  return value;
}

function reviver(_: string, value: any) {
  if (typeof value === "object" && value !== null) {
    if (value.dataType === "Map") {
      return new Map(value.value);
    }
    if (value.dataType === "Set") {
      return new Set(value.value);
    }
  }
  return value;
}

export function stringify(data: any) {
  return safeStringify(data, replacer, 2, { depthLimit: 10, edgesLimit: 10 });
}

export function parse(str: string) {
  return JSON.parse(str, reviver);
}

export function scrubCircularReferences(obj: object) {
  return parse(stringify(obj));
}
