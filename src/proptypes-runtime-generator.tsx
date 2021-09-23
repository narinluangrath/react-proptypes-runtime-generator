import * as React from "react";
import { omit } from "lodash";

import { getNameFromFiber } from "./get-name-from-fiber";
import { ReactFiberRecur } from "./react-fiber-recur";
import { ObjectDatabase } from "./object-database";
import { getPropType } from "./get-proptype";
import { PropType, Shape } from "./types";

type Statistics = {
  numInstances: number;
  componentNames: Set<string>;
  propNames: Set<string>;
};

const initStats = () => ({
  numInstances: 0,
  componentNames: new Set<string>(),
  propNames: new Set<string>(),
});

// @ts-expect-error
export const PropTypesRuntimeGenerator = ({ children }) => {
  React.useEffect(() => {
    // @ts-expect-error
    window.ZOOMZOOM = () => {
      const stats = new Map<PropType, Statistics>();
      const objDatabase = new ObjectDatabase<Shape>();
      ReactFiberRecur(children._owner, (node) => {
        const props = omit(node.memoizedProps ?? {}, children);
        Object.entries(props).forEach(([propName, propValue]) => {
          const propType = getPropType(propValue, objDatabase);

          if (!stats.get(propType)) {
            stats.set(propType, initStats());
          }

          stats.get(propType)!.numInstances += 1;
          stats.get(propType)!.componentNames.add(getNameFromFiber(node));
          stats.get(propType)!.componentNames.add(propName);
        });
      });

      console.log(objDatabase);
      console.log(stats);
    };
  }, [children]);

  return children;
};
