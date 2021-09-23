import * as React from 'react';
import { omit } from 'lodash';

import { ReactFiberRecur } from './react-fiber-recur';
import { ObjectDatabase } from './object-database';
import { getPropType } from './get-proptype';
import { Shape } from './types';

// @ts-expect-error
export const PropTypesRuntimeGenerator = ({ children }) => {
  React.useEffect(() => {
    // @ts-expect-error
    window.ZOOMZOOM = () => {
      const objDatabase = new ObjectDatabase<Shape>();
      ReactFiberRecur(children._owner, (node) => {
        const props = omit(node.memoizedProps ?? {}, children);
        Object.entries(props).forEach(([, propValue]) => {
          getPropType(propValue, objDatabase);
        })
      })

      console.log(objDatabase)
    }
  }, [children])

  return children;
}