# Macro Action

The Macro actions allows the execution of macros or custom code.

| Option            | Description   |
|-------------------|---------------|
| Title             | If configured, will set the title/text on the button. This will override any other text that would normally be displayed. |
| Icon Override     | Url to a custom icon. If configured, this will override any icon that would normally be displayed. |
| Macro Selection   | Sets how to select the macro:<br><b>-Hotbar</b>: Select macros from the macro hotbar.<br><b>-Select by Name/Id</b>: Select macros using their name or ID.<br><b>-Execute Code</b>: Execute code directly.<br><b>-[Macro Offset](#macro-offsets)</b>: Configure macro offsets.<br><b>-[Hotbar Macro Offset](#macro-offsets)</b>: Configure hotbar macro offsets.<br><b>-All others</b>: List of macros to select. |
| Mode              | (`Hotbar` only) Hotbar selection mode:<br><b>-All Hotbar Pages</b>: Select a macro from any hotbar page.<br><b>-Visible Hotbar Page</b>: Select a macro from the currently visible hotbar page. |
| Macro Nr          | (`Hotbar` only) The macro to select from the hotbar.<br>`All Hotbar Pages`: Value between 1 and 50, where 1-10 corresponds with macros on the 1st page, 11-20 corresponds with macros on the 2nd page, etc.<br>`Visible Hotbar Page`: Value between 1 and 10, where the value corresponds with macros on the currently visible page. |
| Macro Name/ID     | (`Select by Name/ID` only) The name or ID of the macro to select. This is case sensitive and must match exactly. |
| Arguments         | (All but `Execute Code`) Arguments for the macro, see [here](#macro-arguments). |
| Code              | (`Execute Code` only) Code to run. This is normal JavaScript code.    |
| Display           | <b>-Name</b>: (All but `Execute Code`) Display the name of the macro on the Stream Deck.<br><b>-Icon</b>: (All but `Execute Code`) Display the icon of the macro on the Stream Deck.<br><b>-Border</b>: Display a border of a specified color on the Stream Deck |
| Colors            | <b>-Border</b>: A border is drawn on the Stream Deck of this color if `Border` is ticked in the `Display` section.<br><b>-Background</b>: Background color of the button. |

## Macro Offsets
Macro offsets can be used in combination with `Macro Nr` to give an offset to the macro nr.<br>
For example, if the macro offset is set to 10, a button with `Macro Nr` set to 1 will then have macro 11 selected, a button with `Macro Nr` set to 5 will have macro 15 selected.<br>
<br>
This can be used to browse through macros.<br>
For example, say you have 5 buttons with `Macro Nr` set from 1 to 5, and a button with `Offset Mode` `Increase/Decrease` and `Offset` of 1. 
If you then press the offset button, the offset will increase to 1, so now macros 2 through 6 are selected.<br>
<br>
There are separate offsets for the `Hotbar` and `Select by Number` options. The `Hotbar Macro Offset` option has an additional `Circle` checkbox, enabling this will circle the offset back to 0 if it would go past 50.

| Option            | Description   |
|-------------------|---------------|
| Offset Mode       | Sets how to set the offset:<br><b>-Set to Value</b>: Sets the offset to the value set in `Offset`.<br><b>-Increase/Decrease</b>: Increases the offset by the value set in `Offset`. |
| Offset            | The value to set the offset to (in case of `Set to Value`), or the value to increment the offset with (in case of `Increase/Decrease`).<br> The offset can be any value, positive or negative. |
| Circle            | (`Hotbar Macro Offset` only) Circle the offset back to 0 if pressing the button would put it past 50. |
| Display           | <b>-Offset</b>: Display the current offset on the Stream Deck.<br><b>-Icon</b>: Display an icon on the Stream Deck. |

## Macro Arguments
Macro arguments allow some customization and expandability of macros. For more information on using macro arguments, read the 'Script Macro Arguments' section on the official [Foundry documentation](https://foundryvtt.com/article/macros/).

Macro arguments must be stringified JSON objects, for example:<br>
```js
{"argument1":value1, "argument2":value2, etc}
```
Which can then be accessed within the macro as `scope.argument1` and `scope.argument2`.

For example, take the following script macro to move the selected token to coordinates x and y:<br>
```js
token.document.update({x: scope.x, y: scope.y})
```
If you want to call this macro from the Stream Deck to move the token to x=1000 and y=1500, you'd use the following arguments:<br>
```js
{"x":1000, "y":1500}
```
Please note that you must include the quotation marks around the object keys.

## Changing Button Icon and Text
Besides all standard Foundry functionality, you can also edit the text and icon of the button you pressed to run the macro.

Some examples:

To change the text of the button, add the following to your macro:<br>
```js
scope.button?.setTitle("New Title")
```

To change the icon of the button, add the following to your macro:<br>
```js
scope.button?.setIcon("path/to/icon.png")
```

To change both the text and icon of the button, add the following to your macro:<br>
```js
scope.button?.set("New Title", "path/to/icon.png")
```

You can add an `options` variable to the `setIcon` and `set` functions for additional options:<br>
```js
const options = {
    background: "#FF0000",  //adds a red background
    border: true,           //adds a colored border
    borderColor: "#00FF00"  //sets the border to green
}
scope.button?.setIcon("path/to/icon.png", options)
```

See [here](./custom/writingCode.md#options) for all options.