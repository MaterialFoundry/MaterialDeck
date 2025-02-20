Settings are registered by adding the `settingsConfig` object variable to the system class, where each key in that variable sets the settings for that action:

```js
this.settingsConfig = {
    token: tokenSettings,
    other: otherSettings
}
```

In this example, `tokenSettings` is an array with the settings for the token action.<br>
You only need to add actions that you want to edit.

The settings array contains all the settings for a specific action, for example `tokenSettings` in the example above.<br>
Each setting is an object that has a unique id and multiple options. The `type` key will determine what kind of setting it is.

Almost all settings can have the following options:

| Option | Description |
|-------|-----|
| id | Unique id of the setting |
| label | Label of the setting |
| type | Type of the setting |
| link | (Optional) A link to, for example, documentation. Setting this will turn the label into a hyperlink |
| indent | (Optional) Indents the setting (moves it slightly to the right) |
| default | (Optional) Default value of the setting |
| sync | (Optional) Allows settings to be synchronized between multiple buttons, see [here](./synchronizedSettings.md) |
| visibility | (Optional) Configure the visibility of the setting, see [here](./visibility.md) for more info |
| permission | (Optional) Configure the permissions of the setting, see [here](./permissions.md) for more info |

Some settings allow more options.<br>
You can see all setting types and how to configure them [here](./settingTypes.md).

The following example will add a checkbox and textbox to the token action:
```js
this.settingsConfig = {
    token: [
        {
            id: "checkboxId",
            label: "Checkbox Label",
            type: "checkbox",
            default: true
        },{
            id: "textboxId",
            label: "Textbox Label",
            type: "textbox",
            default: "Default value"
        }
    ]
} 
```

If a setting is added with an id that already exists, the existing setting will be modified with the values that are specified.<br>
For example, you can change the label of an existing setting:
```js
{
    id: "existingSettingId",
    label: "New Label"
}
```
Or change the options of an existing `select` setting:
```js
{
    id: "existingSelectId",
    options: [
        { 
            value: "newOption1", 
            label: "Option 1 Label",
            permission: false
        },{ 
            value: "newOption2", 
            label: "Option 2 Label" 
        }
    ]
}
``` 