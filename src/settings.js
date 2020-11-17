import * as MODULE from "../MaterialDeck.js";
import { playlistConfigForm, macroConfigForm, soundboardConfigForm } from "./misc.js";

export const registerSettings = function() {
    /**
     * Main settings
     */

    //Enabled the module
    game.settings.register(MODULE.moduleName,'Enable', {
        name: "MaterialDeck.Sett.Enable",
        scope: "world",
        config: true,
        default: true,
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
        default: {a: "None",b: "None",c: "none",d: "none",e: "none",f: "none",g: "none",h: "none",i: "none"},
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
