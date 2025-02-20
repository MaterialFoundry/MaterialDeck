![Screenshot](../img/streamDeckApp/app.png){align=right width=33%}
To use a Stream Deck button with Material Deck, you must apply an action to that button.

## Applying an Action to a Button
After [installing the Material Deck plugin](../gettingStarted/installation.md#stream-deck-plugin), the Material Deck category will appear on the right side of the Stream Deck app. Expanding the category will reveal all the Material Deck actions. By dragging one of the actions onto one of the 'buttons', the action will be assigned to that button.
<BR CLEAR="right" />
## Editing an Action
![Screenshot](../img/streamDeckApp/propertyInspector.png){align=right width=33%}
By pressing one of the 'buttons' in the Stream Deck app, you can edit the action.<br>
All the settings for that action will be displayed in the 'Property Inspector' at the bottom-left.<br>

The function of each setting is explained in the documentation of that specific action, see [below](#actions).

### Setting the Text/Title
It is important to note that by setting the button text/title in the 'Title' field, you will prevent Material Deck from automatically setting the title. It will function as an override.

#### Text/Title Font, Color, Orientation, etc
To the right of the 'Title' field, there is a dropdown menu that allows you to configure the title settings.<br>
These settings will have effect on titles entered into the 'Title' field, but also on any text that has been sent by Material Deck.

### Setting the Icon
It is possible to set the button's icon within the Property Inspector (by pressing the `+` or `v` buttons).<br>
If you do this, Material Deck will not be able to change the icon. It will function as an override.

#### Supported Image Formats
The following image formats are supported:

| Format            | Transparency  | Notes                     |
|-------------------|---------------|---------------------------|
| png               | Yes           |                           |
| jpeg/jpg          | No            |                           |
| webp              | Yes           |                           |
| gif               | Yes           | Displayed as still image  |
| webm              | Yes           | Displayed as still image  |
| mp4               | No            | Displayed as still image  |
| m4v               | No            | Displayed as still image  |
| [Font Awesome](https://fontawesome.com) icons | Yes   | Use, for example, `fas fa-user` or `fa-solid fa-user` as the icon source |

#### Icon Transparency
Image formats that support transparency allow you to set the background image (on supported actions).

#### Icon Size
Icons displayed on the Stream Deck are 144x144 pixels.<br>
Images bigger or smaller than this will be up or downscaled.

## How To Use The Actions Documentation
Each of the actions are listed in the column on the left, or can be accessed [below](#actions).

For each action and modes/functions of that action you will be presented with multiple options, like this:

| Option | Description |
|--------|-------------|
| Option 1 | Description of option 1. |
| Option 2 | Description of option 2. |

These options will (usually) correspond with a setting in the [Property Inspector](#editing-an-action).<br>
The `Description` column will give a short description of what the option/setting does, it might give an overview of selection options for a drop-down menu, or it might link to a more thorough explanation.

## Actions
The following actions are available:

* [Audio](./audio/audio.md): Control playlists, play audio from the [soundboard](../actions/audio/soundboard.md), or play audio from any source.
* [Combat Tracker](./combatTracker.md): Control the combat tracker or display combatants.
* [Custom](./custom/custom.md): Configure fully customized actions.
* [External Modules](./externalModules.md): Use Material Deck with other modules.
* [Macro](./macro.md): Trigger macros or execute custom code.
* [Other](./otherActions.md): Misc other actions.
* [Scene](./scene.md): Display and control scenes.
* [Token](./token/token.md): Display token stats, control tokens, and perform other token-related actions.