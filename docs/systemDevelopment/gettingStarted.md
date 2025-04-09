Material Deck allows system modules to add new system-specific features.
While [some](../gettingStarted/gamingSystems.md) are already supported, it is possible to create your own system module.

These pages will attempt to help you with this. They are not a complete guide on Foundry module development or JavaScript. 

## System Template
You can get a system template from [here](https://github.com/MaterialFoundry/MaterialDeck_SystemTemplate).
This is a very basic template, take a look at the [DnD5e](https://github.com/MaterialFoundry/MaterialDeck_DnD5e) or [PF2E](https://github.com/MaterialFoundry/MaterialDeck_PF2E) system modules for more detailed examples.

## Module.json
The module.json file contains metadata about your module.<br>
Pay attention to the following fields:

| Key | Description |
|-------|-----|
| id | Change to a unique ID that represents the system (lower case only, no spaces) |
| title | Give the module a suitable title |
| description | Give the module a suitable description |
| version | Increment this when push a new version |
| authors | Add your personal data |
| esmodules | Set to the main file of the module, for example: `"./materialdeck-dnd5e.js"` |
| relationships | Set the compatibility with the core Material Deck module |
| compatibility | Set the compatibility with Foundry VTT |
| url | Set to the (github) url of the module |
| manifest | Set to the manifest url of the module |
| download | Set to the download url of the module |

## Registering the System Module
When Material Deck has finished loading, it calls the `MaterialDeck_Ready` hook.<br>
This hook can be used to register your system:
```js
Hooks.once('MaterialDeck_Ready', () => {
    game.materialDeck.registerSystem({
        systemId: "idOfTheSystem", //Must equal the system id: game.system.id
        moduleId: "idOfTheModule", //Must equal "id" in module.json
        systemName: "Name of the System",
        version: "versionOfTheModule", //Get from module.json
        manifest: "manifestUrlOfModule.com", //Get from module.json
        actions,
        permissions
    });
});
```

### Actions
The actions object contains all the data to populate the Stream Deck's property inspector with (new) settings, and what to do when, for example, the button is pressed.

For each action type (audio, token, etc) that the system modifies, you add it to the actions object. Each action type will need to have at least a `buttonActions` and `settingsConfig` function:

```js
const actions = {
    token: {
        buttonActions,
        settingsConfig
    },
    combattracker: {
        buttonActions,
        settingsConfig
    }
}
```

More info on actions can be found [here](actions.md).

### Permissions
Permission allow you to prevent certain players from accessing Material Deck features. See [here](./permissions.md) for more info.