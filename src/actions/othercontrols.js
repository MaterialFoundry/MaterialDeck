import { streamDeck, gamingSystem, getPermission } from "../../MaterialDeck.js";
import { compatibleCore } from "../misc.js";

export class OtherControls{
    constructor(){
        this.active = false;
        this.rollData = {};
        this.rollOption = 'dialog';
        this.controlsOffset = 0;
        this.toolsOffset = 0;
    }

    setRollOption(option) {
        this.rollOption = option;
        this.updateAll();
    }

    async updateAll(options={}){
        if (this.active == false) return;
        for (let device of streamDeck.buttonContext) {
            if (device?.buttons == undefined) continue;
            for (let i=0; i<device.buttons.length; i++){   
                const data = device.buttons[i];
                if (data == undefined || data.action != 'other') continue;
                await this.update(data.settings,data.context,device.device,options);
            }
        }
    }

    update(settings,context,device,options={}){
        this.active = true;
        const mode = settings.otherMode ? settings.otherMode : 'pause';

        if (mode == 'pause')    //pause
            this.updatePause(settings,context,device,options);
        else if (mode == 'move')     //move canvas
            this.updateMove(settings,context,device,options);
        else if (mode == 'controlButtons')    //control buttons
            this.updateControl(settings,context,device,options);
        else if (mode == 'darkness')   //darkness
            this.updateDarkness(settings,context,device,options);
        else if (mode == 'rollDice')    //roll dice
            this.updateRollDice(settings,context,device,options);
        else if (mode == 'rollTables')    //roll tables
            this.updateRollTable(settings,context,device,options);
        else if (mode == 'sidebarTab')    //open sidebar tab
            this.updateSidebar(settings,context,device,options);
        else if (mode == 'compendiumBrowser')    //open compendium browser
            this.updateCompendiumBrowser(settings,context,device,options);
        else if (mode == 'compendium')    //open compendium
            this.updateCompendium(settings,context,device,options);
        else if (mode == 'journal')    //open journal
            this.updateJournal(settings,context,device,options);
        else if (mode == 'chatMessage')
            this.updateChatMessage(settings,context,device,options);
        else if (mode == 'rollOptions')
            this.updateRollOptions(settings,context,device,options);
        else if (mode == 'rollMode')
            this.updateRollMode(settings,context,device,options);
    }

