
## System Template
You can get a system template from [here](https://github.com/MaterialFoundry/MaterialDeck_SystemTemplate).

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

## Registering the System
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

For each action type (audio, token, etc) that the system modifies, you add it to the actions object. Each action type will need to have at least a `getActions` and `getSettings` function:

```js
const actions = {
    token: {
        getTokenActions,
        getTokenSettings
    },
    combattracker: {
        getCombatTrackerActions,
        getCombatTrackerSettings
    }
}

function getTokenActions(settings) {
    let actions = { update: [], keyDown: [], keyUp: [], hold: [] };

    actions.update.push({
        run: functionToRun,
        on: ['hooksToRunOn']
    });
    
    return actions;
}
```