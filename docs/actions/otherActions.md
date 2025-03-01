# Other Actions
Other Actions is used for miscellaneous actions.

| Option            | Description   |
|-------------------|---------------|
| Title             | If configured, will set the title/text on the button. This will override any other text that would normally be displayed |
| Icon Override     | Url to a custom icon. If configured, this will override any icon that would normally be displayed |
| Function          | Sets the function of the button:<br><b>-[Pause](#pause)</b>: Pause or unpause the game<br><b>-[Control Buttons](#control-buttons)</b>: Open or enable the control buttons<br><b>-[Open Sidebar Tab](#open-sidebar-tab)</b>: Open or close sidebar tabs<br><b>-[Roll Dice](#roll-dice)</b>: Roll dice using a formula<br><b>-[Dice Pool](#dice-pool)</b>: Create a dice pool and roll it<br><b>-[Roll Tables](#roll-tables)</b>: Open or close roll tables and roll from them<br><b>-[Open Compendium Pack](#open-compendium-pack)</b>: Open or close compendium packs<br><b>-[Open Journal](#open-journal)</b>: Open or close journal entries<br><b>-[Send Chat Message](#send-chat-message)</b>: Send a chat message<br><b>-[Set Roll Sharing Mode](#set-roll-sharing-mode)</b>: Set the roll sharing mode<br><b>-[Cycle Through Tokens](#cycle-through-tokens)</b>: Cycle through tokens on the canvas

## Pause
This function allows you to pause or unpause the game.

| Option            | Description   |
|-------------------|---------------|
| Mode              | Sets what to do on a button press:<br><b>-Pause Game</b>: Pause the game<br><b>-Resume</b>: Resumes/unpauses the game<br><b>-Toggle Pause</b>: Will pause the game if unpaused, or will unpause the game if paused |
| Display           | <b>-Icon</b>: Display an icon on the Stream Deck |
| Colors            | <b>-On Color</b>: A border is drawn on the Stream Deck of this color if the game is paused<br><b>-Off Color</b>: A border is drawn on the Stream Deck of this color if the game is not paused<br><b>-Background</b>: Background color of the button |

## Control Buttons
This function allows you to open control buttons or select/activate tools (the buttons on the left of the Foundry window).<br>
Controls are the 'categories' on the left. Each category can contain one or more tools and are shown to the right of the controls.

| Option            | Description   |
|-------------------|---------------|
| Control           | The control/tool to open or the control that contains the tool that you want to open or activate:<br><b>-Displayed Controls</b>: Select from one of the controls that are currently displayed in Foundry using `Nr`<br><b>-Displayed Tools</b>: Select from one of the tools that are currently displayed in Foundry using `Nr`<br><b>-Controls/Tools Offset</b>: Configure offsets for `Displayed Controls` and `Displayed Tools`. See [here](#controlstools-offset) for more info<br><b>-Rest</b>: All other options are a list of controls in Foundry that can be selected |
| Number            | (Only for `Displayed Controls/Tools`) The control or tool number that you want to select. 1 is the topmost tool/control. |
| Mode              | (Not for `Displayed Controls/Tools` or `Controls/Tools Offset`) Select what you want to do when the button is pressed:<br><b>-Open Control</b>: Open the control<br><b>-Rest</b>: All other options are the tools for the selected control. Will select or activate the tool |
| Display           | <b>-Icon</b>: Display an icon on the Stream Deck |
| Colors            | <b>-On Color</b>: A border is drawn on the Stream Deck of this color if the control or tool is selected<br><b>-Active Color</b>: A border is drawn on the Stream Deck of this color if the tool is activated<br><b>-Off Color</b>: A border is drawn on the Stream Deck of this color if the control or tool is not selected<br><b>-Background</b>: Background color of the button |

### Controls/Tools Offset
Control and tool offsets can be used in combination with `Nr` to give an offset to the selected control or tool.<br>
For example, if the controls offset is set to 3, a button with `Control` set to `Displayed Controls` and `Nr` set to 1 will now select control 4, 
and a button with `Nr` set to 3 will not select control 6.<br>
<br>
This can be used to browse through the controls or tools.<br>
For example, say you have 5 `Displayed Controls` buttons with `Nr` set from 1 to 5, and a button with `Offset Mode` `Increase/Decrease` and `Offset` of 1. 
If you then press the offset button, the offset will increase to 1, so now controls 2 through 6 ar selected.

| Option            | Description   |
|-------------------|---------------|
| Offset Mode       | Sets how to set the offset:<br><b>-Set to Value</b>: Sets the offset to the value set in `Offset`<br><b>-Increase/Decrease</b>: Increases the offset by the value set in `Offset` |
| Offset            | The value to set the offset to (in case of `Set to Value`), or the value to increment the offset with (in case of `Increase/Decrease`).<br> The offset can be any value, positive or negative. |
| Display           | <b>-Offset</b>: Display the current offset on the Stream Deck<br><b>-Icon</b>: Display an icon on the Stream Deck |
| Colors            | <b>-On Color</b>: (`Set to Value` only) A border is drawn on the Stream Deck of this color if the current offset is equal to the offset configured in `Offset`<br><b>-Off Color</b>: (`Set to Value` only) A border is drawn on the Stream Deck of this color if the current offset is not equal to the offset configured in `Offset`<br><b>-Background</b>: Background color of the button|

## Open Sidebar Tab
This function allows you to open or close sidebar tabs.

| Option            | Description   |
|-------------------|---------------|
| Tab               | The sidebar tab to open or close |
| Pop Out           | If selected, will pop out the sidebar tab in a separate window |
| Display           | <b>-Name</b>: Display the name of the sidebar tab on the Stream Deck<br><b>-Icon</b>: Display the icon of the sidebar tab on the Stream Deck |
| Colors            | <b>-On Color</b>: A border is drawn on the Stream Deck of this color if the sidebar tab is open<br><b>-Off Color</b>: A border is drawn on the Stream Deck of this color if the sidebar is not open<br><b>-Background</b>: Background color of the button|


## Roll Dice
This function allows you to roll dice from a formula

| Option            | Description   |
|-------------------|---------------|
| Mode              | The roll mode:<br><b>-Default</b>: Result is shown as set in Foundry<br><b>-Public Roll</b>: Result is shown in chat to everyone<br><b>-GM Roll</b>: Result is shown in chat to the player that rolled and the GM<br><b>-Blind Roll</b>: Result is shown in chat to the GM only<br><b>-Self Roll</b>: Result is shown in chat to the user who rolled<br><b>-Display on Stream Deck</b>: Result is displayed on the Stream Deck |
| Formula           | The roll formula. Follows the same format as standard Foundry [roll commands](https://foundryvtt.com/article/dice/), but omit `/r` or `/roll`.<br>For example: `1d20 + 7` or `1d4 / 2 + 2d8` |
| Display           | <b>-Formula</b>: Display the formula on the Stream Deck<br><b>-Icon</b>: Display an icon on the Stream Deck |
| Colors            | <b>-Background</b>: Background color of the button |

## Dice Pool
This function allows you to create a dice pool and roll it.<br>
You can add or remove dice using the `Add Dice` and `Remove Dice` modes and roll using the `Roll Dice Pool` mode.

| Option            | Description   |
|-------------------|---------------|
| Mode              | <b>-Roll Dice Pool</b>: Rolls the dice pool<br><b>-Clear Dice Pool</b>: Clear the dice pool<br><b>-Add Dice</b>: Add a die to the dice pool<br><b>-Remove Dice</b>: Remove a die from the dice pool |
| Roll Mode         | (Only on `Roll Dice Pool`) The roll mode:<br><b>-Public Roll</b>: Result is shown in chat to everyone<br><b>-GM Roll</b>: Result is shown in chat to the player that rolled and the GM<br><b>-Blind Roll</b>: Result is shown in chat to the GM only<br><b>-Self Roll</b>: Result is shown in chat to the user who rolled<br><b>-Display on Stream Deck</b>: Result is displayed on the Stream Deck |
| Clear After Roll  | (Only on `Roll Dice Pool`) Clears the dice pool after it has been rolled |
| Dice              | (Only on `Add/Remove Dice`) The dice type to add or remove |
| Display           | <b>-Formula</b>: (Only on `Roll Dice Pool`) Display the formula of the dice pool on the Stream Deck<br><b>-Value</b>: (Only on `Add/Remove Dice`) The amount of dice of this dice type in the dice pool<br><b>-Icon</b>: Display an icon on the Stream Deck |
| Colors            | <b>-Background</b>: Background color of the button |

## Roll Tables
This function allows you to open and close roll tables, and roll from them.

| Option            | Description   |
|-------------------|---------------|
| Table             | Table to select:<br><b>-Select by Number</b>: Select a table by its number<br><b>-Select by Name/Id</b>: Select a table by its name or id<br><b>-Rest</b>: List of all roll tables |
| Number            | (Only on `Select by Number`) The number of the table to select |
| Name/Id           | (Only on `Select by Name/Id`) The name or id of the table to select |
| Mode              | Selects what to do on a button press:<br><b>-Open Table</b>: Opens or closes the table<br><b>-Public Roll</b>: Roll from the table, the result is shown in chat to everyone<br><b>-GM Roll</b>: Roll from the table, the result is shown in chat to the player that rolled and the GM<br><b>-Blind Roll</b>: Roll from the table, the result is shown in chat to the GM only<br><b>-Self Roll</b>: Roll from the table, the result is shown in chat to the user who rolled
| Display           | <b>-Name</b>: Display the name of the roll table on the Stream Deck<br><b>-Icon</b>: Display the icon of the roll table on the Stream Deck |
| Colors            | <b>-On Color</b>: A border is drawn on the Stream Deck of this color if the roll table is open<br><b>-Off Color</b>: A border is drawn on the Stream Deck of this color if the roll table is not open<br><b>-Background</b>: Background color of the button|

## Open Compendium Pack
This function allows you to open and close compendium packs.

| Option            | Description   |
|-------------------|---------------|
| Compendium        | Compendium pack to select:<br><b>-Select by Number</b>: Select a compendium pack by its number<br><b>-Select by Name</b>: Select a compendium pack by its name<br><b>-Rest</b>: List of all compendium packs |
| Number            | (Only on `Select by Number`) The number of the compendium pack to select |
| Name              | (Only on `Select by Name`) The name of the compendium pack to select |
| Display           | <b>-Name</b>: Display the name of the compendium pack on the Stream Deck<br><b>-Icon</b>: Display the icon of the compendium pack on the Stream Deck |
| Colors            | <b>-On Color</b>: A border is drawn on the Stream Deck of this color if the compendium pack is open<br><b>-Off Color</b>: A border is drawn on the Stream Deck of this color if the compendium pack not open<br><b>-Background</b>: Background color of the button|

## Open Journal
This function allows you to open and close journal entries or specific pages of journal entries.

| Option            | Description   |
|-------------------|---------------|
| Journal           | Journal to select:<br><b>-Select by Number</b>: Select a journal by its number<br><b>-Select by Name</b>: Select a journal by its name<br><b>-Rest</b>: List of all journals |
| Number            | (Only on `Select by Number`) The number of the journal to select |
| Name/Id           | (Only on `Select by Name/Id`) The name or id of the journal to select |
| Mode              | Selects what to do on a button press:<br><b>-Open Journal</b>: Opens or closes the journal<br><b>-Open Page by Number</b>: Open a specific page of the journal by its page number<br><b>-Open Page by Name</b>: Open a specific page of the journal by its name |
| Page Number       | (Only on `Open Page by Number`) The number of the journal's page to open |
| Page Name         | (Only on `Open Page by Name`) The name of the journal's page to open |
| Display           | <b>-Name</b>: Display the name of the journal on the Stream Deck<br><b>-Icon</b>: Display an icon on the Stream Deck |
| Colors            | <b>-On Color</b>: A border is drawn on the Stream Deck of this color if the journal is open. If `Open Page by Number/Name` is selected, only half of a border will be of this color if the journal is open but not on the right page<br><b>-Off Color</b>: A border is drawn on the Stream Deck of this color if the journal is not open<br><b>-Background</b>: Background color of the button|

## Send Chat Message
This function allows you to send a chat message.

| Option            | Description   |
|-------------------|---------------|
| Speaker           | <b>-User</b>: Chat message will be spoken by the user<br><b>-Token</b>: Chat message will be spoken by the selected token or the player token |
| Message           | The message to send to chat |
| Display           | <b>-Message</b>: Display the chat message on the Stream Deck<br><b>-Icon</b>: Display an icon on the Stream Deck |
| Colors            | <b>-Background</b>: Background color of the button |

## Set Roll Sharing Mode
This function allows you to set the roll mode in Foundry for generic rolls.

| Option            | Description   |
|-------------------|---------------|
| Mode              | <b>-Public Roll</b>: Results are shown in chat to everyone<br><b>-GM Roll</b>: Results are shown in chat to the player that rolled and the GM<br><b>-Blind Roll</b>: Results are shown in chat to the GM only<br><b>-Self Roll</b>: Results are shown in chat to the user who rolled
| Display           | <b>-Mode</b>: Display the selected mode on the Stream Deck<br><b>-Icon</b>: Display an icon on the Stream Deck |
| Colors            | <b>-On Color</b>: A border is drawn on the Stream Deck of this color if the current roll mode is `Mode`<br><b>-Off Color</b>: A border is drawn on the Stream Deck of this color if the current roll mode is not `Mode`<br><b>-Background</b>: Background color of the button|

## Cycle Through Tokens
This function allows you to cycle through tokens to select them.

| Option            | Description   |
|-------------------|---------------|
| Mode              | <b>-All Tokens</b>: Cycle through all tokens<br><b>-Owned Tokens</b>: Cycle through owned tokens<br><b>-Friendly Tokens</b>: Cycle through friendly tokens |
| Display           | <b>-Icon</b>: Display an icon on the Stream Deck |
| Colors            | <b>-Background</b>: Background color of the button |
