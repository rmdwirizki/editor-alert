
# Alert Tool

Provides Code Blocks for the [Editor.js](https://editorjs.io).

![alert-demo](https://user-images.githubusercontent.com/6184465/68541410-1ea36500-03da-11ea-9c0d-540a70a1d588.gif)


## Installation

### Install via NPM

Get the package

```shell
npm i --save-dev @rmdwirizki/editor-alert
```

Include module at your application

```javascript
const Alert = require('@rmdwirizki/editor-alert');
```

### Download to your project's source dir

1. Upload folder `dist` from repository
2. Add `dist/bundle.js` file to your page.

### Load from CDN

You can load specific version of package from [jsDelivr CDN](https://www.jsdelivr.com/package/npm/@editorjs/quote).

`https://cdn.jsdelivr.net/npm/@rmdwirizki/editor-alert@1.0.19`

Then require this script on page with Editor.js.

```html
<script src="..."></script>
```

## Usage

Add a new Tool to the `tools` property of the Editor.js initial config.

```javascript
var editor = EditorJS({
  ...
  
  tools: {
    ...
    alert: Alert,
  },
  
  ...
});
```

## Output data

| Field     | Type     | Description          |
| --------- | -------- | -------------------- |
| title      | `string` | warning title         |
| desc  | `string` | warning desc |
| alert  | `string` | alert type (warning, error, success, info) |


```json
{
    "type" : "quote",
    "data" : {
        "title" : ""note",
        "desc" : "this is a warning",
        "type" : "warning"
    }
}
```
