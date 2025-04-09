Material Deck has a permissions system that can prevent a user with a specific role from accessing certain features.<br>
See [here](../moduleSettings/permissionConfig.md) for more info on using permissions.

## Registered Permissions
Material Deck already has many permissions built-in. You can get them by calling<br>
`game.materialDeck.permissions.permissions`

## Adding or Modifying Permissions

A gaming system can modify existing permissions, disabling existing permissions or add new permissions.

### Required Setup
To modify or add permissions, you must add a `permissions` array variable when `game.materialDeck.registerSystem` is called.
Each element of that array is a permission category, which in turn has one or more permissions for that category:

```js
const permissions = [
    {
        id: "Category Id",
        label: "Category label",
        permissions: [
            {
                id: "Permission Id",
                label: "Permission label",
                hint: "Permission hint",
                default: [false, true, false, true]
            },{
                id: "Permission Id",
                label: "Permission label",
                hint: "Permission hint",
                default: [false, true, false, true]
            }
        ]
    }
];
```

Each category can have the following keys:

| Option | Description |
|-------|-----|
| id | Each category must have a unique id. If the id already exists, the existing category will me modified, see [below](#modifying-an-existing-category) |
| label | The label that is displayed in the User Permissions configuration |
| disable | A boolean value that allows you to disable the category in the User Permission configuration, see [below](#disabling-categories-or-permissions) |
| permissions | An array that holds all the permissions for the category |

Each permission in a category can have the following keys:

| Option | Description |
|-------|-----|
| id | Each permission must have a unique id within their category (permissions in different categories can have identical ids). If the id already exists, the existing permission will me modified, see [below](#modifying-an-existing-permission) |
| label | The label that is displayed in the User Permissions configuration |
| disable | A boolean value that allows you to disable the category in the User Permission configuration, see [below](#disabling-categories-or-permissions) |
| default | An array holing the default permissions, where each array element sets the default permission for the 'Player', 'Trusted Player', 'Assistant GM' and 'Gamemaster' roles, respectively |

### Adding a New Category
A new category can be added by adding a category element to the permissions variable with an id that does not exist yet. Within this category you can add as many permissions as you like. See the example [above](#required-setup).

### Modifying an Existing Category
You can modify an existing category by setting the category id the same as one of the existing categories.<br>
This will overwrite the 'label' and 'disable' keys, if set.

The following example will change the label for the 'Token' category:
```js
{
    id: "Token",
    label: "New label for the token category",
}
```

### Adding a New Permission
You can add a new permission to a category by adding the permission to the permission array of that category.

The following example will add 2 new permissions to the 'Token' category:
```js
{
    id: "Token",
    permissions: [
        {
            id: "NewPermission",
            label: "Label",
            hint: "Hint",
            default: [true, true, true, true]
        },{
            id: "NewPermission2",
            label: "Label",
            hint: "Hint",
            default: [true, true, true, true]
        }
    ]
}
```

### Modifying an Existing Permission
You can modify an existing permission within a category by setting the permission id the same as one of the existing permissions.<br>
This will overwrite the 'label', 'hint', 'disable' and 'default' keys, if set.

The following example will modify the 'Stats' permission of the 'Token' category to give it a new hint, and the 'Vision' permission to give it new default values:
```js
{
    id: "Token",
    permissions: [
        {
            id: "Stats",
            hint: "Hint"
        },{
            id: "Vision",
            default: [false, false, false, true]
        }
    ]
}
```

### Disabling Categories or Permissions
You can disable categories or permissions by setting the 'disable' key. This will prevent the category or permission from showing up in the Permission Config, and will prevent the permission from having any effect.

The following example will disable the 'Other' category and the 'OpenAny' scene permission:
```js
{
    id: "Other",
    disable: true
},{
    id: "Scene",
    permissions: [
        {
            id: "OpenAny",
            disable: true
        }
    ]
}
```

## Checking Permissions

You can use `game.materialDeck.permissions.getPermission` or `game.materialDeck.permissions.getPermissions` to check for permissions.

### Checking Single Permission
`game.materialDeck.permissions.getPermission` is used to check for single permissions. It takes 3 arguments:

| Argument | Description |
|----------|-------------|
| permissionId<br>(String) | The id of the permission to check, for example `Token.All` or `Scene.DisplayVisible` |
| notify<br>(Boolean, optional) | A notification will be shown to the user if they have no permission, defaults to `false` |
| userId<br>(String, optional)| Id of the user to check the permission for, defaults to the current user's id |

It returns `true` if the user has permission and `false` if the user does not have permission.

### Checking Multiple Permissions
`game.materialDeck.permissions.getPermissions` is used to check for multiple permissions at the same time. It takes 3 arguments:

| Argument | Description |
|----------|-------------|
| permissions<br>(String array) | An array of permission ids of the permissions to check, for example `["Token.All", "Scene.DisplayVisible"]` |
| mode<br>(String, optional) | If set to `or`: Will return true if any permission is allowed.<br> If set to `and`: Will return true if all permissions are allowed. Defaults to `or`. |
| userId<br>(String, optional)| Id of the user to check the permission for, defaults to the current user's id |

It returns `true` if the user has permission and `false` if the user does not have permission.