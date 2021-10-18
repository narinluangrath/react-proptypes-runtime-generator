import { traverseReactFiber } from "./traverse-react-fiber";
import type { Fiber } from "react-reconciler";

/**
 * The root fiber node created by the following React code:
 *
 * const GrandChild2 = () => <div key="div2" />;
 * const GrandChild = () => <div key="div" />;
 * const Child = () => <GrandChild key="grandChild" />;
 * const Sibling = () => <GrandChild2 key="grandChild2" />;
 * const Parent = () => (
 *   <>
 *     <Child key="child" />
 *     <Sibling key="sibling" />
 *   </>
 * );
 * const App = () => <Parent key="parent" />;
 * const rootElement = document.getElementById("root");
 * render(<App key="app" />, rootElement);
 */
const root = {
  sibling: null,
  child: {
    sibling: null,
    child: {
      sibling: null,
      child: {
        sibling: {
          sibling: null,
          child: {
            sibling: null,
            child: {
              sibling: null,
              child: null,
              key: "div2",
            },
            key: "grandChild2",
          },
          key: "sibling",
        },
        child: {
          sibling: null,
          child: {
            sibling: null,
            child: null,
            key: "div",
          },
          key: "grandChild",
        },
        key: "child",
      },
      key: "parent",
    },
    key: "app",
  },
  key: null,
} as Fiber;

describe("react-fiber-recur", () => {
  it("traverses the tree using depth first search", () => {
    const visitedKeys: (string | null)[] = [];
    traverseReactFiber(root, (node) => {
      visitedKeys.push(node.key);
    });
    expect(visitedKeys).toEqual([
      null,
      "app",
      "parent",
      "child",
      "grandChild",
      "div",
      "sibling",
      "grandChild2",
      "div2",
    ]);
  });

  it("stops traversing when the callback returns true", () => {
    const visitedKeys: (string | null)[] = [];
    traverseReactFiber(root, (node) => {
      visitedKeys.push(node.key);
      return node.key === "div";
    });
    expect(visitedKeys).toEqual([
      null,
      "app",
      "parent",
      "child",
      "grandChild",
      "div",
    ]);
  });
});
