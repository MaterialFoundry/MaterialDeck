
# Dev Guide


## Module Development 

### Make a new system.js file

In the [src/systems](src/systems) directory, create a new system file by copying and pasting a similar system to it; for example, `cp demonlord.js wfrp4.js`
You then need to go through all the functions in there and make sure that the correct data is set.

### Update TokenHelper
In [src/systems/TokenHelper.js](src/systems/TokenHelper.js), you need to add an `import {}` for your new system.

In the same file, in the setSystem() function, you need to wire in your system to the if/else block.

## Debugging

It's possible to debug on the Stream Deck, so you can do `console.log`. Just follow the instructions [from elgato here](https://developer.elgato.com/documentation/stream-deck/sdk/create-your-own-plugin/).  After editing the code for the plugin, you need to either refresh by refreshing the debug window, or by deselecting the current button, and selecting it again.

## 

For getStats, getRolls you cannot change value

For the others, it depends on the system. For example:
in 5e, to get the appraise skill modifier, you do token.actor.data.data.skills?.[skill].total where 'skill' is 'apr'. So in the plugin, you have to set the value to 'apr'.

## Streamdeck

On the SD side: The plugin in windows is located at AppData/Roaming/Elgato/StreamDeck/Plugins/com.cdeenen.materialdeck.sdPlugin
In propertyinspector/js/common.js starting at line 1274 there's various functions that are used to get the relevant options to show up in the SD plugin. Each array element has a value and a name, you should keep the value the same, but the name can be whatever you like. I think you'll be able to figure out how to add stuff for wfrp by looking at the others.

To enable logging on the streamdeck, [follow these instructions](https://developer.elgato.com/documentation/stream-deck/sdk/create-your-own-plugin/) from Elgato.


## Module Deployment
Copy the new system.js and tokenHelper.js 