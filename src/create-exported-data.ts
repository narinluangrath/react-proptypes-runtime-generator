import { ObjectStore } from "./object-store";
import { getPropType } from "./get-proptype";
import type {
  FiberNodeData,
  ExportedComponentData,
  ExportedPropTypeData,
  PropType,
  ObjectTypeShape,
  PropTypeData,
  ComponentData,
} from "./types";

const initComponentData = (): ComponentData => ({
  propsInstances: new Set(),
  propTypes: {},
});

const initPropTypeData = (objectTypeShape: ObjectTypeShape): PropTypeData => ({
  associatedComponentIds: new Set(),
  associatedPropNames: new Set(),
  objectTypeShape,
});

const objStore = new ObjectStore<ObjectTypeShape>();

export function createExportedData(data: FiberNodeData[]) {
  const exportedComponentData: ExportedComponentData = new Map();
  const exportedPropTypeData: ExportedPropTypeData = new Map();

  data.forEach(({ propsInstance, componentId }) => {
    if (!exportedComponentData.get(componentId)) {
      exportedComponentData.set(componentId, initComponentData());
    }
    exportedComponentData.get(componentId)!.propsInstances.add(propsInstance);

    Object.entries(propsInstance).forEach(([propName, propValue]) => {
      const propType: PropType = getPropType(propValue, objStore);
      // Some keys might get overwritten if different propsInstances
      // generate different propTypes. @TODO: Handle conflicts intelligently
      exportedComponentData.get(componentId)!.propTypes[propName] = propType;

      if (propType.startsWith("ObjectType")) {
        if (!exportedPropTypeData.get(propType)) {
          exportedPropTypeData.set(
            propType,
            initPropTypeData(objStore.get(propType)!)
          );
        }
        exportedPropTypeData
          .get(propType)!
          .associatedComponentIds.add(componentId);
        exportedPropTypeData.get(propType)!.associatedPropNames.add(propName);
      }
    });
  });

  return {
    exportedComponentData,
    exportedPropTypeData,
  };
}
