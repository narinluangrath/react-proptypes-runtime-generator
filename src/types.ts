export type PropType = string;
export type PropName = string;
export type Shape = { [key: string]: PropType };

type ComponentId = {
  componentName: string;
  fileName?: string;
};

type PropsInstance = { [propName: PropName]: any };

export type FiberNodeData = {
  componentId: ComponentId;
  propsInstance: PropsInstance;
  isDOM: boolean;
};

export type ExportedPropTypeData = {
  propType: PropType;
  associatedpropNames: PropName[];
  associatedComponentIds: ComponentId[];
}[];

export type ExportedComponentData = {
  componentId: ComponentId;
  propsTypes: { [propName: PropName]: PropType };
  propsInstances: PropsInstance[];
}[];
