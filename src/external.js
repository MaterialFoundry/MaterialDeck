import * as MODULE from "../MaterialDeck.js";
import {streamDeck} from "../MaterialDeck.js";

export class ExternalModules{
    constructor(){
        this.active = false;
        this.gmScreenOpen = false;
    }

    async updateAll(data={}){
        if (data.gmScreen != undefined){
            this.gmScreenOpen = data.gmScreen.isOpen;
        }
        if (this.active == false) return;
        for (let i=0; i<32; i++){   
            const data = streamDeck.buttonContext[i];
            if (data == undefined || data.action != 'external') continue;
            await this.update(data.settings,data.context);
        }
    }

    update(settings,context){
        this.active = true;
        const module = settings.module ? settings.module : 'fxmaster';

        if (module == 'fxmaster')           this.updateFxMaster(settings,context);
        else if (module == 'gmscreen')      this.updateGMScreen(settings,context);
        else if (module == 'triggerHappy')  this.updateTriggerHappy(settings,context);
        else if (module == 'sharedVision')  this.updateSharedVision(settings,context);
        else if (module == 'mookAI')        this.updateMookAI(settings,context);
        else if (module == 'notYourTurn')   this.updateNotYourTurn(settings,context);
        else if (module == 'lockView')      this.updateLockView(settings,context);
    }

    keyPress(settings,context){
        if (this.active == false) return;
        const module = settings.module ? settings.module : 'fxmaster';

        if (module == 'fxmaster')           this.keyPressFxMaster(settings,context);
        else if (module == 'gmscreen')      this.keyPressGMScreen(settings,context);
        else if (module == 'triggerHappy')  this.keyPressTriggerHappy(settings,context);
        else if (module == 'sharedVision')  this.keyPressSharedVision(settings,context);
        else if (module == 'mookAI')        this.keyPressMookAI(settings,context);
        else if (module == 'notYourTurn')   this.keyPressNotYourTurn(settings,context);
        else if (module == 'lockView')      this.keyPressLockView(settings,context);
        
    }

