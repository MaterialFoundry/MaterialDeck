import * as MODULE from "../MaterialDeck.js";
import {macroControl} from "../MaterialDeck.js";

export class playlistConfigForm extends FormApplication {
    constructor(data, options) {
        super(data, options);
        this.data = data;
        this.playlistNr;
        this.updatePlaylistNr = false;
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
        let selectedPlaylists = game.settings.get(MODULE.moduleName,'selectedPlaylists');
        if (selectedPlaylists == undefined) selectedPlaylists = [];
        let selectedPlaylistMethod = game.settings.get(MODULE.moduleName, 'selectedPlaylistMethod');
        if (selectedPlaylistMethod == undefined) selectedPlaylistMethod = [];
        let playlistData = [];
        let numberOfPlaylists = game.settings.get(MODULE.moduleName,'numberOfPlaylists');
        if (this.updatePlaylistNr) numberOfPlaylists = this.playlistNr;
        this.updatePlaylistNr = false;
        for (let i=0; i<numberOfPlaylists; i++){
            if (selectedPlaylists[i] == undefined) selectedPlaylists[i] = 'none';
            if (selectedPlaylistMethod[i] == undefined) selectedPlaylistMethod[i] = 0;
            let dataThis = {
                iteration: i+1,
                playlist: selectedPlaylists[i],
                playlistMethod: selectedPlaylistMethod[i],
                playlists: game.playlists.entities
            }
            playlistData.push(dataThis);
        }
        if (!this.data && selectedPlaylists) {
            this.data = selectedPlaylists;
        }
        return {
            playlists: game.playlists.entities,
            numberOfPlaylists: numberOfPlaylists,
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
        await game.settings.set(MODULE.moduleName,'numberOfPlaylists',formData["plNum"]);
        await game.settings.set(MODULE.moduleName,'selectedPlaylistMethod',formData["playlistMethod"]);

    }

    activateListeners(html) {
        super.activateListeners(html);
        const numberOfPlaylists = html.find("input[name='plNum']");
        numberOfPlaylists.on("change", event => {
            this.playlistNr = event.target.value;
            this.updatePlaylistNr = true;
            this.render();
        });
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
        /*
        let streamDeckModel = game.settings.get(MODULE.moduleName,'streamDeckModel');
        let width;
        if (streamDeckModel == 0)
            width = 550;
        else if (streamDeckModel == 1)
            width= 885;
        else   
            width = 1400;
        */
        return mergeObject(super.defaultOptions, {
            id: "macro-config",
            title: "Material Deck: "+game.i18n.localize("MaterialDeck.Sett.MacroConfig"),
            template: "./modules/MaterialDeck/templates/macroConfig.html",
            classes: ["sheet"]
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
        let macroData = [];
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
            let macroThis = [];
      
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
                macroThis.push(dataThis);
                iteration++;
            }
            let data = {
                dataThis: macroThis,
            };
            macroData.push(data);
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
        if (MODULE.enableModule)
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
        this.playlists = [];
        this.updatePlaylist = false;
    }

    /**
     * Default Options for this FormApplication
     */
    static get defaultOptions() {
        /*
        let streamDeckModel = game.settings.get(MODULE.moduleName,'streamDeckModel');
        let width;
        if (streamDeckModel == 0)
            width = 550;
        else if (streamDeckModel == 1)
            width= 885;
        else   
            width = 1400;
        */
        return mergeObject(super.defaultOptions, {
            id: "soundboard-config",
            title: "Material Deck: "+game.i18n.localize("MaterialDeck.Sett.SoundboardConfig"),
            template: "./modules/MaterialDeck/templates/soundboardConfig.html",
            classes: ["sheet"],
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
        let selectedSounds = game.settings.get(MODULE.moduleName,'soundboardSettings').sounds;
        let colorOn = game.settings.get(MODULE.moduleName,'soundboardSettings').colorOn;
        let colorOff = game.settings.get(MODULE.moduleName,'soundboardSettings').colorOff;
        let mode = game.settings.get(MODULE.moduleName,'soundboardSettings').mode;
        let volume = game.settings.get(MODULE.moduleName,'soundboardSettings').volume;
        let img = game.settings.get(MODULE.moduleName,'soundboardSettings').img;
        let name = game.settings.get(MODULE.moduleName,'soundboardSettings').name;
        let selectedPlaylists = game.settings.get(MODULE.moduleName,'soundboardSettings').selectedPlaylists;
        let src = game.settings.get(MODULE.moduleName,'soundboardSettings').src;

        let playlists = [];
        playlists.push({id:"none",name:game.i18n.localize("MaterialDeck.None")});
        playlists.push({id:"FP",name:game.i18n.localize("MaterialDeck.FilePicker")})
        for (let i=0; i<game.playlists.entities.length; i++){
            playlists.push({id:game.playlists.entities[i]._id,name:game.playlists.entities[i].name});
        }

        if (selectedSounds == undefined) selectedSounds = [];
        if (colorOn == undefined) colorOn = [];
        if (colorOff == undefined) colorOff = [];
        if (mode == undefined) mode = [];
        if (img == undefined) img = [];
        if (name == undefined) name = [];
        if (selectedPlaylists == undefined) selectedPlaylists = [];
        if (src == undefined) src = [];
        let soundData = [];

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

        if (this.updatePlaylist) selectedPlaylists = this.playlists;
        else this.playlists = selectedPlaylists;
        this.updatePlaylist = false;

        let iteration = 0;

        for (let j=0; j<jMax; j++){
            let soundsThis = [];
            for (let i=0; i<iMax; i++){
                let selectedPlaylist;
                let sounds = [];
                if (volume == undefined) volume = 50;
                if (selectedPlaylists[iteration]==undefined) selectedPlaylist = 'none';
                else if (selectedPlaylists[iteration] == 'none') selectedPlaylist = 'none';
                else if (selectedPlaylists[iteration] == 'FP') selectedPlaylist = 'FP';
                else {
                    const pl = game.playlists.entities.find(p => p._id == selectedPlaylists[iteration]);
                    selectedPlaylist = pl._id;
                    sounds = pl.sounds;
                }
                let styleSS = "";
                let styleFP ="display:none";
                if (selectedPlaylist == 'FP') {
                    styleSS = 'display:none';
                    styleFP = ''
                }
                let dataThis = {
                    iteration: iteration+1,
                    playlists: playlists,
                    selectedPlaylist: selectedPlaylist,
                    sound: selectedSounds[iteration],
                    sounds: sounds,
                    srcPath: src[iteration],
                    colorOn: colorOn[iteration],
                    colorOff: colorOff[iteration],
                    mode: mode[iteration],
                    volume: volume[iteration],
                    imgPath: img[iteration],
                    name: name[iteration],
                    styleSS: styleSS,
                    styleFP: styleFP
                }
                soundsThis.push(dataThis);
                iteration++;
            }
            let data = {
                dataThis: soundsThis,
            };
            soundData.push(data);
        }
        return {
            soundData: soundData
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
        let soundSrc = []
        for (let i=0; i<length; i++){
            let name = "img"+(i+1);
            let src = formData[name];
            img[i] = src;

            name = "src"+(i+1);
            src = formData[name];
            soundSrc[i] = src;
        }

        await game.settings.set(MODULE.moduleName,'soundboardSettings',{
            selectedPlaylists: formData["playlist"],
            sounds: formData["sounds"],
            colorOn: formData["colorOn"],
            colorOff: formData["colorOff"],
            mode: formData["mode"],
            img: img,
            volume: formData["volume"],
            name: formData["name"],
            src: soundSrc
        });
    }

    async activateListeners(html) {
        super.activateListeners(html);
        const playlistSelect = html.find("select[name='playlist']");

        if (playlistSelect.length > 0) {
            playlistSelect.on("change", event => {
                let id = event.target.id.replace('playlists','');
                this.playlists[id-1] = event.target.value;
                this.updatePlaylist = true;
                this.render();
            });
        }
    }
    
}