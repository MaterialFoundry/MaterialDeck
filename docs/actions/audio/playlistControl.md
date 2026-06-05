The playlist control allows you to control Foundry's playlists.<br>
It is part of the [Audio action](./audio.md).

## Function

Sets the function of the button.

| Option                                            | Description                                           |
|---------------------------------------------------|-------------------------------------------------------|
| [Playlist Control](#playlist-control)             | Control (start/stop) playlists.                       |
| [Track Control](#track-control)                   | Control (start/stop) playlist tracks.                 |
| [Pause All Playlists](#pause-stop-all-playlists)  | Pauses all currently playing playlists.               |
| [Stop All Playlists](#pause-stop-all-playlists)   | Stops all currently playing playlists.                |
| [Playlist Offset](#offsets)                       | Configure playlist offsets.                           |
| [Track Offset](#offsets)                          | Configure track offsets.                              |
| [Set Page-Wide Playlist](#set-page-wide-playlist) | Set the page-wide playlist to the selected playlist.  |
| [Set Page-Wide Folder](#set-page-wide-folder)     | Sets the page-wide folder to the selected folder.     |

## Playlist Control
The playlist control function allows you to start, stop or pause playlists.<br>
When starting a playlist, the track that will be played will depend on the `Playback Mode` that's configured in Foundry.

| Option                                            | Description   |
|---------------------------------------------------|---------------|
| Mode          | Sets what to do on a button press:<br><b>-Play/Stop</b>: Will start the playlist if it's not  playing, otherwise it will stop the playlist.<br><b>-Play/Stop</b>: Will start the playlist if it's not  playing, otherwise it will pause the playlist.<br><b>-Play</b>: Will start the playlist.<br><b>-Stop</b>: Will stop the playlist.<br><b>-Pause</b>: Will pause the playlist.<br><b>-Next Track</b>: Will start the next track in the playlist.<br><b>-Previous Track</b>: Will start the previous track in the playlist.<br> |
| Page-Wide Playlist | All playlist actions on the current page with this setting enabled will share the playlist selection. So if on one of these actions you select a playlist using `Select by Name/ID`, all other actions with `Page-Wide Playlist` enabled will also select that playlist. |
| Playlist          | The playlist to select:<br><b>-Currently Playing</b>: A currently playing playlist.<br><b>-Select by Name/ID</b>: Select a playlist using its name or ID.<br><b>-Select by Number</b>: Select a playlist using a number<br><b>-Select by Folder</b>: Select a playlist from a specified folder using a number.<br><b>-All Other Options</b> A list of all playlists.  |
| Folder            | (`Select by Folder` only) Folder to select a playlist from. |
| Page-Wide Folder  | (`Select by Folder` only) All `Select by Folder` actions on the current page with this setting enabled will share the folder selection. |
| Playlist Nr       | (`Currently Playing`, `Select by Number` and `Select by Folder` only) Number of the playlist to select, see [below](#playlist-track-nr). | 
| Playlist Name/ID  | (`Select by Name/ID` only) Name or ID of the playlist to select.
| Display           | <b>-Name</b>: Display the name of the playlist on the Stream Deck.<br><b>-Icon</b>: Display a relevant icon on the Stream Deck. |
| Colors            | <b>-On Color</b>: A border is drawn on the Stream Deck of this color if the playlist is currently playing.<br><b>-Off Color</b>: A border is drawn on the Stream Deck of this color if the playlist is currently not playing.<br><b>-Background</b>: Background color of the button. |

## Track Control
The track control function allows you to start, stop or pause tracks in a playlist.<br>

| Option                                            | Description   |
|---------------------------------------------------|---------------|
| Mode          | Sets what to do on a button press:<br><b>-Play/Stop</b>: Will start the track if it's not  playing, otherwise it will stop the track.<br><b>-Play/Stop</b>: Will start the track if it's not  playing, otherwise it will pause the track.<br><b>-Play</b>: Will start the track.<br><b>-Stop</b>: Will stop the track.<br><b>-Pause</b>: Will pause the track. |
| Page-Wide Playlist | All playlist actions on the current page with this setting enabled will share the playlist selection. So if on one of these actions you select a playlist using `Select by Name/ID`, all other actions with `Page-Wide Playlist` enabled will also select that playlist. |
| Playlist          | The playlist to select a track from:<br><b>-Currently Playing</b>: A currently playing playlist.<br><b>-Select by Name/ID</b>: Select a playlist using its name or ID.<br><b>-Select by Number</b>: Select a playlist using a number<br><b>-All Other Options</b> A list of all playlists.
| Playlist Nr       | (`Currently Playing` and `Select by Number` only) Number of the playlist to select, see [below](#playlist-track-nr). | 
| Playlist Name/ID  | (`Select by Name/ID` only) Name or ID of the playlist to select. |
| Track             | (only if a playlist was selected from the list) The track to select:<br><b>-Currently Playing</b>: A currently playing track.<br><b>-Select by Name/ID</b>: Select a track using its name or ID.<br><b>-Select by Number</b>: Select a track using a number<br><b>-All Other Options</b> A list of all tracks of the selected playlist. |
| Track Nr       | Number of the track to select, see [below](#playlist-track-nr). |
| Display           | <b>-Name</b>: Display the name of the track on the Stream Deck.<br><b>-Icon</b>: Display a relevant icon on the Stream Deck. |
| Colors            | <b>-On Color</b>: A border is drawn on the Stream Deck of this color if the track is currently playing.<br><b>-Off Color</b>: A border is drawn on the Stream Deck of this color if the track is currently not playing.<br><b>-Background</b>: Background color of the button. |

## Pause & Stop All Playlists
These options will either pause or stop all currently playing playlists.

| Option                                            | Description   |
|---------------------------------------------------|---------------|
| Display           | <b>-Icon</b>: Display a relevant icon on the Stream Deck. |
| Colors            | <b>-On Color</b>: A border is drawn on the Stream Deck of this color if a playlist is currently playing.<br><b>-Off Color</b>: A border is drawn on the Stream Deck of this color if no playlist is currently playing.<br><b>-Background</b>: Background color of the button. |

## Playlist & Track Nr
The `Playlist Nr` and `Track Nr` settings are used to select a playlist or track using a number.<br>
This is mostly useful if you want to keep things flexible. 
For example, if you have multiple buttons set to `Playlist Control` and `Playlist` set to `Select by Number` with playlist nr's from 1 to 10, you would always have control over the first 10 playlists in Foundry, also if you change playlists.<br>

## Offsets
Playlist and Track offsets can be used in combination with `Playlist Nr` and `Track Nr` to give an offset to the respective numbers.<br>
For example, if the playlist offset is set to 10, a button with `Playlist Nr` set to 1 will then have playlist 11 selected, a button with `Playlist Nr` set to 5 will have playlist 15 selected.<br>
<br>
This can be used to browse through playlists or tracks.<br>
For example, say you have 5 buttons with `Track Nr` set from 1 to 5, and a Track Offset button with `Offset Mode` `Increase/Decrease` and `Offset` of 1. 
If you then press the offset button, the offset will increase to 1, so now tracks 2 through 6 are selected.

| Option            | Description   |
|-------------------|---------------|
| Offset Mode       | Sets how to set the offset:<br><b>-Set to Value</b>: Sets the offset to the value set in `Offset`.<br><b>-Increase/Decrease</b>: Increases the offset by the value set in `Offset`. |
| Offset            | The value to set the offset to (in case of `Set to Value`), or the value to increment the offset with (in case of `Increase/Decrease`).<br> The offset can be any value, positive or negative. |
| Display           | <b>-Offset</b>: Display the current offset on the Stream Deck.<br><b>-Icon</b>: Display an icon on the Stream Deck. |
| Colors            | <b>-On Color</b>: (`Set to Value` only) A border is drawn on the Stream Deck of this color if the current offset is equal to the offset configured in `Offset`.<br><b>-Off Color</b>: (`Set to Value` only) A border is drawn on the Stream Deck of this color if the current offset is not equal to the offset configured in `Offset`.<br><b>-Background</b>: Background color of the button. |

## Set Page-Wide Playlist
The `Page-Wide Playlist` setting allows you to synchronize the playlist selection across multiple buttons on the same screen.<br>
Using this function, you can set the playlist selection for all buttons with `Page-Wide Playlist` enabled.

| Option                                            | Description   |
|---------------------------------------------------|---------------|
| Playlist          | The playlist to select:<br><b>-Currently Playing</b>: A currently playing playlist.<br><b>-Select by Name/ID</b>: Select a playlist using its name or ID.<br><b>-Select by Number</b>: Select a playlist using a number<br><b>-All Other Options</b> A list of all playlists.
| Playlist Nr       | (`Currently Playing` and `Select by Number` only) Number of the playlist to select, see [here](#playlist-track-nr). | 
| Playlist Name/ID  | (`Select by Name/ID` only) Name or ID of the playlist to select.
| Display           | <b>-Name</b>: Display the name of the playlist on the Stream Deck.<br><b>-Icon</b>: Display a relevant icon on the Stream Deck. |
| Colors            | <b>-Background</b>: Background color of the button. |

## Set Page-Wide Folder
Similar to `Page-Wide Folder`, but allows you to set folder if `Select by Folder` is set.