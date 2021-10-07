import { isEqual } from "lodash";

// A Bijection<T, K> is a one-to-one mapping Map<T, K>
// All bijections are maps, but not all maps are bijections
export class Bijection<D, R> {
  domain = new Set<D>();
  range = new Set<R>();
  map = new Map<D, R>();
  inverseMap = new Map<R, D>();

  [Symbol.iterator]() {
    return this.map[Symbol.iterator]();
  }

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

// Store and search a large number of objects.
// Avoid storing "duplicate" objects where
// two objects are considered the same by
// shallow equality
export class ObjectStore<T extends object> {
  /**
   * _objSubStore.get(0) // List of objects with zero keys
   * _objSubStore.get(1) // List of objects with one key
   * _objSubStore.get(2) // List of objects with two keys
   *                     // ...etc
   */
  private _objSubStore: Bijection<number, T[]> = new Bijection();
  private _objTypeMap: Bijection<T, string> = new Bijection();
  private _objCount: number = 0;
  private _idPrefix: string = "ObjectType";

  constructor(idPrefix = "ObjectType") {
    this._idPrefix = idPrefix;
  }

  [Symbol.iterator]() {
    return this._objTypeMap[Symbol.iterator]();
  }

  get(id: string) {
    return this._objTypeMap.inverseMap.get(id);
  }

  // Store object and return an id
  // ObjectStore.get(ObjectStore.storeObject(obj)) === obj
  storeObject(obj: T): string {
    console.info("storeObject", obj);

    const maybeObjectId = this._isObjectStored(obj);
    if (maybeObjectId) {
      return maybeObjectId;
    }

    // Save object to substore
    const numKeys = Object.keys(obj).length;
    if (!this._objSubStore.get(numKeys)) {
      this._objSubStore.set(numKeys, []);
    }
    this._objSubStore.get(numKeys)!.push(obj);

    // Save object to typeMap
    const id = `${this._idPrefix}${this._objCount}`;
    this._objTypeMap.set(obj, id);
    this._objCount += 1;

    return id;
  }

  // Check if `obj` is already stored using shallow equality
  private _isObjectStored(obj: T): string | null {
    console.info("isObjectStored", obj);
    const numKeys = Object.keys(obj).length;
    const objectMatch = this._objSubStore
      .get(numKeys)
      ?.find((storedObj) => storedObj === obj || isEqual(storedObj, obj));

    if (objectMatch) {
      return this._objTypeMap.get(objectMatch) ?? null;
    }

    return null;
  }
}
