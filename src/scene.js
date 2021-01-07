import * as MODULE from "../MaterialDeck.js";
import {streamDeck} from "../MaterialDeck.js";

export class SceneControl{
    constructor(){
        this.active = false;
        this.rollData = {};
        this.sceneOffset = 0;
    }

    async updateAll(){
        if (this.active == false) return;
        for (let i=0; i<32; i++){   
            let data = streamDeck.buttonContext[i];
            if (data == undefined || data.action != 'scene') continue;
            await this.update(data.settings,data.context);
        }
    }

    update(settings,context){
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
        if (func == 'visible'){ //visible scenes
            let nr = parseInt(settings.sceneNr);
            if (isNaN(nr) || nr < 1) nr = 1;
            nr--;

            let scene = game.scenes.apps[0].scenes[nr];
            
            if (scene != undefined){
                if (scene.isView) 
                    ringColor = ringOnColor;
                else 
                    ringColor = ringOffColor;
                if (settings.displaySceneName) name = scene.name;
                if (settings.displaySceneIcon) src = scene.img;
                if (scene.active) name += "\n(Active)";
            }
        }
        else if (func == 'dir') {   //from directory
            let nr = parseInt(settings.sceneNr);
            if (isNaN(nr) || nr < 1) nr = 1;
            nr--;

            let sceneList = [];
            for (let i=0; i<ui.scenes.tree.children.length; i++){
                const scenesInFolder = ui.scenes.tree.children[i].entities;
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
            if (settings.sceneName == undefined || settings.sceneName == '') return;
            let scene = game.scenes.apps[1].entities.find(p=>p.data.name == settings.sceneName);
            if (scene != undefined){
                if (scene.isView)
                    ringColor = ringOnColor;
                else 
                    ringColor = ringOffColor;
                if (settings.displaySceneName) name = scene.name;
                if (settings.displaySceneIcon) src = scene.img;
                if (scene.active) name += "\n(Active)";
            }
        }
        else if (func == 'active'){
            const scene = game.scenes.active;
            if (scene == undefined) return;
            if (settings.displaySceneName) name = scene.name;
            if (settings.displaySceneIcon) src = scene.img;
            ring = 0;
        }
        else if (func == 'offset'){
            let offset = parseInt(settings.sceneOffset);
            if (isNaN(offset)) offset = 0;
            if (offset == this.sceneOffset) ringColor = ringOnColor;
            else ringColor = ringOffColor;
        }
        streamDeck.setTitle(name,context);
        streamDeck.setIcon(context,src,background,ring,ringColor);
    }

    keyPress(settings){
        const func = settings.sceneFunction ? settings.sceneFunction : 'visible';

        if (func == 'visible'){ //visible scenes
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
            const viewFunc = settings.sceneViewFunction ? settings.sceneViewFunction : 'view';
            let nr = parseInt(settings.sceneNr);
            if (isNaN(nr) || nr < 1) nr = 1;
            nr--;

            let sceneList = [];
            for (let i=0; i<ui.scenes.tree.children.length; i++){
                const scenesInFolder = ui.scenes.tree.children[i].entities;
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
            if (settings.sceneName == undefined || settings.sceneName == '') return;
            const scenes = game.scenes.entries;
            let scene = game.scenes.apps[1].entities.find(p=>p.data.name == settings.sceneName);
            if (scene == undefined) return;

            let viewFunc = settings.sceneViewFunction;
            if (viewFunc == undefined) viewFunc = 'view';

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