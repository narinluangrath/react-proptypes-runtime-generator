declare module "react-docgen" {
  export type Result = {
    description: string;
    displayName: string;
    props: {
      [propName: string]: {
        type: {
          name: string;
          value?: string;
          raw?: string;
        };
        flowType?: object;
        tsType?: object;
        required: boolean;
        description: string;
        defaultValue?: {
          value: string;
          computed: boolean;
        };
      };
    };
    composes?: string;
  };

  export function parse(
    source: string | Buffer,
    resolver?: (...args: any) => any,
    handlers?: (...args: any) => void,
    options?: {
      fileName?: string;
      cwd?: string;
      configFile?: string;
      parserOptions?: object;
    }
  ): Result[];

  export const resolver: {
    findAllExportedComponentDefinitions: (...args: any) => any;
  };
}
