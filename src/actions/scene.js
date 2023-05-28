import { streamDeck, getPermission } from "../../MaterialDeck.js";
import {  } from "../misc.js";

export class SceneControl{
    constructor(){
        this.active = false;
        this.rollData = {};
        this.sceneOffset = 0;
    }

    async updateAll(){
        if (this.active == false) return;
        for (let device of streamDeck.buttonContext) {
            if (device?.buttons == undefined) continue;
            for (let i=0; i<device.buttons.length; i++){   
                const data = device.buttons[i];
                if (data == undefined || data.action != 'scene') continue;
                await this.update(data.settings,data.context,device.device);
            }
        }
    }

    update(settings,context,device){
        if (canvas.scene == null) return;
        this.active = true;
        const func = settings.sceneFunction ? settings.sceneFunction : 'visible';
        const background = settings.background ? settings.background : '#000000';
        const ringOffColor = settings.offRing ? settings.offRing : '#000000';
        const ringOnColor = settings.onRing ? settings.onRing : '#00FF00';
        const ringActiveColor = settings.activeRing ? settings.activeRing : '#FFFF00'
        let ringColor = "#000000";
        let ring = 2;

        let src = "";
        let name = "";
        if (func == 'visible') { //visible scenes
            if (getPermission('SCENE','VISIBLE') == false ) {
                streamDeck.noPermission(context,device);
                return;
            }
            let nr = parseInt(settings.sceneNr);
            if (isNaN(nr) || nr < 1) nr = 1;
            nr--;

            let scene = game.scenes.apps[0].scenes[nr];
            
            if (scene != undefined){
                ringColor = scene.isView ? ringOnColor : ringOffColor;
                if (settings.displaySceneName) name = scene.name;
                if (settings.displaySceneIcon) src = scene.background.src;
                if (scene.active) name += "\n(Active)";
            }
        }
        else if (func == 'dir') {   //from directory
            if (getPermission('SCENE','DIRECTORY') == false ) {
                streamDeck.noPermission(context,device);
                return;
            }
            let nr = parseInt(settings.sceneNr);
            if (isNaN(nr) || nr < 1) nr = 1;
            nr--;

            let sceneList = [];
            sceneList = ui.scenes.documents;

            const scene = sceneList[nr+this.sceneOffset];
            
            if (scene != undefined){
                if (scene.active)
                    ringColor = ringActiveColor;
                else if (scene.isView) 
                    ringColor = ringOnColor;
                else if (scene.navigation && scene.permission.default == 0)
                    ringColor = '#000791';
                else if (scene.navigation)
                    ringColor = '#2d2d2d';
                else 
                    ringColor = ringOffColor;
                
                if (settings.displaySceneName) name = scene.name;
                if (settings.displaySceneIcon) src = scene.background.src;
                if (scene.active) name += "\n(Active)";
            }
        }
        else if (func == 'any') {   //by name
            if (getPermission('SCENE','NAME') == false ) {
                streamDeck.noPermission(context,device);
                return;
            }
            if (settings.sceneName == undefined || settings.sceneName == '') return;
            let scene = game.scenes.getName(settings.sceneName);

            if (scene != undefined){
                if (scene.active)
                    ringColor = ringActiveColor;
                else if (scene.isView) 
                    ringColor = ringOnColor;
                if (settings.displaySceneName) name = scene.name;
                if (settings.displaySceneIcon) src = scene.background.src;
                if (scene.active) name += "\n(Active)";
            }
        }
        else if (func == 'active'){
            if (getPermission('SCENE','ACTIVE') == false ) {
                streamDeck.noPermission(context,device);
                return;
            }
            const scene = game.scenes.active;
            if (scene == undefined) return;
            if (settings.displaySceneName) name = scene.name;
            if (settings.displaySceneIcon) src = scene.background.src;
            ring = 0;
        }
        else if (func == 'offset'){
            let offset = parseInt(settings.sceneOffset);
            if (isNaN(offset)) offset = 0;
            ringColor = (offset == this.sceneOffset) ? ringOnColor : ringOffColor;
            src = "modules/MaterialDeck/img/transparant.png";
        }
        streamDeck.setTitle(name,context);
        if (settings.iconOverride != '' && settings.iconOverride != undefined) src = settings.iconOverride;
        streamDeck.setIcon(context,device,src,{background:background,ring:ring,ringColor:ringColor});
    }

    keyPress(settings){
        const func = settings.sceneFunction ? settings.sceneFunction : 'visible';

        if (func == 'visible'){ //visible scenes
            if (getPermission('SCENE','VISIBLE') == false ) return;
            const viewFunc = settings.sceneViewFunction ? settings.sceneViewFunction : 'view';
            let nr = parseInt(settings.sceneNr);
            if (isNaN(nr) || nr < 1) nr = 1;
            nr--;
            let scene = game.scenes.apps[0].scenes[nr];
            
            if (scene != undefined){
                if (viewFunc == 'view'){
                    scene.view();
                }
                else if (viewFunc == 'activate'){
                    scene.activate();
                }
                else {
                    if (scene.isView) scene.activate();
                    scene.view();
                }
            }  
        }
        else if (func == 'dir') {   //from directory
            if (getPermission('SCENE','DIRECTORY') == false ) return;
            const viewFunc = settings.sceneViewFunction ? settings.sceneViewFunction : 'view';
            let nr = parseInt(settings.sceneNr);
            if (isNaN(nr) || nr < 1) nr = 1;
            nr--;

            let sceneList = [];
            sceneList = ui.scenes.documents;
            
            const scene = sceneList[nr+this.sceneOffset];

            if (scene != undefined){
                if (viewFunc == 'view'){
                    scene.view();
                }
                else if (viewFunc == 'activate'){
                    scene.activate();
                }
                else {
                    if (scene.isView) scene.activate();
                    scene.view();
                }
            }  

        }
        else if (func == 'any'){ //by name
            if (getPermission('SCENE','NAME') == false ) return;
            if (settings.sceneName == undefined || settings.sceneName == '') return;
            const scenes = game.scenes.entries;
            let scene = game.scenes.getName(settings.sceneName);
            if (scene == undefined) return;

            const viewFunc = settings.sceneViewFunction ? settings.sceneViewFunction : 'view';

            if (viewFunc == 'view'){
                scene.view();
            }
            else if (viewFunc == 'activate'){
                scene.activate();
            }
            else {
                if (scene.isView) scene.activate();
                scene.view();
            }
        }
        else if (func == 'active'){
            if (getPermission('SCENE','ACTIVE') == false ) return;
            const scene = game.scenes.active;
            if (scene == undefined) return;
            scene.view();
        }
        else if (func == 'offset'){
            let offset = parseInt(settings.sceneOffset);
            if (isNaN(offset)) offset = 0;
            this.sceneOffset = offset;
            this.updateAll();
        }
    }
}