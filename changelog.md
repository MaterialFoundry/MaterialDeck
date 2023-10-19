# Changelog Material Deck Module
### v1.6.0 - 20-10-2023
<b>Starting from this version you have to use <a href="https://github.com/MaterialFoundry/MaterialCompanion">Material Companion</a> instead of Material Server.</b>

Additions:
<ul>
<li>Added a new 'Custom' action, which allows the user to customize the behavior of a button. See the <a href="https://github.com/MaterialFoundry/MaterialDeck/wiki/Custom-Action">documentation</a></li>
<li>Token Action => Added option to select token by user character</li>
<li>(PF2e) Other Controls => Added option to open/close the party sheet</li>
<li>Macro button icon and text can now be updated from within Foundry using macros (Thanks to RHeynsZa)</li>
<li>Added support for Star Wars FFG system (thanks to anthonyscorrea)</li>
</ul>

Fixes:
<ul>
    <li>(PF2e) Token Action => Toggle Condition: Condition icons work again</li>
</ul>

Other:
<ul>
    <li>Material Deck is no longer compatible with Material Server, you now have to use Material Companion</li>
    <li>Removed 'Device Config' because this is now handled by Material Companion</li>
</ul>

### v1.5.1 - 28-06-2023
Fixes:
<ul>
    <li>Token Action => Toggle Condition: Fixed PF2e conditions</li>
    <li>Macro Action => Macro by name: Fixed macro arguments not working in v10</li>
    <li>Download Utility: Latest module version is now displayed correctly</li>
</ul>

Additions: 
<ul>
    <li>Other Actions => Open Journal: Added option to open journal pages by page name or number</li>
    <li>Playlist Action: Added option to select playlists and tracks by name</li>
</ul>

<b>Compatible Material Companion and SD plugin:</b><br>
Material Companion v1.0.2 (<b>must be updated!</b>): https://github.com/MaterialFoundry/MaterialCompanion/releases <br>
SD plugin v1.6.0 (<b>must be updated!</b>): https://github.com/MaterialFoundry/MaterialDeck_SD/releases<br>

### v1.5.0 - 28-05-2023
Additions:
<ul>
    <li>Most settings in the plugin are now hyperlinks. Clicking them opens a window opening the relevant section on the wiki describing that setting.</li>
    <li>Token Action => Stats: Added support for simple if-statements in the custom stats function</li>
    <li>(dnd5e) Token Action => Added option to filter spells by preparedness</li>
    <li>Added an 'Icon Override' option to each action. Filling in a path to an icon on your Foundry server will make the button use that icon instead of the default one</li>
    <li>Added a one-time popup asking users if they want to enable the module for their client. This should hopefully solve one of the most common connection issues</li>
    <li>Token Action: Added background color option for items, abilities and spells</li>
    <li>Added the current and latest module version to the download utility</li>
    <li>Combat Tracker: Added option to filter combatants in order to not display neutral, hostile or hidden tokens</li>
    <li>Macro Action => Macroboard: Added a label to each macro. By default this is the name of the macro, but this can be edited to your liking. If 'Display Name/Label' is selected in the SD app, the label will be displayed. This allows you to distinguish macros when the same macro is used for multiple functions (using macro arguments)</li>
    <li>(dnd5e) Other: Added 'Attack Roll Modes' where you can configure weapon rolls to roll for 'to hit', 'damage', 'crit damage', etc</li> 
    <li>Scene Action: Added option to specify a ring color for the active scene</li>
    <li>Other Controls => Darkness Control: Added animation time option for 'Transition to Day/Night'</li>
    <li>Other Controls: Added 'Global Volume Controls' to control the playlist, ambient and interface volume</li>
</ul>

Fixes:
<ul>
    <li>External Modules => Monk's Active Tile Triggers: Was no longer working, should now be fixed</li>
    <li>Soundboard: Changing the 'Ambient' volume slider now instantaneously changes the volume of any currently playing sounds</li>
    <li>Token Action => On Click => Handle Condition: Fixed some issues with conditions not being there or not working</li>
    <li>Token Action => On Click: Fixed item offset</li>
    <li>Fixed issue where long text would result in an error if Foundry was set to Russian</li>
    <li>Macro Action => Macroboard: Arguments are stored again</li>
    <li>Macro Action: Arguments were broken due to an update to Advanced Macros, this is now fixed</li>
    <li>Macro Action: Fixed issue with icons on SD turning black when changing the icon in Foundry or moving the macro on the macrobar</li>
    <li>Playlist Action: Playlist with shuffle enabled now play shuffled</li>
    <li>Other => Control Buttons: Changing controls now loads the correct canvas layer</li>
    <li>Combat Tracker: Token image, name and stats would not always display (if a new Combat Tracker action was created without changing 'Mode')</li>
