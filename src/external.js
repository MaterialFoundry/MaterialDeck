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
            let data = streamDeck.buttonContext[i];
            if (data == undefined || data.action != 'external') continue;
            await this.update(data.settings,data.context);
        }
    }

    update(settings,context){
        this.active = true;
        let module = settings.module;
        if (module == undefined) module = 'fxmaster';

        if (module == 'fxmaster') this.updateFxMaster(settings,context);
        else if (module == 'gmscreen') this.updateGMScreen(settings,context);
        
    }

    keyPress(settings,context){
        if (this.active == false) return;
        let module = settings.module;
        if (module == undefined) module = 'fxmaster';

        if (module == 'fxmaster')    
            this.keyPressFxMaster(settings,context);
        else if (module == 'gmscreen')
            this.keyPressGMScreen(settings,context);
        
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

        const background = settings.gmScreenBackground ? settings.gmScreenBackground : '#000000';
        let ring = 1;
        let ringColor = '#00FF00'
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
        window['gm-screen'].toggleGmScreenVisibility();
    }
}