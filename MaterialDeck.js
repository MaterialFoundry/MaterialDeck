import { registerSettings } from "./src/settings.js";
import { StreamDeck } from "./src/streamDeck.js";
import { TokenControl } from "./src/actions/token.js";
import { MacroControl } from "./src/actions/macro.js";
import { CombatTracker } from "./src/actions/combattracker.js";
import { PlaylistControl } from "./src/actions/playlist.js";
import { SoundboardControl } from "./src/actions/soundboard.js";
import { OtherControls } from "./src/actions/othercontrols.js";
import { ExternalModules } from "./src/actions/external.js";
import { SceneControl } from "./src/actions/scene.js";
import { CustomControl } from "./src/actions/custom.js";
import { compatibleSystem } from "./src/misc.js";
import { SystemHelper } from "./src/systemHelper.js";
import { startWebsocket } from "./src/websocket.js";
import { compatibilityInit } from "./src/compatibilityHandler.js";

//CONFIG.debug.hooks = true;

export const moduleName = "MaterialDeck";

export let versions = {
    materialCompanion: {
        current: '',
        minimum: ''
    },
    plugin: {
        current: '',
        minimum: ''
    },
    module: {
        current: ''
    }
}

let controlTokenTimer;
export let hotbarUses = false;
export let calculateHotbarUses;

class MaterialDeck {
    gamingSystem = "dnd5e";
    ready = false;

    constructor(enable) {
        this.enableModule = enable;

        //if (!enable) return;

        this.soundboard = new SoundboardControl();
        this.streamDeck = new StreamDeck();
        this.tokenControl = new TokenControl();
        this.macroControl = new MacroControl();
        this.combatTracker = new CombatTracker();
        this.playlistControl = new PlaylistControl();
        this.otherControls = new OtherControls();
        this.externalModules = new ExternalModules();
        this.sceneControl = new SceneControl();
        this.systemHelper = new SystemHelper();
        this.customControl = new CustomControl();

        this.getGamingSystem();
    }

    registerSystem(data) {
        this.systemHelper?.registerSystem(data);
    }

    compatibleSystem(version) {
        return compatibleSystem(version)
    }

    getGamingSystem() {
        const systemOverride = game.settings.get(moduleName,'systemOverride');
        this.gamingSystem = (systemOverride == undefined || systemOverride == null || systemOverride == '') ? game.system.id : systemOverride;
        return this.gamingSystem;
    }
}

export function getPermission(action,func) {
    const role = game.user.role-1;
    const settings = game.settings.get(moduleName,'userPermission');
    if (action == 'ENABLE') return settings.enable[role];
    else return settings.permissions?.[action]?.[func]?.[role];
}

