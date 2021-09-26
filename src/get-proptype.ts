import { isPlainObject } from "lodash";
import fclone from "fclone";

import { ObjectDatabase } from "./object-database";
import { PropType, ObjectTypeShape } from "./types";

export function getPropType(
  x: any,
  objectDatabase = new ObjectDatabase<ObjectTypeShape>()
): PropType {
  switch (typeof x) {
    case "number":
    case "bigint":
      return "PropTypes.number";
    case "string":
      return "PropTypes.string";
    case "boolean":
      return "PropTypes.bool";
    case "symbol":
      return "PropTypes.symbol";
    case "function":
      return "PropTypes.func";
    case "undefined":
      return "PropTypes.oneOf([undefined])";
  }

  // Must be 'object' type
  // This may correspond to "normal" objects (e.g. { foo: 'bar' }),
  // or Arrays, Dates, Maps, Sets, null, etc.

  if (x === null) {
    return "PropTypes.oneOf([null])";
  }

  if (Array.isArray(x)) {
    const isNonEmpty = !!x.length;
    const isHomogeneous = x.every(
      (el, i) =>
        i === 0 ||
        getPropType(el, objectDatabase) ===
          getPropType(x[i - 1], objectDatabase)
    );
    const headPropType = getPropType(x[0], objectDatabase);
    return isNonEmpty && isHomogeneous
      ? `PropTypes.arrayOf(${headPropType})`
      : `PropTypes.array`;
  }

  if (x?.$$typeof) {
    return "PropTypes.node";
  }

  if (isPlainObject(x)) {
    const scrubed = fclone(x);
    const shape: ObjectTypeShape = Object.entries(scrubed).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: getPropType(value, objectDatabase),
      }),
      {}
    );
    return (
      objectDatabase.isObjectStored(shape) || objectDatabase.storeObject(shape)
    );
  }

  // eslint-disable-next-line
  const constructorName = x?.__proto__?.constructor?.name;
  return constructorName
    ? `PropTypes.instanceOf(${constructorName})`
    : "PropTypes.any";
}
