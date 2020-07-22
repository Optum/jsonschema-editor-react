<p align="center">
  json-schema-editor - A React Component
</p>

<p align="center">
  <a href="https://github.com/xojs/xo"><img src="https://img.shields.io/badge/code_style-XO-5ed9c7.svg"></a>➕
  <a href="https://github.com/prettier/prettier"><img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square"></a>➕
  <a href="https://chakra-ui.com/"><img src="https://img.shields.io/badge/built%20with-chakra--ui-green"></a>➕
<a href="https://github.com/pages/optum/jsonschema-editor-react/"><img src="https://cdn.jsdelivr.net/gh/storybookjs/brand@master/badge/badge-storybook.svg"></a>
</p>

> JsonSchemaEditor is a React component library that allows the easy generation of valid JsonSchema from a UI.

## Documentation

Control documentation and demo can be viewed [here](https://github.com/pages/optum/jsonschema-editor-react/)

## Install

```shell
npm install @optum/json-schema-editor
```

or

```shell
yarn add @optum/json-schema-editor
```

## Props

| property       | type                               | description                                  | default               |
| -------------- | ---------------------------------- | -------------------------------------------- | --------------------- |
| data           | object                             | the initial data for the editor              | {}                    |
| readOnly       | boolean                            | make editor read only                        | false                 |
| onSchemaChange | callback (results: string) => void | callback method to capture changes to schema | required (no default) |
| schemaRoot        | string                             | schemaRoot for \$id property                    | required (no default) |

## Example

```js
import JsonSchemaEditor from "@optum/jsonschema-editor-react";

// render with function component
export const Home = ({ data, contentSectionText }) => {
    const printResult = (result: string) => {
        console.log(result);
    };

    return (
        <div className="container">
            <JsonSchemaEditor data={titleBarText} printResult={printResult} />
        </div>
    );
};
```

## License

jsonchema-editor-react is Copyright © 2020 Optum. It is free software and may be redistributed under the MIT license.

## Development

### Commands

| Name            |                 Description                  |
| :-------------- | :------------------------------------------: |
| build           | build production ready component for package |
| test            |              execute all tests               |
| storybook       |            run storybook locally             |
| build-storybook |  build static storybook output in `./docs`   |

### Editors

**VS Code**

> extensions

- [Linter for XO](https://marketplace.visualstudio.com/items?itemName=samverschueren.linter-xo)
- [Prettier - Code Formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

> settings.json

```json
{
	"xo.enable": true,
	"xo.format.enable": true,
	"javascript.format.enable": false,
	"javascript.validate.enable": false,
	"prettier.tabWidth": 4,
	"prettier.singleQuote": true,
	"[json]": {
		"editor.formatOnSave": true,
		"editor.defaultFormatter": "esbenp.prettier-vscode"
	},
	"[javascript]": {
		"editor.formatOnSave": true,
		"editor.defaultFormatter": "samverschueren.linter-xo"
	},
	"[typescript]": {
		"editor.formatOnSave": true,
		"editor.defaultFormatter": "samverschueren.linter-xo"
	},
	"[typescriptreact]": {
		"editor.formatOnSave": true,
		"editor.defaultFormatter": "samverschueren.linter-xo"
	}
}
```
