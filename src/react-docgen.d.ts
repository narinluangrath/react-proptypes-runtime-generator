type Result = {
  description: string;
  displayName: string;
  props: { [propName: string]: { 
    type: {
      name: string;
      value?: string;
      raw?: string;
    }
    flowType?: object;
    tsType?: object;
    required: boolean;
    description: string;
    defaultValue?: {
      value: string;
      computed: boolean;
    }
  }};
  composes?: string;
}

declare module 'react-docgen' {
  export function parse(
    source: string | Buffer, 
    resolver?: (...args: any) => any,
    handlers?: (...args: any) => void,
    options?: {
      fileName?: string;
      cwd?: string;
      parserOptions?: object;
      resolver?: (...args: any) => any,
      handlers?: (...args: any) => any,
    }
  ): Result

  export const resolver: {
    findAllExportedComponentDefinitions: (...args: any) => any; 
  }
}