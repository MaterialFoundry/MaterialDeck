import { moduleName, getPermission } from "../MaterialDeck.js";
import { compatibilityHandler } from "../src/compatibilityHandler.js";

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
        return compatibilityHandler('mergeObject', super.defaultOptions, {
            id: "playlist-config",
            title: "Material Deck: "+game.i18n.localize("MaterialDeck.Sett.PlaylistConfig"),
            template: "./modules/MaterialDeck/templates/playlistConfig.html",
            classes: ["sheet"],
            width: 500,
            height: "auto"
        });
        
        /*
        return mergeObject(super.defaultOptions, {
            id: "playlist-config",
            title: "Material Deck: "+game.i18n.localize("MaterialDeck.Sett.PlaylistConfig"),
            template: "./modules/MaterialDeck/templates/playlistConfig.html",
            classes: ["sheet"],
            width: 500,
            height: "auto"
        });
        */
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
            playlists: game.playlists.contents,
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
            if (game.materialDeck.enableModule) game.materialDeck.playlistControl.updateAll();
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