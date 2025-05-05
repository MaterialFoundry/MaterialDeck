# Audio Action
The Sound Action allows you to play sounds, control playlists and set the user volume.<br>

| Option            | Description   |
|-------------------|---------------|
| Title             | If configured, will set the title/text on the button. This will override any other text that would normally be displayed. |
| Icon Override     | Url to a custom icon. If configured, this will override any icon that would normally be displayed. |
| Mode              | The mode of the button:<br><b>-[Soundboard](./soundboard.md)</b>: Control the Material Deck soundboard.<br><b>-[Playlist Control](./playlistControl.md)</b>: Control playlists.<br><b>-[Play Any Sound](#play-any-sound)</b>: Play any sound.<br><b>-[Volume Control](#volume-control)</b>: Control Foundry's volume sliders. |


# Play Any Sound
This mode will allow you to play any sound from any source.

| Option        | Description   |
|---------------|---------------|
| Selection     | <b>-Play from Playlist</b>: Play a sound from a playlist.<br><b>-Play from Url</b>: Play sound from an url |
| URL           | (`Play from Url` only) Url of the sound to play. This can be a file on the Foundry server (e.g. `assets/sound.wav`), or on the internet (e.g. `https://somesound.wav`).<br>Files located on your computer will not play for other users |
| Playlist      | (`Play from Playlist` only) List of playlists on the Foundry server |
| Sound         | (`Play from Playlist` only) List of sounds in the selected playlist |
| Volume        | Volume of the sound |
| Colors            | <b>-On Color</b>: A border of this color will be displayed if the sound is playing<br><b>-Off Color</b>: A border of this color will be displayed if the sound is not playing<br><b>-Background</b>: Background color of the button |

# Volume Control
This mode allows you to control Foundry's volume sliders.

| Option            | Description   |
|-------------------|---------------|
| Type              | <b>-Music</b>: Control the music volume slider<br><b>-Environment</b>: Control the environment volume slider<br><b>-Interface</b>: Control the interface volume slider |
| Mode              | Sets how to change the volume:<br><b>-Set to Value</b>: Sets the value to the value set in `Value`<br><b>-Increase/Decrease</b>: Increases the volume by the value set in `Value` |
| Value             | The value in % to set the volume to (in case of `Set to Value`), or the value in % to change the volume by (in case of `Increase/Decrease`) |
| Display           | <b>-Value</b>: Display the current volume on the Stream Deck<br><b>-Icon</b>: Display an icon on the Stream Deck |
| Colors            | <b>-Background</b>: Background color of the button |