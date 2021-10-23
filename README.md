- [x] Change __exportPosition to __exportName
- [x] Make imports relatively using fs.relative
- [x] Do not run cli unless in root of package
- [ ] Write componentMap file by file so you don't run out of memory
- [x] Create config file
- [x] Prefer displayName over name in get-fiber-node-data
- [x] Also collect __exportPosition, get filename from __filename
- [x] Import config in server, connect server to cli
- [x] Chmod the cli
- [x] Implement some dedup logic on server so only the props instance with most data is saved
- [ ] Improve glob pattern to exclude node modules, dist, maybe use .gitignore?
- [ ] Add save data command to frontend
- [ ] Add generate stories script

# CLI

react-storystrap init --componentFiles [string] --babelConfig [string] 

- Create .storybook directory
- Create .storybook/register-components.js
- Create .storybook/file-component-map.js
- Create .storybook/config.js with shape

```ts
export default {
  port: 1234,
}
```

react-storystrap start-server

- Writes objects of shape to file compmonent-data

```ts
{
  componentId: ComponentId;
  propsInstance: PropsInstance;
  isDOM: boolean;
};
```

react-storystrap generate-stories [--overwrite]

- Write `X.story.js` files adjacent to `X.js` files
- Create a story for each exported component
- The story name should be the `displayName` of the component being described
- If there are naming clashes add `(default)` or `(export0)`/`(export1)`/`...etc` suffix



# React Typescript Package Boilerplate

  const parser = (0, _babelParser.default)(options, src);
    parse(src) {
      return babel.parseSync(src, {
        filename,
        parserOpts,
        ...babelOptions
      });
## Motivation

> In depth explanation of what this package is and why its different from existing npm modules

## Getting Started

### Install

```bash
npm install --save <package-name>

# Or yarn
# yarn add <package-name>
```

### Basic Usage

> The simplest examples you can think of, a quick start guide

### Advanced Usage

> Some fringe use cases and deeper exploration of the API
