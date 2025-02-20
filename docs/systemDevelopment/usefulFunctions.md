The `game.materialDeck` object gives access to multiple functions and data that might be useful.

Everything below is relative to `game.materialDeck`, so `.systems` means `game.materialDeck.systems`

#### .moduleEnabled
Boolean value that states whether the module is enabled for the user.

#### .systems
The system class of the registered system

#### .versions
Stores the versions of the Material Deck module, Material Companion and the Stream Deck plugin.

#### .settingsConfig
The complete settingsConfig, including that of the registered system.

#### .permissions.permissions
All registered permissions.

#### .permissions.getPermission
Function that returns whether a user has permission to do something.<br>
The function takes 2 arguments:

* <b>permission id:</b> The id of the permission to check (e.g. "Scene.ViewAll")
* <b>user id:</b> (Optional) The id of the user to check for. Will default to the current user's id.

#### .streamDeck
The StreamDeck class which handles all button related things.<br>
`.streamDeck.deviceManager` is an array of all connected devices.<br>
Each device within that array has a `buttons` array which stores all button data.

#### .Helpers
Contains miscellaneous functions, for example:

`compareVersions(checked, required)` returns whether the `checked` version is greater than `required`.

`compatibleCore(required)` returns whether the current core Foundry version is greater than `required`.

`compatibleSystem(requiredVersion)` returns whether the current system version is greater than `required`.

`notifyNoPermission()` will notify the user that they lack permission to do an action