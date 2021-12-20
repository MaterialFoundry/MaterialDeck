import {sdVersion, msVersion, moduleName, getPermission, enableModule, streamDeck} from "../MaterialDeck.js";
import {macroControl,soundboard,playlistControl} from "../MaterialDeck.js";

export function compatibleCore(compatibleVersion){
    let coreVersion = game.version == undefined ? game.data.version : `0.${game.version}`;
    coreVersion = coreVersion.split(".");
    compatibleVersion = compatibleVersion.split(".");
    if (compatibleVersion[0] > coreVersion[0]) return false;
    if (compatibleVersion[0] < coreVersion[0]) return true;
    if (compatibleVersion[1] > coreVersion[1]) return false;
    if (compatibleVersion[1] < coreVersion[1]) return true;
    if (compatibleVersion[2] > coreVersion[2]) return false;
    return true;
  }

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
            width: 500,
            height: "auto"
        });
    }

    /**
     * Provide data to the template
     */
    getData() {
        if (getPermission('PLAYLIST','CONFIGURE') == false ) {
            ui.notifications.warn(game.i18n.localize("MaterialDeck.Notifications.Playlist.NoPermission"));
            return;
        }
        //Get the playlist settings
        let settings = game.settings.get(moduleName,'playlists');

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
            playlists: compatibleCore("0.8.1") ? game.playlists.contents : game.playlists.entities,
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
        if (game.user.isGM) {
            await game.settings.set(moduleName,'playlists', settings);
            if (enableModule) playlistControl.updateAll();
            if (render) this.render();
        }
        else {
            const payload = {
                "msgType": "playlistUpdate", 
                "settings": settings,
                "render": render
            };
            game.socket.emit(`module.MaterialDeck`, payload);
        }
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class macroConfigForm extends FormApplication {
    constructor(data, options) {
        super(data, options);
        this.data = data;
        this.page = 0;
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
        if (getPermission('MACRO','MACROBOARD_CONFIGURE') == false ) {
            ui.notifications.warn(game.i18n.localize("MaterialDeck.Notifications.Macroboard.NoPermission"));
            return;
        }
        //Get the settings
        var selectedMacros = game.settings.get(moduleName,'macroSettings').macros;
        var color = game.settings.get(moduleName,'macroSettings').color;
        var args = game.settings.get(moduleName,'macroSettings').args;

        //Check if the settings are defined
        if (selectedMacros == undefined) selectedMacros = [];
        if (color == undefined) color = [];
        if (args == undefined) args = [];

        //Check if the Furnace is installed and enabled
        let furnaceEnabled = false;
        let height = 95;
        let furnace = game.modules.get("furnace");
        let advancedMacros = game.modules.get("advanced-macros");
        if ((furnace != undefined && furnace.active && compatibleCore("0.8.1")==false) || (advancedMacros != undefined && advancedMacros.active)) {
            furnaceEnabled = true;
            height += 50;
        }

        let iteration = this.page*32;
        let macroData = [];
        for (let j=0; j<4; j++){
            let macroThis = [];
      
            for (let i=0; i<8; i++){
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
            furnace: furnaceEnabled,
            macroRange: `${this.page*32 + 1} - ${this.page*32 + 32}`,
            prevDisabled: this.page == 0 ? 'disabled' : '',
            totalMacros: Math.max(Math.ceil(selectedMacros.length/32)*32, this.page*32 + 32)
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
        const navNext = html.find("button[id='navNext']");
        const navPrev = html.find("button[id='navPrev']");
        const clearAll = html.find("button[id='clearAll']");
        const clearPage = html.find("button[id='clearPage']");
        const importBtn = html.find("button[id='import']");
        const exportBtn = html.find("button[id='export']");
        const macro = html.find("select[name='macros']");
        const args = html.find("input[name='args']");
        const color = html.find("input[name='colorPicker']");

        importBtn.on('click', async(event) => {
            let importDialog = new importConfigForm();
            importDialog.setData('macroboard',this)
            importDialog.render(true);
        });

        exportBtn.on('click', async(event) => {
            const settings = game.settings.get(moduleName,'macroSettings');
            let exportDialog = new exportConfigForm();
            exportDialog.setData(settings,'macroboard')
            exportDialog.render(true);
        });

        navNext.on('click',async (event) => {
            this.page++;
            this.render(true);
        });

        navPrev.on('click',async (event) => {
            const settings = game.settings.get(moduleName,'macroSettings');
            this.page--;
            if (this.page < 0) this.page = 0;
            else {
                const totalMacros = Math.ceil(settings.macros.length/32)*32;
                if ((this.page + 2)*32 == totalMacros) {
                    let pageEmpty = this.getPageEmpty(totalMacros-32);
                    if (pageEmpty) {
                        await this.clearPage(totalMacros-32,true)
                    }
                }
            }
            this.render(true);
        });

        clearAll.on('click',async (event) => {
            const parent = this;

            let d = new Dialog({
                title: game.i18n.localize("MaterialDeck.ClearAll"),
                content: game.i18n.localize("MaterialDeck.ClearAll_Content"),
                buttons: {
                    continue: {
                    icon: '<i class="fas fa-check"></i>',
                    label: game.i18n.localize("MaterialDeck.Continue"),
                    callback: async () => {
                        this.page = 0;
                        await parent.clearAllSettings();
                        parent.render(true);
                    }
                    },
                    cancel: {
                    icon: '<i class="fas fa-times"></i>',
                    label: game.i18n.localize("MaterialDeck.Cancel")
                    }
                },
                default: "cancel"
            });
            d.render(true);
        })

        clearPage.on('click',(event) => {
            const parent = this;

            let d = new Dialog({
                title: game.i18n.localize("MaterialDeck.ClearPage"),
                content: game.i18n.localize("MaterialDeck.ClearPage_Content"),
                buttons: {
                    continue: {
                    icon: '<i class="fas fa-check"></i>',
                    label: game.i18n.localize("MaterialDeck.Continue"),
                    callback: async () => {
                        await parent.clearPage(parent.page*32)
                        parent.render(true);
                    }
                    },
                    cancel: {
                    icon: '<i class="fas fa-times"></i>',
                    label: game.i18n.localize("MaterialDeck.Cancel")
                    }
                },
                default: "cancel"
            });
            d.render(true);
        })

        macro.on("change", event => {
            let id = event.target.id.replace('macros','');
            let settings = game.settings.get(moduleName,'macroSettings');
            settings.macros[id-1]=event.target.value;
            this.updateSettings(settings);
        });

        args.on("change", event => {
            let id = event.target.id.replace('args','');
            let settings = game.settings.get(moduleName,'macroSettings');
            settings.args[id-1]=event.target.value;
            this.updateSettings(settings);
        });

        color.on("change", event => {
            let id = event.target.id.replace('colorpicker','');
            let settings = game.settings.get(moduleName,'macroSettings');
            settings.color[id-1]=event.target.value;
            this.updateSettings(settings);
        });
    }

    async updateSettings(settings){
        if (game.user.isGM) {
            await game.settings.set(moduleName,'macroSettings',settings);
            if (enableModule) macroControl.updateAll();
        }
        else {
            const payload = {
                "msgType": "macroboardUpdate", 
                "settings": settings
            };
            game.socket.emit(`module.MaterialDeck`, payload);
        }
    }

    getPageEmpty(pageStart) {
        const settings = game.settings.get(moduleName,'macroSettings');
        let pageEmpty = true;
        for (let i=pageStart; i<pageStart+32; i++) {
            if (settings.macros[i] != undefined && settings.macros[i] != null && settings.macros[i] != "") {
                pageEmpty = false;
                break;
            }
        }
        return pageEmpty;
    }

    async clearPage(pageStart,remove=false) {
        const settings = game.settings.get(moduleName,'macroSettings');
        if (remove) {
            await settings.macros.splice(pageStart,32);
            await settings.color.splice(pageStart,32);
            if (settings.args != undefined) await settings.args.splice(pageStart,32);
        }
        else {
            for (let i=pageStart; i<pageStart+32; i++) {
                settings.macros[i] = null;
                settings.color[i] = "0";
                if (settings.args != undefined) settings.args[i] = null;
            }
        }
        await this.updateSettings(settings);
    }

    async clearAllSettings() {
        let settings = {
            macros: [],
            color: [],
            args: []
        };
        for (let i=0; i<32; i++) {
            settings.macros[i] = null;
            settings.color[i] = "0";
            settings.args[i] = null;
        }
        await this.updateSettings(settings);
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class soundboardConfigForm extends FormApplication {
    constructor(data, options) {
        super(data, options);
        this.playlists = [];
        this.settings = {};
        this.page = 0;
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
            height: "auto"
        });
    }

    /**
     * Provide data to the template
     */
    getData() {
        if (getPermission('SOUNDBOARD','CONFIGURE') == false ) {
            ui.notifications.warn(game.i18n.localize("MaterialDeck.Notifications.Soundboard.NoPermission"));
            return;
        }

        //Get the settings
        this.settings = game.settings.get(moduleName,'soundboardSettings');

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
        
        const playlistArray = compatibleCore("0.8.1") ? game.playlists.contents : game.playlists.entities;
        for (let playlist of playlistArray) 
            playlists.push({id: playlist.id, name: playlist.name})
        
        this.playlists = playlists;

        let iteration = this.page*16;  //Sound number
        let soundData = []; //Stores all the data for each sound

        //Fill soundData
        for (let j=0; j<2; j++){
            let soundsThis = [];    //Stores row data
            for (let i=0; i<8; i++){
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
                    const playlistArray = compatibleCore("0.8.1") ? game.playlists.contents : game.playlists.entities;
                    let pl = playlistArray.find(p => p.id == this.settings.selectedPlaylists[iteration])

                    if (pl == undefined){
                        selectedPlaylist = 'none';
                        sounds = [];
                    }
                    else {
                        //Add the sound name and id to the sounds array
                        if (compatibleCore("0.8.1"))
                            for (let sound of pl.sounds.contents)
                                sounds.push({
                                    name: sound.name,
                                    id: sound.id
                                });
                        else {
                            for (let sound of pl.sounds)
                                sounds.push({
                                    name: sound.name,
                                    id: sound._id
                                });
                        }        
                        //Get the playlist id
                        selectedPlaylist = pl.id;
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
            playlists,
            soundRange: `${this.page*16 + 1} - ${this.page*16 + 16}`,
            prevDisabled: this.page == 0 ? 'disabled' : '',
            totalSounds: this.settings.volume.length
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
        const navNext = html.find("button[id='navNext']");
        const navPrev = html.find("button[id='navPrev']");
        const clearAll = html.find("button[id='clearAll']");
        const clearPage = html.find("button[id='clearPage']");
        const importBtn = html.find("button[id='import']");
        const exportBtn = html.find("button[id='export']");
        const nameField = html.find("input[name='namebox']");
        const playlistSelect = html.find("select[name='playlist']");
        const soundSelect = html.find("select[name='sounds']");
        const soundFP = html.find("input[name2='soundSrc']");
        const imgFP = html.find("input[name2='imgSrc']");
        const onCP = html.find("input[name='colorOn']");
        const offCP = html.find("input[name='colorOff']");
        const playMode = html.find("select[name='mode']");
        const volume = html.find("input[name='volume']");

        importBtn.on('click', async(event) => {
            let importDialog = new importConfigForm();
            importDialog.setData('soundboard',this)
            importDialog.render(true);
        });

        exportBtn.on('click', async(event) => {
            const settings = game.settings.get(moduleName,'soundboardSettings');
            let exportDialog = new exportConfigForm();
            exportDialog.setData(settings,'soundboard')
            exportDialog.render(true);
        });

        navNext.on('click',async (event) => {
            this.page++;
            this.render(true);
        });
        navPrev.on('click',async (event) => {
            this.page--;
            if (this.page < 0) this.page = 0;
            else {
                const totalSounds = this.settings.volume.length;
                if ((this.page + 2)*16 == totalSounds) {
                    let pageEmpty = this.getPageEmpty(totalSounds-16);
                    if (pageEmpty) {
                        await this.clearPage(totalSounds-16,true)
                    }
                }
            }
            this.render(true);
        });

        clearAll.on('click',async (event) => {
            const parent = this;

            let d = new Dialog({
                title: game.i18n.localize("MaterialDeck.ClearAll"),
                content: game.i18n.localize("MaterialDeck.ClearAll_Content"),
                buttons: {
                    continue: {
                    icon: '<i class="fas fa-check"></i>',
                    label: game.i18n.localize("MaterialDeck.Continue"),
                    callback: async () => {
                        this.page = 0;
                        await parent.clearAllSettings();
                        parent.render(true);
                    }
                    },
                    cancel: {
                    icon: '<i class="fas fa-times"></i>',
                    label: game.i18n.localize("MaterialDeck.Cancel")
                    }
                },
                default: "cancel"
            });
            d.render(true);
        })

        clearPage.on('click',(event) => {
            const parent = this;

            let d = new Dialog({
                title: game.i18n.localize("MaterialDeck.ClearPage"),
                content: game.i18n.localize("MaterialDeck.ClearPage_Content"),
                buttons: {
                    continue: {
                    icon: '<i class="fas fa-check"></i>',
                    label: game.i18n.localize("MaterialDeck.Continue"),
                    callback: async () => {
                        await parent.clearPage(parent.page*16)
                        parent.render(true);
                    }
                    },
                    cancel: {
                    icon: '<i class="fas fa-times"></i>',
                    label: game.i18n.localize("MaterialDeck.Cancel")
                    }
                },
                default: "cancel"
            });
            d.render(true);
        })

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

                    const playlistArray = compatibleCore("0.8.1") ? game.playlists.contents : game.playlists.entities;
                    const pl = playlistArray.find(p => p.id == event.target.value)
                    selectedPlaylist = pl.id;

                    //Get the sound select element
                    let SSpicker = document.getElementById(`soundSelect${iteration}`);

                    //Empty ss element
                    SSpicker.options.length=0;

                    //Create new options and append them
                    let optionNone = document.createElement('option');
                    optionNone.value = "";
                    optionNone.innerHTML = game.i18n.localize("MaterialDeck.None");
                    SSpicker.appendChild(optionNone);

                    if (compatibleCore("0.8.1"))
                        for (let sound of pl.sounds.contents) {
                            let newOption = document.createElement('option');
                            newOption.value = sound.id;
                            newOption.innerHTML = sound.name;
                            SSpicker.appendChild(newOption);
                        } 
                    else 
                        for (let sound of pl.sounds) {
                            let newOption = document.createElement('option');
                            newOption.value = sound._id;
                            newOption.innerHTML = sound.name;
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
        if (game.user.isGM) {
            await game.settings.set(moduleName,'soundboardSettings',settings);
            if (enableModule) soundboard.updateAll();
        }
        else {
            const payload = {
                "msgType": "soundboardUpdate", 
                "settings": settings
            };
            game.socket.emit(`module.MaterialDeck`, payload);
        }
    }

    getPageEmpty(pageStart) {
        let pageEmpty = true;
        for (let i=pageStart; i<pageStart+16; i++) {
            const name = this.settings.name[i];
            const playlist = this.settings.selectedPlaylists[i];
            const sound = this.settings.sounds[i];
            if ((name != "" && name != null) || playlist != undefined || sound != undefined) {
                pageEmpty = false;
                break;
            }
        }
        return pageEmpty;
    }

    async clearPage(pageStart,remove=false) {
        if (remove) {
            await this.settings.sounds.splice(pageStart,16);
            await this.settings.colorOn.splice(pageStart,16);
            await this.settings.colorOff.splice(pageStart,16);
            await this.settings.mode.splice(pageStart,16);
            await this.settings.img.splice(pageStart,16);
            await this.settings.volume.splice(pageStart,16);
            await this.settings.name.splice(pageStart,16);
            await this.settings.selectedPlaylists.splice(pageStart,16);
            await this.settings.src.splice(pageStart,16);
            await this.settings.sounds.splice(pageStart,16);
        }
        else {
            for (let i=pageStart; i<pageStart+16; i++) {
                this.settings.sounds[i] = null;
                this.settings.colorOn[i] = null;
                this.settings.colorOff[i] = null;
                this.settings.mode[i] = null;
                this.settings.img[i] = null;
                this.settings.volume[i] = null;
                this.settings.name[i] = null;
                this.settings.selectedPlaylists[i] = null;
                this.settings.src[i] = null;
                this.settings.sounds[i] = null;
            }
        }
        
        await this.updateSettings(this.settings);
    }

    async clearAllSettings() {
        let array = [];
        for (let i=0; i<16; i++) array[i] = "";
        let arrayVolume = [];
        for (let i=0; i<16; i++) arrayVolume[i] = "50";
        let arrayZero = [];
        for (let i=0; i<16; i++) arrayZero[i] = "0";
    
        const settings = {
            playlist: "",
            sounds: array,
            colorOn: arrayZero,
            colorOff: arrayZero,
            mode: arrayZero,
            toggle: arrayZero,
            volume: arrayVolume
        };
        await this.updateSettings(settings);
    }
}

export class exportConfigForm extends FormApplication {
    constructor(data, options) {
        super(data, options);
        this.data = {};
        this.name = "";
        this.source = "";
    }

    /**
     * Default Options for this FormApplication
     */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "MD_Export",
            title: "Material Deck: " + game.i18n.localize("MaterialDeck.ExportDialog.Title"),
            template: "./modules/MaterialDeck/templates/exportDialog.html",
            width: 500,
            height: "auto"
        });
    }

    setData(data,source) {
        this.data = data;
        this.source = source;
        this.name = source;
    }

    /**
     * Provide data to the template
     */
    getData() {
        return {
            source: this.source,
            name: this.name,
            content: this.source == "soundboard" ? game.i18n.localize("MaterialDeck.ExportDialog.SoundboardContent") : game.i18n.localize("MaterialDeck.ExportDialog.MacroboardContent")
        } 
    }

    /**
     * Update on form submit
     * @param {*} event 
     * @param {*} formData 
     */
    async _updateObject(event, formData) {
        this.download(this.data,formData.name)
    }

    activateListeners(html) {
        super.activateListeners(html);
    }

    download(data,name) {
        let dataStr = JSON.stringify(data);
        let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        let exportFileDefaultName = `${name}.json`;
        let linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }
}

export class importConfigForm extends FormApplication {
    constructor(data, options) {
        super(data, options);
        this.data = {};
        this.name = "";
        this.source = "";
        this.parent;
    }

    /**
     * Default Options for this FormApplication
     */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "MD_Import",
            title: "Material Deck: " + game.i18n.localize("MaterialDeck.ImportDialog.Title"),
            template: "./modules/MaterialDeck/templates/importDialog.html",
            width: 500,
            height: "auto"
        });
    }

    setData(source,parent) {
        this.source = source;
        this.name = source;
        this.parent = parent;
    }

    /**
     * Provide data to the template
     */
    getData() {
        return {
            source: this.source,
            name: this.name,
            content: this.source == "soundboard" ? game.i18n.localize("MaterialDeck.ImportDialog.SoundboardContent") : game.i18n.localize("MaterialDeck.ImportDialog.MacroboardContent")
        } 
    }

    /**
     * Update on form submit
     * @param {*} event 
     * @param {*} formData 
     */
    async _updateObject(event, formData) {
        await this.parent.updateSettings(this.data);
        this.parent.render(true);
    }

    activateListeners(html) {
        super.activateListeners(html);

        const upload = html.find("input[id='uploadJson']");

        upload.on('change',(event) => {
            event.preventDefault();
            this.readJsonFile(event.target.files[0]); 
        })
    }

    readJsonFile(jsonFile) {
        var reader = new FileReader(); 
        reader.addEventListener('load', (loadEvent) => { 
          try { 
            let json = JSON.parse(loadEvent.target.result); 
            this.data = json;
          } catch (error) { 
            console.error(error); 
          } 
        }); 
        reader.readAsText(jsonFile); 
    } 


}

export class downloadUtility extends FormApplication {
    constructor(data, options) {
        super(data, options);
        this.localSDversion = sdVersion;
        this.masterSDversion;
        this.localMSversion = msVersion;
        this.masterMSversion;
        this.releaseAssets = [];
        this.profiles = [];

        let parent = this;
        setTimeout(function(){
            parent.checkForUpdate('SD');
            parent.checkForUpdate('MS');
            parent.getReleaseData();
        },100)
    }

    /**
     * Default Options for this FormApplication
     */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "MD_DownloadUtility",
            title: "Material Deck: " + game.i18n.localize("MaterialDeck.DownloadUtility.Title"),
            template: "./modules/MaterialDeck/templates/downloadUtility.html",
            width: 500,
            height: "auto"
        });
    }

    /**
     * Provide data to the template
     */
    getData() {
        let dlDisabled = true;

        this.profiles = [];
        let iteration = 0;
        for (let asset of this.releaseAssets) {
            let split = asset.name.split('.');
            if (split[split.length-1] == 'streamDeckProfile') {
                this.profiles.push({id: iteration, label:split[0], url:asset.browser_download_url});
                iteration++;
                dlDisabled = false;
            }
        }
        if (this.localMSversion == undefined) this.localMSversion = 'unknown';
        
        let minimumSdVersion;
        let minimumMsVersion;
        if (compatibleCore("0.8.5")) {
            minimumSdVersion = game.modules.get("MaterialDeck").data.flags.minimumSDversion.replace('v','');
            minimumMsVersion = game.modules.get("MaterialDeck").data.flags.minimumMSversion;
        }
        else {
            minimumSdVersion = game.modules.get("MaterialDeck").data.minimumSDversion.replace('v','');
            minimumMsVersion = game.modules.get("MaterialDeck").data.minimumMSversion;
        }
        
        return {
            minimumSdVersion,
            localSdVersion: this.localSDversion,
            masterSdVersion: this.masterSDversion,
            sdDlDisable: this.masterSDversion == undefined,
            minimumMsVersion,
            localMsVersion: this.localMSversion,
            masterMsVersion: this.masterMSversion,
            msDlDisable: this.masterMSversion == undefined,
            profiles: this.profiles,
            profileDlDisable: dlDisabled
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

        const downloadSd = html.find("button[id='downloadSd']");
        const downloadMs = html.find("button[id='downloadMs']");
        const downloadProfile = html.find("button[name='downloadProfile']")
        const refresh = html.find("button[id='refresh']");

        downloadSd.on('click', () => {
            const version = document.getElementById('masterSdVersion').innerHTML;
            if (version == '' || version == undefined || version == 'Error') return;
            const url = `https://github.com/CDeenen/MaterialDeck_SD/releases/download/v${version}/com.cdeenen.materialdeck.streamDeckPlugin`;
            this.downloadURI(url,'com.cdeenen.materialdeck.streamDeckPlugin')
        })
        downloadMs.on('click', () => {
            const version = document.getElementById('masterMsVersion').innerHTML;
            const os = document.getElementById('os').value;
            if (version == '' || version == undefined || version == 'Error') return;
            let name = `MaterialServer-${os}.zip`;
            let url;
            if (os == 'source') url = `https://github.com/CDeenen/MaterialServer/archive/refs/tags/v${version}.zip`;
            else url = `https://github.com/CDeenen/MaterialServer/releases/download/v${version}/${name}`;
            this.downloadURI(url,name)
        })
        downloadProfile.on('click',(event) => {
            let id = event.currentTarget.id.replace('dlProfile-','');
            this.downloadURI(this.profiles[id].url,`${this.profiles[id].label}.streamDeckProfile`);
        })
        refresh.on('click', () => {
            document.getElementById('masterSdVersion').value = 'Getting data';
            this.checkForUpdate('SD');
            document.getElementById('masterMsVersion').value = 'Getting data';
            this.checkForUpdate('MS');
            this.getReleaseData();
        })
    }

    downloadURI(uri, name) {
        var link = document.createElement("a");
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      getReleaseData() {
        let parent = this;
        const url = 'https://api.github.com/repos/CDeenen/MaterialDeck_SD/releases/latest';
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.send(null);
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                var type = request.getResponseHeader('Content-Type');
                const data = JSON.parse(request.responseText);
                parent.releaseAssets = data.assets;
                parent.render(true);
                if (type.indexOf("text") !== 1) {
    
                    return;
                }
            }
        }
        request.onerror = function () {
        }
    }

    checkForUpdate(reqType) {
        let parent = this;
        let url;
        if (reqType == 'SD') url = 'https://raw.githubusercontent.com/CDeenen/MaterialDeck_SD/master/Plugin/com.cdeenen.materialdeck.sdPlugin/manifest.json';
        else if (reqType == 'MS') url = 'https://raw.githubusercontent.com/CDeenen/MaterialServer/master/src/Windows/package.json';
        const elementId = reqType == 'SD' ? 'masterSdVersion' : 'masterMsVersion';

        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.send(null);
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                var type = request.getResponseHeader('Content-Type');
                if (type.indexOf("text") !== 1) {
                    if (reqType == 'SD') parent.masterSDversion = JSON.parse(request.responseText).Version;
                    else if (reqType == 'MS') parent.masterMSversion = JSON.parse(request.responseText).version;
                    parent.render(true);
                    return;
                }
                
            }
        }
        request.onerror = function () {
            document.getElementById(elementId).innerHTML = 'Error';
        }
    }     
}

