import { Bijection, ObjectStore } from "./object-store";

describe("helpers", () => {
  describe("Bijection", () => {
    it("is similar to a map", () => {
      const cubed = new Bijection<number, number>();
      cubed.set(-2, (-2) ** 3);
      cubed.set(-1, (-1) ** 3);
      cubed.set(0, 0 ** 3);
      cubed.set(1, 1 ** 3);
      cubed.set(2, 2 ** 3);

      expect(cubed.get(-2)).toBe((-2) ** 3);
      expect(cubed.get(-1)).toBe((-1) ** 3);
      expect(cubed.get(0)).toBe(0 ** 3);
      expect(cubed.get(1)).toBe(1 ** 3);
      expect(cubed.get(2)).toBe(2 ** 3);
    });

    it("is iterable", () => {
      const cubed = new Bijection<number, number>();
      cubed.set(-1, (-1) ** 3);
      cubed.set(0, 0 ** 3);
      cubed.set(1, 1 ** 3);

      expect([...cubed]).toMatchInlineSnapshot(`
        Array [
          Array [
            -1,
            -1,
          ],
          Array [
            0,
            0,
          ],
          Array [
            1,
            1,
          ],
        ]
      `);
    });

    it("but does not allow many to one or one to many maps", () => {
      const cubed = new Bijection<number, number>();
      expect(() => cubed.set(-2, (-2) ** 2)).not.toThrow();
      expect(() => cubed.set(-1, (-1) ** 2)).not.toThrow();
      expect(() => cubed.set(0, 0 ** 2)).not.toThrow();
      expect(() => cubed.set(1, 1 ** 2)).toThrow();
      expect(() => cubed.set(2, 2 ** 2)).toThrow();
    });

    it("and has an inverse get function", () => {
      const capitalized = new Bijection<string, string>();
      capitalized.set("a", "A");
      capitalized.set("b", "B");
      capitalized.set("c", "C");
      capitalized.set("d", "D");
      capitalized.set("e", "E");

      expect(capitalized.inverseGet("A")).toBe("a");
      expect(capitalized.inverseGet("B")).toBe("b");
      expect(capitalized.inverseGet("C")).toBe("c");
      expect(capitalized.inverseGet("D")).toBe("d");
      expect(capitalized.inverseGet("E")).toBe("e");
    });
  });
});

describe("ObjectStore", () => {
  it("can store and retrieve objects", () => {
    const objStore = new ObjectStore();
    const obj1 = { foo: "foo" };
    const id1 = objStore.storeObject(obj1);
    const obj2 = { bar: "bar" };
    const id2 = objStore.storeObject(obj2);

    expect(objStore.get(id1)).toBe(obj1);
    expect(objStore.get(id2)).toBe(obj2);
  });

  it("does not store multiple objects with the same shape (shallow equality)", () => {
    const objStore = new ObjectStore();
    const obj = { foo: "bar" };
    const objCopy = { ...obj };

    const id = objStore.storeObject(obj);
    const idCopy = objStore.storeObject(objCopy);

    expect(id).toBe(idCopy);
    expect(objStore.get(id)).toEqual(obj);
    expect(objStore.get(id)).toEqual(objCopy);
  });

  it("is iterable", () => {
    const objStore = new ObjectStore();
    objStore.storeObject({ foo: "foo" });
    objStore.storeObject({ bar: "bar" });

    expect([...objStore]).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "foo": "foo",
          },
          "ObjectType0",
        ],
        Array [
          Object {
            "bar": "bar",
          },
          "ObjectType1",
        ],
      ]
    `);
  });
});
