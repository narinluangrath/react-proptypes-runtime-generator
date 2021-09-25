import React from "react";
import { cloneDeep } from "lodash";

import { getPropType } from "./get-proptype";
import { ObjectDatabase } from "./object-database";
import { ObjectTypeShape } from "./types";

describe("getPropType", () => {
  it("handles primitive arguments", () => {
    expect(getPropType(4)).toBe("PropTypes.number");
    expect(getPropType("foo")).toBe("PropTypes.string");
    expect(getPropType(true)).toBe("PropTypes.bool");
    expect(getPropType(Symbol("foo"))).toBe("PropTypes.symbol");
    expect(getPropType(() => {})).toBe("PropTypes.func");
  });

  it("handles homogeneous arrays", () => {
    expect(getPropType([4, 5, 6])).toBe("PropTypes.arrayOf(PropTypes.number)");
    expect(getPropType(["4", "5", "6"])).toBe(
      "PropTypes.arrayOf(PropTypes.string)"
    );
  });

  it("handles heterogeneous arrays", () => {
    expect(getPropType([4, "4"])).toBe("PropTypes.array");
  });

  it("handles non-plain objects", () => {
    expect(getPropType(new Date("01/09/1995"))).toBe(
      "PropTypes.instanceOf(Date)"
    );
    expect(getPropType(new Set())).toBe("PropTypes.instanceOf(Set)");
    expect(getPropType(new Map())).toBe("PropTypes.instanceOf(Map)");
  });

  it("handles deeply nested objects without creating duplicate types", () => {
    const objectDatabase = new ObjectDatabase<ObjectTypeShape>("ObjectType");
    const obj = {
      foo: {
        bar: {
          baz: "zoo",
        },
      },
    };
    const type1 = getPropType(obj, objectDatabase);
    const type2 = getPropType(cloneDeep(obj), objectDatabase);
    expect(type2).toBe(type1);
    expect(type1).toMatchInlineSnapshot(`"ObjectType2"`);
    expect(objectDatabase.getIdToObjectMap()).toMatchInlineSnapshot(`
      Map {
        "ObjectType0" => Object {
          "baz": "PropTypes.string",
        },
        "ObjectType1" => Object {
          "bar": "ObjectType0",
        },
        "ObjectType2" => Object {
          "foo": "ObjectType1",
        },
      }
    `);
  });

  it("handles JSX", () => {
    function MyApp() {
      return <div />;
    }
    expect(getPropType(<div />)).toBe("PropTypes.node");
    expect(getPropType(<MyApp />)).toBe("PropTypes.node");
  });
});
