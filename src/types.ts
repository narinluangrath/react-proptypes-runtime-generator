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
export type ObjectTypeShape = { [propName: string]: PropType };

// fileName and componentName separated by a colon
// e.g. path/to/file:MyComponent
type ComponentId = string;

type PropsInstance = { [propName: string]: any };

export type FiberNodeData = {
  componentId: ComponentId;
  propsInstance: PropsInstance;
  isDOM: boolean;
};

export type PropTypeDatum = {
  associatedPropNames: Set<PropName>;
  associatedComponentIds: Set<ComponentId>;
  objectTypeShape: ObjectTypeShape;
};

export type PropTypeData = Map<PropType, PropTypeDatum>;

export type ComponentDatum = {
  propTypes: { [propName: string]: PropType };
  propsInstances: Set<PropsInstance>;
};

export type ComponentData = Map<ComponentId, ComponentDatum>;