</ul>

Other:
<ul>
    <li>Made compatible with Foundry v11, dropped compatibility with Foundry v9</li>
    <li>Moved most of the system-dependent code from the plugin to the module. This makes implementing new system or modifying/fixing current systems easier. It also automates some stuff (for example grabbing all conditions from Foundry instead of hardcoding them)</li>
    <li>External Modules => About Time: Has been replaced with 'Simple Calendar' since About Time no longer functions as time/calendar management. It still functions exactly the same</li>
    <li>External Modules => Mook AI: Has been removed since the module hasn't been updated for Foundry v10 or v11</li>
    <li>Changed the logo in the Stream Deck app from the Foundry VTT logo to the Material Foundry logo</li>
</ul>

<b>Compatible server app and SD plugin:</b><br>
Material Server v1.0.2+ (unchanged): https://github.com/CDeenen/MaterialServer/releases <br>
SD plugin v1.5.0 (<b>must be updated!</b>): https://github.com/CDeenen/MaterialDeck_SD/releases<br>

### v1.4.12 - 07-09-2022
Fixes:
<ul>
    <li>Some settings did not have a default value, which caused errors for new users in v10</li>
</ul>

### v1.4.11 - 05-09-2022
Fixes:
<ul>
    <li>Fixed system autodetection bug, where it would not always correctly detect the system</li>
    <li>Token Action => Stats/On Click: Pf2e intimidation did not work</li>
    <li>Playlist Action => Fix unrestricted playback and 'play playlist'</li>
    <li>User Config: Fix settings saving issue</li>
</ul>

Additions:
<ul>
    <li>Token Action => Inventory: Added roll options to roll for to hit and damage (dnd5e only)</li>
    <li>Token Action => Inventory/Features/Spellbook: Select by name or id</li>
    <li>Token Action => Features: Added option to filter active and passive abilities (dnd5e only)</li>
    <li>Token Action => Items/Spells/Features: Add offset options</li>
    <li>Token Action => OnClick => SetVision: Added checkboxes to configure what settings should be changed</li>
    <li>Combat Tracker => Function: Added option to roll initiative for combatants</li>
    <li>Combat Tracker => OnClick: Added target and untarget token option</li>
    <li>Other Actions => Darkness Control: Added 'Transition to Day' and 'Transition to Night' options</li>
    <li>Other Actions => Darkness Control: Added animation time option for darkness changes</li>
</ul>

Other:
<ul>
    <li>Made compatible with Foundry v10 (see notes below), dropped compatibility with Foundry v8</li>
    <li>Token Action => On Click => Call Macro: Removed macro target, since I can't get it to work properly</li>
    <li>Token Action => On Click => Movement: Tokens now snap to the grid when moved</li>
    <li>Token Action => OnClick => SetVision: update configuration to v9/v10 standards</li>
    <li>Token Action => Handle Conditions: Removed the increase/decrease option for all systems but pf2e (it only works in pf2e)</li>
    <li>System Override: Changed to a dropdown menu with all supported systems, instead of a string field</li>
    <li>All ui elements and classes have been given unique identifiers to prevent module incompatibilities</li>
</ul>

V10 Compatibility Notes:
<ul>
    <li>The following systems have been tested in v10: dnd5e, pf1e, forbidden lands, wfrp4. Other systems have not been updated to v10 yet at the time of this update</li>
    <li>Changing the token vision mode through MD does not work properly, appears to be a bug in Foundry</li>
    <li>Wildcard images currently don't seem to work in v10, so they have not been tested</li>
</ul>

<b>Compatible server app and SD plugin:</b><br>
Material Server v1.0.2+ (unchanged): https://github.com/CDeenen/MaterialServer/releases <br>
SD plugin v1.4.11 (<b>must be updated!</b>): https://github.com/CDeenen/MaterialDeck_SD/releases<br>

### v1.4.10 - 30-05-2022
Fixes:
<ul>
    <li>Stream Deck plugin v1.4.10 was not properly recognized as compatible</li>
</ul>

Additions:
<ul>
    <li>Material Server version is now displayed in the Download Utility (MS v1.1.0+)</li>
</ul>


### v1.4.9 - 16-04-2022
Fixes:
<ul>
    <li>PF2e: Fixed rolls and conditions for compatibility with latest pf2e version. Thanks to Kyamsil</li>
    <li>Token Action => Set Vison: Setting light is working again</li>
    <li>Other Actions => Roll Dice: Roll result would show as 'NaN' in Foundry v9, this is fixed</li>
</ul>

