import { getPermission } from "../../MaterialDeck.js";
import { getLastElement, getDocument } from "../misc.js";

export class SceneControl{
    constructor(){
        this.active = false;
        this.rollData = {};
        this.sceneOffset = 0;
    }

    async updateAll(){
        if (this.active == false) return;
        for (let device of game.materialDeck.streamDeck.buttonContext) {
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
        let scene;
        if (func == 'visible') { //visible scenes
            if (getPermission('SCENE','VISIBLE') == false ) {
                game.materialDeck.streamDeck.noPermission(context,device);
                return;
            }
            let nr = parseInt(settings.sceneNr);
            if (isNaN(nr) || nr < 1) nr = 1;
            nr--;

            scene = game.scenes.apps[0].scenes[nr];
            
            if (scene != undefined) ringColor = scene.isView ? ringOnColor : ringOffColor;
        }
        else if (func == 'dir') {   //from directory
            if (getPermission('SCENE','DIRECTORY') == false ) {
                game.materialDeck.streamDeck.noPermission(context,device);
                return;
            }
            let nr = parseInt(settings.sceneNr);
            if (isNaN(nr) || nr < 1) nr = 1;
            nr--;

            let sceneList = [];
            sceneList = ui.scenes.documents;

            scene = sceneList[nr+this.sceneOffset];
            
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
            }
        }
        else if (func == 'any') {   //by name/id
            if (getPermission('SCENE','NAME') == false ) {
                game.materialDeck.streamDeck.noPermission(context,device);
                return;
            }
            scene = getDocument('scene', settings.sceneName);

            if (scene != undefined){
                if (scene.active)
                    ringColor = ringActiveColor;
                else if (scene.isView) 
                    ringColor = ringOnColor;
            }
        }
        else if (func == 'active'){
            if (getPermission('SCENE','ACTIVE') == false ) {
                game.materialDeck.streamDeck.noPermission(context,device);
                return;
            }
            scene = game.scenes.active;
            ring = 0;
        }
        else if (func == 'offset'){
            let offset = parseInt(settings.sceneOffset);
            if (isNaN(offset)) offset = 0;
            ringColor = (offset == this.sceneOffset) ? ringOnColor : ringOffColor;
            src = "modules/MaterialDeck/img/transparant.png";
        }

        let fit;
        if (func != 'offset' && scene != undefined) {
            if (settings.displaySceneName == 'scene') name = scene.name;
            else if (settings.displaySceneName == 'navigation') name = scene.navName;
            if (settings.displaySceneIcon) {
                src = scene.background.src;
                if (src != null) {
                    let split = src.split('.');
                    let format = split[split.length-1].split('?')[0];
            
                    if (format != 'jpg' && format != 'jpeg' && format != 'png' && format != 'PNG' && format != 'webp') {
                        src = scene.thumb;
                        fit = 'banner';
                    } 
                }
                
            }
            if (scene.active && func != 'active') name += "\n(Active)";
        }

        game.materialDeck.streamDeck.setTitle(name,context);
        if (settings.iconOverride != '' && settings.iconOverride != undefined) src = settings.iconOverride;
        game.materialDeck.streamDeck.setIcon(context,device,src,{background:background,ring:ring,ringColor:ringColor, fit});
    }

    keyPress(settings){
        const func = settings.sceneFunction ? settings.sceneFunction : 'visible';

        if (func == 'visible'){ //visible scenes
            if (getPermission('SCENE','VISIBLE') == false ) return;
            let nr = parseInt(settings.sceneNr);
            if (isNaN(nr) || nr < 1) nr = 1;
            nr--;

            this.setScene(game.scenes.apps[0].scenes[nr], settings.sceneViewFunction);
        }
        else if (func == 'dir') {   //from directory
            if (getPermission('SCENE','DIRECTORY') == false ) return;
            let nr = parseInt(settings.sceneNr);
            if (isNaN(nr) || nr < 1) nr = 1;
            nr--;

            let sceneList = [];
            sceneList = ui.scenes.documents;
            const scene = sceneList[nr+this.sceneOffset];
            if (scene == undefined) console.warn(`Could not find scene: "${nr+this.sceneOffset}"`);
            this.setScene(scene, settings.sceneViewFunction);
        }
        else if (func == 'any'){ //by name
            if (getPermission('SCENE','NAME') == false ) return;
            if (settings.sceneName == undefined || settings.sceneName == '') return;
            const scene = getDocument('scene', settings.sceneName);
            if (scene == undefined) console.warn(`Could not find scene: "${settings.sceneName}"`);
            this.setScene(scene, settings.sceneViewFunction);
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

    setScene(scene, viewFunc = 'view') {
        if (scene == undefined) return;

        if (viewFunc == 'view')             scene.view();
        else if (viewFunc == 'activate')    scene.activate();
        else {
            if (scene.isView) scene.activate();
            scene.view();
        }
    }

    getSceneImage(scene) {
        const backgroundImage = scene.background.src;
        if (backgroundImage == null) return null;
        let split = backgroundImage.split('.');
        let format = split[split.length-1].split('?')[0];
 
        if (format != 'jpg' && format != 'jpeg' && format != 'png' && format != 'PNG' && format != 'webp') return scene.thumb;
        return backgroundImage;
    }
}