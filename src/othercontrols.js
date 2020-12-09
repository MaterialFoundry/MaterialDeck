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
        if (mode == undefined) mode = 'pause';

        if (mode == 'pause') {    //pause
            this.updatePause(settings.pauseFunction,context);
        }
        else if (mode == 'sceneSelect') {   //scene selection
            this.updateScene(settings,context);
        }
        else if (mode == 'controlButtons'){    //control buttons
            this.updateControl(settings,context);
        }
        else if (mode == 'darkness'){    //darkness
            this.updateDarkness(settings,context);
        }
        else if (mode == 'rollTables'){    //roll tables
            this.updateRollTable(settings,context);
        }
        else if (mode == 'sidebarTab') {   //open sidebar tab
            this.updateSidebar(settings,context);
        }
        else if (mode == 'compendium') {   //open compendium
            this.updateCompendium(settings,context);
        }
        else if (mode == 'journal') {   //open journal
            this.updateJournal(settings,context);
        }
    }

    keyPress(settings){
        let mode = settings.otherMode;
        if (mode == undefined) mode = 'pause';

        if (mode == 'pause') {    //pause
            this.keyPressPause(settings.pauseFunction);
        }
        else if (mode == 'sceneSelect') {   //scene
            this.keyPressScene(settings);
        }
        else if (mode == 'controlButtons') {   //control buttons
            this.keyPressControl(settings);
        }
        else if (mode == 'darkness') {   //darkness controll
            this.keyPressDarkness(settings);
        }
        else if (mode == 'rollTables') {   //roll tables
            this.keyPressRollTable(settings);
        }
        else if (mode == 'sidebarTab') {   //sidebar
            this.keyPressSidebar(settings);
        }
        else if (mode == 'compendium') {   //open compendium
            this.keyPressCompendium(settings);
        }
        else if (mode == 'journal') {   //open journal
            this.keyPressJournal(settings);
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////

    updatePause(pauseFunction,context){
        let src = "";
        if (pauseFunction == undefined) pauseFunction = 'pause';
        
        let background = settings.background;
        if(background == undefined) background = '#000000';

        let ringColor = "#000000";

        let ringOffColor = settings.offRing;
        if (ringOffColor == undefined) ringOffColor = '#000000';

        let ringOnColor = settings.onRing;
        if (ringOnColor == undefined) ringOnColor = '#00FF00';

        let playlistType = settings.playlistType;
        if (playlistType == undefined) playlistType = 0;

        if (pauseFunction == 'pause'){ //Pause game
            if (game.paused) ringColor = ringOnColor;
            else ringColor = ringOffColor;
            src = 'modules/MaterialDeck/img/other/pause/pause.png';
            //src = 'action/images/other/pause/pause.png';
        }
        else if (pauseFunction == 'resume'){ //Resume game
            if (game.paused == false) ringColor = ringOnColor;
            else ringColor = ringOffColor;
            src = 'modules/MaterialDeck/img/other/pause/resume.png';
            //src = 'action/images/other/pause/resume.png';
        }
        else if (pauseFunction == 'toggle') { //toggle
            if (game.paused == false) ringColor = ringOnColor;
            else ringColor = ringOffColor;
            src = 'modules/MaterialDeck/img/other/pause/playpause.png';
            //src = 'action/images/other/pause/playpause.png';
        }
        streamDeck.setIcon(context,src,background,2,ringColor,true);
    }

    keyPressPause(pauseFunction){
        if (pauseFunction == undefined) pauseFunction = 'pause';
        if (pauseFunction == 'pause'){ //Pause game
            if (game.paused) return; 
            game.togglePause();
        }
        else if (pauseFunction == 'resume'){ //Resume game
            if (game.paused == false) return; 
            game.togglePause();
        }
        else if (pauseFunction == 'toggle') { //toggle
            game.togglePause();
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////

    updateScene(settings,context){
        if (canvas.scene == null) return;
        let func = settings.sceneFunction;
        if (func == undefined) func = 'visible';

        let background = settings.background;
        if(background == undefined) background = '#000000';

        let ringColor = "#000000";

        let ringOffColor = settings.offRing;
        if (ringOffColor == undefined) ringOffColor = '#000000';

        let ringOnColor = settings.onRing;
        if (ringOnColor == undefined) ringOnColor = '#00FF00';

        let src = "";
        let name = "";
        if (func == 'visible'){ //visible scenes
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
        else if (func == 'any') {   //all scenes
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
        streamDeck.setIcon(context,src,background,2,ringColor);
    }

    keyPressScene(settings){
        let func = settings.sceneFunction;
        if (func == undefined) func = 'visible';
        if (func == 'visible'){ //visible scenes
            let viewFunc = settings.sceneViewFunction;
            if (viewFunc == undefined) viewFunc = 'view';

            let nr = parseInt(settings.sceneNr);
            if (isNaN(nr)) nr = 1;
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
    }

    //////////////////////////////////////////////////////////////////////////////////////////
    
    updateControl(settings,context){
        let control = settings.control;
        if (control == undefined) control = 'dispControls';

        let tool = settings.tool;
        if (tool == undefined) tool = 'open';

        let background = settings.background;
        if (background == undefined) background = '#000000';

        let ringColor = '#000000'

        let txt = "";
        let src = "";
        const activeControl = ui.controls.activeControl;
        const activeTool = ui.controls.activeTool;

        if (control == 'dispControls') { //displayed controls
            let controlNr = parseInt(settings.controlNr);
            if (isNaN(controlNr)) controlNr = 1;
            controlNr--;

            const selectedControl = ui.controls.controls[controlNr];
            if (selectedControl != undefined){
                if (tool == 'open'){  //open category
                    txt = game.i18n.localize(selectedControl.title);
                    src = selectedControl.icon;
                    if (activeControl == selectedControl.name)
                        ringColor = "#FF7B00";
                }
            }
        }
        else if (control == 'dispTools'){  //displayed tools
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
            const selectedControl = ui.controls.controls.find(c => c.name == control);
            if (selectedControl != undefined){
                if (tool == 'open'){  //open category
                        txt = game.i18n.localize(selectedControl.title);
                        src = selectedControl.icon;
                        if (activeControl == selectedControl.name)
                            ringColor = "#FF7B00";
                }
                else {
                    const selectedTool = selectedControl.tools.find(t => t.name == tool);
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
        streamDeck.setIcon(context,src,background,2,ringColor);
        streamDeck.setTitle(txt,context);
    }

    keyPressControl(settings){
        if (canvas.scene == null) return;
        let control = settings.control;
        if (control == undefined) control = 'dispControls';

        let tool = settings.tool;
        if (tool == undefined) tool = 'open';
        
        if (control == 'dispControls'){  //displayed controls
            let controlNr = parseInt(settings.controlNr);
            if (isNaN(controlNr)) controlNr = 1;
            controlNr--;
            const selectedControl = ui.controls.controls[controlNr];
            if (selectedControl != undefined){
                ui.controls.activeControl = 'token';
                selectedControl.activeTool = selectedControl.activeTool;
                canvas.getLayer(selectedControl.layer).activate();
            }
        }
        else if (control == 'dispTools'){  //displayed tools
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
            const selectedControl = ui.controls.controls.find(c => c.name == control);
            if (selectedControl != undefined){
                if (tool == 'open'){  //open category
                    ui.controls.activeControl = 'token';
                    selectedControl.activeTool = selectedControl.activeTool;
                    canvas.getLayer(selectedControl.layer).activate();
                }
                else {
                    const selectedTool = selectedControl.tools.find(t => t.name == tool);
                    if (selectedTool != undefined){
                        ui.controls.activeControl = control;
                        canvas.getLayer(selectedControl.layer).activate();
                        if (selectedTool.toggle) {
                            selectedTool.active = !selectedTool.active;
                            selectedTool.onClick(selectedTool.active);
                        }
                        else if (selectedTool.button){
                            selectedTool.onClick();
                        }
                        else
                            selectedControl.activeTool = tool;
                    }
                }
            }
        } 
        ui.controls.render(); 
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    updateDarkness(settings,context){
        let func = settings.darknessFunction;
        if (func == undefined) func = 'value';

        let value = settings.darknessValue;
        if (value == undefined) value = 0;

        let background = settings.background;
        if (background == undefined) background = "#000000";

        let src = "";
        let txt = "";

        if (func == 'value'){ //value
            src = 'modules/MaterialDeck/img/other/darkness/darkness.png';
        }
        else if (func == 'incDec'){ //increase/decrease
            if (value < 0) src = 'modules/MaterialDeck/img/other/darkness/decreasedarkness.png';
            else src = 'modules/MaterialDeck/img/other/darkness/increasedarkness.png';
        }
        else if (func == 'display'){    //display darkness
            src = 'modules/MaterialDeck/img/other/darkness/darkness.png';
            let darkness = '';
            if (canvas.scene != null) darkness = Math.floor(canvas.scene.data.darkness*100)/100;
            txt += darkness;
        }
        streamDeck.setTitle(txt,context);
        streamDeck.setIcon(context,src,background);
    }

    keyPressDarkness(settings) {
        if (canvas.scene == null) return;
        let func = settings.darknessFunction;
        if (func == undefined) func = 'value';

        let value = parseFloat(settings.darknessValue);
        if (value == undefined) value = 0;

        if (func == 'value') //value
            canvas.scene.update({darkness: value});
        else if (func == 'incDec'){ //increase/decrease
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
        streamDeck.setIcon(context,src,background);
    }

    keyPressRollTable(settings){
        let func = settings.rolltableFunction;
        if (func == undefined) func = 'open';

        let name = settings.rollTableName;
        if (name == undefined) return;

        let background = settings.background;
        if (background == undefined) background = "#000000";

        let table = game.tables.entities.find(p=>p.name == name);

        if (table != undefined) {
            if (func == 'open'){ //open
                const element = document.getElementById(table.sheet.id);
                if (element == null) table.sheet.render(true);
                else table.sheet.close();
            }
            else if (func == 'public') //Public roll
                table.draw({rollMode:"roll"});
            else if (func == 'private') //private roll
                table.draw({rollMode:"selfroll"});
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    getSidebarName(nr){
        let name;
        if (nr == 'chat') name = game.i18n.localize("SIDEBAR.TabChat");
        else if (nr == 'combat') name = game.i18n.localize("SIDEBAR.TabCombat");
        else if (nr == 'scenes') name = game.i18n.localize("SIDEBAR.TabScenes");
        else if (nr == 'actors') name = game.i18n.localize("SIDEBAR.TabActors");
        else if (nr == 'items') name = game.i18n.localize("SIDEBAR.TabItems");
        else if (nr == 'journal') name = game.i18n.localize("SIDEBAR.TabJournal");
        else if (nr == 'tables') name = game.i18n.localize("SIDEBAR.TabTables");
        else if (nr == 'playlists') name = game.i18n.localize("SIDEBAR.TabPlaylists");
        else if (nr == 'compendium') name = game.i18n.localize("SIDEBAR.TabCompendium");
        else if (nr == 'settings') name = game.i18n.localize("SIDEBAR.TabSettings");
        else if (nr == 'collapse') name = game.i18n.localize("SIDEBAR.CollapseToggle");
        return name;
    }

    getSidebarIcon(nr){
        let icon;
        if (nr == 'chat') icon = window.CONFIG.ChatMessage.sidebarIcon;
        else if (nr == 'combat') icon = window.CONFIG.Combat.sidebarIcon;
        else if (nr == 'scenes') icon = window.CONFIG.Scene.sidebarIcon;
        else if (nr == 'actors') icon = window.CONFIG.Actor.sidebarIcon;
        else if (nr == 'items') icon = window.CONFIG.Item.sidebarIcon;
        else if (nr == 'journal') icon = window.CONFIG.JournalEntry.sidebarIcon;
        else if (nr == 'tables') icon = window.CONFIG.RollTable.sidebarIcon;
        else if (nr == 'playlists') icon = window.CONFIG.Playlist.sidebarIcon;
        else if (nr == 'compendium') icon = "fas fa-atlas";
        else if (nr == 'settings') icon = "fas fa-cogs";
        else if (nr == 'collapse') icon = "fas fa-caret-right";
        return icon;
    }
    
    updateSidebar(settings,context){
        let sidebarTab = settings.sidebarTab;
        if (sidebarTab == undefined) sidebarTab = 'chat';

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

        if ((sidebarTab == 'collapse' && collapsed)) 
            ringColor = ringOnColor;
        else    
            ringColor = ringOffColor;
        streamDeck.setTitle(name,context);
        streamDeck.setIcon(context,icon,background,2,ringColor);
    }

    keyPressSidebar(settings){
        let sidebarTab = settings.sidebarTab;
        if (sidebarTab == undefined) sidebarTab = 'chat';
        let collapsed = ui.sidebar._collapsed;

        if (sidebarTab == 'collapse'){
            if (collapsed) ui.sidebar.expand();
            else if (collapsed == false) ui.sidebar.collapse();
        }
        else ui.sidebar.activateTab(sidebarTab);
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
        streamDeck.setIcon(context,"",background,2,ringColor);
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
        streamDeck.setIcon(context,"",background,2,ringColor);
    }

    keyPressJournal(settings){
        let name = settings.compendiumName;
        if (name == undefined) return;

        const journal = game.journal.entries.find(p=>p.name == name);
        if (journal == undefined) return;
        const element = document.getElementById("journal-"+journal.id);
        if (element == null) journal.render(true);
        else journal.sheet.close();
    }
}