Additions:
<ul>
    <li>Added support for the Starfinder system</li>
    <li>External Modules => Added support for 'Monks Active Tile Triggers'</li>
    <li>Added 'System Override' module setting. If your system is not supported, MD defaults to 5e. Here you can choose a supported system that is most similar to yours and have Material Deck use that system instead.</li>
    <li>Token Action => Displayed Stats: A colored border is drawn around certain skills, saves, etc to indicate proficiency (compatible systems: dnd5e, pf2e). Thanks to Kyamsil</li>
</ul>

### v1.4.8 - 22-12-2021
Fixes:
<ul>
    <li>'Device Configuration' would not save its settings properly</li>
</ul>


### v1.4.7 - 20-12-2021
Fixes:
<ul>
    <li>External Modules => GM Screen: Changed to new api (thanks to akrigline)</li>
    <li>Fixed an issue where SDs would not iterate properly, causing errors (thanks to InnerGI)</li>
    <li>Fixed support for FXMaster. Requires FXMaster v2.0.0 or later (not officially released yet)</li>
</ul>

Additions:
<ul>
    <li>Added compatibility for Foundry V0.9</li>
    <li>Added Forbidden Lands system (thanks to JackDCondon)</li>
    <li>Other Controls => Control Buttons: Added offset for 'Displayed Controls' and 'Displayed Tools'</li>
    <li>Added 'Device Configuration' to the module settings. You can use this to configure specific SD devices to not connect to a client</li>
    <li>Playlist Action => Added option to play next or previous track</li>
</ul>

### v1.4.6 - 07-09-2021
Fixes:
<ul>
    <li>Token Action => Move token: If the user is not the GM, tokens can no longer move if game is paused, and they can no longer move through walls</li>
    <li>Modifications made in the Property Inspector now immediately get saved, instead of when user deselects the setting (changed 'onchange' to 'oninput' event)</li>
</ul>

Additions:
<ul>
    <li>Playlist Action: Added a 'Pause All' option</li>
</ul>

Other:
<ul>
    <li>PF2E compatibility updated (thanks @kyamsil)</li>
</ul>

### v1.4.5 - 27-07-2021
Fixes:
<ul>
    <li>Combat Tracker Action => Turn Display: If only 'Display Round' was enabled, the vertical alignment would be off. This has been fixed.</li>
    <li>WebSocket client no longer creates duplicate connections</li>
    <li>Token Action => If 'Display Uses/Quantity' is enabled for an item that has no maximum uses/quantity, the uses/quantity border is now consistently black.</li>
    <li>Update dialog that appears if the SD plugin needs to be updated now only appears once</li>
</ul>

