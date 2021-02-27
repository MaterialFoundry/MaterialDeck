import {registerSettings} from "./src/settings.js";
import {StreamDeck} from "./src/streamDeck.js";
import {TokenControl} from "./src/token.js";
import {Move} from "./src/move.js";
import {MacroControl} from "./src/macro.js";
import {CombatTracker} from "./src/combattracker.js";
import {PlaylistControl} from "./src/playlist.js";
import {SoundboardControl} from "./src/soundboard.js";
import {OtherControls} from "./src/othercontrols.js";
import {ExternalModules} from "./src/external.js";
import {SceneControl} from "./src/scene.js";
export var streamDeck;
export var tokenControl;
var move;
export var macroControl;
export var combatTracker;
export var playlistControl;
export var soundboard;
export var otherControls;
export var externalModules;
export var sceneControl;

export const moduleName = "MaterialDeck";
export var selectedTokenId;

let ready = false;
let activeSounds = [];

export let hotbarUses = false;
export let calculateHotbarUses;
       
//CONFIG.debug.hooks = true;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Global variables
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export var enableModule;

//Websocket variables
var ws;                         //Websocket variable
let wsOpen = false;             //Bool for checking if websocket has ever been opened => changes the warning message if there's no connection
let wsInterval;                 //Interval timer to detect disconnections
let WSconnected = false;

//let furnace = game.modules.get("furnace");

/*
 * Analyzes the message received 
 * 
 * @param {*} msg Message received
 */
async function analyzeWSmessage(msg){
    if (enableModule == false) return;
    const data = JSON.parse(msg);
    //console.log("Received",data);

    if (data.type == "connected" && data.data == "SD"){
        const msg = {
            target: "SD",
            type: "init",
            system: game.system.id
        }
        ws.send(JSON.stringify(msg));
        

        console.log("streamdeck connected to server");
        streamDeck.resetImageBuffer();
    }

    if (data.type == "version" && data.source == "SD") {
        /*
        console.log(data);
        const minimumSDversion = game.modules.get("MaterialDeck").data.minimumSDversion.replace('v','');
        const minimumMSversion = game.modules.get("MaterialDeck").data.minimumMSversion;
        console.log('SD',minimumSDversion,data.version)
        if (data.version < minimumSDversion) console.log('SD: nope')
        else console.log('SD: yes');
        */
    }

    if (data == undefined || data.payload == undefined) return;
    //console.log("Received",data);
    const action = data.action;
    const event = data.event;
    const context = data.context;
    const coordinates = data.payload.coordinates;
    if (coordinates == undefined) coordinates = 0;
    const settings = data.payload.settings;

    if (data.data == 'init'){

    }
    if (event == 'willAppear' || event == 'didReceiveSettings'){
        streamDeck.setScreen(action);
        streamDeck.setContext(action,context,coordinates,settings);

        if (action == 'token'){
            tokenControl.active = true;
            tokenControl.update(selectedTokenId);
        }  
        else if (action == 'move')
            move.update(settings,context);
        else if (action == 'macro')
            macroControl.update(settings,context);
        else if (action == 'combattracker')
            combatTracker.update(settings,context);
        else if (action == 'playlist')
            playlistControl.update(settings,context);
        else if (action == 'soundboard')
            soundboard.update(settings,context); 
        else if (action == 'other')
            otherControls.update(settings,context);
        else if (action == 'external')
            externalModules.update(settings,context);
        else if (action == 'scene')
            sceneControl.update(settings,context);
    }
    
    else if (event == 'willDisappear'){
        streamDeck.clearContext(action,coordinates,context);
    }

    else if (event == 'keyDown'){
        if (action == 'token')
            tokenControl.keyPress(settings);
        else if (action == 'move')
            move.keyPress(settings);
        else if (action == 'macro')
            macroControl.keyPress(settings);
        else if (action == 'combattracker')
            combatTracker.keyPress(settings,context);
        else if (action == 'playlist')
            playlistControl.keyPress(settings,context);
        else if (action == 'soundboard')
            soundboard.keyPressDown(settings);
        else if (action == 'other')
            otherControls.keyPress(settings,context);
        else if (action == 'external')
            externalModules.keyPress(settings,context);
        else if (action == 'scene')
            sceneControl.keyPress(settings);
    }

    else if (event == 'keyUp'){
        if (action == 'soundboard'){
            soundboard.keyPressUp(settings);
        }
    }
};

/**
 * Start a new websocket
 * Start a 10s interval, if no connection is made, run resetWS()
 * If connection is made, set interval to 1.5s to check for disconnects
 * If message is received, reset the interval, and send the message to analyzeWSmessage()
 */