export class deviceConfig extends FormApplication {
    constructor(data, options) {
        super(data, options);

        this.devices = [];
    }

    /**
     * Default Options for this FormApplication
     */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "MD_DeviceConfig",
            title: "Material Deck: " + game.i18n.localize("MaterialDeck.DeviceConfig.Title"),
            template: "./modules/MaterialDeck/templates/deviceConfig.html",
            width: 500,
            height: "auto"
        });
    }

    /**
     * Provide data to the template
     */
    getData() {
        this.devices = [];
        const dConfig = game.settings.get(moduleName, 'devices');

        for (let d of streamDeck.buttonContext) {
            let type;
            if (d.type == 0) type = 'Stream Deck';
            else if (d.type == 1) type = 'Stream Deck Mini';
            else if (d.type == 2) type = 'Stream Deck XL';
            else if (d.type == 3) type = 'Stream Deck Mobile';
            else if (d.type == 4) type = 'Corsair G Keys';

            const name = d.name;
            const id = d.device;
            let enable;
            if (dConfig?.[id] == undefined) enable = true;
            else enable = dConfig?.[id].enable;

            const device = {
                id,
                name,
                type,
                en: enable
            }
            this.devices.push(device);
        }
        
        return {
            devices: this.devices
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

        html.find("input[name='enable']").on('change', (event) => {
            const id = event.currentTarget.id;
            for (let d of this.devices) {
                if (d.id == id) {
                    let dConfig = game.settings.get(moduleName, 'devices');
                    delete dConfig[id];
                    dConfig[id] = {enable: event.currentTarget.checked}
                    
                    game.settings.set(moduleName, 'devices', dConfig);
                }
            }
        })
    }

    
}