Each button has multiple actions:

| Action | Description |
|-------|-----|
| update | Is called to update the button text and/or icon |
| keyDown | Is called when the button is pressed down |
| keyUp | Is scalled when the button is released |
| hold | Is called when the button is held down |

Callbacks are registered by adding the `actions` object variable to the system class, where each key in that variable sets the callbacks for that action:

```js
this.actions = {
    token: tokenAction
}
```

In this example, `tokenAction` sets the actions for Token Action buttons.

`tokenAction` must contain the `getActions` function, where the button actions are configured.

A simplified example:
```js
const tokenAction = {

    getActions: function(settings) {

        let actions = { update: [], keyDown: [], keyUp: [], hold:[] };

        if (settings.settingId === "value1") {
            actions.update.push({
                run: tokenAction.callback1,
                source: 'settingId'
            });
        }
        else if (settings.settingId === "value2") {
            actions.update.push({
                run: tokenAction.callback2,
                source: 'settingId'
            });
            actions.keyDown.push({
                run: tokenAction.callback3,
                source: 'settingId'
            });
        }

        return actions;

    },

    callback1: function(settings) {
        //This runs if settings.settingId === "value1" and the button gets updated
    },
    
    callback2: function(settings) {
        //This runs if settings.settingId === "value2" and the button gets updated
    },
    
    callback2: function(settings) {
        //This runs if settings.settingId === "value2" and the button is pressed down
    }

}
```

## Update Action
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
| permission | (Optional) Will prevent the action from running if set to `false`. See [here](./permissions.md) |

### Setting Button Icon and Text
The button icon and text can be set by returning from the callback function what you want to display.
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

### Source
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

### Running on Specified Hooks
The `on` option can be used so the action is ran whenever that hook is called.<br>

For example:
```js
const tokenAction = {

    getActions: function(settings) {

        let actions = { update: [], keyDown: [], keyUp: [], hold:[] };

        actions.update.push({
            run: callbackFunction,
            on: ['controlToken', 'updateActor'],
            source: 'sourceId'
        })

        return actions;
    },

    callbackFunction: function(settings, hook, args) {
        //Do something
    }

}
```
Here, the `callbackFunction` is called whenever the `controlToken` or `updateActor` hook is called.<br>
The `hook` variable contains the hook that caused the function to be called, while `args` are the hook arguments.

## KeyDown and KeyUp Action
The keyDown and keyUp actions are called when a button is pressed down or released, respectively.

For example, the following action will call `callbackFunction` when the button is pressed down:
```js
actions.keyDown.push({
    run: callbackFunction,
    source: 'sourceId'
})
```

The keyDown and keyUp actions can have the following options:

| Option | Description |
|-------|-----|
| run | The function to run |
| source | Source id of the action, see [below](#source) |
| permission | (Optional) Will prevent the action from running if set to `false`. See [here](./permissions.md) |

## Hold Action
The hold action is called whenever a button is pressed and a certain time has passed, and periodically after that.

For example, the following action will call `callbackFunction` when the button is held down after 1 second, and then every 500 milliseconds:
```js
actions.hold.push({
    run: callbackFunction,
    delay: 1000,
    period: 500,
    source: 'sourceId'
})
```

The hold action can have the following options:

| Option | Description |
|-------|-----|
| run | The function to run |
| source | Source id of the action, see [below](#source) |
| delay | (Optional) Will call the function after this amount of milliseconds. Will default to 0 |
| period | (Optional) Will repeatedly call the function at this period. This will start after the delay has elapsed if `delay` is set |
| permission | (Optional) Will prevent the action from running if set to `false`. See [here](./permissions.md) |