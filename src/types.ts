export type PropType = string;
export type Shape = { [key: string]: PropType };

type Component = {
  componentName: string;
  fileName: string;
};

export type ExportedPropTypeData = {
  propType: PropType;
  associatedpropNames: string[];
  associatedComponents: Component[];
}[];

export type ExportedComponentData = {
  component: Component;
  props: { [propName: string]: PropType };
  exampleData: { [propName: string]: any };
}[];
