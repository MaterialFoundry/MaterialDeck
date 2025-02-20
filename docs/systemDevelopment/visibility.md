The visibility option allows settings to be shown or hidden depending on what the user has selected.<br>
`visibility` is an object that can have either a `showOn` or `hideOn` option, where the first will always hide the setting unless a `showOn` condition is met, while the latter does the opposite.

`showOn` or `hideOn` is an array containing objects with an id and value. You can have as many of these objects as desired.
```js
visibility: {
    showOn: [ 
        { [settingId]: [value] },
        { [settingId]: [value2] }
    ]
}
```

Take the following example, with a select setting with 4 options and a checkbox:
```js
{
    id: "selectId",
    label: "Select Label",
    type: "select",
    options: [
        { value: "option1", label: "Option 1 Label" },
        { value: "option2", label: "Option 2 Label" },
        { value: "option3", label: "Option 3 Label" },
        { value: "option4", label: "Option 4 Label" }
    ]
},{
    id: "checkboxId",
    label: "Checkbox Label",
    type: "checkbox",
    visibility: {
        showOn: [ 
            { selectId: "option1" },
            { selectId: "option4" }
        ]
    }
}
```

The id to show the checkbox is `selectId`, which is the id of the select element, while the values are `option1` and `option4`.<br>
This means that if the user selects one of the options that has a value equal to that, the checkbox will be visible, otherwise it will be hidden.

The following example shows a checkbox and textbox setting:
```js
{
    id: "checkboxId",
    label: "Checkbox Label",
    type: "checkbox"
},{
    id: "textboxId",
    label: "Textbox Label",
    type: "textbox",
    visibility: {
        hideOn: [ 
            { checkboxId: true }
        ]
    }
}
```
In this case, the textbox will be hidden if the checkbox is checked.

It is possible to add multiple settingId/value pairs, so a setting can be shown or hidden if multiple pairs are true:
```js
{
    id: "checkboxId",
    label: "Checkbox Label",
    type: "checkbox"
},{
    id: "checkbox2Id",
    label: "Checkbox 2 Label",
    type: "checkbox"
},{
    id: "textboxId",
    label: "Textbox Label",
    type: "textbox",
    visibility: {
        showOn: [ 
            { checkboxId: true, checkbox2Id: false }
        ]
    }
}
```
In this case, the textbox will only show if the first checkbox is checked while the second checkbox is unchecked.

The setting to be shown or hidden using `visibility` do not need to be next to the element its visibility depends on. They can be located anywhere.