Additions:
<ul>
    <li>External Modules: Added support for the Soundscape module. Requires Soundscape v1.0.3</li>
    <li>Macro Action => Advanced Macros is now supported for calling macros with arguments</li>
    <li>Combat Tracker Action => Function: Added option to select the combatant after changing the turn</li>
    <li>Other Actions => Added 'Set Roll Mode' which sets the roll mode for all rolls to public, private gm, blind gm or self roll</li>
    <li>Added support for wfrp4e (thanks to sozin#8622 & eccobold#3541)</li>
    <li>Added DEVGUIDE.md to help developers add support for new systems (thanks to sozin#8622 & eccobold#3541)</li>
</ul>

<br>
<b>Compatible server app and SD plugin:</b><br>
Material Server v1.0.2 (unchanged): https://github.com/CDeenen/MaterialServer/releases <br>
SD plugin v1.4.5 (<b>must be updated!</b>): https://github.com/CDeenen/MaterialDeck_SD/releases<br>

### v1.4.4 - 26-05-2021
Fixes:
<ul>
    <li>Some small fixes to make the module compatible with Foundry 0.8.5</li>
</ul>

Additions:
<ul>
    <li>Token Action => Added 'Page-Wide Token' option. All buttons on the current page (where the page is the collection of buttons that are shown) that have this enabled will use the same token</li>
    <li>Token Action => On Click: Added 'Set Page-Wide Token' option, so you can configure buttons to set the page-wide token by pressing a button</li>
    <li>Token Action: Added a 'Mode' select box. Setting it to 'Token' is the same as pre v1.4.4. New are the inventory, features and spellbook options that can be used to auto-populate buttons with items, features and spells.</li>
    <li>Added a 'Clear Page' and 'Clear All' button to the soundboard and macroboard configuration</li>
    <li>Added import and export buttons to the soundboard and macroboard configuration (only imports/exports metadata, not the actual audio files or the macros)</li>
    <li>The number of connection error messages you will get is now configurable in the module settings</li>
    <li>Added a download utility to the module settings, so you can easily version-check with the SD plugin and Material Server, download them and download profiles</li>
    <li>Added Japanese localization (thanks BrotherSharper and Asami). All of the new features have not yet been translated</li>
</ul>

Other:
<ul>
    <li><b>(Breaking)</b> The Move Action has been removed. Moving tokens is not in the Token Action (it's an on click setting) and moving the canvas is in the Other Actions.</li>
    <li>Major change to the soundboard and macroboard configuration. It is now displayed as pages of 16 sounds or 32 macros each, you can browse through the pages using the arrow keys at the top.</li>
    <li>There is no longer a limit to the amount of sounds/macros you can assign to the soundboard/macroboard, but please note that at some point you might experience performance issues if there's too many sounds/macros.</li>
    <li>Removed the 'Stream Deck Model' module setting, since it's not that useful</li>
    <li>Token Action has been revamped to make it clearer and easier to implement new game systems</li>
</ul>

<br>
<b>Compatible server app and SD plugin:</b><br>
Material Server v1.0.2 (unchanged): https://github.com/CDeenen/MaterialServer/releases <br>
SD plugin v1.4.4 (<b>must be updated!</b>): https://github.com/CDeenen/MaterialDeck_SD/releases<br>

### v1.4.3 - 05-05-2021
Fixes:
<ul>
    <li>Fixed issue where the module would break if multiple Stream Decks were configured in the Stream Deck application, but not all of them had MD actions assigned to them</li>
    <li>In the User Permission Configuration, the Scene Directory hint wasn't displayed properly</li>
    <li>Got rid of warnings that popped up on initialization when using MD as a player</li>
    <li>Fixed issue where the soundboard and macro board could not be configured by players, if it hadn't first been configured by a GM</li>
</ul>

Other
<ul>
    <li>Added compatibility for Foundry 0.8.2. Some functions no longer work in 0.8.1 (they still do in 0.7.9)</li>
</ul>

<br>
<b>Compatible server app and SD plugin:</b><br>
Material Server v1.0.2 (unchanged): https://github.com/CDeenen/MaterialServer/releases <br>
SD plugin v1.4.2 (unchanged): https://github.com/CDeenen/MaterialDeck_SD/releases<br>

### v1.4.2 - 23-04-2021
Fixes:
<ul>
    <li>Last update I fixed the combat tracker, but this broke something in the Token Action (if you had a token selected, it would sometimes assumed you didn't have it selected), both should now work</li>
    <li>Token Action: Plugin wouldn't save text boxes (such as 'Prepend Title' or 'Custom') if they were empty</li>
    <li>Token Action: Improved performance, especially when 'Token' is set to 'Selected Token', and you're selecting a new token while you had another token selected<li>
    <li>Token Action => Stats => Skill Modifier: (dnd5e) Would only display the modifier, now it displays the total value (so with proficiency, if applicable)</li>
    <li>Combat Tracker => Mode: Function => Function: Would not always properly load the 'Turn Display' options</li>
    <li>Playlist Action: Background color would not show, and 'Off Color' wouldn't work for 'Offset'</li>
    <li>Macro Action => Macro Board => Offset: Background color would not show</li>
    <li>Scene Action => Offset: Background color would not show</li>
</ul>

Additions:
<ul>
    <li>Token Action: Changed the way how you can select what icon will be displayed. Instead of a true/false, there is now a selection box where you can select between 'None', 'Token Icon', 'Actor Icon' and 'Default', where the last one will display the default icon, for example the selected stat to display, the condition, etc</li>
    <li>Token Action => Stats & On Click => Custom: Textbox now automatically resizes to fit the content</li>
    <li>Token Action => On Click => Dice Roll: Added 'Roll Mode' option, where you can set to roll as 'default' (displays dialog), 'normal', 'advantage' or 'disadvantage'. All options, except for 'default', will ignore the previously added 'Token Roll Options' in 'Other Actions'</li>
</ul>

Other:
<ul>
    <li>Big code cleanup of the SD plugin</li>
</ul>

<br>
<b>Compatible server app and SD plugin:</b><br>
Material Server v1.0.2 (unchanged): https://github.com/CDeenen/MaterialServer/releases <br>
SD plugin v1.4.2 (<b>must be updated!</b>): https://github.com/CDeenen/MaterialDeck_SD/releases<br>

### v1.4.1 - 21-04-2021
Fixes:
<ul>
    <li>Previous update broke the combat tracker, should now be fixed</li>
</ul>

### v1.4.0 - 21-04-2021
Additions:
<ul>
    <li>Support for connecting multiple Stream Decks at the same time. Please note that performance decreases with each extra Stream Deck</li>
    <li>Other Actions: Added 'Token Roll Options'. This can toggle token rolls between showing a dialog and skipping the dialog and rolling normally or with advantage or disadvantage</li>
    <li>If the SD plugin version you're using is outdated, you now get a pop-up to notify you of this and direct you to the download page</li>
    <li>Added a module setting to set how dark the default white images should be. Can be lowered for improved readability of the text</li>
    <li>Token Action => Stats: Added option to prepend text to the title, so you can set the stat to, for example, strength, and put 'STR: ' in the prepend textbox to display, for example, 'STR: +2'</li>
</ul>

Fixes:
<ul>
    <li>Token Action => Skill Roll: Setting wasn't saved in SD app</li>
    <li>Token Action => Roll Ability: Rolling ability checks was broken for some systems</li>
    <li>Token Action => Stats => Display HP: Read overlay indicating HP in the heart icon was also drawn when 'Display Token Icon' was enabled</li>
    <li>Token Action => Stats: Added default images for all dnd5e abilities, saves and skills</li>
</ul>

<br>
<b>Compatible server app and SD plugin:</b><br>
Material Server v1.0.2 (unchanged): https://github.com/CDeenen/MaterialServer/releases <br>
SD plugin v1.4.0 (<b>must be updated!</b>): https://github.com/CDeenen/MaterialDeck_SD/releases<br>


### v1.3.3 - 12-04-2021
Additions:
<ul>
    <li>Other Actions => Open Sidebar Tab: Action now indicates which sidebar tab is open (only works on Foundry 0.8.x)</li>
    <li>Other Actions => Open Sidebar Tab: Added option to create an pop-out (doesn't work for the chat)</li>
    <li>Other Actions: Added option to open the pf2e compendium browser</li>
    <li>Macro Action: Can now call macros by name</li>
    <li>Token Action => On Click: Added option to call a macro. Currently the macro will be applied to the selected token</li>
    <li>Token Action => Display Stats: Added saving throws and skill modifiers for most systems</li>
    <li>Token Action => OnClick: Added 'Dice Roll' option, which allows you to roll ability checks, saving throws and other things (depending on game system)</li>
    <li>Token Action => Stats => Display HP: Made the heart icon dynamic, so the amount that the heart is filled with red depends on the relative amount of hit points of the token. 25% hp means the lower 25% of the heart is red, 50% hp means the lower 50% of the heart is red, etc</li>
    <li>Token Action => Stats => Added a '+' before all modifier stats that are bigger than 0</li>
    <li>Token Action => Custom OnClick: Added support for calling macros. For instructions, please refer to the documentation: https://github.com/CDeenen/MaterialDeck/wiki/Token-Action#custom-on-click-function</li>
</ul>

Fixes:
<ul>
    <li>Other Actions => Pause Game: Pause is now transmitted to all connected clients</li>
    <li>Token Action => Display Stats: Fixed movement speed for pf2e</li>
</ul>

Other:
<ul>
    <li>Should be compatible with Foundry 0.8.1. Only tested on DnD5e. Please note that any functions that rely on other modules do not work if the other modules are not compatible with 0.8.1</li>
</ul>

<br>
<b>Compatible server app and SD plugin:</b><br>
Material Server v1.0.2 (unchanged): https://github.com/CDeenen/MaterialServer/releases <br>
SD plugin v1.3.4 (<b>must be updated!</b>): https://github.com/CDeenen/MaterialDeck_SD/releases<br>

### v1.3.2 - 11-03-2021
Additions:
<ul>
    <li>Added support for the Multi Action provided by the SD app</li>
    <li>External Modules Action => Added support for About Time</li>
    <li>Token Action => Stats: Added 'Ability Scores', 'Ability Score Modifiers', 'Ability Score Saves' (dnd5e only) and 'Proficiency Bonus'</li>
    <li>Token Action => Stats: Added 'HP (box)' option that displays a box with color that changes depending on the HP</li>
    <li>Move Action: You can now choose what token should be moved, similar to the Token Action</li>
</ul>

Fixes:
<ul>
    <li>Playlist Action => Relative Offset: Fixed issue with displaying the target playlist name</li>
    <li>Macro Action: Fixed Hotbar Uses for Shadow of the Demonlord</li>
</ul>

Other:
<ul>
    <li>Macro Action: Improved the way Hotbar Uses are displayed, it is now displayed in a box similar to how the module looks in Foundry</li>
    <li>Made the way images are generated more flexible to make future additions easier</li>
</ul>

<br>
<b>Compatible server app and SD plugin:</b><br>
Material Server v1.0.2 (unchanged): https://github.com/CDeenen/MaterialServer/releases <br>
SD plugin v1.3.2 (<b>must be updated!</b>): https://github.com/CDeenen/MaterialDeck_SD/releases<br>

### v1.3.1 - 27-02-2021
Additions:
<ul>
    <li>Token Action: You can now choose what token should be targeted with the action using: 'Selected Token', 'Token Name', 'Actor Name', 'Token Id' or 'Actor Id'. Added relevant user permissions to the permission configuration</li>
    <li>Token Action => On Click: Added options 'Select Token' and 'Center on Token and Select Token'</li>
    <li>Playlist Action: Added relative offset mode, with the option to display the offset target name for playlists</li>
    <li>Playlist Action => Stop All: Added option to display the name of the playlist at the current offset</li>
</ul>

Fixes:
<ul>
    <li>Default user permissions would not be loaded if no previously saved permissions were present, resulting in MD assuming nobody has any permissions</li>
    <li>Other Actions => Control Buttons => Lighting Controls: Would create a button for ambient sound instead of lighting</li>
    <li>Token Action => Display Token Icon: It used to show the icon, even if unchecked, if no stat with default icon was selected</li>
</ul>

<br>
<b>Compatible server app and SD plugin:</b><br>
Material Server v1.0.2 (unchanged): https://github.com/CDeenen/MaterialServer/releases <br>
SD plugin v1.3.1 (<b>must be updated!</b>): https://github.com/CDeenen/MaterialDeck_SD/releases<br>

### v1.3.0 - 25-02-2021
Additions:
<ul>
    <li>Material Deck can now be used by players. A 'User Permission Configuration' screen has been added to the module settings where the GM can deside what Material Deck functions are available to users</li>
    <li>Macro Action: Added support for Illandril's Hotbar Uses (only requires the module to be installed, does not have to be active)</li>
    <li>Token Action => OnClick: Added support for CUB conditions</li>
    <li>External Modules => Added support for the 'Trigger Happy' module</li>
    <li>External Modules => Added support for the 'MookAI' module</li>
    <li>External Modules => Added support for the 'Shared Vision' module</li>
    <li>External Modules => Added support for the 'Lock View' module</li>
    <li>External Modules => Added support for the 'Not Your Turn' module</li>
</ul>
Fixes:
<ul>
    <li>Token Action => OnClick: Fixed conditions for pf1e and dnd3.5e</li>
</ul>
Other Changes:
<ul>
    <li>Token and Combat Tracker Actions now autodetect the game system</li>
    <li>Game-system related settings in the SD app unified and improved</li>
    <li>Image Cache setting is no longer considered experimental</li>
</ul>

<b>Note 1: </b>Because the module can now be used by players, some settings have been moved from 'world' settings to 'client' settings. This means that previous settings have been deleted, and they have to be set up again in the module settings.<br>
<b>Note 2: </b>You can give users access to the playlists, macro board and soundboard. Currently, everyone has to share the same configuration, so be careful with giving players permission to configure one of them.<br>
<b>Note 3: </b>Because of the new game system autodetection, some settings for non dnd5e systems might be deleted. You'll have to reconfigure them.<br>
<br>
<b>Compatible server app and SD plugin:</b><br>
Material Server v1.0.2 (unchanged): https://github.com/CDeenen/MaterialServer/releases <br>
SD plugin v1.3.0 (<b>must be updated!</b>): https://github.com/CDeenen/MaterialDeck_SD/releases<br>

### v1.2.3 - 03-02-2021
Fixes:
<ul>
    <li>Fixed some issues for the Shadow of the Demon Lord system</li>
</ul>
Other Changes:
<ul>
    <li>Improved performance of the 'Playlist Configuration', 'Macro Configuration' and 'Soundboard Configuration' screens</li>
    <li>Minor code clean-up</li>
</ul>
<b>Compatible server app and SD plugin:</b><br>
Material Server v1.0.2 (unchanged): https://github.com/CDeenen/MaterialServer/releases <br>
SD plugin v1.2.2 (unchanged): https://github.com/CDeenen/MaterialDeck_SD/releases<br>

### v1.2.2 - 02-02-2021
Additions:
<ul>
    <li>Added a help button in the module configuration</li>
    <li>Token Action: Added support for easy token wildcard image changes</li>
    <li>Token Action: Added a comprehensive custom onClick function that can modify token and actor data, with support for basic mathematical expressions</li>
</ul>
Other Changes:
<ul>
    <li>Improved GM screen compatibility</li>
</ul>
<b>Compatible server app and SD plugin:</b><br>
Material Server v1.0.2 (unchanged): https://github.com/CDeenen/MaterialServer/releases <br>
SD plugin v1.2.2: https://github.com/CDeenen/MaterialDeck_SD/releases<br>

### v1.2.1 - 07-01-2021
<b>Note:</b> Due to a change in how scene control is handled (moved from 'Other Controls' to its own 'Scene Action'), any actions related to scenes no longer work. You will have to set them up again using the new Scene Action.<br>
<br>
Additions:
<ul>
    <li>EXPERIMENTAL: Added an image buffer to prevent resending of images that have already been sent, giving a slight performance boost. Buffer size can be set in the module settings</li>
    <li>Token Action => Display Stats: Added option to select a data path for an attribute</li>
    <li>External Modules => GM Screen: Open and close the GM screen. Link to module: https://foundryvtt.com/packages/gm-screen/</li>
    <li>Other Actions => Roll dice: Roll dice in foundry and select between public roll, private roll, or displaying result on the SD</li>
    <li>Scene Action: Added way to create scene selection screen similar to soundboard/macro board. New functions to do this: 'Scene Directory' and 'Scene Offset'</li>
    <li>Scene Action: Added 'Active Scene' function</li>
    <li>Move Action => Selected Token: Added rotate to and rotate by functions</li>
    <li>Token Action => On Click: Added 'Set Vision' option to set the token's vision and light emission</li>
    <li>Other Actions => Send Chat Message: Send a message to the Foundry chat</li>
</ul>
Other Changes:
<ul>
    <li>Plugin: Scene Action created that replaces Other Actions => Scene Selection</li>
    <li>Plugin: Scene Action: Changed 'Any Scene' to 'Scene by Name'</li>
    <li>Plugin: Actions are now ordered alphabetically</li>
    <li>Plugin: Replaced color strings with color pickers</li>
    <li>Various minor bug fixes</li>
</ul>
<b>Compatible server app and SD plugin:</b><br>
Material Server v1.0.2 (unchanged): https://github.com/CDeenen/MaterialServer/releases <br>
SD plugin v1.2.1: https://github.com/CDeenen/MaterialDeck_SD/releases<br>

### v1.2.0 - 28-12-2020
Fixes
<ul>
    <li>Incorrect link to some black backgrounds fixed</li>
    <li>Token Action: Movement speed wouldn't be displayed for DnD5e 1.2.0</li>
    <li>Macro Action => Hotbar: 10th macro would not trigger and display correctly</li>
    <li>Combat Tracker Action => Function: Default value would not properly initialize</li>
    <li>Other Actions => Darkness Control => Display would not function correctly</li>
    <li>Fixed some issues in the SD plugin where correct settings would not be displayed</li>
</ul>
Additions:
<ul>
    <li>Added new 'External Modules Action', which will contain all module integrations that don't fit anywhere else</li>
    <li>Added support for the Custom Hotbar module in 'Macro Action' => Mode: 'Custom Hotbar'. Link to module: https://foundryvtt.com/packages/custom-hotbar/</li>
    <li>Added support for the FxMaster module in 'External Modules Action' => Mode: 'Fx Master'. Link to module: https://foundryvtt.com/packages/fxmaster/</li>
</ul>

### v1.1.1 - 12-12-2020
Fixes
<ul>
    <li>Fixed issue where deleting a playlist would cause an error preventing the Soundboard Configuration to show up</li>
</ul>

<b>Compatible server app and SD plugin:</b><br>
Material Server v1.0.2 (unchanged): https://github.com/CDeenen/MaterialServer/releases <br>
SD plugin v1.1.0 (unchanged): https://github.com/CDeenen/MaterialDeck_SD/releases<br>

### v1.1.0 - 09-12-2020
Fixes
<ul>
    <li>Settings would not show for Combat Tracker action</li>
    <li>Macro Action => Macro Board default settings fixed</li>
    <li>API has been improved, making integration with other hardware/software easier, and making future changes/additions easier</li>
</ul>
Additions:
<ul>
    <li>Added support for Pathfinder 1e and Shadow of the Demon Lord</li>
    <li>All dialogs that are openable using the SD can now be closed by pressing the button while the dialog is open</li>
    <li>Playlist Action & Soundboard Action => Stop All now indicates if there are tracks/playlists/sounds playing</li>
    <li>Confirmed Foundry 0.7.8 compatibility</li>
</ul>

<b>Compatible server app and SD plugin:</b><br>
Material Server v1.0.2 (unchanged): https://github.com/CDeenen/MaterialServer/releases <br>
SD plugin v1.1.0: https://github.com/CDeenen/MaterialDeck_SD/releases<br>

### V1.0.1 - 26-11-2020
<ul>
    <li>Fixed issue where macro from macroboard wouldn't execute if furnace arguments were not defined</li>
    <li>Fixed issue where soundboard wouldn't save if no previous data existed for that sound</li>
</ul>

<b>Compatible server app and SD plugin:</b><br>
Material Server v1.0.2 (unchanged): https://github.com/CDeenen/MaterialServer/releases <br>
SD plugin v1.0.0 (unchanged): https://github.com/CDeenen/MaterialDeck_SD/releases<br>

### v1.0.0 - 24-11-2020
Release
<ul>
    <li>Fixed issue where the last column in 'Soundboard Configuration' would not work properly</li>
</ul>

<b>Compatible server app and SD plugin:</b><br>
Material Server v1.0.2: https://github.com/CDeenen/MaterialServer/releases <br>
SD plugin v1.0.0: https://github.com/CDeenen/MaterialDeck_SD/releases<br>

### v0.9.2 - 24-11-2020
<ul>
    <li>Removed unnecessary errors when module is not fully configured</li>
    <li>Solved issue that soundboard config couldn't be saved on a world that hadn't run Material Deck previously</li>
</ul>

### v0.9.1 - 23-11-2020
<ul>
    <li>Fixed 'Playlist' action issue where 'TrackNr' wouldn't show</li>
    <li>Fixed 'Soundboard Configuration' issue where changing the playlist would reset everything you've changed since last save</li>
    <li>'Soundboard Configuration', 'Macro Configuration' and 'Playlist Configuration' now save after each change, and update the SD instantly</li>
    <li>Save button has been removed from configuration screens, since it is now redundant</li>
    <li>Added support for DnD3.5e and Pathfinder 2e</li>
</ul>

<b>Note1:</b> In 'Macro Configuration', previously saved Furnace arguments have to be filled in again.<br>
<b>Note2:</b> Any settings set in 'Playlist Configuration' have to be set again<br>
<br>
<b>Compatible server app and SD plugin:</b><br>
Material Server v1.0.1 (unchanged): https://github.com/CDeenen/MaterialServer/releases <br>
SD plugin v0.9.1: https://github.com/CDeenen/MaterialDeck_SD/releases<br>

### v0.9.0 - 19-11-2020
<ul>
    <li>Added support for more playlists</li>
    <li>Added playmode setting for each playlist, which overrides the default playmode</li>
    <li>Added option to use the file picker to select Soundboard sounds, including support for wildcard names</li>
    <li>Fixed issue where macro config screen would not close if the module was disabled</li>
    <li>Fixed issue where the layout of the configuration screens would be messed up depending on browser/screen size</li>
    <li>Added option to open compendia and journal entries</li>
</ul>

<b>Compatible server app and SD plugin:</b><br>
Material Server v1.0.1: https://github.com/CDeenen/MaterialServer/releases <br>
SD plugin v0.9.0: https://github.com/CDeenen/MaterialDeck_SD/releases<br>

### v0.8.6 - 18-11-2020
<ul>
    <li>Added support for the new Material Server app</li>
</ul>

<b>Compatible server app and SD plugin:</b><br>
Material Server v1.0.0: https://github.com/CDeenen/MaterialServer/releases <br>
SD plugin v0.7.3: https://github.com/CDeenen/MaterialDeck_SD/releases<br>

### v0.8.5 - 17-11-2020
<ul>
    <li>Added 'Display Icon' to Macro action</li>
    <li>Removed background option from 'Macro' => 'Macro Board' => 'Trigger Macro', this is handled in the macro configuration screen</li>
    <li>Added 'Background' option in 'Macro' => 'Macro Board' => 'Offset'</li>
    <li>Fixed control buttons from not performing action when clicked</li>
    <li>Added check for each function to prevent unnecessary searching through the button buffer</li>
    <li>Added 'Target', 'Visibility', 'Toggle Combat State' and 'Set Condition' options to the 'Token' action (under 'on click')</li>
    <li>Added 'Zoom In' and 'Zoom Out' functions to 'Move' action</li>
    <li>Added ability to load icons from web sources</li>
    <li>Added support for localization (module only)</li>
    <li>Fixed issue where SD buttons would not load properly if Foundry was initialized before the SD, or if Foundry was refreshed</li>
    <li>Long words now split up onto multiple lines</li>
    <li>Confirmed compatibility with Foundry v0.7.7</li>
</ul>
<b>Compatible server app and SD plugin:</b><br>
Server v0.2.4 (no change)<br>
SD plugin v0.7.2<br>

### v0.8.4 - 11-11-2020
<ul>
    <li>In 'Other' action, 'Control Button' mode, add 'Displayed Controls' option</li>
    <li>Change 'Other', 'Playlist' and 'Soundboard' actions from background color change to ring color</li>
    <li>Macro board fixed</li>
    <li>Added proper background color options for 'Other' action</li>
    <li>In 'Other' action, control button icons are now properly centered</li>
    <li>Newly created actions now show the correct options at the start</li>
</ul>
<b>Compatible server app and SD plugin:</b><br>
Server v0.2.4 (no change)<br>
SD plugin v0.7.1<br>

### v0.8.3 - 10-11-2020
<ul>
    <li>Fixed compatibility with tokenizer</li>
</ul>
<b>Compatible server app and SD plugin:</b><br>
Server v0.2.4<br>
SD plugin v0.7.0<br>

### v0.8.2 - 10-11-2020
<ul>
    <li>Initial beta release</li>
</ul>
<b>Compatible server app and SD plugin:</b><br>
Server v0.2.4<br>
SD plugin v0.7.1<br>
