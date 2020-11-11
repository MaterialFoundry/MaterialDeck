import * as MODULE from "../MaterialDeck.js";
import {macroControl} from "../MaterialDeck.js";

export class playlistConfigForm extends FormApplication {
    constructor(data, options) {
        super(data, options);
        this.data = data;
    }

    /**
     * Default Options for this FormApplication
     */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "playlist-config",
            title: "Material Deck: "+game.i18n.localize("MaterialDeck.Sett.PlaylistConfig"),
            template: "./modules/MaterialDeck/templates/playlistConfig.html",
            classes: ["sheet"],
            width: 500
        });
    }

    /**
     * Provide data to the template
     */
    getData() {
        const selectedPlaylists = game.settings.get(MODULE.moduleName,'selectedPlaylists');
        let playlistData = {};

        for (let i=0; i<9; i++){
            let playlist;
            playlist = MODULE.getFromJSONArray(selectedPlaylists,i);

            let dataThis = {
                iteration: i+1,
                playlist: selectedPlaylists[i],
                playlists: game.playlists.entities
            }
            MODULE.setToJSONArray(playlistData,i,dataThis);
        }

        if (!this.data && selectedPlaylists) {
            this.data = selectedPlaylists;
        }
        return {
            playlists: game.playlists.entities,
            playlistData: playlistData,
            playMethod: game.settings.get(MODULE.moduleName,'playlistMethod')
        } 
    }

    /**
     * Update on form submit
     * @param {*} event 
     * @param {*} formData 
     */
    async _updateObject(event, formData) {
        await game.settings.set(MODULE.moduleName,'selectedPlaylists', formData["selectedPlaylist"]);
        await game.settings.set(MODULE.moduleName,'playlistMethod',formData["playMethod"]);
        

    }

    activateListeners(html) {
        super.activateListeners(html);

        
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class macroConfigForm extends FormApplication {
    constructor(data, options) {
        super(data, options);
        this.data = data;
    }

    /**
     * Default Options for this FormApplication
     */
    static get defaultOptions() {
        let streamDeckModel = game.settings.get(MODULE.moduleName,'streamDeckModel');
        let width;
        if (streamDeckModel == 0)
            width = 500;
        else if (streamDeckModel == 1)
            width= 800;
        else   
            width = 1400;

        return mergeObject(super.defaultOptions, {
            id: "macro-config",
            title: "Material Deck: "+game.i18n.localize("MaterialDeck.Sett.MacroConfig"),
            template: "./modules/MaterialDeck/templates/macroConfig.html",
            classes: ["sheet"],
            width: width
        });
    }
    
    /**
     * Provide data to the template
     */
    getData() {
        var selectedMacros = game.settings.get(MODULE.moduleName,'macroSettings').macros;
        var color = game.settings.get(MODULE.moduleName,'macroSettings').color;
        var args = game.settings.get(MODULE.moduleName,'macroArgs');
        if (selectedMacros == undefined) selectedMacros = [];
        if (color == undefined) color = [];
        if (args == undefined) args = [];
        let macroData = {};
        let furnaceEnabled = false;
        let furnace = game.modules.get("furnace");
        if (furnace != undefined && furnace.active) furnaceEnabled = true;
        let height = 95;
        if (furnaceEnabled) height += 50;

        let streamDeckModel = game.settings.get(MODULE.moduleName,'streamDeckModel');
        let iMax,jMax;
        if (streamDeckModel == 0){
            jMax = 6;
            iMax = 3;
        }
        else if (streamDeckModel == 1){
            jMax = 6;
            iMax = 5;
        }
        else {
            jMax = 8;
            iMax = 8;
        }

        let iteration = 0;
        for (let j=0; j<jMax; j++){
            let macroThis = {};
      
            for (let i=0; i<iMax; i++){
                let colorThis = color[iteration];
                if (colorThis != undefined){
                    let colorCorrect = true;
                    if (colorThis[0] != '#') colorCorrect = false;
                    for (let k=0; k<6; k++){
                        if (parseInt(colorThis[k+1],16)>15)
                            colorCorrect = false;
                    }
                    if (colorCorrect == false) colorThis = '#000000'; 
                }
                else 
                    colorThis = '#000000';
                    
                let dataThis = {
                    iteration: iteration+1,
                    macro: selectedMacros[iteration],
                    color: colorThis,
                    macros:game.macros,
                    args: args[iteration],
                    furnace: furnaceEnabled
                }
                MODULE.setToJSONArray(macroThis,i,dataThis);
                iteration++;
            }
            let data = {
                dataThis: macroThis,
            };
            MODULE.setToJSONArray(macroData,j,data);
        }
        
        return {
            height: height,
            macros: game.macros,
            selectedMacros: selectedMacros,
            macroData: macroData,
        } 
    }

    /**
     * Update on form submit
     * @param {*} event 
     * @param {*} formData 
     */
    async _updateObject(event, formData) {
       await game.settings.set(MODULE.moduleName,'macroSettings',{
            macros: formData["macros"],
            color: formData["colorPicker"]
       });

        let furnace = game.modules.get("furnace");
        if (furnace != undefined && furnace.active) 
            await game.settings.set(MODULE.moduleName,'macroArgs', formData["args"]);
        macroControl.updateAll();
    }

    activateListeners(html) {
        super.activateListeners(html); 
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class soundboardConfigForm extends FormApplication {
    constructor(data, options) {
        super(data, options);
        this.data = data;
        //this.soundData = {};
        this.playlist;
        this.updatePlaylist = false;
    }

    /**
     * Default Options for this FormApplication
     */
    static get defaultOptions() {
        let streamDeckModel = game.settings.get(MODULE.moduleName,'streamDeckModel');
        let width;
        if (streamDeckModel == 0)
            width = 500;
        else if (streamDeckModel == 1)
            width= 800;
        else   
            width = 1400;

        return mergeObject(super.defaultOptions, {
            id: "soundboard-config",
            title: "Material Deck: "+game.i18n.localize("MaterialDeck.Sett.SoundboardConfig"),
            template: "./modules/MaterialDeck/templates/soundboardConfig.html",
            classes: ["sheet"],
            width: width,
            height: 720
        });
    }
    
    getArray(data){
        let array = [data.a,data.b,data.c,data.d,data.e,data.f,data.g,data.h];
        return array;
    }

    /**
     * Provide data to the template
     */
    getData() {
        let playlistId = game.settings.get(MODULE.moduleName,'soundboardSettings').playlist;
        if (this.updatePlaylist) playlistId = this.playlist;
        this.updatePlaylist = false;
        let playlist = 'none';
        let sounds = [];
        if (playlistId != undefined){
            playlist = game.playlists.entities.find(p => p._id == playlistId);
            if (playlist != undefined) sounds = playlist.sounds;
            else playlist = 'none';
        }
        let selectedSounds = game.settings.get(MODULE.moduleName,'soundboardSettings').sounds;
        let colorOn = game.settings.get(MODULE.moduleName,'soundboardSettings').colorOn;
        let colorOff = game.settings.get(MODULE.moduleName,'soundboardSettings').colorOff;
        let mode = game.settings.get(MODULE.moduleName,'soundboardSettings').mode;
        let volume = game.settings.get(MODULE.moduleName,'soundboardSettings').volume;
        let img = game.settings.get(MODULE.moduleName,'soundboardSettings').img;
        let name = game.settings.get(MODULE.moduleName,'soundboardSettings').name;

        if (selectedSounds == undefined) selectedSounds = [];
        if (colorOn == undefined) colorOn = [];
        if (colorOff == undefined) colorOff = [];
        if (mode == undefined) mode = [];
        if (img == undefined) img = [];
        if (name == undefined) name = [];
        let soundData = {};

        let streamDeckModel = game.settings.get(MODULE.moduleName,'streamDeckModel');
        let iMax,jMax;
        if (streamDeckModel == 0){
            jMax = 6;
            iMax = 3;
        }
        else if (streamDeckModel == 1){
            jMax = 6;
            iMax = 5;
        }
        else {
            jMax = 8;
            iMax = 8;
        }

        let iteration = 0;

        for (let j=0; j<jMax; j++){
            let soundsThis = {};
            for (let i=0; i<iMax; i++){
                if (volume == undefined) volume = 50;
                

                let dataThis = {
                    iteration: iteration+1,
                    sound: selectedSounds[iteration],
                    sounds: sounds,
                    colorOn: colorOn[iteration],
                    colorOff: colorOff[iteration],
                    mode: mode[iteration],
                    volume: volume[iteration],
                    imgPath: img[iteration],
                    name: name[iteration]
                }
                MODULE.setToJSONArray(soundsThis,i,dataThis);
                iteration++;
            }
            let data = {
                dataThis: soundsThis,
            };
            MODULE.setToJSONArray(soundData,j,data);

        }
        return {
            playlists: game.playlists.entities,
            playlist: playlistId,
            sounds: sounds,
            selectedSound81: selectedSounds.a,
            soundData: soundData,
        } 
    }

    /**
     * Update on form submit
     * @param {*} event 
     * @param {*} formData 
     */
    async _updateObject(event, formData) {
        let length = formData["sounds"].length;
        let img = [];
        for (let i=0; i<length; i++){
            let name = "img"+(i+1);
            let src = formData[name];
            img[i] = src;
        }

        await game.settings.set(MODULE.moduleName,'soundboardSettings',{
            playlist: formData["playlist"],
            sounds: formData["sounds"],
            colorOn: formData["colorOn"],
            colorOff: formData["colorOff"],
            mode: formData["mode"],
            img: img,
            volume: formData["volume"],
            name: formData["name"]
        });
        //MODULE.launchpad.audioSoundboardUpdate();
    }

    async activateListeners(html) {
        super.activateListeners(html);
        const colorPickerOn = html.find("button[name='colorPickerOn']");
        const colorPickerOff = html.find("button[name='colorPickerOff']");
        const playlistSelect = html.find("select[name='playlist']");
        const volumeSlider = html.find("input[name='volume']");
        const soundSelect = html.find("select[name='sounds']");

        /*
        colorPickerOn.on('click',(event) => {
            let target = event.currentTarget.value;
            let color = document.getElementById("colorOn"+target).value;
            if ((color < 0 && color > 127) || color == "") color = 0;
            MODULE.launchpad.colorPicker(target,1,color);
            
        });
        colorPickerOff.on('click',(event) => {
            let target = event.currentTarget.value;
            let color = document.getElementById("colorOff"+target).value;
            if ((color < 0 && color > 127) || color == "") color = 0;
            MODULE.launchpad.colorPicker(target,0,color);
            
        });
        if (playlistSelect.length > 0) {
            playlistSelect.on("change", event => {
                this.playlist = event.target.value;
                this.updatePlaylist = true;
                this.render();
            });
        }
        volumeSlider.on('change', event => {
            let id = event.target.id.replace('volume','');
            let column = id%10-1;
            let row = 8-Math.floor(id/10);
            id = row*8+column;
            let settings = game.settings.get(MODULE.moduleName,'soundboardSettings');
            settings.volume[id] = event.target.value;
            game.settings.set(MODULE.moduleName,'soundboardSettings',settings);
            if (MODULE.launchpad.activeSounds[id] != false){
                let volume = AudioHelper.inputToVolume(event.target.value/100) * game.settings.get("core", "globalInterfaceVolume");
                MODULE.launchpad.activeSounds[id].volume(volume);
            }
        });
        if (soundSelect.length > 0) {
            soundSelect.on("change",event => {
                let id = event.target.id.replace('soundSelect','');
                let column = id%10-1;
                let row = 8-Math.floor(id/10);
                id = row*8+column;
                let settings = game.settings.get(MODULE.moduleName,'soundboardSettings');
                settings.sounds[id] = event.target.value;
                game.settings.set(MODULE.moduleName,'soundboardSettings',settings);
                if (MODULE.launchpad.activeSounds[id] != false){
                    let mode = settings.mode[id];
                    let repeat = false;
                    if (mode == 1) repeat = true;
                    MODULE.launchpad.playSound(id,repeat,false);
                }
            });
        }
        */
    }
    
}