# External Modules Action
This action allows you to control other modules.

The following modules are supported:

* [Ember](#ember)
* [FXMaster](#fxmaster)
* [Lock View](#lock-view)
* [Monk's Active Tile Triggers](#monks-active-tile-triggers)
* [Not Your Turn!](#not-your-turn)
* [Shared Vision](#shared-vision)
* [Simple Calendar Reborn](#simple-calendar-reborn)
* [Soundscape](#soundscape)
* [Worldbuilder](#worldbuilder)

!!! warning "External Module Combatibility Issues"
    The functionality of the 'External Modules' action depends on (the API of) the supported modules.<br>
    This means that if one of the modules is updated and changes its API, Material Deck's functionality might break.<br>
    This is also the case if Foundry gets a major update, and the supported module has not been updated.

<BR CLEAR="left">

| Option            | Description   |
|-------------------|---------------|
| Title             | If configured, will set the title/text on the button. This will override any other text that would normally be displayed. |
| Icon Override     | Url to a custom icon. If configured, this will override any icon that would normally be displayed. |
| Module | Module to control |

## Ember
[Ember](https://foundryvtt.com/packages/ember) is a roleplaying campaign by the Foundry team.

| Option            | Description   |
|-------------------|---------------|
| Mode              | Mode of the button:<br><b>-Open Map</b>: Open a specified map.<br><b>-Open Party Sheet</b>: Open or close the party sheet.<br><b>-Open Codex</b>: Open or close the codex.<br><b>-[Calendar](#calendar)</b>: Control or display the calendar.   |
| Map               | (`Open Map` only) The map to open. |
| On Press/ On Hold | (`Open Map` only) Select what to do when the button is pressed:<br><b>-View:</b> View the scene.<br><b>-Activate:</b> Activate the scene.<br><b>-View/Activate if Viewed:</b> View the scene, activate the scene if the scene is already being viewed.<br><b>-Preload Scene:</b> Preload the scene. |
| Open Mode         | (`Open Party Sheet` or `Open Codex` only):<br><b>-Toggle:</b> Toggle between opening and closing.<br><b>-Open:</b> Open.<br><b>-Close:</b> Close. |

### Calendar
Ember has a built-in calendar system.

You can advance or rewind the time and display the time and date.

### Time Display
The time display option consists of multiple checkboxes for the 'Digital' and 'Analog' time.<br>
The digital time displays the time as a value, while the analog time displays a clock face.<br>
In both cases you can configure to display the hours, minutes or seconds by checking the respective checkbox. For the digital time you can additionally set it to a 24 hour or 12 hour clock.

### Date Display
The date display option consists of multiple checkboxes, these define how the date is displayed.<br>
For example, if only `Display` is checked for `Month`, the month's number will be displayed, if `Name` is also checked, the month's name will be displayed, and lastly, if `Abbreviated` is also checked, the month's abbreviated name is displayed.

## FXMaster
[FXMaster](https://foundryvtt.com/packages/fxmaster/) can display effects, such as weather effects, filters or special effects.

Using Material Deck you can enable or disable these effects.

| Option            | Description   |
|-------------------|---------------|
| Mode              | Mode of the button:<br><b>-[Special Effects](#special-effects)</b>: Trigger special effects.<br><b>-[Particle Effects](#particle-effects)</b>: Enable or disable particle effects.<br><b>-[Filter Effects](#filter-effects)</b>: Enable or disable filter effects.<br><b>-Clear All</b>: Clear all effects.   |

### Particle Effects
Particle effects are effects that are displayed across the entire scene, such as weather effects.

| Option            | Description   |
|-------------------|---------------|
| Effect            | Effect to trigger |
| Effect Options    | Effect options will depend on the effect, see [here](https://github.com/ghost-fvtt/fxmaster?tab=readme-ov-file#particle-effect-options) for more info. |
| Display           | <b>-Name</b>: Display the effect's name on the Stream Deck.<br><b>-Icon</b>: Display the effect's icon on the Stream Deck. |
| Colors            | <b>-On Color</b>: A border is drawn on the Stream Deck of this color if the effect is currently active<br><b>-Off Color</b>: A border is drawn on the Stream Deck of this color if the effect is currently not active<br><b>-Background</b>: Background color of the button. |

### Filter Effects
Similar to 'Particle Effects', filter effects are displayed across the entire scene but function as a filter.

| Option            | Description   |
|-------------------|---------------|
| Effect            | Effect to trigger |
| Effect Options    | Effect options will depend on the effect, see [here](https://github.com/ghost-fvtt/fxmaster?tab=readme-ov-file#available-filter-effects-with-supported-options) for more info. |
| Display           | <b>-Name</b>: Display the effect's name on the Stream Deck.<br><b>-Icon</b>: Display the effect's icon on the Stream Deck. |
| Colors            | <b>-On Color</b>: A border is drawn on the Stream Deck of this color if the effect is currently active<br><b>-Off Color</b>: A border is drawn on the Stream Deck of this color if the effect is currently not active<br><b>-Background</b>: Background color of the button. |

## Lock View
[Lock View](https://foundryvtt.com/packages/LockView/) gives the GM control over the zoom and pan capabilities of the player.

Using Material Deck you can enable or disable `Pan Lock`, `Zoom Lock` and `Bounding Box`, and you can set the view of players.

| Option            | Description   |
|-------------------|---------------|
| Mode              | Mode of the button:<br><b>-Pan Lock</b>: Enable or disable the 'Pan Lock'.<br><b>-Zoom Lock</b>: Enable or disable the 'Zoom Lock'.<br><b>-Bounding Box</b>: Enable or disable the 'Bounding Box'.<br><b>-[Set View](#set-view)</b>: Set the view of players.   |
| Toggle Mode       | (All but `Set View`) Sets what to do when pressed:<br><b>-Toggle</b>: Toggle between on and off.<br><b>-Enable</b>: Enable.<br><b>-Disable</b>: Disable.   |
| Display           | <b>-Name</b>: Display the mode's name on the Stream Deck.<br><b>-Icon</b>: Display the mode's icon on the Stream Deck. |
| Colors            | <b>-On Color</b>: A border is drawn on the Stream Deck of this color if the mode is currently active<br><b>-Off Color</b>: A border is drawn on the Stream Deck of this color if the mode is currently not active<br><b>-Background</b>: Background color of the button. |

### Set View
With the 'Set View' mode you can set the view of players.

| Option            | Description   |
|-------------------|---------------|
| Movement          | Configures how to move the canvas for the players:<br><b>-Ignore Movement</b>: Do not move canvas.<br><b>-Reset to Initial View</b>: Reset canvas to the initial view position.<br><b>-Clone View</b>: Clone GM's view.<br><b>-Horizontal Fit</b>: Move canvas to fit it horizontally within the window.<br><b>-Vertical Fit</b>: Move canvas to fit it vertically within the window.<br><b>-Automatic Fit (inside)</b>: Move canvas so it fits within the window with padding visible on the short side.<br><b>-Automatic Fit (outside)</b>: Move canvas to it fits within the window with no padding visible.<br><b>-Move Grid Spaces</b>: Move a specified amount of grid spaces.<br><b>-Move to Coordinates</b>: Move to specified coordinates.<br><b>-Cursor</b>: Move to cursor position.<br> |
| X                 | (`Move Grid Spaces`) Grid spaces to move in x-direction.<br>(`Move to Coordinates`) X-coordinate to move to.  |
| Y                 | (`Move Grid Spaces`) Grid spaces to move in y-direction.<br>(`Move to Coordinates`) Y-coordinate to move to.  |
| Scale             | Configures how to set the scale for the players:<br><b>-Ignore Scale</b>: Do not change the scale.<br><b>-Reset to Initial View</b>: Reset scale to the initial view position.<br><b>-Clone View</b>: Clone the scale from GM.<br><b>-Physical Gridsize</b>: Scale to physical gridsize.<br><b>-Set Scale</b>: Set scale to a specified value.    |
| Value             | (`Set Scale` only) Value to set the scale to. |

## Monk's Active Tile Triggers
[Monk's Active Tile Triggers](https://foundryvtt.com/packages/monks-active-tiles/) allows you to configure actions for tiles, such as teleporting tokens or displaying a message when they move onto a tile.

Using Material Deck you can enable or disable triggers.

| Option            | Description   |
|-------------------|---------------|
| Tile Name/ID      | Name or ID of the tile. |
| Mode              | Mode of the button:<br><b>-Toggle Tile</b>: Enable or disable the tile triggers.<br><b>-Enable Tile</b>: Enable the tile triggers.<br><b>-Disable</b>: Enable or disable the tile triggers.   |
| Display           | <b>-Name</b>: Display the tile's name on the Stream Deck.<br><b>-Icon</b>: Display the tile's image on the Stream Deck. |
| Colors            | <b>-On Color</b>: A border is drawn on the Stream Deck of this color if the tile's triggers are currently active<br><b>-Off Color</b>: A border is drawn on the Stream Deck of this color if the tile's triggers are currently not active<br><b>-Background</b>: Background color of the button. |

## Not Your Turn!
[Not Your Turn!](https://foundryvtt.com/packages/NotYourTurn) allows the GM to block unintended token movement of players.

Using Material Deck you can enable or disable the blocks.

| Option            | Description   |
|-------------------|---------------|
| Mode              | Mode of the button:<br><b>-Toggle Combat Movement Block</b>: Enable or disable the 'Combat Movement Block'.<br><b>-Enable Combat Movement Block</b>: Enable the 'Combat Movement Block'.<br><b>-Disable Combat Movement Block</b>: Disable the 'Combat Movement Block'.<br><b>-Toggle Non-Combat Movement Block</b>: Enable or disable the 'Non-Combat Movement Block'.<br><b>-Enable Non-Combat Movement Block</b>: Enable the 'Non-Combat Movement Block'.<br><b>-Disable Non-Combat Movement Block</b>: Disable the 'Non-Combat Movement Block'.|
| Display           | <b>-Name</b>: Display the mode's name on the Stream Deck.<br><b>-Icon</b>: Display the mode's icon on the Stream Deck. |
| Colors            | <b>-On Color</b>: A border is drawn on the Stream Deck of this color if the mode is currently active<br><b>-Off Color</b>: A border is drawn on the Stream Deck of this color if the mode is currently not active<br><b>-Background</b>: Background color of the button. |

## Shared Vision
[Shared Vision](https://foundryvtt.com/packages/SharedVision) allows vision of tokens to be shared with players, even if they have no permission for that token.

Using Material Deck you can enable or disable vision sharing.

| Option            | Description   |
|-------------------|---------------|
| Mode              | Mode of the button:<br><b>-Global Vision Sharing</b>: Enable or disable 'Global Vision Sharing'.<br><b>-All Vision Sharing</b>: Enable or disable the 'All Vision Sharing'.   |
| Toggle Mode       | Sets what to do when pressed:<br><b>-Toggle</b>: Toggle between on and off.<br><b>-Enable</b>: Enable.<br><b>-Disable</b>: Disable.   |
| Display           | <b>-Name</b>: Display the mode's name on the Stream Deck.<br><b>-Icon</b>: Display the mode's icon on the Stream Deck. |
| Colors            | <b>-On Color</b>: A border is drawn on the Stream Deck of this color if the mode is currently active<br><b>-Off Color</b>: A border is drawn on the Stream Deck of this color if the mode is currently not active<br><b>-Background</b>: Background color of the button. |

## Simple Calendar Reborn
[Simple Calendar Reborn](https://foundryvtt.com/packages/foundryvtt-simple-calendar-reborn) adds a calendar to Foundry.

Using Material Deck you can display the in-game time and date, start or stop the clock and set the time or date.

| Option            | Description   |
|-------------------|---------------|
| Time              | Configures the [time display](#time-display). |
| Date              | Configures the [date display](#date-display). |
| Date Format       | Configures the date format.   |
| On Press          | Configures what to do when the button is pressed:<br><b>-Do Nothing</b>: Do nothing.<br><b>-Start/Stop the Clock</b>: Start or stops the clock.<br><b>-Set the Time</b>: Sets the time/date.  |
| Toggle Mode       | (`Start/Stop the Clock` only) Sets what to do when pressed:<br><b>-Toggle</b>: Toggle between on and off.<br><b>-Enable</b>: Enable.<br><b>-Disable</b>: Disable.   |
| Set Time Mode     | Sets the mode when the button is pressed:<br><b>-Next Sunrise</b>: Advance clock to the next sunrise.<br><b>-Previous Sunrise</b>: Recede clock to the previous sunrise.<br><b>-Next Midday</b>: Advance clock to the next midday.<br><b>-Previous Midday</b>: Recede clock to the previous midday.<br><b>-Next Sunset</b>: Advance clock to the next sunset.<br><b>-Previous Sunset</b>: Recede clock to the previous sunset.<br><b>-Next Midnight</b>: Advance clock to the next midnight.<br><b>-Previous Midnight</b>: Recede clock to the previous midnight.<br><b>-Set Time to Value</b>: [Set the time to a specified value](#set-time-to-value-change-time-to-value).<br><b>-Change Time by Value</b>: [Change the time by a specified value](#set-time-to-value-change-time-to-value).<br>   |

### Time Display
The time display option consists of multiple checkboxes for the 'Digital' and 'Analog' time.<br>
The digital time displays the time as a value, while the analog time displays a clock face.<br>
In both cases you can configure to display the hours, minutes or seconds by checking the respective checkbox. For the digital time you can additionally set it to a 24 hour or 12 hour clock.

### Date Display
The date display option consists of multiple checkboxes, these define how the date is displayed.<br>
For example, if only `Display` is checked for `Month`, the month's number will be displayed, if `Name` is also checked, the month's name will be displayed, and lastly, if `Abbreviated` is also checked, the month's abbreviated name is displayed.

### Set Time to Value/ Change Time to Value
The time and date can be changed by setting the values in the `Time` and `Date` rows.<br>
Only fields that have a value will be changed, for example, if `Mode` is set to `Change Time by Value` and `Hours` is set to 1, the time will be incremented by 1 hour.

## Soundscape
[Soundscape](https://foundryvtt.com/packages/soundscape) adds comprehensive audio mixing capabilities to Foundry.

Using Material Deck you can control Soundscape's mixer and trigger sounds from its soundboard.

| Option            | Description   |
|-------------------|---------------|
| Mode              | Mode of the button:<br><b>-Open Soundscape</b>: Opens or closes the Soundscape mixer.<br><b>-Set Soundscape</b>: Sets the current soundscape.<br><b>-Mixer</b>: Control Soundscape's mixer.   |
| Soundscape Nr     | (`Set Soundscape` only) Sets the current soundscape to this value.    |
| Mixer Mode        | (`Mixer` mode only)<br><b>-Start/Stop All</b>: Start or stops all channels from playing.<br><b>Start/Stop</b>: Start stop the channel from playing.<br><b>Toggle Mute</b>: Toggle the channel's mute.<br><b>-Toggle Solo</b>: Toggle the channel's solo.<br><b>-Toggle Link</b>: Toggles the channel's link.
| Channel           | (`Mixer` mode only) Channel to control.   |
| Volume Mode       | (`Mixer` mode and `Set Volume` only) Configures how to control the channel's volume:<br><b>-Increase/Decrease</b>: Increase or decrease the volume by a specified value.<br><b>-Set to Value</b>: Set the volume to a specified value.    |
| Value             | (`Mixer` mode and `Set Volume` only) Volume to set.   |
| Display           | <b>-Channel</b>: Display the channel number on the Stream Deck.<br><b>-Name</b>: Display the mode's name on the Stream Deck.<br><b>-Icon</b>: Display the an icon on the Stream Deck.<br><b>-Volume</b>: (`Mixer` mode and `Set Volume` only) Display the channel's volume on the Stream Deck. |
| Colors            | <b>-On Color</b>: A border is drawn on the Stream Deck of this color if the mode is currently active<br><b>-Off Color</b>: A border is drawn on the Stream Deck of this color if the mode is currently not active<br><b>-Background</b>: Background color of the button. |

## Worldbuilder
[Worldbuilder](https://foundryvtt.com/packages/worldbuilder) is a campaign management and worldbuilding toolkit for Foundry VTT.

Using Material Deck you can open or close the Worldbuilder application, open and close articles/widgets/tags or show article/widgets/tags to all players.

| Option            | Description   |
|-------------------|---------------|
| Mode              | Mode of the button:<br><b>-[Main App](#main-app-mode)</b>: Control Worldbuilder's main application.<br><b>-[Articles, Widgets & Tags](#articles-widgets-tags-mode)</b>: Control specific articles, widgets or tags.   |
| Display           | <b>-Name</b>: Display a relevant name on the Stream Deck.<br><b>-Icon</b>: Display a relevant icon on the Stream Deck. |
| Colors            | <b>-On Color</b>: A border is drawn on the Stream Deck of this color if the app/tab/article is open<br><b>-Off Color</b>: A border is drawn on the Stream Deck of this color if the app/tab/article is closed<br><b>-Background</b>: Background color of the button. |

### Main App Mode
In "Main App" mode, you can open, close or toggle the main Worldbuilder application, or open a specific tab of the application.

| Option            | Description   |
|-------------------|---------------|
| On Press/On Hold  | Action to be performed when pressing/holding the button:<br><b>-Do Nothing</b>: Do Nothing.<br><b>-Open App</b>: Open the main app.<br><b>-Close App</b>: Close the main app.<br><b>-Toggle App</b>: Toggle between opening and closing the main app.<br><b>-Set Tab</b>: Open a specific tab of the main app.   |
| Tab               | (`Set Tab` only) The tab to open. |
| Open App          | (`Set Tab` only) Also open the application if it's currently closed. |

### Articles, Widgets & Tags Mode
In the "Articles, Widgets & Tags" mode you can open specific articles/widgets/tags and/or show them to all players.

| Option            | Description   |
|-------------------|---------------|
| Selection         | Method of selecting the article/widget/tag:<br><b>-Select by UUID</b>: Select an article/widget/tag by its UUID.<br><b>-Select by Nr</b>: Select an article/widget/tag using a number.<br><b>-All other options</b>: List of articles/widgets/tags to select. |
| UUID              | (`Select by UUID` only) UUID of the article/widget/tag.   |
| Type              | (`Select by Nr` only) Select the type of article/widget/tag. |
| Sorting Mode      | (`Select by Nr` only) Set how to sort the articles/widgets/tags:<br><b>-Same as Worldbuilder App</b>: The same sorting method as the relevant Tab of the Worlbuilder app will be used, see [here](https://materialfoundry.github.io/Worldbuilder/mainApplication/articles/#sorting).<br><b>-Manually</b>: Manual sorting, as configured in the Worldbuilder app, see [here](https://materialfoundry.github.io/Worldbuilder/mainApplication/articles/#sorting).<br><b>-Name (A-Z)</b>: Sort alphabetically, starting with A.<br><b>-Name (Z-A)</b>: Sort alphabetically, starting with Z. |
| Page-Wide Type & Sorting  | (`Select by Nr` only) Apply the same `Type` and `Sorting Mode` to all buttons with this setting enabled. |
| Nr                | (`Select by Nr` only) Number of the article/widget/tag to select.    |
| On Press/On Hold  | Action to be performed when pressing/holding the button:<br><b>-Do Nothing</b>: Do Nothing.<br><b>-Open</b>: Open the article/widget/tag.<br><b>-Close</b>: Close the article/widget/tag.<br><b>-Toggle App</b>: Toggle between opening and closing the article/widget/tag.<br><b>-Show Players</b>: Show the article/widget/tag to all players.   |