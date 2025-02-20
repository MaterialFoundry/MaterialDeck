
### Textbox
A textbox setting allows the user to input a single line of text.

```js
{
    id: "settingId",
    label: "Setting Label",
    type: "textbox",
    default: "Default value" //optional
}
```

### Textarea
A textarea setting allows the user to input multiple lines of text. The element will increase or decrease in size as the text is changed.

```js
{
    id: "settingId",
    label: "Setting Label",
    type: "textarea",
    default: "Default value" //optional
}
```

### Checkbox
A checkbox setting allows the user to set a boolean value.

```js
{
    id: "settingId",
    label: "Setting Label",
    type: "checkbox",
    default: false //optional
}
```

### Number
A number setting allows the user to input a numeric value.

| Key | Description |
|-------|-----|
| min | Minimum allowed value |
| max | Maximum allowed value |
| stepSize | Size of each step, default to 1 |

```js
{
    id: "settingId",
    label: "Setting Label",
    type: "number",
    default: "1", //optional
    min: "0", //optional
    max: "10", //optional
    stepSize: "0.5" //optional, defaults to 1
}
```

### Range
A range setting allows the user to input a numeric value using a slider.

| Key | Description |
|-------|-----|
| min | Minimum allowed value |
| max | Maximum allowed value |
| stepSize | Size of each step, default to 1 |
| displayValue | Will add a number box next to the slider |


```js
{
    id: "settingId",
    label: "Setting Label",
    type: "range",
    default: "1", //optional
    min: "0", //optional
    max: "10", //optional
    stepSize: "0.1", //optional
    displayValue: true //optional
}
```

### Select
A select setting allows the user to select from a list.

| Key | Description |
|-------|-----|
| options | An array containing the options the user can select from |
| permission | An option can prevent a user from having access to that option, see [here](./permissions.md) for more info |

```js
{
    id: "settingId",
    label: "Setting Label",
    type: "select",
    default: "option1", //optional
    options: [
        { 
            value: "option1", 
            label: "Option 1 Label",
            permission: false
        },{ 
            value: "option2", 
            label: "Option 2 Label" 
        }
    ]
}
```

If the setting already exists, it is possible to append options to the existing setting:

```js
{
    id: "settingId",
    appendOptions: [
        { 
            value: "appendedOption", 
            label: "Appended Option Label"
        }
    ]
}
```

### Color
A color setting allows the user to set a color using a color picker.

```js
{
    id: "settingId",
    label: "Setting Label",
    type: "color",
    default: "#FF0000" //optional
}
```

### Multi-Item
Multi-item adds multiple settings on a single line.

| Key | Description |
|-------|-----|
| settings | An array holding all settings for the multi-item. These can be of type `textbox`, `number`, `checkbox` or `color` |

The multi-item setting does not need an id, each setting within it does.<br>
Labels for each setting within the multi-item are ignored.

```js
{
    type: "multiItem",
    label: "Setting label",
    settings: [
        {
            id: "settingId1",
            type: "number",
            default: "0"
        },{
            id: "settingId2",
            type: "checkbox"
        }
    ]
}
```

### Table
Table is an element that contains multiple settings in a table format.

| Key | Description |
|-------|-----|
| columns | Sets the name of the columns. This is displayed at the top of the table |
| rows | An array of settings that populate the columns of each row. These can be of type `textbox`, `number`, `checkbox` or `color` |
| columnVisibility | An array with an array element for each column. Visibility for individual columns can be set here, it follows the same rules as the other [visibility settings](./visibility.md) |

```js
{
    label: "Table Label",
    id: "tableId",
    type: "table",
    columns: [
        { label: "Label 1" }, //Column 1
        { label: "Label 2" }  //Column 2
    ],
    rows: [
        [ { id: "settingId1", type: "checkbox" }, { id: "settingId2", type: "checkbox" } ], //Row 1
        [ { id: "settingId3", type: "checkbox" }, { id: "settingId4", type: "checkbox" } ]  //Row 2
    ],
    columnVisibility: [
        { showOn: [], hideOn: [] }, //Column 1
        true //Column 2
    ]
}
```

### Wrapper
Wrapper is an element that contains multiple settings.<br>
This can be used to group related settings so these settings, for example to show or hide all of these settings with a single line.

| Key | Description |
|-------|-----|
| id | Should end with '-wrapper' |
| settings | An array containing all the settings within the wrapper. These can by of any type, including other wrappers |
| label | Will add a label above the wrapper |
| expandable | Will make the wrapper expandable (requires `label`) |

```js
{
    label: "Wrapper Label", //optional
    id: "wrapperId-wrapper",
    type: "wrapper",
    expandable: true, //optional
    settings: [
        {
            id: "textboxId",
            label: "Textbox Label",
            type: "textbox"
        },{
            id: "checkboxId",
            label: "Checkbox label",
            type: "checkbox"
        }
    ]
}
```