# Synchronized Settings
It is possible to synchronize settings between multiple buttons of the same action by using the `sync` setting.

Synchronized settings require a checkbox setting to enable or disable the synchronization.

For example:
```js
{
    id: "checkboxId",
    label: "Checkbox Label",
    type: "checkbox"
},{
    id: "syncedTextbox",
    label: "Textbox Label",
    type: "textbox",
    sync: "checkboxId"
},{
    id: "syncedValue",
    label: "Setting Label",
    type: "number"
}
```
If the checkbox is checked, all other buttons of the same action with that checkbox checked will have the textbox and number settings synchronized.<br>
So if the number setting is changed in button 1, it will also be changed for button 2.

Settings can be synchronized in wrappers, or entire wrappers can be synchronized so each setting inside a wrapper is synchronized.