async function enableSettingDialog() {
    return new Promise((resolve, reject) => {

        const dialog = new Dialog({
          title: game.i18n.localize("MaterialDeck.EnableDialog.Title"),
          content: game.i18n.localize("MaterialDeck.EnableDialog.Content"),
          buttons: {
            yes: { label: game.i18n.localize("MaterialDeck.EnableDialog.Yes"), callback: () => { resolve('yes') } },
            no: { label: game.i18n.localize("MaterialDeck.EnableDialog.No"), callback: () => { resolve('no') } },
          },
          default: 'no',
          close: () => { reject() }
        });
    
        dialog.render(true);
    });
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Hooks
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Hooks.once('setup', ()=> {
    game.materialDeck = {
        enableModule: false
    }
})

/**
 * Ready hook
 * Attempt to open the websocket
 */
Hooks.once('ready', async()=>{
    compatibilityInit();
    await registerSettings();

    if (game.settings.get(moduleName, 'Enable')) game.settings.set(moduleName,'EnableDialogShown',true);
    else if (!game.settings.get(moduleName,'EnableDialogShown')) {
        const response = await enableSettingDialog();
        await game.settings.set(moduleName,'EnableDialogShown',true);
        if (response == "yes") await game.settings.set(moduleName, 'Enable', true);
        else await game.settings.set(moduleName, 'Enable', false);
    }

    const enableModule = (game.settings.get(moduleName,'Enable')) ? true : false; 
  
    versions.module.current = game.modules.get('MaterialDeck').version;
    versions.materialCompanion.minimum = game.modules.get(moduleName).flags.minimumMaterialCompanionVersion;
    versions.plugin.minimum = game.modules.get(moduleName).flags.minimumPluginVersion;

    game.materialDeck = new MaterialDeck(enableModule);

    if (!game.settings.get(moduleName,'v1.6.3_update_notification') && enableModule) {
        let d = new Dialog({
            title: "Material Deck Update Note",
            content: 
            `
                <p>
                    <b>Important changes to how Material Deck handles gaming systems</b><br>
                    <br>
                    Anything related to how Material Deck handles gaming systems has been split into separate modules.<br>
                    This means that you have to install and enable the specific Material Deck system module for your gaming system.<br>
                    <br>
                    Click <a href='https://github.com/MaterialFoundry/MaterialDeck/wiki/Gaming-Systems'>here</a> for more info.<br>
                    <br>
                </p>
                
                <div style="display:flex">
                    <label>Do not show again</label>
                    <div class="form-value">
                        <input type="checkbox" id="MD_v1.6.3_DoNotShowAgain">
                    </div>
                </div>
            `,
            buttons: {
             one: {
              icon: '',
              label: "Ok",
              callback: () => {
                if (document.getElementById("MD_v1.6.3_DoNotShowAgain").checked) game.settings.set(moduleName,'v1.6.3_update_notification', true)
              }
             }
            },
            default: "one"
           });
           d.render(true);
    }

    
    game.socket.on(`module.MaterialDeck`, async(payload) =>{
        //console.log(payload);
        if (payload.msgType == "playSound") game.materialDeck.soundboard.playSound(payload.trackNr,payload.src,payload.play,payload.repeat,payload.volume);  
        else if (game.user.isGM && payload.msgType == "playPlaylist") {
            const playlist = game.materialDeck.playlistControl.getPlaylist(payload.playlistNr);
            game.materialDeck.playlistControl.playPlaylist(playlist,payload.playlistNr);
        }
        else if (game.user.isGM && payload.msgType == "playTrack") {
            const playlist = game.materialDeck.playlistControl.getPlaylist(payload.playlistNr);
            const sounds = playlist.data.sounds;
            for (let track of sounds)
                if (track._id == payload.trackId)
                    game.materialDeck.playlistControl.playTrack(track,playlist,payload.playlistNr)
        }
        else if (game.user.isGM && payload.msgType == "stopAllPlaylists")
            game.materialDeck.playlistControl.stopAll(payload.force);
        else if (game.user.isGM && payload.msgType == "soundboardUpdate") {
            await game.settings.set(moduleName,'soundboardSettings',payload.settings);
            const payloadNew = {
                "msgType": "soundboardRefresh"
            };
            game.socket.emit(`module.MaterialDeck`, payloadNew);
        }
        else if (game.user.isGM == false && payload.msgType == "soundboardRefresh" && game.materialDeck.enableModule)
            game.materialDeck.soundboard.updateAll();
        else if (game.user.isGM && payload.msgType == "macroboardUpdate") {
            await game.settings.set(moduleName,'macroSettings',payload.settings);
            const payloadNew = {
                "msgType": "macroboardRefresh"
            };
            game.socket.emit(`module.MaterialDeck`, payloadNew);
        }
        else if (game.user.isGM == false && payload.msgType == "macroboardRefresh" && game.materialDeck.enableModule)
            game.materialDeck.macroControl.updateAll();
        else if (game.user.isGM && payload.msgType == "playlistUpdate") {
            await game.settings.set(moduleName,'playlists',payload.settings);
            const payloadNew = {
                "msgType": "playlistRefresh"
            };
            game.socket.emit(`module.MaterialDeck`, payloadNew);
        }
        else if (game.user.isGM == false && payload.msgType == "playlistRefresh" && game.materialDeck.enableModule)
            game.materialDeck.playlistControl.updateAll();
            
    });

    if (game.user.isGM) {
        let soundBoardSettings = game.settings.get(moduleName,'soundboardSettings');
        let macroSettings = game.settings.get(moduleName, 'macroSettings');
        let array = [];
        for (let i=0; i<64; i++) array[i] = "";
        let arrayVolume = [];
        for (let i=0; i<64; i++) arrayVolume[i] = "50";
        let arrayZero = [];
        for (let i=0; i<64; i++) arrayZero[i] = "0";
    
        if (macroSettings.color == undefined){
            game.settings.set(moduleName,'macroSettings',{
                macros: array,
                color: arrayZero
            });
        }
    
        const settings = {
            playlist: "",
            sounds: array,
            colorOn: arrayZero,
            colorOff: arrayZero,
            mode: arrayZero,
            toggle: arrayZero,
            volume: arrayVolume
        };
        if (soundBoardSettings.colorOff == undefined){
            game.settings.set(moduleName,'soundboardSettings',settings);
        }
    }

    if (enableModule == false) return;
    if (getPermission('ENABLE') == false) {
        game.materialDeck.ready = false;
        return;
    }
    game.materialDeck.ready = true;
    startWebsocket();

    const hotbarUsesTemp = game.modules.get("illandril-hotbar-uses");
    if (hotbarUsesTemp != undefined) hotbarUses = true;

    Hooks.call('MaterialDeck_Ready');
});

function updateActor(id) {
    const token = game.materialDeck.systemHelper.getTokenFromActorId(id);
    if (token == undefined) return;
    game.materialDeck.tokenControl.update(token.id);
}

Hooks.on('refreshToken', (token)=> {
    game.materialDeck.tokenControl.update(token.id);
});

Hooks.on('updateToken',(document,changes)=>{
    if (game.materialDeck.enableModule == false || game.materialDeck.ready == false) return;
    let tokenId = changes._id;
    if (tokenId == canvas.tokens.controlled[0]?.id) game.materialDeck.tokenControl.update(canvas.tokens.controlled[0]?.id);
    if (game.materialDeck.macroControl != undefined) game.materialDeck.macroControl.updateAll();
    if (changes.hidden != undefined && game.materialDeck.combatTracker != undefined) game.materialDeck.combatTracker.updateAll();
});

Hooks.on('updateActor',(actor)=>{
    if (game.materialDeck.enableModule == false || game.materialDeck.ready == false) return;
    updateActor(actor.id);
    if (game.materialDeck.macroControl != undefined) game.materialDeck.macroControl.updateAll();
});

Hooks.on('createActiveEffect',(data)=>{
    if (game.materialDeck.enableModule == false || game.materialDeck.ready == false) return;
    updateActor(data.parent.id);
    return;
});

Hooks.on('deleteActiveEffect',(data)=>{
    if (game.materialDeck.enableModule == false || game.materialDeck.ready == false) return;
    updateActor(data.parent.id);
    return;
});

Hooks.on('onActorSetCondition',(data)=>{
    if (game.materialDeck.enableModule == false || game.materialDeck.ready == false) return;
    updateActor(data.actor.id);
    return;
});

Hooks.on('controlToken',(token,controlled)=>{
    if (game.materialDeck.enableModule == false || game.materialDeck.ready == false) return;
    if (controlled) {
        game.materialDeck.tokenControl.update(token.id);
        if (controlTokenTimer != undefined) {
            clearTimeout(controlTokenTimer);
            controlTokenTimer = undefined;
        }
    }
    else {
        controlTokenTimer = setTimeout(function(){game.materialDeck.tokenControl.update(canvas.tokens.controlled[0]?.id);},10)
    }
    
    if (game.materialDeck.macroControl != undefined) game.materialDeck.macroControl.updateAll();
});

Hooks.on('updateOwnedItem',()=>{
    if (game.materialDeck.macroControl != undefined) game.materialDeck.macroControl.updateAll();
})

Hooks.on('renderHotbar', (hotbar)=>{
    if (game.materialDeck.enableModule == false || game.materialDeck.ready == false) return;
    if (game.materialDeck.macroControl != undefined) game.materialDeck.macroControl.hotbar(hotbar.macros);
});

Hooks.on('render', (app)=>{
    if (game.materialDeck.enableModule == false || game.materialDeck.ready == false) return;
    if (app.id == "hotbar" && game.materialDeck.macroControl != undefined)  game.materialDeck.macroControl.hotbar(app.macros);
});

Hooks.on('renderCombatTracker',()=>{
    if (game.materialDeck.enableModule == false || game.materialDeck.ready == false) return;
    if (game.materialDeck.combatTracker != undefined) {
        game.materialDeck.combatTracker.updateAll();
    }
    if (game.materialDeck.tokenControl != undefined) game.materialDeck.tokenControl.update(canvas.tokens.controlled[0]?.id);
});

Hooks.on('renderActorSheet',()=>{
    if (game.materialDeck.enableModule == false || game.materialDeck.ready == false) return;
    if (game.materialDeck.tokenControl != undefined) game.materialDeck.tokenControl.update();
});

Hooks.on('renderPlaylistDirectory', (playlistDirectory)=>{
    if (game.materialDeck.enableModule == false || game.materialDeck.ready == false) return;
    if (game.materialDeck.playlistControl != undefined) game.materialDeck.playlistControl.updateAll();
});

Hooks.on('closeplaylistConfigForm', (form)=>{
    if (game.materialDeck.enableModule == false || game.materialDeck.ready == false) return;
    if (form.template == "./modules/MaterialDeck/templates/playlistConfig.html")
        game.materialDeck.playlistControl.updateAll();
});

Hooks.on('updatePlaylistSound', ()=>{
    if (game.materialDeck.enableModule == false || game.materialDeck.ready == false) return;
    if (game.materialDeck.playlistControl != undefined) game.materialDeck.playlistControl.updateAll();
});

Hooks.on('lightingRefresh',()=>{
    if (game.materialDeck.enableModule == false || game.materialDeck.ready == false) return;
    if (game.materialDeck.tokenControl != undefined) game.materialDeck.tokenControl.update();
});

Hooks.on('pauseGame',()=>{
    if (game.materialDeck.enableModule == false || game.materialDeck.ready == false) return;
    game.materialDeck.otherControls.updateAll();
});

Hooks.on('renderSidebarTab',(app)=>{
    const options = {
        sidebarTab: app.tabName,
        renderPopout: app.popOut
    }
    if (game.materialDeck.enableModule == false || game.materialDeck.ready == false) return;
    if (game.materialDeck.otherControls != undefined) game.materialDeck.otherControls.updateAll(options);
    if (game.materialDeck.sceneControl != undefined) game.materialDeck.sceneControl.updateAll();
    if (document.getElementsByClassName("roll-type-select")[0] != undefined)
        document.getElementsByClassName("roll-type-select")[0].addEventListener('change',function(){
            if (game.materialDeck.otherControls != undefined) game.materialDeck.otherControls.updateAll(options);
        })
});

Hooks.on('closeSidebarTab',(app)=>{
    const options = {
        sidebarTab: app.tabName,
        renderPopout: false
    }
    if (game.materialDeck.otherControls != undefined) game.materialDeck.otherControls.updateAll(options);
});

Hooks.on('changeSidebarTab',()=>{
    if (game.materialDeck.enableModule == false || game.materialDeck.ready == false) return;
    if (game.materialDeck.otherControls != undefined) game.materialDeck.otherControls.updateAll();
});

Hooks.on('updateScene',()=>{
    if (game.materialDeck.enableModule == false || game.materialDeck.ready == false) return;
    game.materialDeck.sceneControl.updateAll();
    game.materialDeck.externalModules.updateAll();
    game.materialDeck.otherControls.updateAll();
});

Hooks.on('renderSceneControls',()=>{
    if (game.materialDeck.enableModule == false || game.materialDeck.ready == false || game.materialDeck.otherControls == undefined) return;
    game.materialDeck.otherControls.updateAll();
    game.materialDeck.externalModules.updateAll();
});

Hooks.on('targetToken',(user,token,targeted)=>{
    if (game.materialDeck.enableModule == false || game.materialDeck.ready == false) return;
    if (token.id == canvas.tokens.controlled[0]?.id) game.materialDeck.tokenControl.update(canvas.tokens.controlled[0]?.id);
});

Hooks.on('sidebarCollapse',()=>{
    if (game.materialDeck.enableModule == false || game.materialDeck.ready == false) return;
    game.materialDeck.otherControls.updateAll();
});

Hooks.on('renderCompendium',()=>{
    if (game.materialDeck.enableModule == false || game.materialDeck.ready == false) return;
    game.materialDeck.otherControls.updateAll();
});

Hooks.on('closeCompendium',()=>{
    if (game.materialDeck.enableModule == false || game.materialDeck.ready == false) return;
    game.materialDeck.otherControls.updateAll();
});

Hooks.on('renderCompendiumBrowser',()=>{
    if (game.materialDeck.enableModule == false || game.materialDeck.ready == false) return;
    game.materialDeck.otherControls.updateAll({renderCompendiumBrowser:true});
});

Hooks.on('closeCompendiumBrowser',()=>{
    if (game.materialDeck.enableModule == false || game.materialDeck.ready == false) return;
    game.materialDeck.otherControls.updateAll({renderCompendiumBrowser:false});
});

Hooks.on('renderJournalSheet',(sheet)=>{
    if (game.materialDeck.enableModule == false || game.materialDeck.ready == false) return;
    game.materialDeck.otherControls.updateAll({
        hook:'renderJournalSheet',
        sheet:sheet
    });
});

Hooks.on('closeJournalSheet',(sheet)=>{
    if (game.materialDeck.enableModule == false || game.materialDeck.ready == false) return;
    game.materialDeck.otherControls.updateAll({
        hook:'closeJournalSheet',
        sheet:sheet
    });
});

Hooks.on('gmScreenOpenClose',(html,isOpen)=>{
    if (game.materialDeck.enableModule == false || game.materialDeck.ready == false) return;
    game.materialDeck.externalModules.updateAll({gmScreen:isOpen});
});

Hooks.on('ShareVision', ()=>{
    if (game.materialDeck.enableModule == false || game.materialDeck.ready == false) return;
    game.materialDeck.externalModules.updateAll();
})

Hooks.on('NotYourTurn', ()=>{
    if (game.materialDeck.enableModule == false || game.materialDeck.ready == false) return;
    game.materialDeck.externalModules.updateAll();
})

Hooks.on('simple-calendar-date-time-change', ()=>{
    if (game.materialDeck.enableModule == false || game.materialDeck.ready == false) return;
    game.materialDeck.externalModules.updateAll();
})

Hooks.on('simple-calendar-clock-start-stop', ()=>{
    if (game.materialDeck.enableModule == false || game.materialDeck.ready == false) return;
    game.materialDeck.externalModules.updateAll();
})

Hooks.on('updateTile',()=>{
    if (game.materialDeck.enableModule == false || game.materialDeck.ready == false) return;
    game.materialDeck.externalModules.updateAll();
});

Hooks.once('canvasReady',()=>{
    game.materialDeck.ready = true;
});

Hooks.on("soundscape", (data) => {
    game.materialDeck.externalModules.newSoundscapeData(data);
});

Hooks.on("globalAmbientVolumeChanged", (volume) => {
    game.materialDeck.soundboard.ambientVolumeChanged(volume);
})

Hooks.on('updateMacro', () => {
    if (game.materialDeck.enableModule == false || game.materialDeck.ready == false || game.materialDeck.macroControl == undefined) return;
    game.materialDeck.macroControl.updateAll();
})

Hooks.on('globalPlaylistVolumeChanged', () => {
    if (game.materialDeck.enableModule == false || game.materialDeck.ready == false || game.materialDeck.otherControls == undefined) return;
    game.materialDeck.otherControls.updateAll();
})

Hooks.on('globalAmbientVolumeChanged', () => {
    if (game.materialDeck.enableModule == false || game.materialDeck.ready == false || game.materialDeck.otherControls == undefined) return;
    game.materialDeck.otherControls.updateAll();
})

Hooks.on('globalInterfaceVolumeChanged', () => {
    if (game.materialDeck.enableModule == false || game.materialDeck.ready == false || game.materialDeck.otherControls == undefined) return;
    game.materialDeck.otherControls.updateAll();
})

// Hook to update the state of a button
Hooks.on('MaterialDeck', (data) => {
    switch (data.action) {
        case 'updateButton': {
            let buttonContext = data.buttonContext;
            let deviceContext = data.deviceContext;

            if (!buttonContext) {
                // Find the button context via the buttonId
                if (data.buttonId) {
                    const devices = game.materialDeck.streamDeck.buttonContext;
                    deviceContext = devices.find((device) => device.buttons.find((button) => {
                        if (button?.settings.buttonId === data.buttonId.toString()) {
                            buttonContext = button.context;
                            return true;
                        }
                    }))?.device;
                } else {
                    // No button context, so we can't update the button
                    console.warn('No button context found for button', data.buttonId);
                    return;
                }
            }
            //Set icon on SD
            game.materialDeck.streamDeck.setIcon(buttonContext, deviceContext, data.icon || '<empty>', data.options);
            //Set text on SD
            game.materialDeck.streamDeck.setTitle(data.text, buttonContext);
            // Set state so that the button can be updated when loaded
            game.materialDeck.streamDeck.setButtonState(buttonContext, deviceContext, {
                text: data.text,
                icon: data.icon || '<empty>',
                options: data.options || {}
            });
            break;
        } 
        case 'custom': {
            let buttonContext;
            let deviceContext;
            if (data.buttonId) {
                const devices = game.materialDeck.streamDeck.buttonContext;
                deviceContext = devices.find((device) => device.buttons.find((button) => {
                    if (button?.settings.buttonId === data.buttonId.toString()) {
                        buttonContext = button.context;
                        return true;
                    }
                }))?.device;
            } else {
                // No button context, so we can't update the button
                console.warn('No button context found for button', data.buttonId);
                return;
            }

            //Set icon on SD
            game.materialDeck.streamDeck.setIcon(buttonContext, deviceContext, data.icon || '<empty>', data.options);
            //Set text on SD
            game.materialDeck.streamDeck.setTitle(data.text, buttonContext);
            // Set state so that the button can be updated when loaded

            game.materialDeck.customControl.registerButton({
                buttonId: data.buttonId,
                text: data.text,
                icon: data.icon || '<empty>',
                options: data.options || {},
                keyUp: data.keyUp,
                keyDown: data.keyDown,
                appear: data.appear,
                disappear: data.disappear
            });

            /*
            game.materialDeck.streamDeck.setButtonState(buttonContext, deviceContext, {
                buttonId: data.buttonId,
                text: data.text,
                icon: data.icon || '<empty>',
                options: data.options || {},
                keyUp: data.keyUp,
                keyDown: data.keyDown,
                appear: data.appear,
                disappear: data.disappear
            });
            */
            break;
        }
            
        default:
            console.warn('Unhandled action', data.action);
            break;
    }
});
