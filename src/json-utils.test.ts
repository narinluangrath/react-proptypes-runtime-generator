import { stringify, parse } from "./json-utils";

describe("json-utils", () => {
  const obj = {
    foo: {
      bar: "baz",
    },
    cat: "dog",
  };
  const map = new Map([
    ["a", 1],
    ["b", 2],
    ["c", 3],
  ]);
  const set = new Set(["a", "b", "c"]);

  describe("stringify", () => {
    it("handles plain objects the same as JSON.stringify", () => {
      expect(stringify(obj)).toBe(JSON.stringify(obj, null, 2));
      expect(stringify({})).toBe(JSON.stringify({}, null, 2));
    });

    it("handles Maps", () => {
      expect(stringify(map)).toMatchInlineSnapshot(`
        "{
          \\"dataType\\": \\"Map\\",
          \\"value\\": [
            [
              \\"a\\",
              1
            ],
            [
              \\"b\\",
              2
            ],
            [
              \\"c\\",
              3
            ]
          ]
        }"
      `);
    });

    it("handles Sets", () => {
      expect(stringify(set)).toMatchInlineSnapshot(`
        "{
          \\"dataType\\": \\"Set\\",
          \\"value\\": [
            \\"a\\",
            \\"b\\",
            \\"c\\"
          ]
        }"
      `);
    });
  });

  describe("parse", () => {
    it("handles plain objects the same as JSON.stringify", () => {
      expect(parse(stringify(obj))).toEqual(JSON.parse(JSON.stringify(obj)));
    });

    it("handles Maps", () => {
      expect(parse(stringify(map))).toMatchInlineSnapshot(`
        Map {
          "a" => 1,
          "b" => 2,
          "c" => 3,
        }
      `);
    });

    it("handles Sets", () => {
      expect(parse(stringify(set))).toMatchInlineSnapshot(`
        Set {
          "a",
          "b",
          "c",
        }
      `);
    });
  });
});
