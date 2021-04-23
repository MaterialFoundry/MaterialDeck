import * as MODULE from "../MaterialDeck.js";
import {streamDeck} from "../MaterialDeck.js";
import {compatibleCore} from "./misc.js";

export class SceneControl{
    constructor(){
        this.active = false;
        this.rollData = {};
        this.sceneOffset = 0;
    }

    async updateAll(){
        if (this.active == false) return;
        for (let device of streamDeck.buttonContext) {
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
        let ringColor = "#000000";
        let ring = 2;

        let src = "";
        let name = "";
        if (func == 'visible') { //visible scenes
            if (MODULE.getPermission('SCENE','VISIBLE') == false ) {
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
                if (settings.displaySceneIcon) src = scene.img;
                if (scene.active) name += "\n(Active)";
            }
        }
        else if (func == 'dir') {   //from directory
            if (MODULE.getPermission('SCENE','DIRECTORY') == false ) {
                streamDeck.noPermission(context,device);
                return;
            }
            let nr = parseInt(settings.sceneNr);
            if (isNaN(nr) || nr < 1) nr = 1;
            nr--;

            let sceneList = [];
            for (let i=0; i<ui.scenes.tree.children.length; i++){
                const scenesInFolder = compatibleCore("0.8.1") ? ui.scenes.tree.children[i].contents : ui.scenes.tree.children[i].entities;
                for (let j=0; j<scenesInFolder.length; j++)
                    sceneList.push(scenesInFolder[j])
            }
            for (let i=0; i<ui.scenes.tree.content.length; i++)
                sceneList.push(ui.scenes.tree.content[i])

            const scene = sceneList[nr+this.sceneOffset];
            
            if (scene != undefined){
                if (scene.isView) 
                    ringColor = ringOnColor;
                else if (scene.data.navigation && scene.data.permission.default == 0)
                    ringColor = '#000791';
                else if (scene.data.navigation)
                    ringColor = '#2d2d2d';
                else 
                    ringColor = ringOffColor;
                
                if (settings.displaySceneName) name = scene.name;
                if (settings.displaySceneIcon) src = scene.img;
                if (scene.active) name += "\n(Active)";
            }
        }
        else if (func == 'any') {   //by name
            if (MODULE.getPermission('SCENE','NAME') == false ) {
                streamDeck.noPermission(context,device);
                return;
            }
            if (settings.sceneName == undefined || settings.sceneName == '') return;
            let scene = game.scenes.getName(settings.sceneName);

            if (scene != undefined){
                ringColor = scene.isView ? ringOnColor : ringOffColor;
                if (settings.displaySceneName) name = scene.name;
                if (settings.displaySceneIcon) src = scene.img;
                if (scene.active) name += "\n(Active)";
            }
        }
        else if (func == 'active'){
            if (MODULE.getPermission('SCENE','ACTIVE') == false ) {
                streamDeck.noPermission(context,device);
                return;
            }
            const scene = game.scenes.active;
            if (scene == undefined) return;
            if (settings.displaySceneName) name = scene.name;
            if (settings.displaySceneIcon) src = scene.img;
            ring = 0;
        }
        else if (func == 'offset'){
            let offset = parseInt(settings.sceneOffset);
            if (isNaN(offset)) offset = 0;
            ringColor = (offset == this.sceneOffset) ? ringOnColor : ringOffColor;
            src = "modules/MaterialDeck/img/transparant.png";
        }
        streamDeck.setTitle(name,context);
        streamDeck.setIcon(context,device,src,{background:background,ring:ring,ringColor:ringColor});
    }

    keyPress(settings){
        const func = settings.sceneFunction ? settings.sceneFunction : 'visible';

        if (func == 'visible'){ //visible scenes
            if (MODULE.getPermission('SCENE','VISIBLE') == false ) return;
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
            if (MODULE.getPermission('SCENE','DIRECTORY') == false ) return;
            const viewFunc = settings.sceneViewFunction ? settings.sceneViewFunction : 'view';
            let nr = parseInt(settings.sceneNr);
            if (isNaN(nr) || nr < 1) nr = 1;
            nr--;

            let sceneList = [];
            for (let i=0; i<ui.scenes.tree.children.length; i++){
                const scenesInFolder = compatibleCore("0.8.1") ? ui.scenes.tree.children[i].contents : ui.scenes.tree.children[i].entities;
                for (let j=0; j<scenesInFolder.length; j++)
                    sceneList.push(scenesInFolder[j])
            }
            for (let i=0; i<ui.scenes.tree.content.length; i++)
                sceneList.push(ui.scenes.tree.content[i])

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
            if (MODULE.getPermission('SCENE','NAME') == false ) return;
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
            if (MODULE.getPermission('SCENE','ACTIVE') == false ) return;
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