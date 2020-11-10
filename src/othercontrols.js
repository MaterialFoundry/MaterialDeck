import * as MODULE from "../MaterialDeck.js";
import {streamDeck} from "../MaterialDeck.js";

export class OtherControls{
    constructor(){
        this.offset = 0;
    }

    async updateAll(){
        for (let i=0; i<32; i++){   
            let data = streamDeck.buttonContext[i];
            if (data == undefined || data.action != 'other') continue;
            await this.update(data.settings,data.context);
        }
    }

    update(settings,context){
        let mode = settings.otherMode;
        if (mode == undefined) mode = 0;

        if (mode == 0) {    //pause
            this.updatePause(settings.pauseFunction,context);
        }
        else if (mode == 1) {   //scene selection
            this.updateScene(settings,context);
        }
        else if (mode == 2){    //control buttons
            this.updateControl(settings,context);
        }
        else if (mode == 3){    //darkness
            this.updateDarkness(settings,context);
        }
        else if (mode == 4){    //roll tables
            this.updateRollTable(settings,context);
        }
    }

    keyPress(settings){
        let mode = settings.otherMode;
        if (mode == undefined) mode = 0;

        if (mode == 0) {    //pause
            this.keyPressPause(settings.pauseFunction);
        }
        else if (mode == 1) {   //scene
            this.keyPressScene(settings);
        }
        else if (mode == 2) {   //control buttons
            this.keyPressControl(settings);
        }
        else if (mode == 3) {   //darkness controll
            this.keyPressDarkness(settings);
        }
        else if (mode == 4) {   //roll tables
            this.keyPressRollTable(settings);
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////

    updatePause(pauseFunction,context){
        
        if (pauseFunction == undefined) pauseFunction = 0;
        let src = "";
        let name = "";
        let background = "#000000";
        if (pauseFunction == 0){ //Pause game
            if (game.paused) background = "#00FF00"
            src = 'action/images/other/pause/pause.png';
        }
        else if (pauseFunction == 1){ //Resume game
            if (game.paused == false) background = "#00FF00"
            src = 'action/images/other/pause/resume.png';
        }
        else if (pauseFunction == 2) { //toggle
            if (game.paused == false) background = "#00FF00"
            src = 'action/images/other/pause/playpause.png';
        }
        streamDeck.setIcon(0,context,src,background);
        streamDeck.setTitle(name,context);
    }

    keyPressPause(pauseFunction){
        if (pauseFunction == undefined) pauseFunction = 0;
        if (pauseFunction == 0){ //Pause game
            if (game.paused) return; 
            game.togglePause();
        }
        else if (pauseFunction == 1){ //Resume game
            if (game.paused == false) return; 
            game.togglePause();
        }
        else if (pauseFunction == 2) { //toggle
            game.togglePause();
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////

    updateScene(settings,context){
        let func = settings.sceneFunction;
        if (func == undefined) func = 0;

        if (func == 0){ //visible scenes
            let nr = parseInt(settings.sceneNr);
            if (isNaN(nr)) nr = 1;
            nr--;

            let background = settings.background;
            if (background == undefined) background = "#000000";

            let scene = game.scenes.apps[0].scenes[nr];
            let name = "";
            let src = "";
            let ringColor = "#000000";
            let ring = 1;
            
            if (scene != undefined){
                if (scene.isView) {
                    ringColor = "#00FF00";
                    ring = 2;
                }
                if (settings.displaySceneName) name = scene.name;
                if (settings.displaySceneIcon) src = scene.img;
                if (scene.active) name += "\n(Active)";
            }
            streamDeck.setTitle(name,context);
            streamDeck.setIcon(1, context,src,background,ring,ringColor);
        }
        else if (func == 1) {   //all scenes
            let name = settings.sceneName;
            if (name == undefined) return;

            let background = settings.background;
            if (background == undefined) background = "#000000";

            let src = "";
            let ringColor = "#000000";
            let ring = 1;
            let scene = game.scenes.apps[1].entities.find(p=>p.data.name == name);
            name = "";
            if (scene != undefined){
                if (scene.isView) {
                    ringColor = "#00FF00";
                    ring = 2;
                }
                if (settings.displaySceneName) name = scene.name;
                if (settings.displaySceneIcon) src = scene.img;
                if (scene.active) name += "\n(Active)";
            }
            streamDeck.setTitle(name,context);
            streamDeck.setIcon(1, context,src,background,ring,ringColor);
        }
    }

    keyPressScene(settings){
        let func = settings.sceneFunction;
        if (func == undefined) func = 0;
        if (func == 0){ //visible scenes
            let viewFunc = settings.sceneViewFunction;
            if (viewFunc == undefined) viewFunc = 0;

            let nr = parseInt(settings.sceneNr);
            if (isNaN(nr)) nr = 1;
            nr--;
            let scene = game.scenes.apps[0].scenes[nr];
            
            if (scene != undefined){
                if (viewFunc == 0){
                    scene.view();
                }
                else if (viewFunc == 1){
                    scene.activate();
                }
                else {
                    if (scene.isView) scene.activate();
                    scene.view();
                }
            }
            
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////
    
    updateControl(settings,context){
        let control = settings.control;
        if (control == undefined) control = 0;

        let tool = settings.tool;
        if (tool == undefined) tool = 0;

        const controlName = this.getControlName(control);
        const toolName = this.getToolName(control,tool);

        let txt = "";
        let src = "";
        let background = "#000000";
        let ringColor = "#FF7B00"
        let selectedControl;
        let selectedTool;
        let ring = 1;
        let activeControl = ui.controls.activeControl;
        let activeTool = ui.controls.activeTool;

        if (control == 0){
            let controlNr = parseInt(settings.controlNr);
            if (isNaN(controlNr)) controlNr = 1;
            controlNr--;

            selectedControl = ui.controls.controls.find(c => c.name == ui.controls.activeControl);
            if (selectedControl != undefined){
                selectedTool = selectedControl.tools[controlNr];
                if (selectedTool != undefined){
                    txt = game.i18n.localize(selectedTool.title);
                    src = selectedTool.icon;
                    if (selectedTool.toggle){
                        background = "#340057"
                        if (selectedTool.active)
                            ringColor = "#A600FF"
                        else    
                            ringColor = "#340057"
                        ring = 2;
                    }
                    else if (activeTool == selectedTool.name)
                        ring = 2;
                }  
            }
        }
        else {
            selectedControl = ui.controls.controls.find(c => c.name == controlName);
            if (selectedControl != undefined){
                if (tool == 0){  //open category
                        txt = game.i18n.localize(selectedControl.title);
                        src = selectedControl.icon;
                        if (activeControl == selectedControl.name)
                            ring = 2;
                }
                else {
                    selectedTool = selectedControl.tools.find(t => t.name == toolName);
                    if (selectedTool != undefined){
                        txt = game.i18n.localize(selectedTool.title);
                        src = selectedTool.icon;
                        if (selectedTool.toggle){
                            background = "#340057"
                            if (selectedTool.active)
                                ringColor = "#A600FF"
                            else    
                                ringColor = "#340057"
                            ring = 2;
                        }
                        else if (activeTool == selectedTool.name && activeControl == selectedControl.name)
                            ring = 2;
                    }
                }
            }
        }
        streamDeck.setIcon(1,context,src,background,ring,ringColor);
        streamDeck.setTitle(txt,context);
    }

    keyPressControl(settings){
        let control = settings.control;
        if (control == undefined) control = 0;

        let tool = settings.tool;
        if (tool == undefined) tool = 0;

        const controlName = this.getControlName(control);
        const toolName = this.getToolName(control,tool);
        
        if (control == 0){  //displayed tools
            let controlNr = parseInt(settings.controlNr);
            if (isNaN(controlNr)) controlNr = 1;
            controlNr--;
            let selectedControl = ui.controls.controls.find(c => c.name == ui.controls.activeControl);
            if (selectedControl != undefined){
                let selectedTool = selectedControl.tools[controlNr];
                if (selectedTool != undefined){
                    if (selectedTool.toggle){
                        let newValue = !selectedTool.active;
                        selectedTool.active = newValue;
                    }
                    else if (selectedTool.button){
                        selectedTool.onClick();
                    }
                    else
                        selectedControl.activeTool = selectedTool.name;
                    ui.controls.render();
                }  
            }
        }
        else {  //select control
            let selectedControl = ui.controls.controls.find(c => c.name == controlName);
            if (selectedControl != undefined){
                if (tool == 0){  //open category
                    ui.controls.activeControl = controlName;
                    selectedControl.activeTool = selectedControl.activeTool;
                    canvas.getLayer(selectedControl.layer).activate();
                }
                else {
                    let selectedTool = selectedControl.tools.find(t => t.name == toolName);
                    if (selectedTool != undefined){
                        ui.controls.activeControl = controlName;
                        canvas.getLayer(selectedControl.layer).activate();
                        if (selectedTool.toggle){
                            let newValue = !selectedTool.active;
                            selectedTool.active = newValue;
                        }
                        else if (selectedTool.button){
                            selectedTool.onClick();
                        }
                        else
                            selectedControl.activeTool = toolName;
                    }
                }
                ui.controls.render();
            }
        }  
    }





//ui.controls.controls.find(c => c.name == 'token')
//ui.controls.controls.find(c => c.name == 'walls').tools.find(t => t.name == 'snap').active=false
//ui.controls.render()

    getControlName(control){
        control--;
        let name;
        if (control == 0) name = 'token';
        else if (control == 1) name = 'measure';
        else if (control == 2) name = 'tiles';
        else if (control == 3) name = 'drawings';
        else if (control == 4) name = 'walls';
        else if (control == 5) name = 'lighting';
        else if (control == 6) name = 'sounds';
        else if (control == 7) name = 'notes';
        return name;
    }

    getToolName(control,tool){
        control--;
        tool--;
        let name;
        if (control == 0){  //basic controls
            if (tool == 0) name = 'select';
            else if (tool == 1) name = 'target';
            else if (tool == 2) name = 'ruler';
        }
        else if (control == 1){  //measurement controls
            if (tool == 0) name = 'circle';
            else if (tool == 1) name = 'cone';
            else if (tool == 2) name = 'rect';
            else if (tool == 3) name = 'ray';
            else if (tool == 4) name = 'clear';
        }
        else if (control == 2){  //tile controls
            if (tool == 0) name = 'select';
            else if (tool == 1) name = 'tile';
            else if (tool == 2) name = 'browse';
        }
        else if (control == 3){  //drawing tools
            if (tool == 0) name = 'select';
            else if (tool == 1) name = 'rect';
            else if (tool == 2) name = 'ellipse';
            else if (tool == 3) name = 'polygon';
            else if (tool == 4) name = 'freehand';
            else if (tool == 5) name = 'text';
            else if (tool == 6) name = 'configure';
            else if (tool == 7) name = 'clear';
        }
        else if (control == 4){  //wall controls
            if (tool == 0) name = 'select';
            else if (tool == 1) name = 'walls';
            else if (tool == 2) name = 'terrain';
            else if (tool == 3) name = 'invisible';
            else if (tool == 4) name = 'ethereal';
            else if (tool == 5) name = 'doors';
            else if (tool == 6) name = 'secret';
            else if (tool == 7) name = 'clone';
            else if (tool == 8) name = 'snap';
            else if (tool == 9) name = 'clear';
        }
        else if (control == 5){  //lighting controls
            if (tool == 0) name = 'light';
            else if (tool == 1) name = 'day';
            else if (tool == 2) name = 'night';
            else if (tool == 3) name = 'reset';
            else if (tool == 4) name = 'clear';
        }
        else if (control == 6){  //ambient sound controls
            if (tool == 0) name = 'sound';
            else if (tool == 1) name = 'clear';
        }
        else if (control == 7){  //journal notes
            if (tool == 0) name = 'select';
            else if (tool == 1) name = 'toggle';
            else if (tool == 2) name = 'clear';
        }
        return name;
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    updateDarkness(settings,context){
        let func = settings.darknessFunction;
        if (func == undefined) func = 0;

        let value = settings.darknessValue;
        if (value == undefined) value = 0;

        let background = settings.background;
        if (background == undefined) background = "#000000";

        let src = "";
        let txt = "";

        if (func == 0){ //value
            src = 'action/images/other/darkness/darkness.png';
        }
        else if (func == 1){ //increase/decrease
            if (value < 0) src = 'action/images/other/darkness/decreasedarkness.png';
            else src = 'action/images/other/darkness/increasedarkness.png';
        }
        else if (func == 2){    //display darkness
            src = 'action/images/other/darkness/darkness.png';
            let darkness = Math.floor(canvas.scene.data.darkness*100)/100;
            txt += darkness;
        }
        streamDeck.setTitle(txt,context);
        streamDeck.setIcon(0, context,src,background);
    }

    keyPressDarkness(settings) {
        let func = settings.darknessFunction;
        if (func == undefined) func = 0;

        let value = parseFloat(settings.darknessValue);
        if (value == undefined) value = 0;

        if (func == 0){ //value
            canvas.scene.update({darkness: value});
        }
        else if (func == 1){ //increase/decrease
            let darkness = canvas.scene.data.darkness;
            darkness += -1*value;
            if (darkness > 1) darkness = 1;
            if (darkness < 0) darkness = 0;
            canvas.scene.update({darkness: darkness});
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    updateRollTable(settings,context){
        let name = settings.rollTableName;
        if (name == undefined) return;

        let background = settings.background;
        if (background == undefined) background = "#000000";

        let table = game.tables.entities.find(p=>p.name == name);

        let txt = "";
        let src = "";

        if (table != undefined) {
            if (settings.displayRollIcon) src = table.data.img;
            if (settings.displayRollName) txt = table.name;
        }
        streamDeck.setTitle(txt,context);
        streamDeck.setIcon(1, context,src,background);
    }

    keyPressRollTable(settings){
        let func = settings.rolltableFunction;
        if (func == undefined) func = 0;

        let name = settings.rollTableName;
        if (name == undefined) return;

        let background = settings.background;
        if (background == undefined) background = "#000000";

        let table = game.tables.entities.find(p=>p.name == name);

        if (table != undefined) {
            if (func == 0){ //open
                table.sheet.render(true);
            }
            else if (func == 1) {//Public roll
                table.draw({rollMode:"roll"});
            }
            else if (func == 2) {//private roll
                table.draw({rollMode:"selfroll"});
            }
        }
    }
}