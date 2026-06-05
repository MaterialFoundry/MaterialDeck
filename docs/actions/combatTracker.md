# Combat Tracker Action
The combat tracker action allows you to control Foundry's combat tracker, and display combatants.

Foundry allows for multiple simultaneous encounters, these can be categorized in 2 types:

* <b>Linked Encounters</b>: Encounter that are linked to a specific scene. Only visible if you're on that scene.
* <b>Unlinked Encounters</b>: Encounters that are not linked to a specific scene. Visible from all scenes.

Under the `Encounter` option you can specify the kind of encounter you want to control.

Since multiple encounters can be active at the same time, you can select a specific encounter using the `Encounter Nr` option.

| Option            | Description   |
|-------------------|---------------|
| Title             | If configured, will set the title/text on the button. This will override any other text that would normally be displayed. |
| Icon Override     | Url to a custom icon. If configured, this will override any icon that would normally be displayed. |
| Page-Wide Encounter | All combat tracker actions on the current page with this setting enabled will share the same encounter selection. So if on one of these actions you select an encounter using `Encounter on a Scene`, all other actions with Page-Wide Encounter enabled will also select that encounter. |
| Encounter         | Encounter selection:<br><b>-Active Encounter</b>: The encounter that is currently open in Foundry.<br><b>-Encounter on a Scene</b>: Select an encounter on a specific scene.<br><b>-Unlinked Encounter</b>: Select an unlinked encounter. |
| Scene Selection   | (`Encounter on a Scene` only) Sets how to select a scene:<br><b>-Visible Scenes</b>: Select a scene from the ones that are currently visible in the navigation bar.<br><b>-Any Scene</b>: Select any scene on the Foundry server.<br><b>-Select From List</b>: Select from a list of all scenes.<br><b>-Select by Name/ID</b>: Select a scene by its name or ID.<br><b>-Active Scene</b>: Selects the currently active scene. |
| Scene Nr          | (`Encounter on a Scene` and `Visible Scenes` or `Any Scene` only) Number of the scene to select, see [here](./scene.md#scene-nr). |
| Scene             | (`Encounter on a Scene` and `Select From List` only) List of all scenes. |
| Scene Name/ID     | (`Encounter on a Scene` and `Select by Name/ID` only) Name or ID of the scene to select. |
| Encounter Nr      | (`Encounter on a Scene` and `Unlinked Encounter` only) The encounter to select. |
| Mode              | Mode of the button:<br><b>-[Combatants](#combatants-current-combatant-mode)</b>: Display combatants.<br><b>-[Current Combatant](#combatants-current-combatant-mode)</b>: Display the current combatant.<br><b>-[Control](#control-mode)</b>: Control the combat tracker.   |

## Combatants & Current Combatant Mode
With the `Combatant` mode you can display the combatants of the combat tracker, while the `Current Combatant` mode displays the current combatant (with an optional offset).

| Option            | Description   |
|-------------------|---------------|
| Disposition Filter    | Filter displayed combatants based on their disposition:<br><b>-All Tokens</b>: Display any token.<br><b>-Friendly & Neutral Tokens</b>: Only display friendly or neutral tokens.<br><b>-Friendly Tokens</b>: Only display friendly tokens.<br><b>-Hostile Tokens</b>: Only display hostile tokens.    |
| Hide Mode         | Configure what to do with tokens that are filtered out with `Disposition Filter`:<br><b>-Remove</b>: Remove tokens from the displayed combatants.<br><b>-Blacken Button</b>: Display a black button with no text.<br><b>-Display Mystery Man</b>: Display a 'Mystery Man' icon.<br><b>-Hide Token Name</b>: Only hide the token name. |
| Offset            | (`Current Combatant Mode` only) Can be used to offset the displayed combatant, for example to display the next combatant (if set to 1) or the previous combatant (if set to -1). |
| Colors            | <b>-On Color</b>: A border is drawn on the Stream Deck of this color if it's the combatant's turn.<br><b>-Off Color</b>: A border is drawn on the Stream Deck of this color if it's not the combatant's turn.<br><b>-Background</b>: Background color of the button. |
| All other settings    | All other settings are related to the token (`Stats`, `On Press`, etc) and are identical to the [Token Action](./token/token.md#token-mode). |

## Control Mode
With the control mode you can control the combat tracker.

| Option            | Description   |
|-------------------|---------------|
| Function          | Function of the button:<br><b>-Start/Stop Combat</b>: Start or stop the combat.<br><b>-End Turn</b>: End your turn (mainly meant for players).<br><b>-Next Turn</b>: Go to the next turn.<br><b>-Previous Turn</b>: Go to the previous turn.<br><b>-Next Round</b>: Go to the next round.<br><b>-Previous Round</b>: Go to the previous round.<br><b>-Turn Display</b>: Display the current round and turn.<br><b>-Roll Initiative</b>: Roll initiative for the combatants.<br><b>-Add/Remove Tokens From Combat</b>: Adds or removes all selected tokens from the combat. |
| Initiative Mode   | (`Roll Initiative` only) Set what combatants to roll initiative for:<br><b>-All</b>: All combatants.<br><b>-Current Combatant</b>: The current combatant only.<br><b>-Player Characters</b>: Player characters only.<br><b>-Non-Player Characters</b>: Non-player characters only. |
| Display           | <b>-Icon</b>: (All except for `Turn Display`) Display a relevant icon.<br><b>-Round</b>: (`Turn Display` only) Display the current round.<br><b>-Turn</b>: (`Turn Display` only) Display the current turn. |

## Dial Functions
The following Dial Functions are available for dials (Stream Deck + and Stream Deck XL +):

| Button Mode                                           | Dial Function         | Description           |
|---------------------------|-------------------|-------------------------------------------------------|
| Mode: Combatants          | Combatant Nr      | Sets the combatant nr for the dial (not persistent).  |
| Mode: Current Combatant   | Combatant Offset  | Sets the combatant offset (not persistent).           |
| Any                       | Set Turn          | Sets the turn for the selected encounter.             |
| Any                       | Set Round         | Sets the round for the selected encounter.            |

The `Dial Stepsize` option sets how much the configured value should increase or decrease for each dial "tick".