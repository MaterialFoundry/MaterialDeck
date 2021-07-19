
# Dev Guide

In addition to this repo, you will also need to check out the [MaterialDeck_SD github repo](https://github.com/CDeenen/MaterialDeck_SD).

## Module Development 

### Make a new system.js file

In the [src/systems](src/systems) directory, create a new system file by copying and pasting a similar system to it; for example, `cp demonlord.js wfrp4.js`
You then need to go through all the functions in there and make sure that the correct data is set.

### Update TokenHelper
In [src/systems/TokenHelper.js](src/systems/TokenHelper.js), you need to add an `import {}` for your new system.

In the same file, in the setSystem() function, you need to wire in your system to the if/else block.

## Debugging

It's possible to debug on the Stream Deck, so you can do `console.log`. Just follow the instructions [from elgato here](https://developer.elgato.com/documentation/stream-deck/sdk/create-your-own-plugin/).  After editing the code for the plugin, you need to either refresh by refreshing the debug window, or by deselecting the current button, and selecting it again.

When you go to the debugging page, there should be multiple options. With the property inspector open, you should connect to the one with property inspector in its name. If you go to to propertyinspector/js/common.js, near the top there's the debugEn variable. Set it to true, and you should get tons of messages, especially if you change any settings.
In the module, in MaterialDeck.js, at line 60, there's //console.log("Received",data);. If you uncomment that, it'll log everything that's send from the SD to the module. Might be helpful for debugging.


## Streamdeck

To enable logging on the streamdeck, [follow these instructions](https://developer.elgato.com/documentation/stream-deck/sdk/create-your-own-plugin/) from Elgato.

The plugin in Windows is located at (Windows) `AppData/Roaming/Elgato/StreamDeck/Plugins/com.cdeenen.materialdeck.sdPlugin`
In `propertyinspector/js/common.js::getStats()` there are various functions that are used to get the relevant options to show up in the SD plugin. Each array element has a value and a name, you should keep the value the same, but the name can be whatever you like. I think you'll be able to figure out how to add stuff for wfrp by looking at the others.


## Property discovery
In a Foundry client browser instance, if you go to the dev console, you can browser your tokens via the `canvas.tokens` path, for example `canvas.tokens.children[0].children[0].actor.data`.

## Module Deployment
If you make changes to files in this project, you'll need to copy the changed files to your Foundry install folder, probably found here: `C:\Users\$USER\AppData\Local\FoundryVTT\Data\modules\MaterialDeck`.

If you change the `MaterialDeck_SD` code (for example, `propertyinspector\js\common.js`), you will need to copy that file to the Elgato streamdeck plugins directory, probably found here: `C:\Users\$USER\AppData\Roaming\Elgato\StreamDeck\Plugins\com.cdeenen.materialdeck.sdPlugin`. 