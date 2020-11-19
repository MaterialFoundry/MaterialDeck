import * as MODULE from "../MaterialDeck.js";
import {streamDeck} from "../MaterialDeck.js";

export class OtherControls{
    constructor(){
        this.active = false;
        this.offset = 0;
    }

    async updateAll(){
        if (this.active == false) return;
        for (let i=0; i<32; i++){   
            let data = streamDeck.buttonContext[i];
            if (data == undefined || data.action != 'other') continue;
            await this.update(data.settings,data.context);
        }
    }

    update(settings,context){
        this.active = true;
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
        else if (mode == 5) {   //open sidebar tab
            this.updateSidebar(settings,context);
        }
        else if (mode == 6) {   //open compendium
            this.updateCompendium(settings,context);
        }
        else if (mode == 7) {   //open journal
            this.updateJournal(settings,context);
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
        else if (mode == 5) {   //sidebar
            this.keyPressSidebar(settings);
        }
        else if (mode == 6) {   //open compendium
            this.keyPressCompendium(settings);
        }
        else if (mode == 7) {   //open journal
            this.keyPressJournal(settings);
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////

    updatePause(pauseFunction,context){
        let src = "";
        if (pauseFunction == undefined) pauseFunction = 0;
        
        let background = settings.background;
        if(background == undefined) background = '#000000';

        let ringColor = "#000000";

        let ringOffColor = settings.offRing;
        if (ringOffColor == undefined) ringOffColor = '#000000';

        let ringOnColor = settings.onRing;
        if (ringOnColor == undefined) ringOnColor = '#00FF00';

        let playlistType = settings.playlistType;
        if (playlistType == undefined) playlistType = 0;

        if (pauseFunction == 0){ //Pause game
            if (game.paused) ringColor = ringOnColor;
            else ringColor = ringOffColor;
            src = 'action/images/other/pause/pause.png';
        }
        else if (pauseFunction == 1){ //Resume game
            if (game.paused == false) ringColor = ringOnColor;
            else ringColor = ringOffColor;
            src = 'action/images/other/pause/resume.png';
        }
        else if (pauseFunction == 2) { //toggle
            if (game.paused == false) ringColor = ringOnColor;
            else ringColor = ringOffColor;
            src = 'action/images/other/pause/playpause.png';
        }
        streamDeck.setIcon(0,context,src,background,2,ringColor);
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

        let background = settings.background;
        if(background == undefined) background = '#000000';

        let ringColor = "#000000";

        let ringOffColor = settings.offRing;
        if (ringOffColor == undefined) ringOffColor = '#000000';

        let ringOnColor = settings.onRing;
        if (ringOnColor == undefined) ringOnColor = '#00FF00';

        let playlistType = settings.playlistType;
        if (playlistType == undefined) playlistType = 0;

        let src = "";
        let name = "";
        if (func == 0){ //visible scenes
            let nr = parseInt(settings.sceneNr);
            if (isNaN(nr)) nr = 1;
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
        else if (func == 1) {   //all scenes
            let scene = game.scenes.apps[1].entities.find(p=>p.data.name == name);
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
        streamDeck.setTitle(name,context);
        streamDeck.setIcon(1, context,src,background,2,ringColor);
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

        let background = settings.background;
        if (background == undefined) background = '#000000';

        let ringColor = '#000000'

        const controlName = this.getControlName(control);
        const toolName = this.getToolName(control,tool);

        let txt = "";
        let src = "";
        const activeControl = ui.controls.activeControl;
        const activeTool = ui.controls.activeTool;

        if (control == 0) { //displayed controls
            let controlNr = parseInt(settings.controlNr);
            if (isNaN(controlNr)) controlNr = 1;
            controlNr--;

            const selectedControl = ui.controls.controls[controlNr];
            if (selectedControl != undefined){
                if (tool == 0){  //open category
                    txt = game.i18n.localize(selectedControl.title);
                    src = selectedControl.icon;
                    if (activeControl == selectedControl.name)
                        ringColor = "#FF7B00";
                }
            }
        }
        else if (control == 1){  //displayed tools
            let controlNr = parseInt(settings.controlNr);
            if (isNaN(controlNr)) controlNr = 1;
            controlNr--;

            const selectedControl = ui.controls.controls.find(c => c.name == ui.controls.activeControl);
            if (selectedControl != undefined){
                const selectedTool = selectedControl.tools[controlNr];
                if (selectedTool != undefined){
                    txt = game.i18n.localize(selectedTool.title);
                    src = selectedTool.icon;
                    if (selectedTool.toggle){
                        background = "#340057"
                        if (selectedTool.active)
                            ringColor = "#A600FF"
                        else    
                            ringColor = "#340057";
                    }
                    else if (activeTool == selectedTool.name)
                        ringColor = "#FF7B00";
                }  
            }
        }
        else {  // specific control/tool
            const selectedControl = ui.controls.controls.find(c => c.name == controlName);
            if (selectedControl != undefined){
                if (tool == 0){  //open category
                        txt = game.i18n.localize(selectedControl.title);
                        src = selectedControl.icon;
                        if (activeControl == selectedControl.name)
                            ringColor = "#FF7B00";
                }
                else {
                    const selectedTool = selectedControl.tools.find(t => t.name == toolName);
                    if (selectedTool != undefined){
                        txt = game.i18n.localize(selectedTool.title);
                        src = selectedTool.icon;
                        if (selectedTool.toggle){
                            background = "#340057"
                            if (selectedTool.active)
                                ringColor = "#A600FF"
                            else    
                                ringColor = "#340057"
                        }
                        else if (activeTool == selectedTool.name && activeControl == selectedControl.name)
                            ringColor = "#FF7B00";
                    }
                }
            }
        }
        streamDeck.setIcon(1,context,src,background,2,ringColor);
        streamDeck.setTitle(txt,context);
    }

    keyPressControl(settings){
        let control = settings.control;
        if (control == undefined) control = 0;

        let tool = settings.tool;
        if (tool == undefined) tool = 0;

        const controlName = this.getControlName(control);
        const toolName = this.getToolName(control,tool);
        
        if (control == 0){  //displayed controls
            let controlNr = parseInt(settings.controlNr);
            if (isNaN(controlNr)) controlNr = 1;
            controlNr--;
            const selectedControl = ui.controls.controls[controlNr];
            if (selectedControl != undefined){
                ui.controls.activeControl = controlName;
                selectedControl.activeTool = selectedControl.activeTool;
                canvas.getLayer(selectedControl.layer).activate();
            }
        }
        else if (control == 1){  //displayed tools
            let controlNr = parseInt(settings.controlNr);
            if (isNaN(controlNr)) controlNr = 1;
            controlNr--;
            const selectedControl = ui.controls.controls.find(c => c.name == ui.controls.activeControl);
            if (selectedControl != undefined){
                const selectedTool = selectedControl.tools[controlNr];
                if (selectedTool != undefined){
                    if (selectedTool.toggle) {
                        selectedTool.active = !selectedTool.active;
                        selectedTool.onClick(selectedTool.active);
                    }
                    else if (selectedTool.button){
                        selectedTool.onClick();
                    }
                    else
                        selectedControl.activeTool = selectedTool.name;
                }  
            }
        }
        else {  //select control
            const selectedControl = ui.controls.controls.find(c => c.name == controlName);
            if (selectedControl != undefined){
                if (tool == 0){  //open category
                    ui.controls.activeControl = controlName;
                    selectedControl.activeTool = selectedControl.activeTool;
                    canvas.getLayer(selectedControl.layer).activate();
                }
                else {
                    const selectedTool = selectedControl.tools.find(t => t.name == toolName);
                    if (selectedTool != undefined){
                        ui.controls.activeControl = controlName;
                        canvas.getLayer(selectedControl.layer).activate();
                        if (selectedTool.toggle) {
                            selectedTool.active = !selectedTool.active;
                            selectedTool.onClick(selectedTool.active);
                        }
                        else if (selectedTool.button){
                            selectedTool.onClick();
                        }
                        else
                            selectedControl.activeTool = toolName;
                    }
                }
            }
        } 
        ui.controls.render(); 
    }

    getControlName(control){
        control -= 2;
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
        control -= 2;
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

    //////////////////////////////////////////////////////////////////////////////////////////

    getSidebarId(nr){
        let id;
        if (nr == 0) id = 'chat';
        else if (nr == 1) id = 'combat';
        else if (nr == 2) id = 'scenes';
        else if (nr == 3) id = 'actors';
        else if (nr == 4) id = 'items';
        else if (nr == 5) id = 'journal';
        else if (nr == 6) id = 'tables';
        else if (nr == 7) id = 'playlists';
        else if (nr == 8) id = 'compendium';
        else if (nr == 9) id = 'settings';
        else id = '';
        return id;
    }

    getSidebarName(nr){
        let name;
        if (nr == 0) name = game.i18n.localize("SIDEBAR.TabChat");
        else if (nr == 1) name = game.i18n.localize("SIDEBAR.TabCombat");
        else if (nr == 2) name = game.i18n.localize("SIDEBAR.TabScenes");
        else if (nr == 3) name = game.i18n.localize("SIDEBAR.TabActors");
        else if (nr == 4) name = game.i18n.localize("SIDEBAR.TabItems");
        else if (nr == 5) name = game.i18n.localize("SIDEBAR.TabJournal");
        else if (nr == 6) name = game.i18n.localize("SIDEBAR.TabTables");
        else if (nr == 7) name = game.i18n.localize("SIDEBAR.TabPlaylists");
        else if (nr == 8) name = game.i18n.localize("SIDEBAR.TabCompendium");
        else if (nr == 9) name = game.i18n.localize("SIDEBAR.TabSettings");
        else if (nr == 10) name = game.i18n.localize("SIDEBAR.CollapseToggle");
        return name;
    }

    getSidebarIcon(nr){
        let icon;
        if (nr == 0) icon = window.CONFIG.ChatMessage.sidebarIcon;
        else if (nr == 1) icon = window.CONFIG.Combat.sidebarIcon;
        else if (nr == 2) icon = window.CONFIG.Scene.sidebarIcon;
        else if (nr == 3) icon = window.CONFIG.Actor.sidebarIcon;
        else if (nr == 4) icon = window.CONFIG.Item.sidebarIcon;
        else if (nr == 5) icon = window.CONFIG.JournalEntry.sidebarIcon;
        else if (nr == 6) icon = window.CONFIG.RollTable.sidebarIcon;
        else if (nr == 7) icon = window.CONFIG.Playlist.sidebarIcon;
        else if (nr == 8) icon = "fas fa-atlas";
        else if (nr == 9) icon = "fas fa-cogs";
        else if (nr == 10) icon = "fas fa-caret-right";
        return icon;
    }
    
    updateSidebar(settings,context){
        let sidebarTab = settings.sidebarTab;
        if (sidebarTab == undefined) sidebarTab = 0;

        let activeTab = ui.sidebar.activeTab;
        let collapsed = ui.sidebar._collapsed;

        let name = "";
        let icon = "";

        let background = settings.background;
        if(background == undefined) background = '#000000';

        let ringColor = "#000000";

        let ringOffColor = settings.offRing;
        if (ringOffColor == undefined) ringOffColor = '#000000';

        let ringOnColor = settings.onRing;
        if (ringOnColor == undefined) ringOnColor = '#00FF00';

        if (settings.displaySidebarName) name = this.getSidebarName(sidebarTab);
        if (settings.displaySidebarIcon) icon = this.getSidebarIcon(sidebarTab);

        if ((sidebarTab == 10 && collapsed)) 
            ringColor = ringOnColor;
        else    
            ringColor = ringOffColor;
        streamDeck.setTitle(name,context);
        streamDeck.setIcon(1,context,icon,background,2,ringColor);
    }

    keyPressSidebar(settings){
        let sidebarTab = settings.sidebarTab;
        if (sidebarTab == undefined) sidebarTab = 0;
        let collapsed = ui.sidebar._collapsed;

        if (sidebarTab < 10) ui.sidebar.activateTab(this.getSidebarId(sidebarTab));
        else if (collapsed) ui.sidebar.expand();
        else if (collapsed == false) ui.sidebar.collapse();
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    updateCompendium(settings,context){
        let background = settings.background;
        if(background == undefined) background = '#000000';

        let name = settings.compendiumName;
        if (name == undefined) return;

        const compendium = game.packs.entries.find(p=>p.metadata.label == name);
        if (compendium == undefined) return;

        let ringColor = "#000000";

        let ringOffColor = settings.offRing;
        if (ringOffColor == undefined) ringOffColor = '#000000';

        let ringOnColor = settings.onRing;
        if (ringOnColor == undefined) ringOnColor = '#00FF00';

        
        if (compendium.rendered) ringColor = ringOnColor;
        else ringColor = ringOffColor;

        if (settings.displayCompendiumName) streamDeck.setTitle(name,context);
        streamDeck.setIcon(0,context,"",background,2,ringColor);
    }

    keyPressCompendium(settings){
        let name = settings.compendiumName;
        if (name == undefined) return;

        const compendium = game.packs.entries.find(p=>p.metadata.label == name);
        if (compendium == undefined) return;
        if (compendium.rendered) compendium.close();
        else compendium.render(true);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    //Journals
    //game.journal.entries[0].render(true)

    updateJournal(settings,context){
        let background = settings.background;
        if(background == undefined) background = '#000000';

        let name = settings.compendiumName;
        if (name == undefined) return;
        const journal = game.journal.entries.find(p=>p.name == name);
        if (journal == undefined) return;

        let ringColor = "#000000";

        let ringOffColor = settings.offRing;
        if (ringOffColor == undefined) ringOffColor = '#000000';

        let ringOnColor = settings.onRing;
        if (ringOnColor == undefined) ringOnColor = '#00FF00';

        
       
        if (journal.sheet.rendered) ringColor = ringOnColor;
        else ringColor = ringOffColor;
        
        if (settings.displayCompendiumName) streamDeck.setTitle(name,context);
        streamDeck.setIcon(0,context,"",background,2,ringColor);
    }

    keyPressJournal(settings){
        let name = settings.compendiumName;
        if (name == undefined) return;

        const journal = game.journal.entries.find(p=>p.name == name);
        if (journal == undefined) return;
        //if (journal.sheet.rendered) journal.close();
        journal.render(true);
    }
}