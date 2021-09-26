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

// fileName and componentName separated by a colon
// e.g. path/to/file:MyComponent
type ComponentId = string;

type PropsInstance = { [propName: PropName]: any };

export type FiberNodeData = {
  componentId: ComponentId;
  propsInstance: PropsInstance;
  isDOM: boolean;
};

export type PropTypeData = {
  associatedPropNames: Set<PropName>;
  associatedComponentIds: Set<ComponentId>;
};

export type ExportedPropTypeData = Map<PropType, PropTypeData>;

export type ComponentData = {
  propTypes: { [propName: PropName]: PropType };
  propsInstances: Set<PropsInstance>;
};

export type ExportedComponentData = Map<ComponentId, ComponentData>;
