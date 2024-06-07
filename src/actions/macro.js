import { moduleName, getPermission, hotbarUses } from "../../MaterialDeck.js";
import { getLastElement, getDocument } from "../misc.js";

export class MacroControl{
    constructor(){
        this.active = false;
        this.offset = 0;
    }

    async updateAll(){
        if (this.active == false) return;
        for (let device of game.materialDeck.streamDeck.buttonContext) {
            if (device?.buttons == undefined) continue;
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
        let macroNumber = settings.macroNumber;
        if (macroNumber == undefined || isNaN(parseInt(macroNumber))) macroNumber = 0;
        macroNumber = parseInt(macroNumber);

        let background;
        let ringColor;
        let ring;
        let name;
        let src;

        let macro;
        let uses;
        let macroLabel = "";

        if (mode == 'macroBoard') {  //Macro board
            if ((getPermission('MACRO','MACROBOARD') == false )) {
                game.materialDeck.streamDeck.noPermission(context,device);
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
                const macroSettings = game.settings.get(moduleName,'macroSettings');
                const macroId = macroSettings.macros[macroNumber];
                macro = game.macros.get(macroId);
                background = macroSettings.color[macroNumber];
                try {
                    macroLabel = macroSettings.labels[macroNumber];
                }
                catch (err) {}
                if ((macroLabel == undefined || macroLabel == "") && game.macros.get(macroId)) macroLabel = game.macros.get(macroId).name;
                if (background == undefined) background = '#000000';
                ring = 0;
            }
        }
        else if (mode == 'name') {  //macro by name/id
            macro = getDocument('macro', settings.macroNumber);
        }
        else { //Macro Hotbar
            if ((getPermission('MACRO','HOTBAR') == false )) {
                game.materialDeck.streamDeck.noPermission(context,device);
                return;
            }
            let macroId;
            if (mode == 'hotbar') macroId = game.user.hotbar[macroNumber];
            else {
                let macros;
                if (mode == 'customHotbar' && game.modules.get('custom-hotbar') != undefined) 
                    macros = ui.customHotbar.macros;
                else 
                    macros = game.macros.apps[0].macros;
                if (macroNumber > 9) macroNumber = 0;
                macroId = game.macros.apps[0].macros.find(m => m.key == macroNumber).macro?.id
            }
            macro = game.macros.get(macroId);  
        }

        if (macro != undefined) {
            if (displayName && mode == 'macroBoard') name = macroLabel;
            else if (displayName) name = macro.name;
            if (displayIcon) src = macro.img;
            if (hotbarUses && displayUses) uses = await this.getUses(macro);
        }

        if (settings.iconOverride != '' && settings.iconOverride != undefined) src = settings.iconOverride;
        game.materialDeck.streamDeck.setIcon(context, device, src, {
            background,
            ring,
            ringColor,
            uses,
        });
        game.materialDeck.streamDeck.setTitle(name,context);
    }

    async getUses(macro) {
        let hbUses = await import('../../illandril-hotbar-uses/scripts/item-system.js');
        const command = macro.command;
        const uses = await hbUses.calculateUses(command);
        return uses;
    }

    async hotbar(){
        for (let device of game.materialDeck.streamDeck.buttonContext) {
            if (device?.buttons == undefined) continue;
            for (let i=0; i<device.buttons.length; i++){   
                const data = device.buttons[i];
                if (data == undefined || data.action != 'macro' || data.settings.macroMode != 'hotbar') continue;
                const context = data.context;
                const mode = data.settings.macroMode ? data.settings.macroMode : 'hotbar';
                const displayName = data.settings.displayName ? data.settings.displayName : false;
                const displayIcon = data.settings.displayIcon ? data.settings.displayIcon : false;
                const displayUses = data.settings.displayUses ? data.settings.displayUses : false;
                let background = data.settings.background ? data.settings.background : '#000000';
                let macroNumber = data.settings.macroNumber;
                if(macroNumber == undefined || isNaN(parseInt(macroNumber))) macroNumber = 1;

                if ((getPermission('MACRO','HOTBAR') == false )) {
                    game.materialDeck.streamDeck.noPermission(context,device);
                    return;
                }

                let src = "";
                let name = "";

                if (mode == 'Macro Board') continue;

                let macroId;
                if (mode == 'hotbar'){
                    macroId = game.user.hotbar[macroNumber];
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
                    if (hotbarUses && displayUses) uses = await this.getUses(macro);
                }
                if (settings.iconOverride != '' && settings.iconOverride != undefined) src = settings.iconOverride;
                game.materialDeck.streamDeck.setIcon(context,device,src,{background:background,uses:uses});
                game.materialDeck.streamDeck.setTitle(name,context);
            }
        }
    }

    keyPress(settings){
        const mode = settings.macroMode ? settings.macroMode : 'hotbar';
        let macroNumber = settings.macroNumber;
        if(macroNumber == undefined || isNaN(parseInt(macroNumber))) macroNumber = 0;
        let target = settings.target ? settings.target : undefined;

        if (mode == 'hotbar' || mode == 'visibleHotbar' || mode == 'customHotbar'){
            if ((getPermission('MACRO','HOTBAR') == false )) return;
            this.executeHotbar(macroNumber,mode,target, settings);
        }
        else if (mode == 'name') {
            if ((getPermission('MACRO', 'BY_NAME') == false)) return;
            const macro = getDocument('macro', settings.macroNumber);
            this.executeMacro(macro, settings.macroArgs, settings);
        }
        else {
            if ((getPermission('MACRO','MACROBOARD') == false )) return;
            if (settings.macroBoardMode == 'offset') {
                let macroOffset = settings.macroOffset;
                if (macroOffset == undefined) macroOffset = 0;
                this.offset = macroOffset;
                this.updateAll();
            }
            else 
                this.executeBoard(macroNumber, settings);
        }
    }

    executeMacro(macro, args, settings) {
        if (macro == undefined) {
            console.warn("Could not find macro");
            return;
        }
        if (args == undefined || args == '') args = "{}";
        let argument = {};
        try {
            argument = JSON.parse(args)
        } catch (err) {
            console.warn(`Could not parse macro arguments, make sure it is formatted correctly: {"argument1":value1, "argument2":value2, etc}`)
        }

        macro.execute({
            ...argument,
            // Add additional arguments for device updates
            deviceContext: settings.device,
            buttonContext: settings.context,
        });
    }

    executeHotbar(macroNumber,mode,target, macroSettings){
        let macroId;
        if (mode == 'hotbar') macroId = game.user.hotbar[macroNumber];
        else {
            let macros;
            if (mode == 'customHotbar' && game.modules.get('custom-hotbar') != undefined) { 
                macros = ui.customHotbar.macros;
            }
            else macros = game.macros.apps[0].macros;
            if (macroNumber > 9) macroNumber = 0;
            macroId = game.macros.apps[0].macros.find(m => m.key == macroNumber).macro?.id
        }

        if (!macroId) return;
        let macro = game.macros.get(macroId);

        macro.execute({
            token: target,
            // Add additional arguments for device updates
            deviceContext: macroSettings.device,
            buttonContext: macroSettings.context,
        });
    }

    executeBoard(macroNumber, macroSettings){
        macroNumber = parseInt(macroNumber);
        macroNumber += this.offset - 1;
        if (macroNumber < 0) macroNumber = 0;
        var macroId = game.settings.get(moduleName,'macroSettings').macros[macroNumber];

        if (macroId != undefined){
            let macro = game.macros.get(macroId);
            if (macro != undefined && macro != null) {
                // Parse macro arguments
                const args = game.settings.get(moduleName, 'macroSettings').args;

                let argument;
                try {
                    argument = JSON.parse(args[macroNumber] || "{}")
                } catch (err) {
                    //console.error(err)
                }
                macro.execute({
                    ...argument,
                    // Add additional arguments for device updates
                    deviceContext: macroSettings.device,
                    buttonContext: macroSettings.context,
                });
            }
        }
    }
}
