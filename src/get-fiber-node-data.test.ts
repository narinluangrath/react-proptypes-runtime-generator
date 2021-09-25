import { getFiberNodeData } from "./get-fiber-node-data";
import type { Fiber } from "react-reconciler";

describe("getFiberNodeData", () => {
  it("handles function elements", () => {
    const functionElement = {
      elementType: {
        name: "FunctionComponent",
      },
      memoizedProps: {
        foo: "bar",
      },
      pendingProps: {
        baz: "biz",
      },
      _debugSource: {
        fileName: "path/to/file",
      },
    };
    expect(getFiberNodeData(functionElement as Fiber)).toEqual({
      componentId: {
        componentName: "FunctionComponent",
        fileName: "path/to/file",
      },
      propsInstance: { foo: "bar", baz: "biz" },
      isDOM: false,
    });
  });

  it("handles class elements", () => {
    const classElement = {
      elementType: {
        name: "ClassComponent",
      },
      memoizedProps: {
        foo: "bar",
      },
      pendingProps: {
        baz: "biz",
      },
      _debugSource: {
        fileName: "path/to/file",
      },
    };
    expect(getFiberNodeData(classElement as Fiber)).toEqual({
      componentId: {
        componentName: "ClassComponent",
        fileName: "path/to/file",
      },
      propsInstance: { foo: "bar", baz: "biz" },
      isDOM: false,
    });
  });

  it("handles dom elements", () => {
    const domElement = {
      elementType: "div",
      type: "div",
      memoizedProps: {
        children: "text",
      },
      pendingProps: {
        children: "text",
      },
    };
    expect(getFiberNodeData(domElement as Fiber)).toEqual({
      componentId: {
        componentName: "div",
      },
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
      componentId: {
        componentName: "react.provider",
      },
      propsInstance: { foo: "bar", baz: "biz" },
      isDOM: false,
    });
  });
});
