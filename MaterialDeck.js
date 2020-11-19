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
let activeSounds = [];
       
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
        console.log("streamdeck connected to server");
    }




    if (data == undefined || data.payload == undefined) return;
      
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
        else if (action == 'soundboard')
            soundboard.keyPressDown(settings);
        else if (action == 'other')
            otherControls.keyPress(settings);
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
    ws = new WebSocket('ws://'+address+'/');

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
            type: "init"
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
    
    
    game.socket.on(`module.MaterialDeck`, (payload) =>{
        //console.log(payload);
        if (payload.msgType != "playSound") return;
        playTrack(payload.trackNr,payload.src,payload.play,payload.repeat,payload.volume);  
    });

    for (let i=0; i<64; i++)
        activeSounds[i] = false;

    if (enableModule == false) return;
    if (game.user.isGM == false) {
        ready = true;
        return;
    }
    
    startWebsocket();
    soundboard = new SoundboardControl();
    streamDeck = new StreamDeck();
    tokenControl = new TokenControl();
    move = new Move();
    macroControl = new MacroControl();
    combatTracker = new CombatTracker();
    playlistControl = new PlaylistControl();
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
    else if (i == 9) val = data.j;
    else if (i == 10) val = data.k;
    else if (i == 11) val = data.l;
    else if (i == 12) val = data.m;
    else if (i == 13) val = data.n;
    else if (i == 14) val = data.o;
    else if (i == 15) val = data.p;
    else if (i == 16) val = data.q;
    else if (i == 17) val = data.r;
    else if (i == 18) val = data.s;
    else if (i == 19) val = data.t;
    else if (i == 20) val = data.u;
    else if (i == 21) val = data.v;
    else if (i == 22) val = data.w;
    else if (i == 23) val = data.x;
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
    else if (i == 9) data.j = val;
    else if (i == 10) data.k = val;
    else if (i == 11) data.l = val;
    else if (i == 12) data.m = val;
    else if (i == 13) data.n = val;
    else if (i == 14) data.o = val;
    else if (i == 15) data.p = val;
    else if (i == 16) data.q = val;
    else if (i == 17) data.r = val;
    else if (i == 18) data.s = val;
    else if (i == 19) data.t = val;
    else if (i == 20) data.u = val;
    else if (i == 21) data.v = val;
    else if (i == 22) data.w = val;
    else if (i == 23) data.x = val;
}