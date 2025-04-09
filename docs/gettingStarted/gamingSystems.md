The core Material Deck module is system agnostic. This means that all the functions should work on all systems.<br>
However, this means that anything related to a system isn't part of the core module.<br>
This is most obvious for the [Token Action](../actions/token/token.md), where many things are missing, such as displaying a token's hit points.<br>

To add this functionality, you need to install a separate gaming system module.<br>
Gaming system modules may add or remove features to Material Deck. For questions and/or problems regarding system-specific features, please contact the system module's author.

## Supported Systems
Currently, the following gaming systems are supported:

|System|Material Deck Module|Documentation|Project Source|Author|
|------|--------------------|-------------|--------------|------|
|[Dungeons & Dragons 5e](https://foundryvtt.com/packages/dnd5e) | [Material Deck - Dungeons & Dragons 5e](https://foundryvtt.com/packages/materialdeck-dnd5e) | [link](https://materialfoundry.github.io/MaterialDeck_DnD5e) | [link](https://github.com/MaterialFoundry/MaterialDeck_DnD5e)|[Material Foundry](https://github.com/MaterialFoundry)|
|[Pathfinder 2e](https://foundryvtt.com/packages/pf2e)          | [Material Deck - Pathfinder 2e](https://foundryvtt.com/packages/materialdeck-pf2e) | [link](https://materialfoundry.github.io/MaterialDeck_PF2e) | [link](https://github.com/MaterialFoundry/MaterialDeck_PF2e)|[Material Foundry](https://github.com/MaterialFoundry)|

## System Installation
Gaming system modules are installed exactly the same as other module. See [here](https://foundryvtt.com/article/modules/) for module installation instructions.<br>
Don't forget to also activate the module in Foundry's Module Management window.

## System Activation
For supported gaming systems, Material Deck will automatically activate the correct system module.