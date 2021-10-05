import { ObjectDatabase } from "./object-database";
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

const objDatabase = new ObjectDatabase<ObjectTypeShape>();

export function createExportedData(data: FiberNodeData[]) {
  console.info("createExportedData", data);
  const exportedComponentData: ExportedComponentData = new Map();
  const exportedPropTypeData: ExportedPropTypeData = new Map();

  data.forEach(({ propsInstance, componentId, isDOM }) => {
    console.info("data.forEach", { propsInstance, componentId, isDOM });

    if (!exportedComponentData.get(componentId)) {
      exportedComponentData.set(componentId, initComponentData());
    }
    exportedComponentData.get(componentId)!.propsInstances.add(propsInstance);

    Object.entries(propsInstance).forEach(([propName, propValue]) => {
      console.info("Object.entries", [propName, propValue]);
      const propType: PropType = getPropType(propValue, objDatabase);
      // Some keys might get overwritten if different propsInstances
      // generate different propTypes. @TODO: Handle conflicts intelligently
      exportedComponentData.get(componentId)!.propTypes[propName] = propType;

      if (!exportedPropTypeData.get(propType)) {
        exportedPropTypeData.set(
          propType,
          initPropTypeData(objDatabase.getObject(propType)!)
        );
      }
      exportedPropTypeData
        .get(propType)!
        .associatedComponentIds.add(componentId);
      exportedPropTypeData.get(propType)!.associatedPropNames.add(propName);
    });
  });

  return {
    exportedComponentData,
    exportedPropTypeData,
  };
}
