# Rude

**rudejs** is a Node.js implementation of the *rule-based dispatcher* control-flow pattern [Rude](https://github.com/kaisersparpick/Rude).


## Usage

```js
const rude = require("rudejs");
```
### Adding rules

The function accepts an optional parameter for the default scope. Callbacks with no explicit binding will use this default when invoked.

```js
rude([
    [condition1, yesCallback1, noCallback1],
    [condition2, scope.yesCallback2, scope.noCallback2],
], entryPoint, scope, pathFormat, doneCallback);
```

A rule is made up of three parts: the condition to check, the function to call when the result is true, and the function to call when it is false. Each argument is a function (for exit points `undefined` is okay.)

When using classes, to set the desired value of `this`, use the `.bind()` method

```js
[ someFunction, SomeClass.staticMethod, obj.instanceMethod.bind(obj) ];
```

When a condition returns `null`, Rude exits the condition chain. In this case, the yes and no callbacks are not necessary, therefore they can be left empty -- i.e. `undefined`. These conditions are usually exit points.
```js
[ someFunction ]
```
Rules do not have to be added in linear order. The rules themselves determine the order the conditions are checked in. 
Rude automatically generates a key for each rule based on the condition callback name -- therefore callback function names must be unique. 

### Checking conditions

The function passed as `entryPoint` specifies the entry point in the condition chain and can be set to any valid rule condition.

When finished, Rude returns the applied condition path in the requested format ("raw", "plain", "html" or "all"), if specified. If a `doneCallback` is provided, it will, instead, execute that with the path as the first argument.

```js
// example 1

rude([
    [condition1, yesCallback1, noCallback1],
    [condition2, inst.yesCallback2, inst.noCallback2],
], entryPoint, inst, "all", console.log);

// example 2

/**
 * This is the callback function. It runs after the processing of rules has finished.
 * @param {Object|Array|String} path
 */
const done = path => {
    const msg = `The path taken: "${path}"`;
    // do something clever...
};
rude([
    [condition1, yesCallback1, noCallback1],
], entryPoint, undefined, "plain", done);
```

#### Path formats

Here is the output from the example application showing the supported path formats.

```js
node .\examples\example.js
{ raw:
   [ { ruleName: 'isAnimal', result: true },
     { ruleName: 'hasLegs', result: true },
     { ruleName: 'hasTwoLegs', result: false },
     { ruleName: 'hasHorns', result: true },
     { ruleName: 'hasOneHorn', result: true },
     { ruleName: 'bound creatureFound', result: null } ],
  plain: 'isAnimal > hasLegs > !hasTwoLegs > hasHorns > hasOneHorn > bound creatureFound',
  html: '<table><thead><tr><th>idx</th><th>rule name</th><th>result</th></tr></thead><tr><td>0</td><td>isAnimal</td><td>true</td></tr><tr><td>1</td><td>hasLegs</td><td>true</td></tr><tr><td>2</td><td>hasTwoLegs</td><td>false</td></tr><tr><td>3</td><td>hasHorns</td><td>true</td></tr><tr><td>4</td><td>hasOneHorn</td><td>true</td></tr><tr><td>5</td><td>bound creatureFound</td><td>null</td></tr></tbody></table>' }

It must be a unicorn!
```

### Examples

See a full application in the **examples** folder.
