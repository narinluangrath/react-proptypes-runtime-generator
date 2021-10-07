import { isEqual } from "lodash";

import type { PropType } from "./types";

// A Bijection<T, K> is a one-to-one mapping Map<T, K>
// All bijections are maps, but not all maps are bijections
class Bijection<D, R> {
  domain = new Set<D>();
  range = new Set<R>();
  map = new Map<D, R>();
  inverseMap = new Map<R, D>();

  get(x: D) {
    return this.map.get(x);
  }

  inverseGet(y: R) {
    return this.inverseMap.get(y);
  }

  set(x: D, y: R) {
    if (this.map.get(x) === y) {
      return this.map;
    }

    if (this.range.has(y)) {
      throw Error(
        `Cannot set mapping ${x} -> ${y}, ${this.inverseMap.get(y)} -> y exists`
      );
    }

    this.inverseMap.set(y, x);
    this.domain.add(x);
    this.range.add(y);
    return this.map.set(x, y);
  }
}

// Store and search a large number of objects
export class ObjectDatabase<T extends object> {
  /**
   * _objStore.get(0) // List of objects with zero keys
   * _objStore.get(1) // List of objects with one key
   * _objStore.get(2) // List of objects with two keys
   *                  // ...etc
   */
  private _objStore: Bijection<number, T[]> = new Bijection();
  private _objTypeMap: Bijection<T, PropType> = new Bijection();
  private _objCount: number = 0;
  private _idPrefix: string = "ObjectType";

  constructor(idPrefix = "ObjectType") {
    this._idPrefix = idPrefix;
  }

  getObjectToIdMap() {
    console.info("getObjectToIdMap");
    return this._objTypeMap.map;
  }

  getIdToObjectMap() {
    console.info("getIdToObjectMap");
    return this._objTypeMap.inverseMap;
  }

  getObject(p: PropType) {
    return this.getIdToObjectMap().get(p);
  }

  storeObject(obj: T): string {
    console.info("storeObject", obj);
    const numKeys = Object.keys(obj).length;
    if (!this._objStore.get(numKeys)) {
      this._objStore.set(numKeys, []);
    }
    this._objStore.get(numKeys)!.push(obj);

    const typeName = `${this._idPrefix}${this._objCount}`;
    this._objTypeMap.set(obj, typeName);

    this._objCount += 1;

    return typeName;
  }

  // isObjectStored(obj) returns true if
  // an object with the same keys/values
  // exists in this._store
  isObjectStored(obj: T): PropType | null {
    console.info("isObjectStored", obj);
    const numKeys = Object.keys(obj).length;
    const objectMatch = this._objStore
      .get(numKeys)
      ?.find((storedObj) => storedObj === obj || isEqual(storedObj, obj));

    if (objectMatch) {
      return this._objTypeMap.get(objectMatch) ?? null;
    }

    return null;
  }
}
