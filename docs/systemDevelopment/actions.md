From the system module you can modify Material Deck actions.<br>
You can add new settings to an action or modify existing settings, and define what to do when, for example, a button is pressed.

Actions that the system should edit are defined when `game.materialDeck.registerSystem` is called, as discussed [here](./gettingStarted.md).
Each action needs to have the correct id for the action and at least these 2 functions:

* <b>settingsConfig</b>: Defines which settings to display in the Stream Deck app
* <b>buttonActions</b>: Defines what to do when a button is interacted with

So a basic action would look something like this:

```js
const tokenAction = {

    id: 'token',

    //Add a select box with 2 values
    settingsConfig: function() {
        return [
            {
                id: "selectExample",
                type: "select",
                options: [
                    { value: "val1", label: "Value 1" },
                    { value: "val2", label: "Value 2" }
                ]
            }
        ]
    },

    buttonActions: function(settings) {
        let buttonActions = { update: [], keyDown: [], keyUp: [], hold: [] };

        //If the select box is set to 'val1', run 'onVal1Update' when the button should be updated and run 'onVal1Keydown' when the button is pressed down.
        if (settings.selectExample === "val1") {
            buttonActions.update.push({
                run: onVal1Update
            });
            buttonActions.keyDown.push({
                run: onVal1Keydown
            });
        }

        return buttonActions;
    }

    
}

function onVal1Update(data) {
    //code to run when update is called
}

function onVal1Keydown(data) {
    //code to run when button is pressed
}
```

## Settings Config
The `settingsConfig` function returns an array of settings that are displayed in the Stream Deck app.

Each array element is a separate setting. Almost all settings can have the following options:

