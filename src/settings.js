import * as MODULE from "../MaterialDeck.js";
import { playlistConfigForm, macroConfigForm, soundboardConfigForm } from "./misc.js";

export const registerSettings = function() {
    /**
     * Main settings
     */

    //Enabled the module
    game.settings.register(MODULE.moduleName,'Enable', {
        name: "MaterialDeck.Sett.Enable",
        scope: "global",
        config: true,
        default: false,
        type: Boolean,
        onChange: x => window.location.reload()
    });

    game.settings.register(MODULE.moduleName,'streamDeckModel', {
        name: "MaterialDeck.Sett.Model",
        hint: "MaterialDeck.Sett.Model_Hint",
        scope: "world",
        config: true,
        type:Number,
        default:1,
        choices:["MaterialDeck.Sett.Model_Mini","MaterialDeck.Sett.Model_Normal","MaterialDeck.Sett.Model_XL"],
    });

    /**
     * Sets the ip address of the server
     */
    game.settings.register(MODULE.moduleName,'address', {
        name: "MaterialDeck.Sett.ServerAddr",
        hint: "MaterialDeck.Sett.ServerAddrHint",
        scope: "world",
        config: true,
        default: "localhost:3001",
        type: String,
        onChange: x => window.location.reload()
    });

    /**
     * Playlist soundboard
     */
    game.settings.register(MODULE.moduleName,'playlistMethod', {
        name: "Playlist play method",
        scope: "world",
        config: false,
        type:Number,
        default:0,
        choices:["MaterialDeck.Playlist.Playmethod.Unrestricted","MaterialDeck.Playlist.Playmethod.OneTrackPlaylist","MaterialDeck.Playlist.Playmethod.OneTrackTotal"],
    });

    game.settings.registerMenu(MODULE.moduleName, 'playlistConfigMenu',{
        name: "MaterialDeck.Sett.PlaylistConfig",
        label: "MaterialDeck.Sett.PlaylistConfig",
        type: playlistConfigForm,
        restricted: true
    });

    game.settings.register(MODULE.moduleName, 'selectedPlaylists', {
        name: "selectedPlaylists",
        scope: "world",
        type: Object,
        default: {},
        config: false
    });

    game.settings.register(MODULE.moduleName, 'selectedPlaylistMethod', {
        name: "selectedPlaylistMethod",
        scope: "world",
        type: Object,
        default: {},
        config: false
    });

    game.settings.register(MODULE.moduleName, 'numberOfPlaylists', {
        name: "numberOfPlaylists",
        scope: "world",
        type: Number,
        default: 9,
        config: false
    });

    /**
     * Macro Board
     */
    game.settings.registerMenu(MODULE.moduleName, 'macroConfigMenu',{
        name: "MaterialDeck.Sett.MacroConfig",
        label: "MaterialDeck.Sett.MacroConfig",
        type: macroConfigForm,
        restricted: true
    });

    game.settings.register(MODULE.moduleName, 'macroSettings', {
        name: "macroSettings",
        scope: "world",
        type: Object,
        config: false
    });

    game.settings.register(MODULE.moduleName, 'macroArgs', {
        name: "macroArgs",
        scope: "world",
        type: Object,
        config: false
    });

    /**
     * Soundboard
     */
    game.settings.register(MODULE.moduleName, 'soundboardSettings', {
        name: "soundboardSettings",
        scope: "world",
        type: Object,
        default: "None",
        config: false
    });

    game.settings.registerMenu(MODULE.moduleName, 'soundboardConfigMenu',{
        name: "MaterialDeck.Sett.SoundboardConfig",
        label: "MaterialDeck.Sett.SoundboardConfig",
        type: soundboardConfigForm,
        restricted: true
    });
}
