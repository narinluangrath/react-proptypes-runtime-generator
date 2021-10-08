import { isPlainObject } from "lodash";

import { scrubCircularReferences } from "./scrub-circular-references";
import { ObjectStore } from "./object-store";
import { PropType, ObjectTypeShape } from "./types";

export function getPropType(
  x: any,
  objectStore = new ObjectStore<ObjectTypeShape>()
): PropType {
  console.info("getPropType", x);
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
        getPropType(el, objectStore) === getPropType(x[i - 1], objectStore)
    );
    const headPropType = getPropType(x[0], objectStore);
    return isNonEmpty && isHomogeneous
      ? `PropTypes.arrayOf(${headPropType})`
      : `PropTypes.array`;
  }

  if (x?.$$typeof) {
    return "PropTypes.node";
  }

  if (isPlainObject(x)) {
    const scrubbed = scrubCircularReferences(x);
    const shape: ObjectTypeShape = Object.entries(scrubbed).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: getPropType(value, objectStore),
      }),
      {}
    );
    return objectStore.storeObject(shape);
  }

  // eslint-disable-next-line
  const constructorName = x?.__proto__?.constructor?.name;
  return constructorName
    ? `PropTypes.instanceOf(${constructorName})`
    : "PropTypes.any";
}
