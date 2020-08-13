## Functions

<dl>
<dt><a href="#deepScanDir">deepScanDir(directory, [exclude], [only], [filter])</a> ⇒ <code>Promise.&lt;Array.&lt;String&gt;&gt;</code></dt>
<dd><p>Deep scans the given <code>directory</code> returning an array of strings of all of the files found in the given <code>directory</code>.</p>
</dd>
<dt><a href="#findNearestAvailablePath">findNearestAvailablePath(dir, pathName)</a> ⇒ <code>String</code> | <code>void</code></dt>
<dd><p>Finds given <code>pathName</code> in given <code>dir</code>. Will look for parent dirs of given <code>dir</code> until found or <code>/</code> is reached.</p>
</dd>
<dt><a href="#findPackageJson">findPackageJson([dir])</a> ⇒ <code>String</code></dt>
<dd><p>Finds package.json file in given dir or nearest found in parent directories</p>
</dd>
<dt><a href="#findRoot">findRoot([...paths])</a> ⇒ <code>String</code></dt>
<dd><p>Finds the root of a project (where the <code>pleasure.config.js</code> resides).</p>
</dd>
<dt><a href="#findConfig">findConfig()</a> ⇒ <code>String</code></dt>
<dd><p>Locates the pleasure.config.js file. Alternatively returns the env variable PLEASURE_CONFIG if set.</p>
</dd>
<dt><a href="#findPleasureConfig">findPleasureConfig([dir])</a> ⇒ <code>String</code></dt>
<dd><p>Finds package.json file in given dir or nearest found in parent directories</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#ProjectConfig">ProjectConfig</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="deepScanDir"></a>

## deepScanDir(directory, [exclude], [only], [filter]) ⇒ <code>Promise.&lt;Array.&lt;String&gt;&gt;</code>
Deep scans the given `directory` returning an array of strings of all of the files found in the given `directory`.

**Kind**: global function  
**Returns**: <code>Promise.&lt;Array.&lt;String&gt;&gt;</code> - Paths found  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| directory | <code>String</code> |  | The directory to scan |
| [exclude] | <code>Array.&lt;String&gt;</code> \| <code>Array.&lt;RegExp&gt;</code> | <code>[/node_modules/]</code> | Paths to exclude |
| [only] | <code>Array.&lt;String&gt;</code> \| <code>Array.&lt;RegExp&gt;</code> | <code>[]</code> | If present, only paths matching at least one of the expressions, would be included. |
| [filter] | <code>function</code> |  | Callback function called with the evaluated `path` as the first argument. Must return `true` or `false` |

<a name="findNearestAvailablePath"></a>

## findNearestAvailablePath(dir, pathName) ⇒ <code>String</code> \| <code>void</code>
Finds given `pathName` in given `dir`. Will look for parent dirs of given `dir` until found or `/` is reached.

**Kind**: global function  
**Returns**: <code>String</code> \| <code>void</code> - path to the nearest file or `void` if none found  

| Param | Type | Default |
| --- | --- | --- |
| dir | <code>String</code> | <code>process.cwd()</code> | 
| pathName | <code>String</code> |  | 

<a name="findPackageJson"></a>

## findPackageJson([dir]) ⇒ <code>String</code>
Finds package.json file in given dir or nearest found in parent directories

**Kind**: global function  
**Returns**: <code>String</code> - path to the nearest package.json  

| Param | Type | Default |
| --- | --- | --- |
| [dir] | <code>String</code> | <code>process.cwd()</code> | 

<a name="findRoot"></a>

## findRoot([...paths]) ⇒ <code>String</code>
Finds the root of a project (where the `pleasure.config.js` resides).

**Kind**: global function  
**Returns**: <code>String</code> - The path to the project. When given extra arguments, it will resolve those as paths from the
found root.  

| Param | Type | Description |
| --- | --- | --- |
| [...paths] | <code>String</code> \| <code>Array.&lt;String&gt;</code> | Optional resolve the given path(s) from the root. |

**Example** *(Returning the location to the package.json file)*  

e.g. imaging running the code below from a project at path `/Users/tin/my-kick-ass-project`

```js
// prints: /Users/tin/my-kick-ass-project/package.json
console.log(findRoot('package.json'))
```
<a name="findConfig"></a>

## findConfig() ⇒ <code>String</code>
Locates the pleasure.config.js file. Alternatively returns the env variable PLEASURE_CONFIG if set.

**Kind**: global function  
**Returns**: <code>String</code> - pleasure config found  
<a name="findPleasureConfig"></a>

## findPleasureConfig([dir]) ⇒ <code>String</code>
Finds package.json file in given dir or nearest found in parent directories

**Kind**: global function  
**Returns**: <code>String</code> - path to the nearest package.json  

| Param | Type | Default |
| --- | --- | --- |
| [dir] | <code>String</code> | <code>process.cwd()</code> | 

<a name="ProjectConfig"></a>

## ProjectConfig : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| http | <code>Object</code> |  | http orchestration configuration |
| [http.host] | <code>String</code> | <code>0.0.0.0</code> | http orchestration configuration |
| [http.port] | <code>Number</code> | <code>3000</code> | port where to run the http server |
| [api.dir] | <code>Number</code> | <code>api</code> | relative path to the api folder to use |


* * *

&copy; 2020 Martin Rafael Gonzalez <tin@devtin.io>
