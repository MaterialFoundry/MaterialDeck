# Writing Code
The code you can write is normal JavaScript, and is essentially the same as writing [script macros](https://foundryvtt.com/article/macros/).<br>
This means that you have access to the full [Foundry API](https://foundryvtt.com/api/).

Within your code you have access to the following Material Deck specific objects:

* <b>settings</b>: Contains all the settings for you custom action. These are the settings configured [here](./config.md#configuring-settings) and settable in the Stream Deck application.
* <b>button</b>: Has all the button configuration and gives access to functions to set the button's icon and title.
* <b>eventType</b>: Returns the type of the event (`onUpdate`, `onKeyDown`, `onKeyUp`, `onHold`).
* <b>variables</b>: Gives a way to store variables between different events (of the same button).
* <b>hooks</b>: (On Update only) Returns the hook that triggered the 'On Update' event (`hook.hook`) and the hook's arguments (`hook.args`).

## Setting a Button's Text & Icon
You can set a button's text and icon through the `button` object:

Setting the text:
```js
button.setTitle("Text to display");
```

Setting the icon:
```js
button.setIcon("path/to/icon.png", options);
```

Setting both the text and icon:
```js
button.set("Text to display", "path/to/icon.png", options);
```

The icon path can be relative to the Foundry server for files stored on your server, for example: `icons/vtt-512.png` or `systems/dnd5e/tokens/heroes/SorcererTiefling.webp`.<br>
You can find the path to icons by opening Foundry's image browser (for example the one you get when changing an actor's image), navigating to the icon, and then copying `Selected` at the bottom.

You can also use a path to a publicly accessible icon, for example: `https://avatars.githubusercontent.com/u/135522358?v=4.png`.

#### Options
The optional `options` object can be used to customize the icon:

| Option | Description |
|-------|-----|
| background | Sets the background color of the icon |
| border | Displays a (colored) border around the icon, can be `true` or `false` |
| borderColor | Color of the border is `border` is set to `true`. Must be a hex color value, such as `#ff0000`. |
| dim | If set to `true`, adds a gray overlay over the icon to dim it |
| uses | Allows for some display elements based on uses of something. This is an object with one or more of the following options:<br><b>-available</b>: Current value of something<br><b>-maximum</b>: Maximum value of something<br><b>-heart</b>: If set to `true`, displays a heart icon that is filled based on `available` and `maximum`<br><b>-box</b>: If set to `true`, display a box with [`available`/`maximum`]<br><b>-bar</b>: If set to `true`, displays a bar with `maximum` as its maximum value and filled until `available`

## Variables
The `variables` object gives a way to store values between multiple executions of your action.

You can initialize a variable:
```js
variables.value = "some value"; //stores "some value" to the 'value' variable
variables.counter = 0;          //Sets the 'counter' variable to 0
```

You can, at a later point, retrieve the variables and/or change them:
```js
const storedVariable = variables.value; //returns the value stored in the 'value' variable
variables.counter++;                    //increments the 'counter' variable
```

Whenever the code is first executed, the variable doesn't exist yet, so it's good practise to add some code to check if the variable already exists:
```js
if (variables.value !== undefined) variables.value = "some value";  //if 'value' doesn't exist, create it and set it to "some value"
if (varialbes.counter === undefined) variables.counter = 0;         //if 'counter' doesn't exist, create it and set it to 0
else variables.counter++;                                           //otherwise increment its value
```

<b>Note</b>:<br>
Variables are shared between all events of a button. So the 'On Update' and 'On Press' events will return the same variables.<br>
Variables are <u>not</u> shared between different buttons.
