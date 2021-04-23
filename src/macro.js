import * as MODULE from "../MaterialDeck.js";
import {streamDeck} from "../MaterialDeck.js";
import {compatibleCore} from "./misc.js";

export class MacroControl{
    constructor(){
        this.active = false;
        this.offset = 0;
    }

    async updateAll(){
        if (this.active == false) return;
        for (let device of streamDeck.buttonContext) {
            for (let i=0; i<device.buttons.length; i++){   
                const data = device.buttons[i];
                if (data == undefined || data.action != 'macro') continue;
                await this.update(data.settings,data.context,device.device);
            }
        }
    }

    async update(settings,context,device){
        this.active = true;
        const mode = settings.macroMode ? settings.macroMode : 'hotbar';
        const displayName = settings.displayName ? settings.displayName : false;
        const displayIcon = settings.displayIcon ? settings.displayIcon : false;
        const displayUses = settings.displayUses ? settings.displayUses : false;
        let background = settings.background ? settings.background : '#000000';
        let macroNumber = settings.macroNumber;
        if (macroNumber == undefined || isNaN(parseInt(macroNumber))) macroNumber = 0;
        macroNumber = parseInt(macroNumber);

        let ringColor = "#000000";
        let ring = 0;
        let name = "";
        let src = ""; 
        let macroId = undefined;
        let uses = undefined;
        
        if (mode == 'macroBoard') {  //Macro board
            if ((MODULE.getPermission('MACRO','MACROBOARD') == false )) {
                streamDeck.noPermission(context,device);
                return;
            }
            if (settings.macroBoardMode == 'offset') {  //Offset
                const ringOffColor = settings.offRing ? settings.offRing : '#000000';
                const ringOnColor = settings.onRing ? settings.onRing : '#00FF00';
                
                let macroOffset = parseInt(settings.macroOffset);
                if (macroOffset == undefined || isNaN(macroOffset)) macroOffset = 0;
                
                ringColor = (macroOffset == parseInt(this.offset)) ? ringOnColor : ringOffColor;
                ring = 2;
                src = "modules/MaterialDeck/img/transparant.png";
            }
            else { //Execute macro
                macroNumber += this.offset - 1;
                if (macroNumber < 0) macroNumber = 0;
                macroId = game.settings.get(MODULE.moduleName,'macroSettings').macros[macroNumber];
                background = game.settings.get(MODULE.moduleName,'macroSettings').color[macroNumber];
                if (background == undefined) background = '#000000';
                ring = 0;
            }  
        }
        else if (mode == 'name') {  //macro by name
            const macroName = settings.macroNumber;
            const macro = game.macros.getName(macroName);
            macroId = macro?.id;
        }
        else { //Macro Hotbar
            if ((MODULE.getPermission('MACRO','HOTBAR') == false )) {
                streamDeck.noPermission(context,device);
                return;
            }
            if (mode == 'hotbar') macroId = game.user.data.hotbar[macroNumber];
            else {
                let macros;
                if (mode == 'customHotbar' && game.modules.get('custom-hotbar') != undefined) 
                    macros = ui.customHotbar.macros;
                else 
                    macros = game.macros.apps[0].macros;
                if (macroNumber > 9) macroNumber = 0;
                macroId = game.macros.apps[0].macros.find(m => m.key == macroNumber).macro?.id
            }  
        }

        if (macroId != undefined){
            let macro = game.macros._source.find(p => p._id == macroId);
            
            if (macro != undefined) {
                if (displayName) name = macro.name;
                if (displayIcon) src = macro.img;
                if (MODULE.hotbarUses && displayUses) uses = await this.getUses(macro);
            }
        }
        else {
            if (displayName) name = "";
            if (displayIcon) src = "modules/MaterialDeck/img/black.png";
        }
        
        streamDeck.setIcon(context,device,src,{background:background,ring:ring,ringColor:ringColor,uses:uses});
        streamDeck.setTitle(name,context);
    }

    async getUses(macro) {
        let hbUses = await import('../../illandril-hotbar-uses/scripts/item-system.js');
        const command = macro.command;
        const uses = await hbUses.calculateUses(command);
        return uses;
    }

