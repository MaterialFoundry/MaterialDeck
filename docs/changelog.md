Changes between module versions are documented here.<br>
This changelog is for v2+ only, for the pre v2 changelog click [here](https://github.com/MaterialFoundry/MaterialDeck/blob/Master/changelog.md).

??? changelog "v2.0.0 - 20-02-2025"

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
    


