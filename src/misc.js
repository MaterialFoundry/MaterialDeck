import * as MODULE from "../MaterialDeck.js";
import {macroControl,soundboard,playlistControl} from "../MaterialDeck.js";

export class playlistConfigForm extends FormApplication {
    constructor(data, options) {
        super(data, options);
        this.data = data;
        this.playlistNr;
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
        //Get the playlist settings
        let settings = game.settings.get(MODULE.moduleName,'playlists');

        //Get values from the settings, and check if they are defined
        let selectedPlaylists = settings.selectedPlaylist;
        if (selectedPlaylists == undefined) selectedPlaylists = [];
        let selectedPlaylistMode = settings.playlistMode;
        if (selectedPlaylistMode == undefined) selectedPlaylistMode = [];
        let numberOfPlaylists = settings.playlistNumber;
        if (this.updatePlaylistNr) numberOfPlaylists = this.playlistNr;
        if (numberOfPlaylists == undefined) numberOfPlaylists = 9;
        let playMode = settings.playMode;
        if (playMode == undefined) playMode = 0;


        //Create array to store all the data for each playlist
        let playlistData = [];
        for (let i=0; i<numberOfPlaylists; i++){
            if (selectedPlaylists[i] == undefined) selectedPlaylists[i] = 'none';
            if (selectedPlaylistMode[i] == undefined) selectedPlaylistMode[i] = 0;
            let dataThis = {
                iteration: i+1,
                playlist: selectedPlaylists[i],
                playlistMode: selectedPlaylistMode[i]
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
            this.data.playlistNumber=event.target.value;
            this.updateSettings(this.data,true);
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

    async updateSettings(settings,render){
        await game.settings.set(MODULE.moduleName,'playlists', settings);
        if (MODULE.enableModule) playlistControl.updateAll();
        if (render) this.render();
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
        //Get the settings
        var selectedMacros = game.settings.get(MODULE.moduleName,'macroSettings').macros;
        var color = game.settings.get(MODULE.moduleName,'macroSettings').color;
        var args = game.settings.get(MODULE.moduleName,'macroSettings').args;

        //Check if the settings are defined
        if (selectedMacros == undefined) selectedMacros = [];
        if (color == undefined) color = [];
        if (args == undefined) args = [];

        //Check if the Furnace is installed and enabled
        let furnaceEnabled = false;
        let height = 95;
        let furnace = game.modules.get("furnace");
        if (furnace != undefined && furnace.active) {
            furnaceEnabled = true;
            height += 50;
        }

        //Check what SD model the user is using, and set the number of rows and columns to correspond
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
        let macroData = [];
        for (let j=0; j<jMax; j++){
            let macroThis = [];
      
            for (let i=0; i<iMax; i++){
                let colorData = color[iteration];
                if (colorData != undefined){
                    let colorCorrect = true;
                    if (colorData[0] != '#') colorCorrect = false;
                    for (let k=0; k<6; k++){
                        if (parseInt(colorData[k+1],16)>15)
                            colorCorrect = false;
                    }
                    if (colorCorrect == false) colorData = '#000000'; 
                }
                else 
                    colorData = '#000000';
                    
                let dataThis = {
                    iteration: iteration+1,
                    macro: selectedMacros[iteration],
                    color: colorData,
                    args: args[iteration]
                }
                macroThis.push(dataThis);
                iteration++;
            }
            macroData.push({dataThis: macroThis});
        }

        return {
            height: height,
            macros: game.macros,
            selectedMacros: selectedMacros,
            macroData: macroData,
            furnace: furnaceEnabled
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
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class soundboardConfigForm extends FormApplication {
    constructor(data, options) {
        super(data, options);
        this.playlists = [];
        this.iMax;
        this.jMax;
        this.settings = {};
    }

    /**
     * Default Options for this FormApplication
     */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "soundboard-config",
            title: "Material Deck: "+game.i18n.localize("MaterialDeck.Sett.SoundboardConfig"),
            template: "./modules/MaterialDeck/templates/soundboardConfig.html",
            classes: ["sheet"],
            height: 720
        });
    }

    /**
     * Provide data to the template
     */
    getData() {
        //Get the settings
        this.settings = game.settings.get(MODULE.moduleName,'soundboardSettings');

        //Check if all settings are defined
        if (this.settings.sounds == undefined) this.settings.sounds = [];
        if (this.settings.colorOn == undefined) this.settings.colorOn = [];
        if (this.settings.colorOff == undefined) this.settings.colorOff = [];
        if (this.settings.mode == undefined) this.settings.mode = [];
        if (this.settings.img == undefined) this.settings.img = [];
        if (this.settings.volume == undefined) this.settings.volume = [];
        if (this.settings.name == undefined) this.settings.name = [];
        if (this.settings.selectedPlaylists == undefined) this.settings.selectedPlaylists = [];
        if (this.settings.src == undefined) this.settings.src = [];

        //Create the playlist array
        let playlists = [];
        playlists.push({id:"none",name:game.i18n.localize("MaterialDeck.None")});
        playlists.push({id:"FP",name:game.i18n.localize("MaterialDeck.FilePicker")})
        for (let i=0; i<game.playlists.entities.length; i++){
            playlists.push({id:game.playlists.entities[i]._id,name:game.playlists.entities[i].name});
        }
        this.playlists = playlists;

        //Check what SD model the user is using, and set the number of rows and columns to correspond
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

        let iteration = 0;  //Sound number
        let soundData = []; //Stores all the data for each sound

        //Fill soundData. soundData is an array the size of jMax (nr of rows), with each array element containing an array the size of iMax (nr of columns)
        for (let j=0; j<this.jMax; j++){
            let soundsThis = [];    //Stores row data
            for (let i=0; i<this.iMax; i++){
                //Each iteration gets the data for each sound

                //If the volume is undefined for this sound, define it and set it to its default value
                if (this.settings.volume[iteration] == undefined) this.settings.volume[iteration] = 50;

                //Get the selected playlist and the sounds of that playlist
                let selectedPlaylist;
                let sounds = [];
                if (this.settings.selectedPlaylists[iteration]==undefined) selectedPlaylist = 'none';
                else if (this.settings.selectedPlaylists[iteration] == 'none') selectedPlaylist = 'none';
                else if (this.settings.selectedPlaylists[iteration] == 'FP') selectedPlaylist = 'FP';
                else {
                    //Get the playlist
                    const pl = game.playlists.entities.find(p => p._id == this.settings.selectedPlaylists[iteration]);
                    if (pl == undefined){
                        selectedPlaylist = 'none';
                        sounds = [];
                    }
                    else {
                        //Add the sound name and id to the sounds array
                        for (let i=0; i<pl.sounds.length; i++)
                            sounds.push({
                                name: pl.sounds[i].name,
                                id: pl.sounds[i]._id
                            });
                        //Get the playlist id
                        selectedPlaylist = pl._id;
                    }  
                }

                //Determine whether the sound selector or file picker should be displayed
                let styleSS = "";
                let styleFP ="display:none";
                if (selectedPlaylist == 'FP') {
                    styleSS = 'display:none';
                    styleFP = ''
                }

                //Create and fill the data object for this sound
                let dataThis = {
                    iteration: iteration+1,
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

                //Push the data to soundsThis (row array)
                soundsThis.push(dataThis);

                iteration++;
            }

            //Push soundsThis (row array) to soundData (full data array)
            soundData.push({dataThis: soundsThis});
        }

        return {
            soundData: soundData,
            playlists
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
            this.settings.name[id]=event.target.value;
            this.updateSettings(this.settings);
        });

        if (playlistSelect.length > 0) {

            //Listener for when the playlist is changed
            playlistSelect.on("change", event => {
                //Get the sound number
                const iteration = event.target.id.replace('playlists','');

                //Get the selected playlist and the sounds of that playlist
                let selectedPlaylist;
                //let sounds = [];
                if (event.target.value==undefined) selectedPlaylist = 'none';
                else if (event.target.value == 'none') selectedPlaylist = 'none';
                else if (event.target.value == 'FP') {
                    selectedPlaylist = 'FP';

                    //Show the file picker
                    document.querySelector(`#fp${iteration}`).style='';
                    
                    //Hide the sound selector
                    document.querySelector(`#ss${iteration}`).style='display:none';
                }
                else {
                    //Hide the file picker
                    document.querySelector(`#fp${iteration}`).style='display:none';
                    
                    //Show the sound selector
                    document.querySelector(`#ss${iteration}`).style='';

                    const pl = game.playlists.entities.find(p => p._id == event.target.value);
                    selectedPlaylist = pl._id;

                    //Get the sound select element
                    let SSpicker = document.getElementById(`soundSelect${iteration}`);

                    //Empty ss element
                    SSpicker.options.length=0;

                    //Create new options and append them
                    let optionNone = document.createElement('option');
                    optionNone.value = "";
                    optionNone.innerHTML = game.i18n.localize("MaterialDeck.None");
                    SSpicker.appendChild(optionNone);

                    for (let i=0; i<pl.sounds.length; i++){
                        let newOption = document.createElement('option');
                        newOption.value = pl.sounds[i]._id;
                        newOption.innerHTML = pl.sounds[i].name;
                        SSpicker.appendChild(newOption);
                    }
                }

                //Save the new playlist to this.settings, and update the settings
                this.settings.selectedPlaylists[iteration-1]=event.target.value;
                this.updateSettings(this.settings);
            });
        }

        soundSelect.on("change", event => {
            let id = event.target.id.replace('soundSelect','')-1;
            this.settings.sounds[id]=event.target.value;
            this.updateSettings(this.settings);
        });
        
        soundFP.on("change",event => {
            let id = event.target.id.replace('srcPath','')-1;
            this.settings.src[id]=event.target.value;
            this.updateSettings(this.settings);
        });

        imgFP.on("change",event => {
            let id = event.target.id.replace('imgPath','')-1;
            this.settings.img[id]=event.target.value;
            this.updateSettings(this.settings);
        });

        onCP.on("change",event => {
            let id = event.target.id.replace('colorOn','')-1;
            this.settings.colorOn[id]=event.target.value;
            this.updateSettings(this.settings);
        });

        offCP.on("change",event => {
            let id = event.target.id.replace('colorOff','')-1;
            this.settings.colorOff[id]=event.target.value;
            this.updateSettings(this.settings);
        });

        playMode.on("change",event => {
            let id = event.target.id.replace('playmode','')-1;
            this.settings.mode[id]=event.target.value;
            this.updateSettings(this.settings);
        });

        volume.on("change",event => {
            let id = event.target.id.replace('volume','')-1;
            this.settings.volume[id]=event.target.value;
            this.updateSettings(this.settings); 
        });
    }
    
    async updateSettings(settings){
        await game.settings.set(MODULE.moduleName,'soundboardSettings',settings);
        if (MODULE.enableModule) soundboard.updateAll();
    }
}