function startWebsocket() {
    const address = game.settings.get(moduleName,'address');
    
    const url = address.startsWith('wss://') ? address : ('ws://'+address+'/');

    ws = new WebSocket(url);

    ws.onmessage = function(msg){
        //console.log(msg);
        analyzeWSmessage(msg.data);
        clearInterval(wsInterval);
        wsInterval = setInterval(resetWS, 5000);
    }

    ws.onopen = function() {
        WSconnected = true;
        ui.notifications.info("Material Deck "+game.i18n.localize("MaterialDeck.Notifications.Connected") +": "+address);
        wsOpen = true;
        const msg = {
            target: "server",
            module: "MD"
        }
        ws.send(JSON.stringify(msg));
        const msg2 = {
            target: "SD",
            type: "init",
            system: game.system.id
        }
        ws.send(JSON.stringify(msg2));
        clearInterval(wsInterval);
        wsInterval = setInterval(resetWS, 5000);
    }
  
    clearInterval(wsInterval);
    wsInterval = setInterval(resetWS, 10000);
}

/**
 * Try to reset the websocket if a connection is lost
 */
function resetWS(){
    if (wsOpen) ui.notifications.warn("Material Deck: "+game.i18n.localize("MaterialDeck.Notifications.Disconnected"));
    else ui.notifications.warn("Material Deck: "+game.i18n.localize("MaterialDeck.Notifications.ConnectFail"));
    WSconnected = false;
    startWebsocket();
}

export function sendWS(txt){
    if (WSconnected)
        ws.send(txt);
}

export function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

