import { moduleName, getPermission } from "../MaterialDeck.js";
import { importDialogForm } from "./importDialog.js";
import { exportDialogForm } from "./exportDialog.js";

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
            id: "materialDeck_soundboardConfig",
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
        
        const playlistArray = game.playlists.contents;
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
                    const playlistArray = game.playlists.contents;
                    let pl = playlistArray.find(p => p.id == this.settings.selectedPlaylists[iteration])

                    if (pl == undefined){
                        selectedPlaylist = 'none';
                        sounds = [];
                    }
                    else {
                        //Add the sound name and id to the sounds array
                        for (let sound of pl.sounds.contents)
                            sounds.push({
                                name: sound.name,
                                id: sound.id
                            });
       
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
                    colorOn: this.settings.colorOn[iteration] == 0 ? '#000000' : this.settings.colorOn[iteration],
                    colorOff: this.settings.colorOff[iteration] == 0 ? '#000000' : this.settings.colorOff[iteration],
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
        const navNext = html.find("button[name='navNext']");
        const navPrev = html.find("button[name='navPrev']");
        const clearAll = html.find("button[name='clearAll']");
        const clearPage = html.find("button[name='clearPage']");
        const importBtn = html.find("button[name='import']");
        const exportBtn = html.find("button[name='export']");
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
            let importDialog = new importDialogForm();
            importDialog.setData('soundboard',this)
            importDialog.render(true);
        });

        exportBtn.on('click', async(event) => {
            const settings = game.settings.get(moduleName,'soundboardSettings');
            let exportDialog = new exportDialogForm();
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
            let id = event.target.id.replace('materialDeck_sbConfig_name','')-1;
            this.settings.name[id]=event.target.value;
            this.updateSettings(this.settings);
        });

        if (playlistSelect.length > 0) {

            //Listener for when the playlist is changed
            playlistSelect.on("change", event => {
                //Get the sound number
                const iteration = event.target.id.replace('materialDeck_sbConfig_playlists','');

                //Get the selected playlist and the sounds of that playlist
                let selectedPlaylist;
                //let sounds = [];
                if (event.target.value==undefined) selectedPlaylist = 'none';
                else if (event.target.value == 'none') selectedPlaylist = 'none';
                else if (event.target.value == 'FP') {
                    selectedPlaylist = 'FP';

                    //Show the file picker
                    document.querySelector(`#materialDeck_sbConfig_fp${iteration}`).style='';
                    
                    //Hide the sound selector
                    document.querySelector(`#materialDeck_sbConfig_ss${iteration}`).style='display:none';
                }
                else {
                    //Hide the file picker
                    document.querySelector(`#materialDeck_sbConfig_fp${iteration}`).style='display:none';
                    
                    //Show the sound selector
                    document.querySelector(`#materialDeck_sbConfig_ss${iteration}`).style='';

                    const playlistArray = game.playlists.contents;
                    const pl = playlistArray.find(p => p.id == event.target.value)
                    selectedPlaylist = pl.id;

                    //Get the sound select element
                    let SSpicker = document.getElementById(`materialDeck_sbConfig_soundSelect${iteration}`);

                    //Empty ss element
                    SSpicker.options.length=0;

                    //Create new options and append them
                    let optionNone = document.createElement('option');
                    optionNone.value = "";
                    optionNone.innerHTML = game.i18n.localize("MaterialDeck.None");
                    SSpicker.appendChild(optionNone);

                    for (let sound of pl.sounds.contents) {
                        let newOption = document.createElement('option');
                        newOption.value = sound.id;
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
            let id = event.target.id.replace('materialDeck_sbConfig_soundSelect','')-1;
            this.settings.sounds[id]=event.target.value;
            this.updateSettings(this.settings);
        });
        
        soundFP.on("change",event => {
            let id = event.target.id.replace('materialDeck_sbConfig_srcPath','')-1;
            this.settings.src[id]=event.target.value;
            this.updateSettings(this.settings);
        });

        imgFP.on("change",event => {
            let id = event.target.id.replace('materialDeck_sbConfig_imgPath','')-1;
            this.settings.img[id]=event.target.value;
            this.updateSettings(this.settings);
        });

        onCP.on("change",event => {
            let id = event.target.id.replace('materialDeck_sbConfig_colorOn','')-1;
            this.settings.colorOn[id]=event.target.value;
            this.updateSettings(this.settings);
        });

        offCP.on("change",event => {
            let id = event.target.id.replace('materialDeck_sbConfig_colorOff','')-1;
            this.settings.colorOff[id]=event.target.value;
            this.updateSettings(this.settings);
        });

        playMode.on("change",event => {
            let id = event.target.id.replace('materialDeck_sbConfig_playmode','')-1;
            this.settings.mode[id]=event.target.value;
            this.updateSettings(this.settings);
        });

        volume.on("change",event => {
            let id = event.target.id.replace('materialDeck_sbConfig_volume','')-1;
            this.settings.volume[id]=event.target.value;
            this.updateSettings(this.settings); 
        });
    }
    
    async updateSettings(settings){
        if (game.user.isGM) {
            await game.settings.set(moduleName,'soundboardSettings',settings);
            if (game.materialDeck.enableModule) game.materialDeck.soundboard.updateAll();
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