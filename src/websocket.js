import { moduleName, versions } from "../MaterialDeck.js";
import { compareVersions } from "./misc.js";

//Websocket variables
var ws;                         //Websocket variable
let wsOpen = false;             //Bool for checking if websocket has ever been opened => changes the warning message if there's no connection
let wsInterval;                 //Interval timer to detect disconnections
let WSconnected = false;
let connectFailedMsg = false;
let connectionAttempts = 0;

/*
 * Analyzes the message received 
 * 
 * @param {*} msg Message received
 */
async function analyzeWSmessage(msg){
    if (game.materialDeck.enableModule == false) return;
    const data = JSON.parse(msg);
    //console.log("Received",data);

    // Ping
    if (data.T == "P") {
        return;
    }

    if (data.type == "connected"){
        transmitInitData();

        let sdNok = false;
        let msNok = false;
        if (data.materialCompanionVersion) {
            versions.materialCompanion.current = data.materialCompanionVersion;
            if (!compareVersions(versions.materialCompanion.minimum, versions.materialCompanion.current)) {
                msNok = true;
            }
        }
        if (data.pluginVersion) {
            versions.plugin.current = data.pluginVersion;
            if (!compareVersions(versions.plugin.minimum, versions.plugin.current)) {
                sdNok = true;
            }
        }
        if (msNok || sdNok) {
            let content = '';
            if (sdNok && msNok) content += `${game.i18n.localize("MaterialDeck.UpdateRequired.Both")}<br><br>`;
            else if (sdNok) content += `${game.i18n.localize("MaterialDeck.UpdateRequired.SD")}<br><br>`;
            else if (msNok) content += `${game.i18n.localize("MaterialDeck.UpdateRequired.MC")}<br><br>`;

            content += `${game.i18n.localize("MaterialDeck.UpdateRequired.Update")}<br><br>`;

            if (sdNok) content += `<a href="${releaseURLs.plugin.url}">${game.i18n.localize("MaterialDeck.UpdateRequired.SDdownload")}</a><br>`;
            if (msNok) content += `<a href="${releaseURLs.materialCompanion.url}">Material Companion</a><br>`;
            content += "<br>"

            new Dialog({
                title: game.i18n.localize("MaterialDeck.UpdateRequired.Title"),
              content,
              buttons: {
                download: {
                 icon: '<i class="fas fa-download"></i>',
                 label: "Download Utility",
                 callback: () => new downloadUtility()
                },
                ignore: {
                 icon: '<i class="fas fa-times"></i>',
                 label: "Ignore"
                }
               },
               default: "download"
            }).render(true);
        }

        console.log("streamdeck connected to Material Companion", versions.materialCompanion.current);
        game.materialDeck.streamDeck.resetImageBuffer();
    }

    if (data.type == 'newDevice') {
        game.materialDeck.streamDeck.newDevice(data.iteration,data.device);
        return;
    }

    if (data == undefined || data.payload == undefined) return;
    const action = data.action;
    const event = data.event;
    const context = data.context;
    const coordinates = data.payload.coordinates;
    const settings = data.payload.settings;
    const device = data.device;
    const name = data.deviceName;
    const type = data.deviceType;

    if (data.data == 'init'){

    }

    if (event == 'willAppear' || event == 'didReceiveSettings'){
        if (coordinates == undefined) return;
        game.materialDeck.streamDeck.setScreen(action);
        await game.materialDeck.streamDeck.setContext(device,data.size,data.deviceIteration,action,context,coordinates,settings,name,type);

        if (action == 'token'){
            game.materialDeck.tokenControl.active = true;
            //game.materialDeck.tokenControl.pushData(canvas.tokens.controlled[0]?.id,settings,context,device);
            game.materialDeck.tokenControl.pushData({
                tokenId: canvas.tokens.controlled[0]?.id,
                settings,
                context,
                device
            });
        }  
        else if (action == 'macro')
            game.materialDeck.macroControl.update(settings,context,device);
        else if (action == 'combattracker')
            game.materialDeck.combatTracker.update(settings,context,device);
        else if (action == 'playlist')
            game.materialDeck.playlistControl.update(settings,context,device);
        else if (action == 'soundboard')
            game.materialDeck.soundboard.update(settings,context,device); 
        else if (action == 'other')
            game.materialDeck.otherControls.update(settings,context,device);
        else if (action == 'external')
            game.materialDeck.externalModules.update(settings,context,device);
        else if (action == 'scene')
            game.materialDeck.sceneControl.update(settings,context,device);
        else if (action == 'custom')
            game.materialDeck.customControl.appear(settings, context, device);
    }
    
    else if (event == 'willDisappear'){
        if (action == 'custom')
            game.materialDeck.customControl.disappear(settings, context, device);
        if (coordinates == undefined) return;
        game.materialDeck.streamDeck.clearContext(device,action,coordinates,context);
    }

    else if (event == 'keyDown'){

        if (action == 'token')
            game.materialDeck.tokenControl.keyPress(settings);
        else if (action == 'macro')
            game.materialDeck.macroControl.keyPress({
                device,
                context,
                ...settings,
            });
        else if (action == 'combattracker')
            game.materialDeck.combatTracker.keyPress(settings,context,device);
        else if (action == 'playlist')
            game.materialDeck.playlistControl.keyPress(settings,context,device);
        else if (action == 'soundboard')
            game.materialDeck.soundboard.keyPressDown(settings);
        else if (action == 'other')
            game.materialDeck.otherControls.keyPress(settings,context,device);
        else if (action == 'external')
            game.materialDeck.externalModules.keyPress(settings,context,device);
        else if (action == 'scene')
            game.materialDeck.sceneControl.keyPress(settings);
        else if (action == 'custom')
            game.materialDeck.customControl.keyDown(settings, context, device);
    }

    else if (event == 'keyUp'){
        if (action == 'soundboard')
            game.materialDeck.soundboard.keyPressUp(settings);
        else if (action == 'custom')
            game.materialDeck.customControl.keyUp(settings, context, device);
    }
};