    keyPress(settings,context,device){
        const mode = settings.otherMode ? settings.otherMode : 'pause';

        if (mode == 'pause')     //pause
            this.keyPressPause(settings);
        else if (mode == 'move')     //move canvas
            this.keyPressMove(settings);
        else if (mode == 'controlButtons')    //control buttons
            this.keyPressControl(settings);
        else if (mode == 'darkness')    //darkness controll
            this.keyPressDarkness(settings);
        else if (mode == 'rollDice')    //roll dice
            this.keyPressRollDice(settings,context,device);
        else if (mode == 'rollTables')    //roll tables
            this.keyPressRollTable(settings);
        else if (mode == 'sidebarTab')    //sidebar
            this.keyPressSidebar(settings);
        else if (mode == 'compendiumBrowser')    //open compendium browser
            this.keyPressCompendiumBrowser(settings);
        else if (mode == 'compendium')    //open compendium
            this.keyPressCompendium(settings);
        else if (mode == 'journal')    //open journal
            this.keyPressJournal(settings);
        else if (mode == 'chatMessage')
            this.keyPressChatMessage(settings);
        else if (mode == 'rollOptions')
            this.keyPressRollOptions(settings);
        else if (mode == 'rollMode')
            this.keyPressRollMode(settings);
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////

    updatePause(settings,context,device,options={}){
        if (getPermission('OTHER','PAUSE') == false ) {
            streamDeck.noPermission(context,device);
            return;
        }

        let src = "";
        const pauseFunction = settings.pauseFunction ? settings.pauseFunction : 'pause';
        const background = settings.background ? settings.background : '#000000';
        const ringOffColor = settings.offRing ? settings.offRing : '#000000';
        const ringOnColor = settings.onRing ? settings.onRing : '#00FF00';
        let ringColor = game.paused ? ringOnColor : ringOffColor;

        if (pauseFunction == 'pause') //Pause game
            src = 'modules/MaterialDeck/img/other/pause/pause.png';
        else if (pauseFunction == 'resume'){ //Resume game
            ringColor = game.paused ? ringOffColor : ringOnColor;
            src = 'modules/MaterialDeck/img/other/pause/resume.png';
        }
        else if (pauseFunction == 'toggle')  //toggle
            src = 'modules/MaterialDeck/img/other/pause/playpause.png';
        streamDeck.setIcon(context,device,src,{background:background,ring:2,ringColor:ringColor,overlay:true});
        streamDeck.setTitle('',context);
    }

    keyPressPause(settings){
        if (getPermission('OTHER','PAUSE') == false ) return;
        
        const pauseFunction = settings.pauseFunction ? settings.pauseFunction : 'pause';

        if (pauseFunction == 'pause'){ //Pause game
            if (game.paused) return; 
            game.togglePause(true,true);
        }
        else if (pauseFunction == 'resume'){ //Resume game
            if (game.paused == false) return; 
            game.togglePause(false,true);
        }
        else if (pauseFunction == 'toggle') { //toggle
            game.togglePause(!game.paused,true);
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////

    updateMove(settings,context,device,options={}){
        let url = '';
        const dir = settings.dir ? settings.dir : 'center';
        const background = settings.background ? settings.background : '#000000';
        if (dir == 'center')  //center
            url = "modules/MaterialDeck/img/move/center.png";
        else if (dir == 'up') //up
            url = "modules/MaterialDeck/img/move/up.png";
        else if (dir == 'down') //down
            url = "modules/MaterialDeck/img/move/down.png";
        else if (dir == 'right') //right
            url = "modules/MaterialDeck/img/move/right.png";
        else if (dir == 'left') //left
            url = "modules/MaterialDeck/img/move/left.png";
        else if (dir == 'upRight') 
            url = "modules/MaterialDeck/img/move/upright.png";
        else if (dir == 'upLeft') 
            url = "modules/MaterialDeck/img/move/upleft.png";
        else if (dir == 'downRight') 
            url = "modules/MaterialDeck/img/move/downright.png";
        else if (dir == 'downLeft') 
            url = "modules/MaterialDeck/img/move/downleft.png";
        else if (dir == 'zoomIn') 
            url = "modules/MaterialDeck/img/move/zoomin.png";
        else if (dir ==  'zoomOut') 
            url = "modules/MaterialDeck/img/move/zoomout.png";
        
        streamDeck.setIcon(context,device,url,{background:background,overlay:true});
        streamDeck.setTitle('',context);
    }

    keyPressMove(settings){
        if (canvas.scene == null) return;
        const dir = settings.dir ? settings.dir : 'center';
        if (dir ==  'zoomIn') {//zoom in
            let viewPosition = canvas.scene._viewPosition;
            viewPosition.scale = viewPosition.scale*1.05;
            viewPosition.duration = 100;
            canvas.animatePan(viewPosition);
        }
        else if (dir == 'zoomOut') {//zoom out
            let viewPosition = canvas.scene._viewPosition;
            viewPosition.scale = viewPosition.scale*0.95;
            viewPosition.duration = 100;
            canvas.animatePan(viewPosition);
        }
        else {
            let viewPosition = canvas.scene._viewPosition;
            const gridSize = compatibleCore('10.0') ? canvas.scene.grid.size : canvas.scene.data.grid;
            viewPosition.duration = 100;
            
            if (dir == 'up') viewPosition.y -= gridSize;
            else if (dir == 'down') viewPosition.y += gridSize;
            else if (dir == 'right') viewPosition.x += gridSize;
            else if (dir == 'left') viewPosition.x -= gridSize;
            else if (dir == 'upRight') {
                viewPosition.x += gridSize;
                viewPosition.y -= gridSize;
            }
            else if (dir == 'upLeft') {
                viewPosition.x -= gridSize;
                viewPosition.y -= gridSize;
            }
            else if (dir == 'downRight') {
                viewPosition.x += gridSize;
                viewPosition.y += gridSize;
            }
            else if (dir == 'downLeft') {
                viewPosition.x -= gridSize;
                viewPosition.y += gridSize;
            }
            else if (dir == 'center') {
                viewPosition.x = (canvas.dimensions.sceneWidth+window.innerWidth)/2;
                viewPosition.y = (canvas.dimensions.sceneHeight+window.innerHeight)/2;
            }
            canvas.animatePan(viewPosition);
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////
    
    updateControl(settings,context,device,options={}){
        if (getPermission('OTHER','CONTROL') == false ) {
            streamDeck.noPermission(context,device);
            return;
        }
        const control = settings.control ? settings.control : 'dispControls';
        const tool = settings.tool ?  settings.tool : 'open';
        let background = settings.background ? settings.background : '#000000';
        let ringColor = '#000000';
        const ringOffColor = settings.offRing ? settings.offRing : '#000000';
        const ringOnColor = settings.onRing ? settings.onRing : '#00FF00';
        let txt = "";
        let src = "";
        const activeControl = ui.controls.activeControl;
        const activeTool = ui.controls.activeTool;
        
        if (control == 'dispControls') { //displayed controls
            let controlNr = parseInt(settings.controlNr);
            if (isNaN(controlNr)) controlNr = 1;
            controlNr--;
            controlNr += this.controlsOffset;

            const selectedControl = ui.controls.controls[controlNr];       
            
            if (selectedControl != undefined){
                if (selectedControl.visible == false) {
                    streamDeck.noPermission(context,device,false);
                    return;
                }
                //if (tool == 'open'){  //open category
                    txt = game.i18n.localize(selectedControl.title);
                    src = selectedControl.icon;
                    if (activeControl == selectedControl.name)
                        ringColor = "#FF7B00";
                //}
            }
        }
        else if (control == 'dispTools'){  //displayed tools
            let controlNr = parseInt(settings.controlNr);
            if (isNaN(controlNr)) controlNr = 1;
            controlNr--;
            controlNr += this.toolsOffset;

            const selectedControl = ui.controls.controls.find(c => c.name == ui.controls.activeControl);
            if (selectedControl != undefined){
                const selectedTool = selectedControl.tools[controlNr];
                if (selectedTool != undefined){
                    if (selectedControl.visible == false || selectedTool.visible == false) {
                        streamDeck.noPermission(context,device,false);
                        return;
                    }
                    txt = game.i18n.localize(selectedTool.title);
                    src = selectedTool.icon;
                    if (selectedTool.toggle){
                        background = "#340057"
                        ringColor = selectedTool.active ? "#A600FF" : "#340057";
                    }
                    else if (activeTool == selectedTool.name)
                        ringColor = "#FF7B00";
                }  
            }
        }
        else if (control == 'controlsOffset') {
            const display = settings.controlsOffsetDisplay ? settings.controlsOffsetDisplay : false;
            const offsetType = settings.controlsOffsetType ? settings.controlsOffsetType : 'absoluteOffset';
            if (display) txt = `${this.controlsOffset}`;
            if (offsetType == 'absoluteOffset') ringColor = (this.controlsOffset == settings.controlsOffset) ? ringOnColor : ringOffColor;
        }
        else if (control == 'toolsOffset') {
            const display = settings.controlsOffsetDisplay ? settings.controlsOffsetDisplay : false;
            const offsetType = settings.controlsOffsetType ? settings.controlsOffsetType : 'absoluteOffset';
            if (display) txt = `${this.toolsOffset}`;
            if (offsetType == 'absoluteOffset') ringColor = (this.toolsOffset == settings.controlsOffset) ? ringOnColor : ringOffColor;
        }
        else {  // specific control/tool
            const selectedControl = ui.controls.controls.find(c => c.name == control);
            if (selectedControl != undefined){
                if (selectedControl.visible == false) {
                    streamDeck.noPermission(context,device,false);
                    return;
                }
                if (tool == 'open'){  //open category
                        txt = game.i18n.localize(selectedControl.title);
                        src = selectedControl.icon;
                        if (activeControl == selectedControl.name)
                            ringColor = "#FF7B00";
                }
                else {
                    const selectedTool = selectedControl.tools.find(t => t.name == tool);
                    if (selectedTool != undefined){
                        if (selectedTool.visible == false) {
                            streamDeck.noPermission(context,device,false);
                            return;
                        }
                        txt = game.i18n.localize(selectedTool.title);
                        src = selectedTool.icon;
                        if (selectedTool.toggle){
                            background = "#340057";
                            ringColor = selectedTool.active ? "#A600FF" : "#340057";
                        }
                        else if (activeTool == selectedTool.name && activeControl == selectedControl.name)
                            ringColor = "#FF7B00";
                    }
                }
            }
        }
        streamDeck.setIcon(context,device,src,{background:background,ring:2,ringColor:ringColor});
        streamDeck.setTitle(txt,context);
    }

    keyPressControl(settings){
        if (getPermission('OTHER','CONTROL') == false ) return;
        if (canvas.scene == null) return;
        const control = settings.control ? settings.control : 'dispControls';
        const tool = settings.tool ?  settings.tool : 'open';

        if (control == 'dispControls'){  //displayed controls
            let controlNr = parseInt(settings.controlNr);
            if (isNaN(controlNr)) controlNr = 1;
            controlNr--;
            const selectedControl = ui.controls.controls[controlNr];
            
            if (selectedControl != undefined){
                if (selectedControl.visible == false) {
                    streamDeck.noPermission(context,device,false);
                    return;
                }
                if (compatibleCore('10.0')) {
                    ui.controls.initialize({layer: selectedControl.layer});
                }
                else {
                    ui.controls.activeControl = selectedControl.name;
                    selectedControl.activeTool = selectedControl.activeTool;
                    for (let layer of canvas.layers) {
                        if (layer.options == undefined) continue;
                        if (layer.options.name == selectedControl.layer) {
                            layer.activate();
                            break;
                        }
                    }
                }
            }
        }
        else if (control == 'dispTools'){  //displayed tools
            let controlNr = parseInt(settings.controlNr);
            if (isNaN(controlNr)) controlNr = 1;
            controlNr--;
            const selectedControl = ui.controls.controls.find(c => c.name == ui.controls.activeControl);
            if (selectedControl != undefined){
                if (selectedControl.visible == false) {
                    streamDeck.noPermission(context,device,false);
                    return;
                }
                const selectedTool = selectedControl.tools[controlNr];
                if (selectedTool != undefined){
                    if (selectedTool.visible == false) {
                        streamDeck.noPermission(context,device,false);
                        return;
                    }
                    if (selectedTool.toggle) {
                        selectedTool.active = !selectedTool.active;
                        selectedTool.onClick(selectedTool.active);
                    }
                    else if (selectedTool.button){
                        selectedTool.onClick();
                    }
                    else {
                        if (compatibleCore('10.0')) {
                            ui.controls.initialize({layer: selectedControl.layer, tool: selectedTool.name});
                        }
                        else {
                            selectedControl.activeTool = selectedTool.name;
                        }
                    }
                        
                }  
            }
        }
        else if (control == 'controlsOffset') {
            const offsetType = settings.controlsOffsetType ? settings.controlsOffsetType : 'absoluteOffset';
            if (offsetType == 'absoluteOffset') this.controlsOffset = parseInt(settings.controlsOffset);
            else if (offsetType == 'relativeOffset') this.controlsOffset += parseInt(settings.controlsOffset);
        }
        else if (control == 'toolsOffset') {
            const offsetType = settings.controlsOffsetType ? settings.controlsOffsetType : 'absoluteOffset';
            if (offsetType == 'absoluteOffset') this.toolsOffset = parseInt(settings.controlsOffset);
            else if (offsetType == 'relativeOffset') this.toolsOffset += parseInt(settings.controlsOffset);
        }
        else {  //select control
            const selectedControl = ui.controls.controls.find(c => c.name == control);
            if (selectedControl != undefined){
                if (selectedControl.visible == false) {
                    streamDeck.noPermission(context,device,false);
                    return;
                }
                if (tool == 'open'){  //open category
                    if (compatibleCore('10.0')) {
                        ui.controls.initialize({layer: selectedControl.layer});
                    }
                    else {
                        ui.controls.activeControl = control;
                        selectedControl.activeTool = selectedControl.activeTool;
                        for (let layer of canvas.layers) {
                            if (layer.options == undefined) continue;
                            if (layer.options.name == selectedControl.layer) {
                                layer.activate();
                                break;
                            }
                        }
                    }
                    
                }
                else {
                    const selectedTool = selectedControl.tools.find(t => t.name == tool);
                    if (selectedTool != undefined){
                        if (selectedTool.visible == false) {
                            streamDeck.noPermission(context,device,false);
                            return;
                        }
                        if (compatibleCore('10.0')) {
                            if (selectedTool.toggle) {
                                ui.controls.initialize({layer: selectedControl.layer});
                                selectedTool.active = !selectedTool.active;
                                selectedTool.onClick(selectedTool.active);
                            }
                            else if (selectedTool.button){
                                ui.controls.initialize({layer: selectedControl.layer});
                                selectedTool.onClick();
                            }
                            else
                            ui.controls.initialize({layer: selectedControl.layer, tool: selectedTool.name});
                        }
                        else {
                            ui.controls.activeControl = control;
                            for (let layer of canvas.layers) {
                                if (layer.options == undefined) continue;
                                if (layer.options.name == selectedControl.layer) {
                                    layer.activate();
                                    break;
                                }
                            }
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
        } 
        ui.controls.render(); 
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    updateDarkness(settings,context,device,options={}){
        if (getPermission('OTHER','DARKNESS') == false ) {
            streamDeck.noPermission(context,device);
            return;
        }
        const func = settings.darknessFunction ? settings.darknessFunction : 'value';
        const value = parseFloat(settings.darknessValue) ? parseFloat(settings.darknessValue) : 0;
        const background = settings.background ? settings.background : '#000000';

        let src = "";
        let txt = "";

        if (func == 'value'){ //value
            src = 'modules/MaterialDeck/img/other/darkness/darkness.png';
        }
        else if (func == 'incDec'){ //increase/decrease
            if (value < 0) src = 'modules/MaterialDeck/img/other/darkness/decreasedarkness.png';
            else src = 'modules/MaterialDeck/img/other/darkness/increasedarkness.png';
        }
        else if (func == 'disp'){    //display darkness
            src = 'modules/MaterialDeck/img/other/darkness/darkness.png';
            const darkness = canvas.scene != null ? compatibleCore('10.0') ? Math.floor(canvas.scene.darkness*100)/100 : Math.floor(canvas.scene.data.darkness*100)/100 : '';
            txt += darkness;
        }
        streamDeck.setTitle(txt,context);
        streamDeck.setIcon(context,device,src,{background:background,overlay:true});
    }

    keyPressDarkness(settings) {
        if (canvas.scene == null) return;
        if (getPermission('OTHER','DARKNESS') == false ) return;
        const func = settings.darknessFunction ? settings.darknessFunction : 'value';
        const value = parseFloat(settings.darknessValue) ? parseFloat(settings.darknessValue) : 0;
        const animateDarkness = parseInt(settings.darknessAnimation) ? parseInt(settings.darknessAnimation) : 500;

        if (func == 'value') //value
            canvas.scene.update({darkness: value}, {animateDarkness});
        else if (func == 'incDec'){ //increase/decrease
            let darkness = compatibleCore('10.0') ? canvas.scene.darkness - value : canvas.scene.data.darkness - value;
            if (darkness > 1) darkness = 1;
            if (darkness < 0) darkness = 0;
            canvas.scene.update({darkness: darkness}, {animateDarkness});
        }
        else if (func == 'transitionDay') {
            canvas.scene.update({darkness: 0}, {animateDarkness: 10000})
        }
        else if (func == 'transitionNight') {
            canvas.scene.update({darkness: 1}, {animateDarkness: 10000})
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    updateRollDice(settings,context,device,options={}){
        if (getPermission('OTHER','DICE') == false ) {
            streamDeck.noPermission(context,device);
            return;
        }
        const background = settings.background ? settings.background : '#000000';
        let txt = '';
        const formula = settings.rollDiceFormula ? settings.rollDiceFormula : '1d20 + 7';

        if (settings.displayDiceName) txt = 'Roll: ' + formula;

        streamDeck.setTitle(txt,context);
        streamDeck.setIcon(context,device,'',{background:background});
    }

    keyPressRollDice(settings,context,device){
        if (getPermission('OTHER','DICE') == false ) return;
        const formula = settings.rollDiceFormula ? settings.rollDiceFormula : '1d20 + 7';
        if (formula == '') return;
        const rollFunction = settings.rollDiceFunction ? settings.rollDiceFunction : 'public';

        let actor;
        let tokenControlled = false;

        if (canvas.tokens.controlled[0] != undefined) actor = canvas.tokens.controlled[0].actor;
        if (actor != undefined) tokenControlled = true;

        let r;
        if (tokenControlled) r = new Roll(formula,actor.getRollData());
        else r = new Roll(formula);

        r.evaluate({async:false});
        
        if (rollFunction == 'public') {
            r.toMessage(r,{rollMode:"roll"})
        }
        else if (rollFunction == 'private') {
            r.toMessage(r,{rollMode:"selfroll"})
        }
        else if (rollFunction == 'sd'){
            let txt = settings.displayDiceName ? 'Roll: '+formula + '\nResult: ' : '';
            txt += r.total;
            streamDeck.setTitle(txt,context);
            let data = this.rollData
            data[context] = {
                formula: formula,
                result: txt
            }
            this.rollData = data;
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    updateRollTable(settings,context,device,options={}){
        const name = settings.rollTableName;
        if (name == undefined) return;
        if (getPermission('OTHER','TABLES') == false ) {
            streamDeck.noPermission(context,device);
            return;
        }

        const background = settings.background ? settings.background : '#000000';
        const table = game.tables.getName(name);
        if (table == undefined) return;

        let txt = settings.displayRollName ? table.name : '';
        let src = settings.displayRollIcon ? (compatibleCore('10.0') ? table.img : table.data.img) : '';

        if (table == undefined) {
            src = '';
            txt = '';
        }
        else {
            if (table.permission < 2 && getPermission('OTHER','TABLES_ALL') == false ) {
                streamDeck.noPermission(context,device);
                return;
            }
        }

        streamDeck.setTitle(txt,context);
        streamDeck.setIcon(context,device,src,{background:background});
    }

    keyPressRollTable(settings){
        if (getPermission('OTHER','TABLES') == false ) return;
        const name = settings.rollTableName;
        if (name == undefined) return;

        const func = settings.rolltableFunction ? settings.rolltableFunction : 'open';
        const table = game.tables.getName(name);

        if (table != undefined) {
            if (table.permission < 2 && getPermission('OTHER','TABLES_ALL') == false ) return;
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
        if (compatibleCore('10.0')) {
            if (nr == 'chat') name = game.i18n.localize("DOCUMENT.ChatMessages");
            else if (nr == 'combat') name = game.i18n.localize("DOCUMENT.Combats");
            else if (nr == 'scenes') name = game.i18n.localize("DOCUMENT.Scenes");
            else if (nr == 'actors') name = game.i18n.localize("DOCUMENT.Actors");
            else if (nr == 'items') name = game.i18n.localize("DOCUMENT.Items");
            else if (nr == 'journal') name = game.i18n.localize("DOCUMENT.JournalEntries");
            else if (nr == 'tables') name = game.i18n.localize("DOCUMENT.RollTables");
            else if (nr == 'cards') name = game.i18n.localize("DOCUMENT.Cards");
            else if (nr == 'playlists') name = game.i18n.localize("DOCUMENT.Playlists");
            else if (nr == 'compendium') name = game.i18n.localize("SIDEBAR.TabCompendium");
            else if (nr == 'settings') name = game.i18n.localize("SIDEBAR.TabSettings");
            else if (nr == 'collapse') name = game.i18n.localize("SIDEBAR.CollapseToggle");
        }
        else {
            if (nr == 'chat') name = game.i18n.localize("SIDEBAR.TabChat");
            else if (nr == 'combat') name = game.i18n.localize("SIDEBAR.TabCombat");
            else if (nr == 'scenes') name = game.i18n.localize("SIDEBAR.TabScenes");
            else if (nr == 'actors') name = game.i18n.localize("SIDEBAR.TabActors");
            else if (nr == 'items') name = game.i18n.localize("SIDEBAR.TabItems");
            else if (nr == 'journal') name = game.i18n.localize("SIDEBAR.TabJournal");
            else if (nr == 'tables') name = game.i18n.localize("SIDEBAR.TabTables");
            else if (nr == 'cards') name = game.i18n.localize("SIDEBAR.TabCards");
            else if (nr == 'playlists') name = game.i18n.localize("SIDEBAR.TabPlaylists");
            else if (nr == 'compendium') name = game.i18n.localize("SIDEBAR.TabCompendium");
            else if (nr == 'settings') name = game.i18n.localize("SIDEBAR.TabSettings");
            else if (nr == 'collapse') name = game.i18n.localize("SIDEBAR.CollapseToggle");
        }
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
        else if (nr == 'cards') icon = window.CONFIG.Cards.sidebarIcon;
        else if (nr == 'playlists') icon = window.CONFIG.Playlist.sidebarIcon;
        else if (nr == 'compendium') icon = "fas fa-atlas";
        else if (nr == 'settings') icon = "fas fa-cogs";
        else if (nr == 'collapse') icon = "fas fa-caret-right";
        return icon;
    }
    
    updateSidebar(settings,context,device,options={}){
        if (getPermission('OTHER','SIDEBAR') == false ) {
            streamDeck.noPermission(context,device);
            return;
        }
        const popOut = settings.sidebarPopOut ? settings.sidebarPopOut : false;
        const sidebarTab = settings.sidebarTab ? settings.sidebarTab : 'chat';
        const background = settings.background ? settings.background : '#000000';
        const collapsed = ui.sidebar._collapsed;
        const activeTab = ui.sidebar.activeTab;
        const ringOffColor = settings.offRing ? settings.offRing : '#000000';
        const ringOnColor = settings.onRing ? settings.onRing : '#00FF00';
        let ringColor = ringOffColor;
        if (popOut && options.sidebarTab == sidebarTab) {
            ringColor = options.renderPopout ? ringOnColor : ringOffColor;
        }
        else if (popOut == false) ringColor = (sidebarTab == 'collapse' && collapsed || (activeTab == sidebarTab)) ? ringOnColor : ringOffColor;
        const name = settings.displaySidebarName ? this.getSidebarName(sidebarTab) : '';
        const icon = settings.displaySidebarIcon ? this.getSidebarIcon(sidebarTab) : '';

        streamDeck.setTitle(name,context);
        streamDeck.setIcon(context,device,icon,{background:background,ring:2,ringColor:ringColor});
    }

    keyPressSidebar(settings){
        if (getPermission('OTHER','SIDEBAR') == false ) return;
        const sidebarTab = settings.sidebarTab ? settings.sidebarTab : 'chat';
        const popOut = settings.sidebarPopOut ? settings.sidebarPopOut : false;
        
        if (sidebarTab == 'collapse'){
            const collapsed = ui.sidebar._collapsed;
            if (collapsed) ui.sidebar.expand();
            else if (collapsed == false) ui.sidebar.collapse();
        }
        else if (popOut == false) ui.sidebar.activateTab(sidebarTab);
        else {
            const element = document.getElementById(sidebarTab+"-popout");
            if (element == null) ui?.[sidebarTab].renderPopout();
            else element.getElementsByClassName("close")[0].click();
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    updateCompendiumBrowser(settings,context,device,options={}){
        let rendered = options.renderCompendiumBrowser;
        if (rendered == undefined && gamingSystem == "pf2e") rendered = (document.getElementById("app-1") != null);
        else if (rendered == undefined) rendered = (document.getElementById("compendium-popout") != null);
        const background = settings.background ? settings.background : '#000000';
        const ringOffColor = settings.offRing ? settings.offRing : '#000000';
        const ringOnColor = settings.onRing ? settings.onRing : '#00FF00';
        const ringColor = rendered ? ringOnColor : ringOffColor;
        const txt = settings.displayCompendiumName ? name : '';

        streamDeck.setTitle(txt,context);
        streamDeck.setIcon(context,device,"",{background:background,ring:2,ringColor:ringColor});
    }

    keyPressCompendiumBrowser(settings){
        let element = null;
        if (gamingSystem == "pf2e") element = document.getElementById("app-1")
        else element = document.getElementById("compendium-popout");
        const rendered = (element != null);

        if (rendered) 
            element.getElementsByClassName("close")[0].click();
        else if (gamingSystem == "pf2e")
            document.getElementsByClassName("compendium-browser-btn")[0].click()
        else
            ui.compendium.renderPopout();
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    updateCompendium(settings,context,device,options={}){
        const name = settings.compendiumName;
        if (name == undefined) return;
        if (getPermission('OTHER','COMPENDIUM') == false ) {
            streamDeck.noPermission(context,device);
            return;
        }
        const compendium = game.packs.find(p=>p.metadata.label == name);
        if (compendium == undefined) return;
        if (compendium.private && getPermission('OTHER','COMPENDIUM_ALL') == false) {
            streamDeck.noPermission(context,device);
            return;
        }
        const rendered = compendium.apps[0].rendered;
        const background = settings.background ? settings.background : '#000000';
        const ringOffColor = settings.offRing ? settings.offRing : '#000000';
        const ringOnColor = settings.onRing ? settings.onRing : '#00FF00';
        const ringColor = rendered ? ringOnColor : ringOffColor;
        const txt = settings.displayCompendiumName ? name : '';

        streamDeck.setTitle(txt,context);
        streamDeck.setIcon(context,device,"",{background:background,ring:2,ringColor:ringColor});
    }

    keyPressCompendium(settings){
        let name = settings.compendiumName;
        if (name == undefined) return;
        if (getPermission('OTHER','COMPENDIUM') == false ) return;

        const compendium = game.packs.find(p=>p.metadata.label == name);
        const rendered = compendium.apps[0].rendered;
        if (compendium == undefined) return;
        if (compendium.private && getPermission('OTHER','COMPENDIUM_ALL') == false) return;
        else if (rendered) compendium.apps[0].close();
        else compendium.render(true);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    updateJournal(settings,context,device,options={}){
        const name = settings.compendiumName;
        if (name == undefined) return;

        const journal = game.journal.getName(name);
        if (journal == undefined) return;

        if (getPermission('OTHER','JOURNAL') == false ) {
            streamDeck.noPermission(context,device);
            return;
        }
        if (journal.permission < 2 && getPermission('OTHER','JOURNAL_ALL') == false ) {
            streamDeck.noPermission(context,device);
            return;
        }
        let rendered = false;
        
        if (options?.sheet?.title == name) {
            if (options.hook == 'renderJournalSheet') rendered = true;
            else if (options.hook == 'closeJournalSheet') rendered = false;
        }
        else 
            if (document.getElementById("journalentry-sheet-"+journal.id) != null) rendered = true;

        const background = settings.background ? settings.background : '#000000';
        const ringOffColor = settings.offRing ? settings.offRing : '#000000';
        const ringOnColor = settings.onRing ? settings.onRing : '#00FF00';
        const ringColor = rendered ? ringOnColor : ringOffColor;
        const txt = settings.displayCompendiumName ? name : '';

        streamDeck.setTitle(txt,context);
        streamDeck.setIcon(context,device,"",{background:background,ring:2,ringColor:ringColor});
    }

    keyPressJournal(settings){
        const name = settings.compendiumName;
        if (name == undefined) return;

        const journal = game.journal.getName(name);
        if (journal == undefined) return;

        if (getPermission('OTHER','JOURNAL') == false ) return;
        if (journal.permission < 2 && getPermission('OTHER','JOURNAL_ALL') == false ) return;

        if (journal.sheet.rendered == false) journal.sheet.render(true);
        else journal.sheet.close();
    }

//////////////////////////////////////////////////////////////////////////////////////////

    updateChatMessage(settings,context,device,options={}){
        if (getPermission('OTHER','CHAT') == false ) {
            streamDeck.noPermission(context,device);
            return;
        }
        const background = settings.background ? settings.background : '#000000';
        streamDeck.setTitle("",context);
        streamDeck.setIcon(context,device,"",{background:background});
    }

    keyPressChatMessage(settings){
        if (getPermission('OTHER','CHAT') == false ) return;
        const message = settings.chatMessage ? settings.chatMessage : '';

        let chatData = {
            user: game.user._id,
            speaker: ChatMessage.getSpeaker(),
            content: message
        };
        ChatMessage.create(chatData, {});
    }

//////////////////////////////////////////////////////////////////////////////////////////

    updateRollOptions(settings,context,device,options={}){
        const background = settings.background ? settings.background : '#000000';
        const ringOffColor = settings.offRing ? settings.offRing : '#000000';
        const ringOnColor = settings.onRing ? settings.onRing : '#00FF00';
        const iconSrc = "modules/MaterialDeck/img/other/d20.png";
        const rollOption = settings.rollOptionFunction ? settings.rollOptionFunction : 'normal';
        const ringColor = (rollOption == this.rollOption) ? ringOnColor : ringOffColor;
        streamDeck.setTitle("",context);
        streamDeck.setIcon(context,device,iconSrc,{background:background,ring:2,ringColor:ringColor,overlay:true});
    }

    keyPressRollOptions(settings){
        const rollOption = settings.rollOptionFunction ? settings.rollOptionFunction : 'normal';
        if (this.rollOption != rollOption) {
            this.rollOption = rollOption;
            this.updateAll();
        }
    }

//////////////////////////////////////////////////////////////////////////////////////////

    updateRollMode(settings,context,device,options={}){
        const background = settings.background ? settings.background : '#000000';
        const ringOffColor = settings.offRing ? settings.offRing : '#000000';
        const ringOnColor = settings.onRing ? settings.onRing : '#00FF00';
        const iconSrc = "modules/MaterialDeck/img/other/d20.png";
        const rollMode = settings.rollMode ? settings.rollMode : 'roll';
        const ringColor = (rollMode == game.settings.get('core','rollMode')) ? ringOnColor : ringOffColor;
        streamDeck.setTitle("",context);
        streamDeck.setIcon(context,device,iconSrc,{background:background,ring:2,ringColor:ringColor,overlay:true});
    }

    async keyPressRollMode(settings){
        const rollMode = settings.rollMode ? settings.rollMode : 'roll';
        await game.settings.set('core','rollMode',rollMode);
        this.updateAll();
    }
}