    getModuleEnable(moduleId){
        const module = game.modules.get(moduleId);
        if (module == undefined || module.active == false) return false;
        return true;
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //FxMaster
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    updateFxMaster(settings,context){
        if (game.user.isGM == false) return;
        const fxmaster = game.modules.get("fxmaster");
        if (fxmaster == undefined || fxmaster.active == false) return;

        const type = (settings.fxMasterType == undefined) ? 'weatherControls' : settings.fxMasterType;
        const displayIcon = settings.displayFxMasterIcon;
        const displayName = settings.displayFxMasterName;
        let ring = 0;
        let ringColor = "#000000";
        let background = "#000000"

        let icon = '';
        let name = '';
        if (type == 'weatherControls') {
            const effect = (settings.weatherEffect == undefined) ? 'leaves' : settings.weatherEffect;
            name = CONFIG.weatherEffects[effect].label;
            icon = CONFIG.weatherEffects[effect].icon;
            ring = this.findWeatherEffect(effect) != undefined ? 2 : 1;
            ringColor = ring < 2 ? '#000000' : "#00ff00";
        }
        else if (type == 'colorize') {
            background = (settings.fxMasterColorizeColor == undefined) ? '#000000' : settings.fxMasterColorizeColor;
            icon = "fas fa-palette";
            name = game.i18n.localize("MaterialDeck.FxMaster.Colorize");
            const filters = canvas.scene.getFlag("fxmaster", "filters");
            ring = 2;
            if (filters == undefined || filters['core_color'] == undefined) {
                ringColor = "#000000";
            }
            else {
                const colors = filters['core_color'].options;
                let red = Math.ceil(colors.red*255).toString(16);
                if (red.length == 1) red = '0' + red;
                let green = Math.ceil(colors.green*255).toString(16);
                if (green.length == 1) green = '0' + green;
                let blue = Math.ceil(colors.blue*255).toString(16);
                if (blue.length == 1) blue = '0' + blue;
                ringColor = "#" + red + green + blue;
            }
        }
        else if (type == 'filters') {
            const filter = (settings.fxMasterFilter == undefined) ? 'underwater' : settings.fxMasterFilter;
            name = CONFIG.fxmaster.filters[filter].label;
            background = "#340057";
            if (displayIcon){
                if (filter == 'underwater') icon = "fas fa-water";
                else if (filter == 'predator') icon = "fas fa-wave-square";
                else if (filter == 'oldfilm') icon = "fas fa-film";
                else if (filter == 'bloom') icon = "fas fa-ghost";
            }
            const fxmaster = canvas.scene.getFlag("fxmaster", "filters");
            ring = 1;
            if (fxmaster != undefined) {
                const objKeys = Object.keys(fxmaster);
                for (let i=0; i<objKeys.length; i++){
                    if (objKeys[i] == "core_"+filter) {
                        ring = 2;
                        ringColor = "#A600FF";
                        break;
                    }
                }
            }
        }
        else if (type == 'clear'){
            icon = "fas fa-trash";
            name = game.i18n.localize("MaterialDeck.FxMaster.Clear");
        }

        if (displayIcon) streamDeck.setIcon(context,icon,background,ring,ringColor);
        else streamDeck.setIcon(context, "", background,ring,ringColor);
        if (displayName == 0) name = ""; 
        streamDeck.setTitle(name,context);
    }

    hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          red: parseInt(result[1], 16)/256,
          green: parseInt(result[2], 16)/256,
          blue: parseInt(result[3], 16)/256
        } : null;
      }

    keyPressFxMaster(settings,context){
        if (game.user.isGM == false) return;
        const fxmaster = game.modules.get("fxmaster");
        if (fxmaster == undefined || fxmaster.active == false) return;

        const type = (settings.fxMasterType == undefined) ? 'weatherControls' : settings.fxMasterType;

        if (type == 'weatherControls') {
            const effect = (settings.weatherEffect == undefined) ? 'leaves' : settings.weatherEffect;
            let exists = false;
            let newEffects = {};
            let effects = canvas.scene.getFlag("fxmaster", "effects");
            if (effects != undefined){
                const weatherIds = Object.keys(effects);
                for (let i=0; i<weatherIds.length; i++){
                    const weather = effects[weatherIds[i]].type;
                    if (weather === effect) {
                        exists = true;
                        continue;
                    } 
                    newEffects[weatherIds[i]] = effects[weatherIds[i]]; 
                }
            }

            const density = (settings.densitySlider == undefined) ? 50 : settings.densitySlider;
            const speed = (settings.speedSlider == undefined) ? 50 : settings.speedSlider;
            const direction = (settings.directionSlider == undefined) ? 50 : settings.directionSlider;
            const scale = (settings.scaleSlider == undefined) ? 50 : settings.scaleSlider;
            const color = (settings.fxMasterWeatherColor == undefined) ? "#000000" : settings.fxMasterWeatherColor;
            const applyColor = (settings.fxWeatherEnColor == undefined) ? false : settings.fxWeatherEnColor;
            
            if (exists == false) {
                newEffects[randomID()] = {
                    type: effect,
                    options: {
                        density: density,
                        speed: speed,
                        scale: scale,
                        tint: color,
                        direction: direction,
                        apply_tint: applyColor
                    }
                };
            }
            canvas.scene.unsetFlag("fxmaster", "effects").then(() => {
                canvas.scene.setFlag("fxmaster", "effects", newEffects);
            });
            
        }
        else if (type == 'colorize') {
            const color = (settings.fxMasterColorizeColor == undefined) ? '#000000' : settings.fxMasterColorizeColor;
            const filters = canvas.scene.getFlag("fxmaster", "filters");
            let newFilters = {};
            if (filters != undefined){
                const filterObjects = Object.keys(filters);
                for (let i=0; i<filterObjects.length; i++){
                    if (filterObjects[i] == 'core_color'){
                        //continue;
                    }
                    newFilters[filterObjects[i]] = filters[filterObjects[i]]; 
                }
            }
            newFilters['core_color'] = {
                type : 'color',
                options: this.hexToRgb(color)
            };
            
            canvas.scene.unsetFlag("fxmaster", "filters").then(() => {
                canvas.scene.setFlag("fxmaster", "filters", newFilters);
            });

        }
        else if (type == 'filters') {
            const filter = (settings.fxMasterFilter == undefined) ? 'underwater' : settings.fxMasterFilter;
            const filters = canvas.scene.getFlag("fxmaster", "filters");
            let newFilters = {};
            let exists = false;
            if (filters != undefined){
                const filterObjects = Object.keys(filters);
                for (let i=0; i<filterObjects.length; i++){
                    if (filterObjects[i] == 'core_'+filter){
                        exists = true;
                        continue;
                    }
                    newFilters[filterObjects[i]] = filters[filterObjects[i]]; 
                }
                
            }
            if (exists == false) {
                newFilters['core_'+filter] = {type : filter};
            }
            canvas.scene.unsetFlag("fxmaster", "filters").then(() => {
                canvas.scene.setFlag("fxmaster", "filters", newFilters);
            });
        }
        else if (type == 'clear'){
            canvas.scene.unsetFlag("fxmaster", "filters");
            canvas.scene.unsetFlag("fxmaster", "effects");
        }
    }

    findWeatherEffect(effect){
        const effects = canvas.scene.getFlag("fxmaster", "effects");
        if (effects == undefined) return undefined;

        const weatherIds = Object.keys(effects);
        for (let i = 0; i < weatherIds.length; ++i) {
            const weather = effects[weatherIds[i]].type;
            if (weather === effect) return weatherIds[i];
        }
        return undefined;
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //GM Screen
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////

    updateGMScreen(settings,context){
        if (this.getModuleEnable("gm-screen") == false) return;
        if (game.user.isGM == false) return;

        const background = settings.gmScreenBackground ? settings.gmScreenBackground : '#000000';
        let ring = 1;
        const ringColor = '#00FF00'
        let src = '';
        let txt = '';

        if (this.gmScreenOpen) ring = 2;
        
        if (settings.displayGmScreenIcon) src = "fas fa-book-reader";
        streamDeck.setIcon(context,src,background,ring,ringColor);
        if (settings.displayGmScreenName) txt = game.i18n.localize(`GMSCR.gmScreen.Open`); 
        streamDeck.setTitle(txt,context);
    }

    keyPressGMScreen(settings,context){
        if (this.getModuleEnable("gm-screen") == false) return;
        if (game.user.isGM == false) return;
        window['gm-screen'].toggleGmScreenVisibility();
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Trigger Happy
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////

    updateTriggerHappy(settings,context) {
        if (this.getModuleEnable("trigger-happy") == false) return;
        if (game.user.isGM == false) return;
        
        const displayName = settings.displayTriggerHappyName ? settings.displayTriggerHappyName : false;
        const displayIcon = settings.displayTriggerHappyIcon ? settings.displayTriggerHappyIcon : false;

        const background = "#340057";
        const ringColor = game.settings.get("trigger-happy", "enableTriggers") ? "#A600FF" : "#340057";

        let txt = '';
        if (displayIcon) streamDeck.setIcon(context,"fas fa-grin-squint-tears",background,2,ringColor);
        else streamDeck.setIcon(context,'','#000000');
        if (displayName) txt = 'Trigger Happy';
        
        streamDeck.setTitle(txt,context);
    }

    keyPressTriggerHappy(settings,context){
        if (this.getModuleEnable("trigger-happy") == false) return;
        if (game.user.isGM == false) return;
        const mode = settings.triggerHappyMode ? settings.triggerHappyMode : 'toggle';

        let val = game.settings.get("trigger-happy", "enableTriggers");
        if (mode == 'toggle') val = !val;
        else if (mode == 'enable') val = true;
        else if (mode == 'disable') val = false;

        game.settings.set("trigger-happy", "enableTriggers", val);

        const control = ui.controls.controls.find(c => c.name == 'token');
        if (control == undefined) return;
        let tool = control.tools.find(t => t.name == 'triggers');
        if (tool == undefined) return;
        tool.active = val;
        ui.controls.render(); 
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Shared Vision
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    updateSharedVision(settings,context) {
        if (this.getModuleEnable("SharedVision") == false) return;
        if (game.user.isGM == false) return;
        
        const displayName = settings.sharedVisionName ? settings.sharedVisionName : false;
        const displayIcon = settings.sharedVisionIcon ? settings.sharedVisionIcon : false;

        const background = "#340057";
        const ringColor = game.settings.get("SharedVision", "enable") ? "#A600FF" : "#340057";

        let txt = '';
        if (displayIcon) streamDeck.setIcon(context,"fas fa-eye",background,2,ringColor);
        else streamDeck.setIcon(context,'','#000000');
        if (displayName) txt = 'Shared Vision';
        streamDeck.setTitle(txt,context);
    }

    keyPressSharedVision(settings,context) {
        if (this.getModuleEnable("SharedVision") == false) return;
        if (game.user.isGM == false) return;

        const mode = settings.sharedVisionMode ? settings.sharedVisionMode : 'toggle';

        if (mode == 'toggle') Hooks.call("setShareVision",{enable:'toggle'});
        else if (mode == 'enable') Hooks.call("setShareVision",{enable:true});
        else if (mode == 'disable') Hooks.call("setShareVision",{enable:false});
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Mook AI
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    updateMookAI(settings,context) {
        if (this.getModuleEnable("mookAI") == false) return;
        if (game.user.isGM == false) return;
        
        const displayName = settings.mookName ? settings.mookName : false;
        const displayIcon = settings.mookIcon ? settings.mookIcon : false;

        const background = "#000000";

        let txt = '';
        if (displayIcon) streamDeck.setIcon(context,"fas fa-brain",'#000000');
        else streamDeck.setIcon(context,'','#000000');
        if (displayName) txt = 'Mook AI';
        streamDeck.setTitle(txt,context);
    }

    async keyPressMookAI(settings,context) {
        if (this.getModuleEnable("mookAI") == false) return;
        if (game.user.isGM == false) return;
        
        let mook = await import('../../mookAI/scripts/mookAI.js');
        let mookAI = new mook.MookAI ();
        mookAI.takeNextTurn();
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Not Your Turn!
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    updateNotYourTurn(settings,context) {
        
        if (this.getModuleEnable("NotYourTurn") == false) return;
        if (game.user.isGM == false) return;

        const mode = settings.notYourTurnMode ? settings.notYourTurnMode : 'toggle';
        const displayName = settings.notYourTurnName ? settings.notYourTurnName : false;
        const displayIcon = settings.notYourTurnIcon ? settings.notYourTurnIcon : false;

        const background = "#340057";
        let ringColor = "#340057" ;

        let txt = '';
        let icon = '';
        if (mode == 'toggle' || mode == 'enable' || mode == 'disable') {
            icon = "fas fa-fist-raised";
            txt = "Block Combat Movement";
            ringColor = game.settings.get('NotYourTurn','enable') ?  "#A600FF": "#340057" ;
        }
        else {
            icon = "fas fa-lock";
            txt = "Block Non-Combat Movement";
            ringColor = game.settings.get('NotYourTurn','nonCombat') ?  "#A600FF": "#340057" ;
        }
        if (displayIcon) streamDeck.setIcon(context,icon,background,2,ringColor);
        else streamDeck.setIcon(context,'','#000000');
        if (displayName == false) txt = '';
        streamDeck.setTitle(txt,context);
    }

    async keyPressNotYourTurn(settings,context) {
        if (this.getModuleEnable("NotYourTurn") == false) return;
        if (game.user.isGM == false) return;

        const mode = settings.notYourTurnMode ? settings.notYourTurnMode : 'toggle';

        if (mode == 'toggle') Hooks.call("setNotYourTurn",{combat:'toggle'});
        else if (mode == 'enable') Hooks.call("setNotYourTurn",{combat:true});
        else if (mode == 'disable') Hooks.call("setNotYourTurn",{combat:false});
        else if (mode == 'toggleNonCombat') Hooks.call("setNotYourTurn",{nonCombat:'toggle'});
        else if (mode == 'enableNonCombat') Hooks.call("setNotYourTurn",{nonCombat:true});
        else if (mode == 'disableNonCombat') Hooks.call("setNotYourTurn",{nonCombat:false});
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Lock View
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    updateLockView(settings,context) {
        
        if (this.getModuleEnable("LockView") == false) return;
        if (game.user.isGM == false) return;

        const mode = settings.lockViewMode ? settings.lockViewMode : 'panLock';
        const displayName = settings.lockViewName ? settings.lockViewName : false;
        const displayIcon = settings.lockViewIcon ? settings.lockViewIcon : false;

        const background = "#340057";
        let ringColor = "#340057" ;

        let txt = '';
        let icon = '';
        if (mode == 'panLock') {
            icon = "fas fa-arrows-alt";
            txt = "Pan Lock";
            ringColor = canvas.scene.getFlag('LockView', 'lockPan') ?  "#A600FF": "#340057" ;
        }
        else if (mode == 'zoomLock') {
            icon = "fas fa-search-plus";
            txt = "Zoom Lock";
            ringColor = canvas.scene.getFlag('LockView', 'lockZoom') ?  "#A600FF": "#340057" ;
        }
        else if (mode == 'boundingBox') {
            icon = "fas fa-box";
            txt = "Bounding Box";
            ringColor = canvas.scene.getFlag('LockView', 'boundingBox') ?  "#A600FF": "#340057" ;
        }
        
        if (displayIcon) streamDeck.setIcon(context,icon,background,2,ringColor);
        else streamDeck.setIcon(context,'','#000000');
        if (displayName == false) txt = '';
        streamDeck.setTitle(txt,context);
    }

    async keyPressLockView(settings,context) {
        if (this.getModuleEnable("LockView") == false) return;
        if (game.user.isGM == false) return;

        const mode = settings.lockViewMode ? settings.lockViewMode : 'panLock';
        let toggle = settings.lockViewToggle ? settings.lockViewToggle : 'toggle';
        if (toggle == 'enable') toggle = true;
        else if (toggle == 'disable') toggle = false;
        let msg = {};

        if (mode == 'panLock') msg = {panLock:toggle};
        else if (mode == 'zoomLock') msg = {zoomLock:toggle};
        else if (mode == 'boundingBox') msg = {boundingBox:toggle};

        Hooks.call("setLockView",msg);
    }
}


