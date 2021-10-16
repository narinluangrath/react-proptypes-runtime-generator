import { ObjectStore } from "./object-store";
import { getPropType } from "./get-proptype";
import type {
  FiberNodeData,
  ComponentData,
  PropTypeData,
  PropType,
  ObjectTypeShape,
  PropTypeDatum,
  ComponentDatum,
} from "./types";

const initComponentData = (): ComponentDatum => ({
  propsInstances: new Set(),
  propTypes: {},
});

const initPropTypeData = (objectTypeShape: ObjectTypeShape): PropTypeDatum => ({
  associatedComponentIds: new Set(),
  associatedPropNames: new Set(),
  objectTypeShape,
});

const objStore = new ObjectStore<ObjectTypeShape>();

export function createExportedData(data: Omit<FiberNodeData, 'isDOM'>[]) {
  const componentData: ComponentData = new Map();
  const propTypeData: PropTypeData = new Map();

  data.forEach(({ propsInstance, componentId }) => {
    if (!componentData.get(componentId)) {
      componentData.set(componentId, initComponentData());
    }
    componentData.get(componentId)!.propsInstances.add(propsInstance);

    Object.entries(propsInstance).forEach(([propName, propValue]) => {
      const propType: PropType = getPropType(propValue, objStore);
      // Some keys might get overwritten if different propsInstances
      // generate different propTypes. @TODO: Handle conflicts intelligently
      componentData.get(componentId)!.propTypes[propName] = propType;
      const thing = objStore.get(propType)!

      if (propType.startsWith("ObjectType")) {
        if (!propTypeData.get(propType)) {
          propTypeData.set(
            propType,
            initPropTypeData(thing)
          );
        }
        propTypeData
          .get(propType)!
          .associatedComponentIds.add(componentId);
        propTypeData.get(propType)!.associatedPropNames.add(propName);
      }
    });
  });

  return {
    componentData,
    propTypeData,
  };
}
