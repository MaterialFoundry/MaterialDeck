# Changelog Material Deck Module
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
<ul>
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