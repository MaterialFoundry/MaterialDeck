Changes between module versions are documented here.<br>
This changelog is for v2+ only, for the pre v2 changelog click [here](https://github.com/MaterialFoundry/MaterialDeck/blob/Master/changelog.md).

??? changelog "v2.1.0 - 29-07-2025"
    ### Breaking Changes:
    * Macro => Select from Folder: Folders are now automatically parsed from your Foundry server. Existing actions with manually entered folders will no longer work, and will need to be reconfigured.
    * External Modules => FXMaster => Animated Effects: Split the old "Target" option into "Target" and "Source" to make it easier to edit and give more options. This means that existing actions might need some minor reconfiguring.

    ### Fixes:
    * External Modules: API changes of modules could lock up Material Deck's initialization, essentially breaking Material Deck. This should no longer be possible.
    * External Modules => FXMaster: Compatible with the new FXMaster by Gambit, support for the older versions of FXMaster is not guaranteed.

    ### Additions:
    * Other Actions => Dice Pool: Added the ability to add a flat modifier to the dice pool.
    * External Modules => FXMaster => Animated Effects: Added option to display effect thumbnail as icon.
    * Audio => Play Any Sound: Added "Play from Folder" option.
    * Soundboard => Import & Export: Added "Select All" to select or deselect all checkboxes.
    * Soundboard => Import & Export: Added a "Name" field to display the name of the sound to be imported or exported.
    * Soundboard => Import & Export: Wildcard sounds can now be imported and exported.

    ### Other:
    * External Modules => FXMaster: Renamed "Special Effects" to "Animated Effects" to reflect the name change in FXMaster.
    * Almost all applications and dialogs have been migrated to ApplicationV2 and DialogV2.

??? changelog "v2.0.6 - 25-06-2025"
    ### Fixes:
    * Soundboard: Fixed issues with importing and exporting the soundboard
    * Token Action => On Press/On Hold => Move Token: Sometimes a token would end up halfway across a grid space, this should no longer happen

    ### Additions:
    * (v13) Token Action => On Press/On Hold => Move Token: Token now rotates when it is moved in the direction of its movement, if the core setting 'Automatic Token Rotation' is enabled

??? changelog "v2.0.5 - 16-05-2025"
    ### Fixes:
    * External Modules -> fxMaster: Fixed errors that are thrown if effects are disabled in the fxMaster module settings
    * Fixed buttons in module settings not showing up properly in v12
    * Icons with upper case name extensions can now be displayed

??? changelog "v2.0.4 - 07-05-2025"
    Some debug code was left in the previous version that, for some reason, would throw an error in the v12 Foundry app, but not in the browser. This would prevent the module from loading. The code served no purpose for users, so it has been removed.

??? changelog "v2.0.3 - 06-05-2025"
    ### Additions:
    * Macro Action: Added macro offsets for the hotbar

    ### Fixes:
    * Made compatible with V13 stable
    * Fixed incompatibility with Dorako UX if 'Adjust chat controls' is disabled
    * The previous update caused documents within folders to not show up when selecting by number, this is fixed

    ### Compatible Stream Deck Plugin
    * [v2.0.1.0](https://github.com/MaterialFoundry/MaterialDeck_SD/releases/tag/v2.0.1.0) (unchanged)

??? changelog "v2.0.2 - 23-04-2025"
    ### Additions
    * Combat Tracker Action => Control: Added 'Add/Remove Tokens From Combat' function that toggles the combat state of all selected tokens
    * Select options parsed from Foundry (actors, playlists, scenes, etc) are now ordered as they are displayed in Foundry, including the folder structure
    * Macro Action: Added macro offsets to be used with 'Select by Number'
    * When selecting something by name, only partial names are required. For example, to find the scene 'Scene 1', MD will find it if you fill in 'Scene' (if no other scenes have the same partial name).

    ### Fixes:
    * Scene Action => Visible Scenes: Now only show the visible scenes as it should.
    * Audio Action => Playlist Control => Play: Now correctly starts all tracks if playlist is configured to 'Simultaneous Playback'
    * Fixed incompatibility with Dorako UI/UX
    * Fixed broken links in 'Foundry VTT is not connected' message in Stream Deck's Property Inspector
    * Minor fixes to make compatible with Foundry v13.340

    ### Other:
    * Stream Deck Plugin: Made the Material Deck category white to bring it in line with other Stream Deck plugins

    ### Compatible Stream Deck Plugin
    * [v2.0.1.0](https://github.com/MaterialFoundry/MaterialDeck_SD/releases/tag/v2.0.1.0)

??? changelog "v2.0.1 - 01-04-2025"

    The entire module has been rewritten. This changelog only summarizes the most important changes compared to v1.

    ### Important Changes
    * The module is now premium, read the [installation guide](./gettingStarted/installation.md) to learn how to activate it. 
    * The plugin does not contain any hard-coded settings anymore, instead it is provided settings from the module, which means that the plugin shouldn't need a lot of updates anymore, making changes is easier, and localization is supported.
    * Profiles made for previous versions are not compatible with this version.
    * Compatible with Foundry v12 and v13

    ### Additions
    * Added an 'On Hold' option for some actions, which will trigger after holding the button for a certain amount of time (hold time is set in the module settings)
    * Token: Can now work on actors that are not on the current scene
    * Token: Added option to select tokens by hovering over them
    * Audio => Soundboard: You can now import and export with the actual audio files and icon files included
    * Audio: You now have access to a 'User' soundboard, only for the user, and a 'World' soundboard accessible to all users
    * Audio: Added option to set the target of soundboard sounds, so only one player hears them
    * Other Actions: Added dice pool functionality, where you can add or remove dice from a dice pool and roll them all together
    * Custom Actions: Custom actions are more powerful and easier to configure through the UI

    ### Removals
    * Macro: Removed the macroboard, it is redundant with the current ways to select macros
    * Audio: Removed playlist config, it is redundant with the current ways to select playlists

    ### Other
    * Renamed 'On Click' to 'On Press'
    * New 'Audio' action combines the previous 'Soundboard' and 'Playlist' actions
    * Audio => Soundboard: Changed how the soundboard config looks, and you can now use it to play sounds directly
    * All client settings have been converted to user settings, which means that settings are no longer lost when using a different browser or after clearing cookies

    ### Compatible Stream Deck Plugin
    * [v2.0.0.0](https://github.com/MaterialFoundry/MaterialDeck_SD/releases/tag/v2.0.0.0)
    


