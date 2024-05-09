import { moduleName } from "../MaterialDeck.js";
import { downloadUtility } from "../templates/downloadUtility.js";
import { playlistConfigForm } from "../templates/playlistConfig.js";
import { macroConfigForm } from "../templates/macroConfig.js";
import { soundboardConfigForm } from "../templates/soundboardConfig.js";
import { helpMenu } from "../templates/helpMenu.js";
import { configureUserPermissions, userPermission } from "../templates/userPermissionConfig.js";

export const registerSettings = async function() {
    /**
     * Main settings
     */
    //world,global,client

    game.settings.register(moduleName,'v1.6.3_update_notification', {
        scope: "client",
        config: false,
        default: false,
        type: Boolean
    });

    //Enabled the module
    game.settings.register(moduleName,'Enable', {
        name: "MaterialDeck.Sett.Enable",
        hint: "MaterialDeck.Sett.EnableHint",
        scope: "client",
        config: true,
        default: false,
        type: Boolean,
        onChange: x => window.location.reload()
    });

    game.settings.register(moduleName,'EnableDialogShown', {
        name: "MaterialDeck_EnableDialogShown",
        scope: "client",
        config: false,
        default: false,
        type: Boolean
    });

    /**
     * System override
     */
    game.settings.register(moduleName,'systemOverride', {
        name: "MaterialDeck.Sett.SystemOverride",
        hint: "MaterialDeck.Sett.SystemOverrideHint",
        scope: "client",
        config: true,
        default: "",
        type: String,
        choices: {
            "": "Autodetect"
        },
        onChange: x => window.location.reload()
    });

    /**
     * Sets the ip address of the server
     */
    game.settings.register(moduleName,'address', {
        name: "MaterialDeck.Sett.ServerAddr",
        hint: "MaterialDeck.Sett.ServerAddrHint",
        scope: "client",
        config: true,
        default: "localhost:3001",
        type: String,
        onChange: x => window.location.reload()
    });

    game.settings.register(moduleName, 'imageBuffer', {
        name: "MaterialDeck.Sett.ImageBuffer",
        hint: "MaterialDeck.Sett.ImageBufferHint",
        default: 100,
        type: Number,
        scope: 'client',
        range: { min: 0, max: 500, step: 10 },
        config: true
        
    });

    game.settings.register(moduleName, 'imageBrightness', {
        name: "MaterialDeck.Sett.ImageBrightness",
        hint: "MaterialDeck.Sett.ImageBrightnessHint",
        default: 50,
        type: Number,
        scope: 'client',
        range: { min: 0, max: 100, step: 1 },
        config: true
        
    });

    game.settings.register(moduleName, 'nrOfConnMessages', {
        name: "MaterialDeck.Sett.MaxAttempts",
        hint: "MaterialDeck.Sett.MaxAttemptsHint",
        default: 5,
        type: Number,
        scope: 'client',
        range: { min: 0, max: 100, step: 1 },
        config: true
        
    });

    //Create the Help button
    game.settings.registerMenu(moduleName, 'helpMenu',{
        name: "MaterialDeck.Sett.Help",
        label: "MaterialDeck.Sett.Help",
        type: helpMenu,
        restricted: false
    });

    game.settings.registerMenu(moduleName, 'downloadUtility',{
        name: "MaterialDeck.DownloadUtility.Title",
        label: "MaterialDeck.DownloadUtility.Title",
        type: downloadUtility,
        restricted: false
    });

    game.settings.registerMenu(moduleName, 'permissionConfig',{
        name: "MaterialDeck.Sett.Permission",
        label: "MaterialDeck.Sett.Permission",
        type: userPermission,
        restricted: true
    });

    game.settings.register(moduleName, 'userPermission', {
        name: "userPermission",
        label: "",
        scope: "world",
        type: Object,
        config: false,
        default: {}
    });

    /**
     * Playlist soundboard
     */
    game.settings.registerMenu(moduleName, 'playlistConfigMenu',{
        name: "MaterialDeck.Sett.PlaylistConfig",
        label: "MaterialDeck.Sett.PlaylistConfig",
        type: playlistConfigForm,
        restricted: false
    });

    game.settings.register(moduleName, 'playlists', {
        name: "selectedPlaylists",
        scope: "world",
        type: Object,
        default: {},
        config: false
    });

    /**
     * Macro Board
     */
    game.settings.registerMenu(moduleName, 'macroConfigMenu',{
        name: "MaterialDeck.Sett.MacroConfig",
        label: "MaterialDeck.Sett.MacroConfig",
        type: macroConfigForm,
        restricted: false
    });

    game.settings.register(moduleName, 'macroSettings', {
        name: "macroSettings",
        scope: "world",
        type: Object,
        config: false,
        default: {}
    });

    game.settings.register(moduleName, 'macroArgs', {
        name: "macroArgs",
        scope: "world",
        type: Object,
        config: false,
        default: {}
    });

    /**
     * Soundboard
     */
    game.settings.register(moduleName, 'soundboardSettings', {
        name: "soundboardSettings",
        scope: "world",
        type: Object,
        default: "None",
        config: false
    });

    game.settings.registerMenu(moduleName, 'soundboardConfigMenu',{
        name: "MaterialDeck.Sett.SoundboardConfig",
        label: "MaterialDeck.Sett.SoundboardConfig",
        type: soundboardConfigForm,
        restricted: false
    });

    configureUserPermissions();
}