# Changelog Material Deck Module
### v1.1.1 - 09-12-2020
Fixes
<ul>
<li>Fixed issue where deleting a playlist would cause an error preventing the Soundboard Configuration to show up</li>
</li>

<b>Compatible server app and SD plugin:</b><br>
Material Server v1.0.2 (unchanged): https://github.com/CDeenen/MaterialServer/releases <br>
SD plugin v1.1.0 (unchanged): https://github.com/CDeenen/MaterialDeck_SD/releases<br>

### v1.1.0 - 09-12-2020
Fixes
<ul>
<li>Settings would not show for Combat Tracker action</li>
<li>Macro Action => Macro Board default settings fixed</li>
<li>API has been improved, making integration with other hardware/software easier, and making future changes/additions easier</li>
</li>
Additions:
<ul>
<li>Added support for Pathfinder 1e and Shadow of the Demon Lord</li>
<li>All dialogs that are openable using the SD can now be closed by pressing the button while the dialog is open</li>
<li>Playlist Action & Soundboard Action => Stop All now indicates if there are tracks/playlists/sounds playing</li>
<li>Confirmed Foundry 0.7.8 compatibility</li>
</li>

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