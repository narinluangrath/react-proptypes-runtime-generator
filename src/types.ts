// String representations for type definitions
// Specifically, these strings are one of the following:
// 'PropTypes.number'
// 'PropTypes.string'
// 'PropTypes.bool'
// 'PropTypes.symbol'
// 'PropTypes.func'
// 'PropTypes.oneOf([undefined])'
// 'PropTypes.oneOf([null])'
// 'PropTypes.arrayOf(<PropType>)'
// 'PropTypes.array'
// 'PropTypes.instanceOf(<Constructor>)'
// 'PropTypes.any'
// 'ObjectType0'
// 'ObjectType1'
// 'ObjectType2'
// ...etc
export type PropType = string;
export type PropName = string;
export type ObjectTypeShape = { [propName: PropName]: PropType };

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