/**
 * Start a new websocket
 * Start a 10s interval, if no connection is made, run resetWS()
 * If connection is made, set interval to 1.5s to check for disconnects
 * If message is received, reset the interval, and send the message to analyzeWSmessage()
 */
export function startWebsocket() {
    if (game.materialDeck.enableModule == false) return;
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
        connectionAttempts = 0;
        WSconnected = true;
        ui.notifications.info("Material Deck "+game.i18n.localize("MaterialDeck.Notifications.Connected") +": "+address);
        wsOpen = true;
        const msg = {
            target: "MaterialCompanion",
            source: "MaterialDeck_Foundry",
            sourceTarget: "MaterialDeck_Device",
            type: "connected",
            userId: game.userId,
            userName: game.user.name,
            version: game.modules.get(moduleName).version
        }
        ws.send(JSON.stringify(msg));
        transmitInitData();
        clearInterval(wsInterval);
        wsInterval = setInterval(resetWS, 5000);
    }
  
    clearInterval(wsInterval);
    wsInterval = setInterval(resetWS, 10000);
}

export function transmitInitData() {
    const msg = {
        target: "MaterialDeck_Device",
        type: "init",
        userId: game.userId,
        system: game.materialDeck.systemHelper?.systemLoaded ? game.materialDeck.getGamingSystem() : undefined,
        systemData: game.materialDeck.systemHelper?.systemData,
        coreVersion: game.version.split('.')[0]
    }
    sendWS(JSON.stringify(msg));
}

/**
 * Try to reset the websocket if a connection is lost
 */
function resetWS(){
    const maxAttempts = game.settings.get(moduleName, 'nrOfConnMessages');

    if (maxAttempts != 0 && connectionAttempts >= maxAttempts+1) return;

    if (wsOpen) {
        ui.notifications.warn("Material Deck: "+game.i18n.localize("MaterialDeck.Notifications.Disconnected"));
        wsOpen = false;
        connectionAttempts = 0;
        WSconnected = false;
        startWebsocket();
    }
    else if (ws.readyState == 3){
        WSconnected = false;
        if (!connectFailedMsg) {
            if (maxAttempts != 0 && connectionAttempts == maxAttempts) {
                connectionAttempts++;
                ui.notifications.warn("Material Deck: " + game.i18n.localize("MaterialDeck.Notifications.MaxAttemptsReached"));
            }
            else {
                connectionAttempts++;
                ui.notifications.warn("Material Deck: " + game.i18n.localize("MaterialDeck.Notifications.ConnectFail") + (maxAttempts != 0 ? ` (${connectionAttempts}/${maxAttempts})` : ``));
                connectFailedMsg = true;
                setTimeout(()=>{
                    connectFailedMsg = false;
                    startWebsocket();
                },10000)
            }
        }
    }
}

export function sendWS(txt){
    if (WSconnected)
        ws.send(txt);
}