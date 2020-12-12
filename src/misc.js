import * as MODULE from "../MaterialDeck.js";
import {macroControl,soundboard,playlistControl} from "../MaterialDeck.js";

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
        let settings = game.settings.get(MODULE.moduleName,'playlists');
        let selectedPlaylists = settings.selectedPlaylist;
        if (selectedPlaylists == undefined) selectedPlaylists = [];
        let selectedPlaylistMode = settings.playlistMode;
        if (selectedPlaylistMode == undefined) selectedPlaylistMode = [];
        let numberOfPlaylists = settings.playlistNumber;
        if (this.updatePlaylistNr) numberOfPlaylists = this.playlistNr;
        if (numberOfPlaylists == undefined) numberOfPlaylists = 9;
        let playMode = settings.playMode;
        if (playMode == undefined) playMode = 0;
        let playlistData = [];
        
        this.updatePlaylistNr = false;
        for (let i=0; i<numberOfPlaylists; i++){
            if (selectedPlaylists[i] == undefined) selectedPlaylists[i] = 'none';
            if (selectedPlaylistMode[i] == undefined) selectedPlaylistMode[i] = 0;
            let dataThis = {
                iteration: i+1,
                playlist: selectedPlaylists[i],
                playlistMode: selectedPlaylistMode[i],
                playlists: game.playlists.entities
            }
            playlistData.push(dataThis);
        }

        this.data = {
            playMode: playMode,
            playlistNumber: numberOfPlaylists,
            selectedPlaylist: selectedPlaylists,
            playlistMode: selectedPlaylistMode
        }

        return {
            playlists: game.playlists.entities,
            numberOfPlaylists: numberOfPlaylists,
            playlistData: playlistData,
            playMode: playMode
        } 
    }

    /**
     * Update on form submit
     * @param {*} event 
     * @param {*} formData 
     */
    async _updateObject(event, formData) {

    }

    activateListeners(html) {
        super.activateListeners(html);
        const playMode = html.find("select[name='playMode']");
        const numberOfPlaylists = html.find("input[name='plNum']");
        const selectedPlaylist = html.find("select[name='selectedPlaylist']");
        const playlistMode = html.find("select[name='playlistMode']");

        playMode.on("change", event => {
            this.data.playMode=event.target.value;
            this.updateSettings(this.data);
        });

        numberOfPlaylists.on("change", event => {
            this.playlistNr = event.target.value;
            this.updatePlaylistNr = true;
            this.data.playlistNumber=event.target.value;
            this.updateSettings(this.data);
        });

        selectedPlaylist.on("change", event => {
            let id = event.target.id.replace('playlist','');
            this.data.selectedPlaylist[id-1]=event.target.value;
            this.updateSettings(this.data);
        });

        playlistMode.on("change", event => {
            let id = event.target.id.replace('playlistMode','');
            this.data.playlistMode[id-1]=event.target.value;
            this.updateSettings(this.data);
        });
    }
    async updateSettings(settings){
        await game.settings.set(MODULE.moduleName,'playlists', settings);
        if (MODULE.enableModule) playlistControl.updateAll();
        this.render();
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
            width= 1500;
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
        var args = game.settings.get(MODULE.moduleName,'macroSettings').args;
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

    }

    activateListeners(html) {
        super.activateListeners(html); 
        const macro = html.find("select[name='macros']");
        const args = html.find("input[name='args']");
        const color = html.find("input[name='colorPicker']");

        macro.on("change", event => {
            let id = event.target.id.replace('macros','');
            let settings = game.settings.get(MODULE.moduleName,'macroSettings');
            settings.macros[id-1]=event.target.value;
            this.updateSettings(settings);
        });

        args.on("change", event => {
            let id = event.target.id.replace('args','');
            let settings = game.settings.get(MODULE.moduleName,'macroSettings');
            settings.args[id-1]=event.target.value;
            this.updateSettings(settings);
        });

        color.on("change", event => {
            let id = event.target.id.replace('colorpicker','');
            let settings = game.settings.get(MODULE.moduleName,'macroSettings');
            settings.color[id-1]=event.target.value;
            this.updateSettings(settings);
        });
    }

    async updateSettings(settings){
        await game.settings.set(MODULE.moduleName,'macroSettings',settings);
        if (MODULE.enableModule) macroControl.updateAll();
        this.render();
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class soundboardConfigForm extends FormApplication {
    constructor(data, options) {
        super(data, options);
        this.data = data;
        this.playlists = [];
        this.updatePlaylist = false;
        this.update = false;
        this.iMax;
        this.jMax;
        this.settings = {};
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
        if (this.update) {
            this.update=false;
            return {soundData: this.data};
        }
        this.settings = game.settings.get(MODULE.moduleName,'soundboardSettings');
        let playlists = [];
        playlists.push({id:"none",name:game.i18n.localize("MaterialDeck.None")});
        playlists.push({id:"FP",name:game.i18n.localize("MaterialDeck.FilePicker")})
        for (let i=0; i<game.playlists.entities.length; i++){
            playlists.push({id:game.playlists.entities[i]._id,name:game.playlists.entities[i].name});
        }

        if (this.settings.sounds == undefined) this.settings.sounds = [];
        if (this.settings.colorOn == undefined) this.settings.colorOn = [];
        if (this.settings.colorOff == undefined) this.settings.colorOff = [];
        if (this.settings.mode == undefined) this.settings.mode = [];
        if (this.settings.img == undefined) this.settings.img = [];
        if (this.settings.volume == undefined) this.settings.volume = [];
        if (this.settings.name == undefined) this.settings.name = [];
        if (this.settings.selectedPlaylists == undefined) this.settings.selectedPlaylists = [];
        if (this.settings.src == undefined) this.settings.src = [];
        let soundData = [];

        let streamDeckModel = game.settings.get(MODULE.moduleName,'streamDeckModel');
       
        if (streamDeckModel == 0){
            this.jMax = 6;
            this.iMax = 3;
        }
        else if (streamDeckModel == 1){
            this.jMax = 6;
            this.iMax = 5;
        }
        else {
            this.jMax = 8;
            this.iMax = 8;
        }

        let iteration = 0;

        for (let j=0; j<this.jMax; j++){
            let soundsThis = [];
            for (let i=0; i<this.iMax; i++){
                let selectedPlaylist;
                let sounds = [];
                if (this.settings.volume[iteration] == undefined) this.settings.volume[iteration] = 50;
                if (this.settings.selectedPlaylists[iteration]==undefined) selectedPlaylist = 'none';
                else if (this.settings.selectedPlaylists[iteration] == 'none') selectedPlaylist = 'none';
                else if (this.settings.selectedPlaylists[iteration] == 'FP') selectedPlaylist = 'FP';
                else {
                    const pl = game.playlists.entities.find(p => p._id == this.settings.selectedPlaylists[iteration]);
                    if (pl == undefined){
                        selectedPlaylist = 'none';
                        sounds = [];
                    }
                    else {
                        sounds = pl.sounds;
                        selectedPlaylist = pl._id;
                    }  
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
                    sound: this.settings.sounds[iteration],
                    sounds: sounds,
                    srcPath: this.settings.src[iteration],
                    colorOn: this.settings.colorOn[iteration],
                    colorOff: this.settings.colorOff[iteration],
                    mode: this.settings.mode[iteration],
                    volume: this.settings.volume[iteration],
                    imgPath: this.settings.img[iteration],
                    name: this.settings.name[iteration],
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
        this.data = soundData;

        return {
            soundData: this.data
        } 
    }

    /**
     * Update on form submit
     * @param {*} event 
     * @param {*} formData 
     */
    async _updateObject(event, formData) {
   
    }

    async activateListeners(html) {
        super.activateListeners(html);
        const nameField = html.find("input[name='namebox']");
        const playlistSelect = html.find("select[name='playlist']");
        const soundSelect = html.find("select[name='sounds']");
        const soundFP = html.find("input[name2='soundSrc']");
        const imgFP = html.find("input[name2='imgSrc']");
        const onCP = html.find("input[name='colorOn']");
        const offCP = html.find("input[name='colorOff']");
        const playMode = html.find("select[name='mode']");
        const volume = html.find("input[name='volume']");

        nameField.on("change",event => {
            let id = event.target.id.replace('name','')-1;
            let j = Math.floor(id/this.jMax);
            let i = id % this.jMax;
            this.data[j].dataThis[i].name=event.target.value;
            this.update = true;

            this.settings.name[id]=event.target.value;
            this.updateSettings(this.settings);
        });

        if (playlistSelect.length > 0) {
            playlistSelect.on("change", event => {
                let id = event.target.id.replace('playlists','')-1;
                let j = Math.floor(id/this.jMax);
                let i = id % this.jMax;
                this.data[j].dataThis[i].selectedPlaylist=event.target.value;

                let selectedPlaylist;
                let sounds = [];
                if (event.target.value==undefined) selectedPlaylist = 'none';
                else if (event.target.value == 'none') selectedPlaylist = 'none';
                else if (event.target.value == 'FP') selectedPlaylist = 'FP';
                else {
                    const pl = game.playlists.entities.find(p => p._id == event.target.value);
                    selectedPlaylist = pl._id;
                    sounds = pl.sounds;
                }
                this.data[j].dataThis[i].sounds=sounds;

                let styleSS = "";
                let styleFP ="display:none";
                if (selectedPlaylist == 'FP') {
                    styleSS = 'display:none';
                    styleFP = ''
                }
                this.data[j].dataThis[i].styleSS=styleSS;
                this.data[j].dataThis[i].styleFP=styleFP;
                this.update = true;

                this.settings.selectedPlaylists[id]=event.target.value;
                this.updateSettings(this.settings);
            });
        }

        soundSelect.on("change", event => {
            let id = event.target.id.replace('soundSelect','')-1;
            let j = Math.floor(id/this.jMax);
            let i = id % this.jMax;
            this.data[j].dataThis[i].sound=event.target.value;
            this.update = true;

            this.settings.sounds[id]=event.target.value;
            this.updateSettings(this.settings);
        });
        
        soundFP.on("change",event => {
            let id = event.target.id.replace('srcPath','')-1;
            let j = Math.floor(id/this.jMax);
            let i = id % this.jMax;
            this.data[j].dataThis[i].srcPath=event.target.value;
            this.update = true;

            this.settings.src[id]=event.target.value;
            this.updateSettings(this.settings);
        });

        imgFP.on("change",event => {
            let id = event.target.id.replace('imgPath','')-1;
            let j = Math.floor(id/this.jMax);
            let i = id % this.jMax;
            this.data[j].dataThis[i].imgPath=event.target.value;
            this.update = true;

            this.settings.img[id]=event.target.value;
            this.updateSettings(this.settings);
        });

        onCP.on("change",event => {
            let id = event.target.id.replace('colorOn','')-1;
            let j = Math.floor(id/this.jMax);
            let i = id % this.jMax;
            this.data[j].dataThis[i].colorOn=event.target.value;
            this.update = true;

            this.settings.colorOn[id]=event.target.value;
            this.updateSettings(this.settings);
        });

        offCP.on("change",event => {
            let id = event.target.id.replace('colorOff','')-1;
            let j = Math.floor(id/this.jMax);
            let i = id % this.jMax;
            this.data[j].dataThis[i].colorOff=event.target.value;
            this.update = true;

            this.settings.colorOff[id]=event.target.value;
            this.updateSettings(this.settings);
        });

        playMode.on("change",event => {
            let id = event.target.id.replace('playmode','')-1;
            let j = Math.floor(id/this.jMax);
            let i = id % this.jMax;
            this.data[j].dataThis[i].mode=event.target.value;
            this.update = true;

            this.settings.mode[id]=event.target.value;
            this.updateSettings(this.settings);
        });

        volume.on("change",event => {
            let id = event.target.id.replace('volume','')-1;
            let j = Math.floor(id/this.jMax);
            let i = id % this.jMax;
            this.data[j].dataThis[i].volume=event.target.value;
            this.update = true;

            this.settings.volume[id]=event.target.value;
            this.updateSettings(this.settings); 
        });
    }
    
    async updateSettings(settings){
        await game.settings.set(MODULE.moduleName,'soundboardSettings',settings);
        if (MODULE.enableModule) soundboard.updateAll();
        this.render();
    }
    
}