| Option | Description |
|-------|-----|
| id | Unique id of the setting |
| label | Label of the setting |
| type | Type of the setting |
| link | (Optional) A link to, for example, documentation. Setting this will turn the label into a hyperlink |
| indent | (Optional) Indents the setting (moves it slightly to the right) |
| default | (Optional) Default value of the setting |
| sync | (Optional) Allows settings to be synchronized between multiple buttons, see [here](./synchronizedSettings.md) |
| visibility | (Optional) Configure the visibility of the setting, see [here](./visibility.md) for more info |
| permission | (Optional) Configure the permissions of the setting, see [here](#permissions) for more info |

Some settings allow more options.<br>
You can see all setting types and how to configure them [here](./settingTypes.md).

The following example will add a checkbox and textbox:
```js
[
    {
        id: "checkboxId",
        label: "Checkbox Label",
        type: "checkbox",
        default: true
    },{
        id: "textboxId",
        label: "Textbox Label",
        type: "textbox",
        default: "Default value"
    }
]
```

If a setting is added with an id that already exists, the existing setting will be modified with the values that are specified.<br>
For example, you can change the label of an existing setting:
```js
{
    id: "existingSettingId",
    label: "New Label"
}
```
Or change the options of an existing `select` setting:
```js
{
    id: "existingSelectId",
    options: [
        { 
            value: "newOption1", 
            label: "Option 1 Label"
        },{ 
            value: "newOption2", 
            label: "Option 2 Label" 
        }
    ]
}
```

### Permissions
A system module can register [new permissions](./permissions.md), and use these or core Material Deck permissions to determine which settings or setting options are shown to the user.

You can use `game.materialDeck.permissions.getPermission` or `game.materialDeck.permissions.getPermissions` to check for permissions, see [here](./permissions.md#checking-permissions) for more info.

For example, take the following setting, where the setting isn't shown if the user doesn't have the correct permission:
```js
{
    id: "settingId",
    type: "checkbox",
    label: "Permission Example",
    permission: game.materialDeck.permissions.getPermission("Token.All")
}
```

## Button Actions
The `buttonActions` function defines what should happen when a button is interacted with.
Each button has multiple button actions:

| Action | Description |
|-------|-----|
| update | Is called to update the button text and/or icon |
| keyDown | Is called when the button is pressed down |
| keyUp | Is scalled when the button is released |
| hold | Is called when the button is held down |

You can configure these button actions based on the settings that are configured for the button:

```js
buttonActions: function(settings) {

    let buttonActions = { update: [], keyDown: [], keyUp: [], hold:[] };

    if (settings.settingId === "value1") {
        buttonActions.update.push({
            run: callback1
        });
    }
    else if (settings.settingId === "value2") {
        buttonActions.update.push({
            run: callback2
        });
        buttonActions.keyDown.push({
            run: callback3
        });
    }

    return buttonActions;
}
```

In this case, if a setting with id `settingId` is set to `value1`, `callback1` will be called when the button is updated. If it's set to `value 2`, `callback2` will be called when its updated and `callback3` is called when it is pressed down.

### General Button Action Info
Functions that are called by a button action have a single 'data' argument:

```js
function callback(data) { /* code */ }
```
This argument is an object with the following keys:

| Key | Type | Description |
|-----|------|-------------|
| actionType | String | Type of the button action (`update`, `keyUp`, `keyDown` or `hold`) |
| settings      | Object    | Settings of the button |
| button        | Object    | Contains all the data for the button and useful functions, for example to set the button text and icon |
| actor (token action)  | Object    | Selected actor |
| token (token action)  | Object    | Selected token    |

#### Settings
The button settings can be found in `data.settings`.
This is an object containing all the setting of the button. These settings are provided by the core Material Deck module, or can be added by the system.

#### Setting Button Icon and Text
For the update button action, see [here](#setting-button-icon-and-text).

You can set a button's text and icon through the `data.button` object:

Setting the text:
```js
data.button.setTitle("Text to display");
```

Setting the icon:
```js
data.button.setIcon("path/to/icon.png", options);
```

Setting both the text and icon:
```js
data.button.set("Text to display", "path/to/icon.png", options);
```

The icon path can be relative to the Foundry server for files stored on your server, for example: `icons/vtt-512.png` or `systems/dnd5e/tokens/heroes/SorcererTiefling.webp`.

You can also use a path to a publicly accessible icon, for example: `https://avatars.githubusercontent.com/u/135522358?v=4.png`.

### Update Button Action
The update actions is called in the following cases:

* When the button appears (for example when a new action is dragged onto a button or when a folder is opened)
* When a registered hook is called
* When a button update is forced through code

The update action can have the following options:

| Option | Description |
|-------|-----|
| run | The function to run |
| source | Source id of the action, see [below](#source) |
| on | (Optional) A list of hooks on which to run the update, see [below](#running-on-specified-hooks) |
| permission | (Optional) Will prevent the action from running if set to `false`. See [here](./permissions.md#checking-permissions) |

#### Setting Button Icon and Text
The button icon and text can be set by returning from the function what you want to display.
```js
callbackFunction: function(settings) {
    return {
        icon: "linkToIcon.png",
        text: "Text to display",
        options: {}
    }
}
```
Each of `icon`, `text` and `options` is optional.

| Option | Description |
|-------|-----|
| text | Text to display |
| icon | Link to an image (e.g. `"modules/MaterialDeck/img/MaterialFoundry512x512.png"`) or a [fontAwesome](https://fontawesome.com/) icon (e.g. `"fas fa-user"`) |
| options | Icon options, see below |

`options` can have one of the following options:

| Option | Description |
|-------|-----|
| background | Sets the background color of the icon |
| border | Displays a (colored) border around the icon, can be `true` or `false` |
| borderColor | Color of the border is `border` is set to `true` |
| dim | If set to `true`, adds a gray overlay over the icon to dim it |
| uses | Allows for some display elements based on uses of something. This is an object with one or more of the following options:<br><b>-available</b>: Current value of something<br><b>-maximum</b>: Maximum value of something<br><b>-heart</b>: If set to `true`, displays a heart icon that is filled based on `available` and `maximum`<br><b>-box</b>: If set to `true`, display a box with [`available`/`maximum`]<br><b>-bar</b>: If set to `true`, displays a bar with `maximum` as its maximum value and filled until `available`

#### Source
The `source` option is an id that is used to prevent duplicate actions from running. This allows a system module to override a core Material Deck function.

For example. core Material Deck has the following update action when the `stats` setting is set to 'none':
```js
if (settings.stats === 'none') {
    actions.update.push({
        run: function() {
            return {text:"", icon:""};
        },
        on: ['controlToken', 'updateActor', 'createToken', 'deleteToken'],
        source: 'stats'
    });
}
```
If you want to something else to happen in that case, register the following token action:
```js
if (settings.stats === 'none') {
    actions.update.push({
        run: yourOwnCallback,
        on: ['controlToken', 'updateActor', 'createToken', 'deleteToken'],
        source: 'stats'
    });
}
```

#### Running on Specified Hooks
The `on` option can be used so the action is ran whenever that hook is called.<br>

For example:
```js
    buttonActions: function(settings) {

        let buttonActions = { update: [], keyDown: [], keyUp: [], hold:[] };

        buttonActions.update.push({
            run: this.callbackFunction,
            on: ['controlToken', 'updateActor']
        })

        return buttonActions;
    },

    callbackFunction: function(data) {
        const hook = data.hook;
        const args = data.args;
        //Do something
    }
```
Here, the `callbackFunction` is called whenever the `controlToken` or `updateActor` hook is called.<br>
The `hook` variable contains the hook that caused the function to be called, while `args` are the hook arguments.

### KeyDown and KeyUp Button Action
The keyDown and keyUp actions are called when a button is pressed down or released, respectively.

For example, the following action will call `callbackFunction` when the button is pressed down:
```js
actions.keyDown.push({
    run: callbackFunction
})
```

The keyDown and keyUp actions can have the following options:

| Option | Description |
|-------|-----|
| run | The function to run |
| source | Source id of the action, see [below](#source) |
| permission | (Optional) Will prevent the action from running if set to `false`. See [here](./permissions.md#checking-permissions) |

### Hold Button Action
The hold action is called whenever a button is pressed and a certain time has passed, and periodically after that.

For example, the following action will call `callbackFunction` when the button is held down after 1 second, and then every 500 milliseconds:
```js
actions.hold.push({
    run: callbackFunction,
    delay: 1000,
    period: 500
})
```

The hold action can have the following options:

| Option | Description |
|-------|-----|
| run | The function to run |
| source | Source id of the action, see [below](#source) |
| delay | (Optional) Will call the function after this amount of milliseconds. Will default to 0 |
| period | (Optional) Will repeatedly call the function at this period. This will start after the delay has elapsed if `delay` is set |
| permission | (Optional) Will prevent the action from running if set to `false`. See [here](./permissions.md#checking-permissions) |

