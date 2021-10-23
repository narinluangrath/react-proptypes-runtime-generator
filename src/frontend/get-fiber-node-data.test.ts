import { getFiberNodeData } from "./get-fiber-node-data";
import type { Fiber } from "react-reconciler";

describe("getFiberNodeData", () => {
  it("handles function elements", () => {
    const functionElement = {
      elementType: {
        name: "FunctionComponent",
        __fileName: "path/to/file",
        __exportName: "default",
      },
      memoizedProps: {
        foo: "bar",
      },
      pendingProps: {
        baz: "biz",
      },
    };
    expect(getFiberNodeData(functionElement as Fiber)).toEqual({
      componentId: "path/to/file:default:FunctionComponent",
      propsInstance: { foo: "bar", baz: "biz" },
      isDOM: false,
    });
  });

  it("handles class elements", () => {
    const classElement = {
      elementType: {
        name: "ClassComponent",
        __fileName: "path/to/file",
        __exportName: "MyClassComponent",
      },
      memoizedProps: {
        foo: "bar",
      },
      pendingProps: {
        baz: "biz",
      },
    };
    expect(getFiberNodeData(classElement as Fiber)).toEqual({
      componentId: "path/to/file:MyClassComponent:ClassComponent",
      propsInstance: { foo: "bar", baz: "biz" },
      isDOM: false,
    });
  });

  it("handles dom elements", () => {
    const domElement = {
      elementType: "div",
      type: "div",
      memoizedProps: {},
      pendingProps: {},
    };
    expect(getFiberNodeData(domElement as Fiber)).toEqual({
      componentId: "::div",
      propsInstance: {},
      isDOM: true,
    });
  });

  it("handles react built-in elements", () => {
    const contextProvider = {
      elementType: {
        $$typeof: Symbol.for("react.provider"),
      },
      memoizedProps: {
        foo: "bar",
      },
      pendingProps: {
        baz: "biz",
      },
    };
    expect(getFiberNodeData(contextProvider as Fiber)).toEqual({
      componentId: "::react.provider",
      propsInstance: { foo: "bar", baz: "biz" },
      isDOM: false,
    });
  });

  it("handles strings in the dom", () => {
    const stringElement = {
      elementType: null,
      memoizedProps: "some text",
      pendingProps: "some text",
      stateNode: {
        __proto__: {
          constructor: {
            name: "Text",
          },
        },
      },
    };
    expect(getFiberNodeData(stringElement as Fiber)).toEqual({
      componentId: "::Text",
      propsInstance: {},
      isDOM: false,
    });
  });
});
