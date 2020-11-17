import {registerSettings} from "./src/settings.js";
import {StreamDeck} from "./src/streamDeck.js";
import {TokenControl} from "./src/token.js";
import {Move} from "./src/move.js";
import {MacroControl} from "./src/macro.js";
import {CombatTracker} from "./src/combattracker.js";
import {PlaylistControl} from "./src/playlist.js";
import {SoundboardControl} from "./src/soundboard.js";
import {OtherControls} from "./src/othercontrols.js";
export var streamDeck;
export var tokenControl;
var move;
export var macroControl;
export var combatTracker;
export var playlistControl;
export var soundboard;
export var otherControls;

export const moduleName = "MaterialDeck";
export var selectedTokenId;

let ready = false;
//CONFIG.debug.hooks = true;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Global variables
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var enableModule;

//Websocket variables
let ip = "localhost";       //Ip address of the websocket server
let port = "3003";                //Port of the websocket server
var ws;                         //Websocket variable
let wsOpen = false;             //Bool for checking if websocket has ever been opened => changes the warning message if there's no connection
let wsInterval;                 //Interval timer to detect disconnections
let WSconnected = false;

/*
 * Analyzes the message received 
 * 
 * @param {*} msg Message received
 */
async function analyzeWSmessage(msg,passthrough = false){
    if (enableModule == false) return;
    const data = JSON.parse(msg);
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
    }
    
    else if (event == 'willDisappear'){
        streamDeck.clearContext(action,coordinates);
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
        else if (action == 'soundboard'){
            soundboard.keyPressDown(settings);
        }
    }

    else if (event == 'keyUp'){
        if (action == 'soundboard'){
            soundboard.keyPressUp(settings);
        }
        else if (action == 'other')
            otherControls.keyPress(settings);
    }
};

/**
 * Start a new websocket
 * Start a 10s interval, if no connection is made, run resetWS()
 * If connection is made, set interval to 1.5s to check for disconnects
 * If message is received, reset the interval, and send the message to analyzeWSmessage()
 */
function startWebsocket() {
    //ip = localhost;
    ws = new WebSocket('ws://'+ip+':'+port+'/1');

    ws.onmessage = function(msg){
        //console.log(msg);
        
        analyzeWSmessage(msg.data);
        clearInterval(wsInterval);
        wsInterval = setInterval(resetWS, 5000);
    }

    ws.onopen = function() {
        WSconnected = true;
        ui.notifications.info("Material Deck "+game.i18n.localize("MaterialDeck.Notifications.Connected") +": "+ip+':'+port);
        wsOpen = true;
        let msg = {
            type: "Foundry"
        }
        ws.send(JSON.stringify(msg));
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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Hooks
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Ready hook
 * Attempt to open the websocket
 */
Hooks.once('ready', ()=>{
    enableModule = (game.settings.get(moduleName,'Enable')) ? true : false;
    if (enableModule == false) return;
    
    game.socket.on(`module.MaterialDeck`, (payload) =>{
        //console.log(payload);
        if (payload.msgType != "playSound") return;
        playTrack(payload.trackNr,payload.play,payload.repeat,payload.volume);  
    });

    if (game.user.isGM == false) {
        ready = true;
        return;
    }
    
    startWebsocket();

    streamDeck = new StreamDeck();
    tokenControl = new TokenControl();
    move = new Move();
    macroControl = new MacroControl();
    combatTracker = new CombatTracker();
    playlistControl = new PlaylistControl();
    soundboard = new SoundboardControl();
    otherControls = new OtherControls();


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
    
});

export function playTrack(soundNr,play,repeat,volume){
    if (play){
        let trackId = game.settings.get(moduleName,'soundboardSettings').sounds[soundNr];
        let playlistId = game.settings.get(moduleName,'soundboardSettings').playlist;
        let sounds = game.playlists.entities.find(p => p._id == playlistId).data.sounds;
        let sound = sounds.find(p => p._id == trackId);
        if (sound == undefined){
            activeSounds[soundNr] = false;
            return;
        }
        volume *= game.settings.get("core", "globalInterfaceVolume");
        let src = sound.path;

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
   }
}

Hooks.on('updateToken',(scene,token)=>{
    if (enableModule == false || ready == false) return;
    let tokenId = token._id;
    if (tokenId == selectedTokenId)
        tokenControl.update(selectedTokenId);
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
});

Hooks.on('renderHotbar', (hotbar)=>{
    if (enableModule == false || ready == false) return;
    macroControl.hotbar(hotbar.macros);
});

Hooks.on('renderCombatTracker',()=>{
    if (enableModule == false || ready == false) return;
    combatTracker.updateAll();
    tokenControl.update(selectedTokenId);
});

Hooks.on('renderPlaylistDirectory', (playlistDirectory)=>{
    if (enableModule == false || ready == false) return;
    playlistControl.updateAll();
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
    otherControls.updateAll();
});

Hooks.on('updateScene',()=>{
    if (enableModule == false || ready == false) return;
    otherControls.updateAll();
});

Hooks.on('renderSceneControls',()=>{
    if (enableModule == false || ready == false) return;
    otherControls.updateAll();
});

Hooks.on('targetToken',(user,token,targeted)=>{
    if (enableModule == false || ready == false) return;
    if (token.id == selectedTokenId) tokenControl.update(selectedTokenId);
});

  Hooks.once('init', ()=>{
    //CONFIG.debug.hooks = true;
    registerSettings(); //in ./src/settings.js
});

Hooks.once('canvasReady',()=>{
    ready = true;
});

export function getFromJSONArray(data,i){
    if (i>9) return 'nul';
    let val;
    if (i == 0) val = data.a;
    else if (i == 1) val = data.a;
    else if (i == 2) val = data.c;
    else if (i == 3) val = data.d;
    else if (i == 4) val = data.e;
    else if (i == 5) val = data.f;
    else if (i == 6) val = data.g;
    else if (i == 7) val = data.h;
    else if (i == 8) val = data.i;
    return val;
}

export function setToJSONArray(data,i,val){
    if (i>9) return 'nul';
    if (i == 0) data.a = val;
    else if (i == 1) data.b = val;
    else if (i == 2) data.c = val;
    else if (i == 3) data.d = val;
    else if (i == 4) data.e = val;
    else if (i == 5) data.f = val;
    else if (i == 6) data.g = val;
    else if (i == 7) data.h = val;
    else if (i == 8) data.i = val;
}