export function getPermission(action,func) {
    const role = game.user.role-1;
    const settings = game.settings.get(moduleName,'userPermission');
    if (action == 'ENABLE') return settings.enable[role];
    else return settings.permissions?.[action]?.[func]?.[role];
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Hooks
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Ready hook
 * Attempt to open the websocket
 */
Hooks.once('ready', async()=>{
    enableModule = (game.settings.get(moduleName,'Enable')) ? true : false;
    
    
    soundboard = new SoundboardControl();
    streamDeck = new StreamDeck();
    tokenControl = new TokenControl();
    move = new Move();
    macroControl = new MacroControl();
    combatTracker = new CombatTracker();
    playlistControl = new PlaylistControl();
    otherControls = new OtherControls();
    externalModules = new ExternalModules();
    sceneControl = new SceneControl();

    game.socket.on(`module.MaterialDeck`, async(payload) =>{
        //console.log(payload);
        if (payload.msgType == "playSound") playTrack(payload.trackNr,payload.src,payload.play,payload.repeat,payload.volume);  
        else if (game.user.isGM && payload.msgType == "playPlaylist") {
            const playlist = playlistControl.getPlaylist(payload.playlistNr);
            playlistControl.playPlaylist(playlist,payload.playlistNr);
        }
        else if (game.user.isGM && payload.msgType == "playTrack") {
            const playlist = playlistControl.getPlaylist(payload.playlistNr);
            const sounds = playlist.data.sounds;
            for (let track of sounds)
                if (track._id == payload.trackId)
                    playlistControl.playTrack(track,playlist,payload.playlistNr)
        }
        else if (game.user.isGM && payload.msgType == "stopAllPlaylists")
            playlistControl.stopAll(payload.force);
        else if (game.user.isGM && payload.msgType == "soundboardUpdate") {
            await game.settings.set(moduleName,'soundboardSettings',payload.settings);
            const payloadNew = {
                "msgType": "soundboardRefresh"
            };
            game.socket.emit(`module.MaterialDeck`, payloadNew);
        }
        else if (game.user.isGM == false && payload.msgType == "soundboardRefresh" && enableModule)
            soundboard.updateAll();
        else if (game.user.isGM && payload.msgType == "macroboardUpdate") {
            await game.settings.set(moduleName,'macroSettings',payload.settings);
            const payloadNew = {
                "msgType": "macroboardRefresh"
            };
            game.socket.emit(`module.MaterialDeck`, payloadNew);
        }
        else if (game.user.isGM == false && payload.msgType == "macroboardRefresh" && enableModule)
            macroControl.updateAll();
        else if (game.user.isGM && payload.msgType == "playlistUpdate") {
            await game.settings.set(moduleName,'playlists',payload.settings);
            const payloadNew = {
                "msgType": "playlistRefresh"
            };
            game.socket.emit(`module.MaterialDeck`, payloadNew);
        }
        else if (game.user.isGM == false && payload.msgType == "playlistRefresh" && enableModule)
            playlistControl.updateAll();
            
    });

    for (let i=0; i<64; i++)
        activeSounds[i] = false;

    if (enableModule == false) return;
    if (getPermission('ENABLE') == false) {
        ready = true;
        return;
    }

    startWebsocket();

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
    if (soundBoardSettings.colorOff == undefined){
        game.settings.set(moduleName,'soundboardSettings',{
            playlist: "",
            sounds: array,
            colorOn: arrayZero,
            colorOff: arrayZero,
            mode: arrayZero,
            toggle: arrayZero,
            volume: arrayVolume
        });
    }

    const hotbarUsesTemp = game.modules.get("illandril-hotbar-uses");
    if (hotbarUsesTemp != undefined) {
        hotbarUses = true;
    }
    
});

export function playTrack(soundNr,src,play,repeat,volume){
    if (play){
        volume *= game.settings.get("core", "globalInterfaceVolume");

        let howl = new Howl({src, volume, loop: repeat, onend: (id)=>{
            if (repeat == false){
                activeSounds[soundNr] = false;
            }
        },
        onstop: (id)=>{
            activeSounds[soundNr] = false;
        }});
        howl.play();
        activeSounds[soundNr] = howl;
   }
   else {
        activeSounds[soundNr].stop();
        activeSounds[soundNr] = false;
   }
}

Hooks.on('updateToken',(scene,token)=>{
    if (enableModule == false || ready == false) return;
    let tokenId = token._id;
    if (tokenId == selectedTokenId)
        tokenControl.update(selectedTokenId);
    if (macroControl != undefined) macroControl.updateAll();
});

Hooks.on('updateActor',(scene,actor)=>{
    if (enableModule == false || ready == false) return;
    let children = canvas.tokens.children[0].children;
    for (let i=0; i<children.length; i++){
        if (children[i].actor.id == actor._id){
            let tokenId = children[i].id;
            if (tokenId == selectedTokenId)
                tokenControl.update(selectedTokenId);
        }
    }
    if (macroControl != undefined) macroControl.updateAll();
});

Hooks.on('controlToken',(token,controlled)=>{
    if (enableModule == false || ready == false) return;
    if (controlled) {
        selectedTokenId = token.data._id;
    }
    else {
        selectedTokenId = undefined;
    }
    tokenControl.update(selectedTokenId);
    if (macroControl != undefined) macroControl.updateAll();
});

Hooks.on('updateOwnedItem',()=>{
    if (macroControl != undefined) macroControl.updateAll();
})

Hooks.on('renderHotbar', (hotbar)=>{
    if (enableModule == false || ready == false) return;
    if (macroControl != undefined) macroControl.hotbar(hotbar.macros);
});

Hooks.on('renderCombatTracker',()=>{
    if (enableModule == false || ready == false) return;
    if (combatTracker != undefined) combatTracker.updateAll();
    if (tokenControl != undefined) tokenControl.update(selectedTokenId);
});

Hooks.on('renderPlaylistDirectory', (playlistDirectory)=>{
    if (enableModule == false || ready == false) return;
    if (playlistControl != undefined) playlistControl.updateAll();
});

Hooks.on('closeplaylistConfigForm', (form)=>{
    if (enableModule == false || ready == false) return;
    if (form.template == "./modules/MaterialDeck/templates/playlistConfig.html")
        playlistControl.updateAll();
});

Hooks.on('pauseGame',()=>{
    if (enableModule == false || ready == false) return;
    otherControls.updateAll();
});

Hooks.on('renderSidebarTab',()=>{
    if (enableModule == false || ready == false) return;
    if (otherControls != undefined) otherControls.updateAll();
    if (sceneControl != undefined) sceneControl.updateAll();
});

Hooks.on('updateScene',()=>{
    if (enableModule == false || ready == false) return;
    sceneControl.updateAll();
    externalModules.updateAll();
    otherControls.updateAll();
});

Hooks.on('renderSceneControls',()=>{
    if (enableModule == false || ready == false || otherControls == undefined) return;
    otherControls.updateAll();
    externalModules.updateAll();
});

Hooks.on('targetToken',(user,token,targeted)=>{
    if (enableModule == false || ready == false) return;
    if (token.id == selectedTokenId) tokenControl.update(selectedTokenId);
});

Hooks.on('sidebarCollapse',()=>{
    if (enableModule == false || ready == false) return;
    otherControls.updateAll();
});

Hooks.on('renderCompendium',()=>{
    if (enableModule == false || ready == false) return;
    otherControls.updateAll();
});

Hooks.on('closeCompendium',()=>{
    if (enableModule == false || ready == false) return;
    otherControls.updateAll();
});

Hooks.on('renderJournalSheet',()=>{
    if (enableModule == false || ready == false) return;
    otherControls.updateAll();
});

Hooks.on('closeJournalSheet',()=>{
    if (enableModule == false || ready == false) return;
    otherControls.updateAll();
});

Hooks.on('gmScreenOpenClose',(html,isOpen)=>{
    if (enableModule == false || ready == false) return;
    externalModules.updateAll({gmScreen:isOpen});
});

Hooks.on('ShareVision', ()=>{
    if (enableModule == false || ready == false) return;
    externalModules.updateAll();
})

Hooks.on('NotYourTurn', ()=>{
    if (enableModule == false || ready == false) return;
    externalModules.updateAll();
})

Hooks.once('init', ()=>{
    //CONFIG.debug.hooks = true;
    registerSettings(); //in ./src/settings.js
});

Hooks.once('canvasReady',()=>{
    ready = true;
});