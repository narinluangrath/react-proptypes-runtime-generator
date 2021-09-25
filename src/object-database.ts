import { isEqual } from "lodash";

import type { PropType } from "./types";

class TwoWayMap<T, K> {
  map = new Map<T, K>();
  reverseMap = new Map<K, T>();

  get(key: T) {
    return this.map.get(key);
  }

  set(key: T, value: K) {
    this.reverseMap.set(value, key);
    return this.map.set(key, value);
  }

  reverseGet(key: K) {
    return this.reverseMap.get(key);
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
  private _objStore: TwoWayMap<number, T[]> = new TwoWayMap();
  private _objTypeMap: TwoWayMap<T, PropType> = new TwoWayMap();
  private _objCount: number = 0;
  private _idPrefix: string = "ObjectType";

  constructor(idPrefix = "ObjectType") {
    this._idPrefix = idPrefix;
  }

  getObjectToIdMap() {
    return this._objTypeMap.map;
  }

  getIdToObjectMap() {
    return this._objTypeMap.reverseMap;
  }

  storeObject(obj: T): string {
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
