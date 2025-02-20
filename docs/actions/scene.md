# Scene Action

The Scene action give control over Foundry's scenes.

You can use it to display scenes on the Stream Deck, switch scenes in Foundry, activate scenes in Foundry, or set the scene darkness.

| Option            | Description   |
|-------------------|---------------|
| Title             | If configured, will set the title/text on the button. This will override any other text that would normally be displayed. |
| Icon Override     | Url to a custom icon. If configured, this will override any icon that would normally be displayed. |
| Function          | The function of the button:<br><b>-[Scene Control](#scene-control)</b>: Open or close scenes.<br><b>-[Scene Offsets](#scene-offsets)</b>: Configure scene offsets.<br><b>-[Darkness Control](#darkness-control)</b>: Control the current scene's darkness level.<br><b>-[Move Canvas](#move-canvas)</b>: Move the canvas or zoom in or out |

## Scene Control
With this function you can open or activate scenes.

| Option            | Description   |
|-------------------|---------------|
| Scene Selection   | Sets how to select a scene:<br><b>-Visible Scenes</b>: Select a scene from the ones that are currently visible in the navigation bar.<br><b>-Any Scene</b>: Select any scene on the Foundry server.<br><b>-Select by Name/ID</b>: Select a scene by its name or ID.<br><b>-Active Scene</b>: Selects the currently active scene.<br><b>-All other options</b>: List of scenes to select from. |
| Scene Nr          | (`Visible Scenes` and `Any Scene` only) Number of the scene to select, see [below](#scene-nr). |
| Scene Name/ID     | (`Select by Name/ID` only) Name or ID of the scene to select. |
| On Press/ On Hold | What to do when the button is pressed/held down:<br><b>-View</b>: View (open) the selected scene.<br><b>-Activate</b>: Activate the selected scene.<br><b>-View/Activate if Viewed</b>: View (open) the selected scene if it's not currently open. If it is already open, activate the scene.<br><b>-Preload Scene</b>: Preload the scene. |
| Display           | <b>-Name</b>: Display the scene or navigation name of the scene on the Stream Deck.<br><b>-Icon</b>: Display the scene's background on the Stream Deck. |
| Colors            | <b>-Open Color</b>: A border is drawn on the Stream Deck of this color if the scene is currently open.<br><b>-Active Color</b>: A border is drawn on the Stream Deck of this color if the scene is currently active.<br><b>-Off Color</b>: A border is drawn on the Stream Deck of this color if the scene is currently not open or active.<br><b>-Background</b>: Background color of the button. |

#### Scene Nr
Selects a scene using a number.<br>
This is mostly useful if you want to keep things flexible. 
For example, if you have multiple buttons set to `Visible Scenes` with scene nr's from 1 to 10, you would always have control over the first 10 visible scenes, even if you change which scenes are visible.<br>
<br>
In case of `Visible Scenes`, 1 is the left-most scene that's visible, 1 is the scene to the right of that, etc.<br>
In case of `Any Scene`, the number is based on how Foundry has organised the scenes.

## Scene Offsets
Scene offsets can be used in combination with `Scene Nr` to give an offset to the scene nr.<br>
For example, if the scene offset is set to 10, a button with `Scene Nr` set to 1 will then have scene 11 selected, a button with `Scene Nr` set to 5 will have scene 15 selected.<br>
<br>
This can be used to browse through scenes.<br>
For example, say you have 5 buttons with `Scene Nr` set from 1 to 5, and a button with `Offset Mode` `Increase/Decrease` and `Offset` of 1. 
If you then press the offset button, the offset will increase to 1, so now scenes 2 through 6 are selected.

| Option            | Description   |
|-------------------|---------------|
| Offset Mode       | Sets how to set the offset:<br><b>-Set to Value</b>: Sets the offset to the value set in `Offset`.<br><b>-Increase/Decrease</b>: Increases the offset by the value set in `Offset`. |
| Offset            | The value to set the offset to (in case of `Set to Value`), or the value to increment the offset with (in case of `Increase/Decrease`).<br> The offset can be any value, positive or negative. |
| Display           | <b>-Offset</b>: Display the current offset on the Stream Deck.<br><b>-Icon</b>: Display an icon on the Stream Deck. |
| Colors            | <b>-On Color</b>: (`Set to Value` only) A border is drawn on the Stream Deck of this color if the current offset is equal to the offset configured in `Offset`.<br><b>-Off Color</b>: (`Set to Value` only) A border is drawn on the Stream Deck of this color if the current offset is not equal to the offset configured in `Offset`.<br><b>-Background</b>: Background color of the button. |

## Darkness Control
Allows you to set the darkness of the current scene.

| Option            | Description   |
|-------------------|---------------|
| Mode              | Sets how to control the darkness:<br><b>-Set to Value</b>: Sets the darkness to the value set in `Value`.<br><b>-Increase/Decrease</b>: Increases the darkness by the value set in `Value`.<br><b>-Transition to Day</b>: Transitions to day.<br><b>-Transition to Night</b>: Transition to night. |
| Value             | (`Set to Value` and `Increase/Decrease` only) The value to set the darkness to (in case of `Set to Value`), or the value to increment the darkness with (in case of `Increase/Decrease`). |
| Animation Time    | Time in milliseconds that the animation takes when changing the scene darkness. |
| Display           | <b>-Value</b>: Display the current scene darkness on the Stream Deck.<br><b>-Icon</b>: Display an icon on the Stream Deck. |
| Colors            | <b>-On Color</b>: (Not for `Increase/Decrease`) A border is drawn on the Stream Deck of this color if the current scene darkness is equal to the offset configured in `Value`.<br><b>-Off Color</b>: (Not for `Increase/Decrease`) A border is drawn on the Stream Deck of this color if the current scene darkness is not equal to the offset configured in `Value`.<br><b>-Background</b>: Background color of the button. |

## Move Canvas
This function allows you to move the canvas or zoom in or out.

| Option            | Description   |
|-------------------|---------------|
| Direction         | Sets what to do on a button press:<br><b>-Center</b>: Centers the canvas.<br><b>-Up/Down/Left/Right etc</b>: Move the canvas in this direction by the value set in `Distance` (in grid spaces).<br><b>-Zoom In/Zoom Out</b>: Zoom in or out on the canvas by the value set in `Distance`. |
| Distance          | (Not shown for `Center`) The distance to move the canvas or value to zoom in/out by. |
| Display           | <b>-Icon</b>: Display an icon on the Stream Deck. |
| Colors            | <b>-Background</b>: Background color of the button. |