    async hotbar(macros){
        for (let i=0; i<32; i++){ 
            const data = streamDeck.buttonContext[i];
            if (data == undefined || data.action != 'macro' || data.settings.macroMode == 'macroBoard') continue;
            
            const context = data.context;
            const mode = data.settings.macroMode ? data.settings.macroMode : 'hotbar';
            const displayName = data.settings.displayName ? data.settings.displayName : false;
            const displayIcon = data.settings.displayIcon ? data.settings.displayIcon : false;
            const displayUses = data.settings.displayUses ? data.settings.displayUses : false;
            let background = data.settings.background ? data.settings.background : '#000000';
            let macroNumber = data.settings.macroNumber;
            if(macroNumber == undefined || isNaN(parseInt(macroNumber))) macroNumber = 1;

            if ((MODULE.getPermission('MACRO','HOTBAR') == false )) {
                streamDeck.noPermission(context,device);
                return;
            } 

            let src = "";
            let name = "";

            if (mode == 'Macro Board') continue;
            
            let macroId;
            if (mode == 'hotbar'){
                macroId = game.user.data.hotbar[macroNumber];
            }
            else {
                if (macroNumber > 9) macroNumber = 0;
                macroId = game.macros.apps[0].macros.find(m => m.key == macroNumber).macro?.id
            }
            let macro = undefined;
            let uses = undefined;
            if (macroId != undefined) macro = game.macros._source.find(p => p._id == macroId);
            if (macro != undefined && macro != null) {
                if (displayName) name += macro.name;
                if (displayIcon) src += macro.img;
                if (MODULE.hotbarUses && displayUses) uses = await this.getUses(macro);
            }
            streamDeck.setIcon(context,device,src,{background:background,uses:uses});
            streamDeck.setTitle(name,context);
        }
    }
   
    keyPress(settings){
        const mode = settings.macroMode ? settings.macroMode : 'hotbar';
        let macroNumber = settings.macroNumber;
        if(macroNumber == undefined || isNaN(parseInt(macroNumber))) macroNumber = 0;
        let target = settings.target ? settings.target : undefined;
        
        if (mode == 'hotbar' || mode == 'visibleHotbar' || mode == 'customHotbar'){
            if ((MODULE.getPermission('MACRO','HOTBAR') == false )) return;
            this.executeHotbar(macroNumber,mode);
        } 
        else if (mode == 'name') {
            if ((MODULE.getPermission('MACRO','BY_NAME') == false )) return;
            const macroName = settings.macroNumber;
            const macro = game.macros.getName(macroName);

            if (macro == undefined) return;
           
            const args = settings.macroArgs ? settings.macroArgs : "";

            let furnaceEnabled = false;
            let furnace = game.modules.get("furnace");
            if (furnace != undefined && furnace.active && compatibleCore("0.8.1")==false) furnaceEnabled = true;
            if (args == "" || args == " ") furnaceEnabled = false;
            if (furnaceEnabled == false) macro.execute({token:target});
            else {
                let chatData = {
                    user: game.user._id,
                    speaker: ChatMessage.getSpeaker(),
                    content: "/'" + macro.name + "' " + args
                };
                ChatMessage.create(chatData, {});
            }

        }
        else {
            if ((MODULE.getPermission('MACRO','MACROBOARD') == false )) return;
            if (settings.macroBoardMode == 'offset') {
                let macroOffset = settings.macroOffset;
                if (macroOffset == undefined) macroOffset = 0;
                this.offset = macroOffset;
                this.updateAll();
            }
            else 
                this.executeBoard(macroNumber);
        }
    }

    executeHotbar(macroNumber,mode){
        let macroId 
        if (mode == 'hotbar') macroId = game.user.data.hotbar[macroNumber];
        else {
            let macros;
            if (mode == 'customHotbar' && game.modules.get('custom-hotbar') != undefined) { 
                macros = ui.customHotbar.macros;
            }
            else macros = game.macros.apps[0].macros;
            if (macroNumber > 9) macroNumber = 0;
            macroId = game.macros.apps[0].macros.find(m => m.key == macroNumber).macro?.id
        }
        if (macroId == undefined) return;
        let macro = game.macros.get(macroId);
        macro.execute();
    }

    executeBoard(macroNumber){
        macroNumber = parseInt(macroNumber);
        macroNumber += this.offset - 1;
        if (macroNumber < 0) macroNumber = 0;
        var macroId = game.settings.get(MODULE.moduleName,'macroSettings').macros[macroNumber];

        if (macroId != undefined){
            let macro = game.macros.get(macroId);
            if (macro != undefined && macro != null) {
                const args = game.settings.get(MODULE.moduleName,'macroSettings').args;
                let furnaceEnabled = false;
                let furnace = game.modules.get("furnace");
                if (furnace != undefined && furnace.active && compatibleCore("0.8.1")==false) furnaceEnabled = true;
                if (args == undefined || args[macroNumber] == undefined || args[macroNumber] == "") furnaceEnabled = false;
                if (furnaceEnabled == false) macro.execute();
                else {
                    let chatData = {
                        user: game.user._id,
                        speaker: ChatMessage.getSpeaker(),
                        content: "/'" + macro.name + "' " + args
                    };
                    ChatMessage.create(chatData, {});
                }
            }
        }
    }
}