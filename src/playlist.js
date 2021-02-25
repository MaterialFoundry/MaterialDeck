import * as MODULE from "../MaterialDeck.js";
import {streamDeck} from "../MaterialDeck.js";

export class PlaylistControl{
    constructor(){
        this.active = false;
        this.playlistOffset = 0;
        this.trackOffset = 0;
    }

    async updateAll(){
        if (this.active == false) return;
        for (let i=0; i<32; i++){   
            const data = streamDeck.buttonContext[i];
            if (data == undefined || data.action != 'playlist') continue;
            await this.update(data.settings,data.context);
        }
    }

    update(settings,context){
        if (MODULE.getPermission('PLAYLIST','PLAY') == false ) {
            streamDeck.noPermission(context);
            return;
        }
        this.active = true;
        if (settings.playlistMode == undefined) settings.playlistMode = 'playlist';
        if (settings.playlistMode == 'playlist'){
            this.updatePlaylist(settings,context);
        }
        else if (settings.playlistMode == 'track'){
            this.updateTrack(settings,context);
        }
        else {
            let src = 'modules/MaterialDeck/img/playlist/stop.png';
            if (game.playlists.playing.length > 0)
                streamDeck.setIcon(context,src,settings.background,2,'#00FF00',true);
            else
                streamDeck.setIcon(context,src,settings.background,1,'#000000',true);
        }
    }

    updatePlaylist(settings,context){
        let name = "";

        let background = settings.background;
        if(background == undefined) background = '#000000';

        let ringColor = "#000000"

        let ringOffColor = settings.offRing;
        if (ringOffColor == undefined) ringOffColor = '#FF0000';

        let ringOnColor = settings.onRing;
        if (ringOnColor == undefined) ringOnColor = '#00FF00';

        let playlistType = settings.playlistType;
        if (playlistType == undefined) playlistType = 'playStop';

        //Play/Stop
        if (playlistType == 'playStop'){
            let playlistNr = parseInt(settings.playlistNr);
            if (isNaN(playlistNr) || playlistNr < 1) playlistNr = 1;
            playlistNr--;
            playlistNr += this.playlistOffset;

            let playlist = this.getPlaylist(playlistNr);
            if (playlist != undefined){
                if (playlist.playing) 
                    ringColor = ringOnColor;
                else
                    ringColor = ringOffColor;
                if (settings.displayName)
                    name = playlist.name;
            }
        }
        //Offset
        else if (playlistType == 'offset') {
            let playlistOffset = parseInt(settings.offset);
            if (isNaN(playlistOffset)) playlistOffset = 0;
            if (playlistOffset == this.playlistOffset) ringColor = ringOnColor;
        }
        streamDeck.setIcon(context,"",background,2,ringColor);
        streamDeck.setTitle(name,context);
    }

    updateTrack(settings,context){
        let name = "";

        let background = settings.background;
        if(background == undefined) background = '#000000';

        let ringColor = "#000000"

        let ringOffColor = settings.offRing;
        if (ringOffColor == undefined) ringOffColor = '#FF0000';

        let ringOnColor = settings.onRing;
        if (ringOnColor == undefined) ringOnColor = '#00FF00';

        let playlistType = settings.playlistType;
        if (playlistType == undefined) playlistType = 'playStop';

        //Play/Stop
        if (playlistType == 'playStop'){
            let playlistNr = parseInt(settings.playlistNr);
            if (isNaN(playlistNr) || playlistNr < 1) playlistNr = 1;
            playlistNr--;
            playlistNr += this.playlistOffset;
            let trackNr = parseInt(settings.trackNr);
            if (isNaN(trackNr) || trackNr < 1) trackNr = 1;
            trackNr--;
            trackNr += this.trackOffset;

            let playlist = this.getPlaylist(playlistNr);
            if (playlist != undefined){
                let track = playlist.data.sounds[trackNr];
                if (track != undefined){
                    if (track.playing) 
                        ringColor = ringOnColor;
                    else
                        ringColor = ringOffColor;
                    if (settings.displayName)
                        name = track.name;
                }
            } 
        }
        //Offset
        else {
            let trackOffset = parseInt(settings.offset);
            if (isNaN(trackOffset)) trackOffset = 0;
            if (trackOffset == this.trackOffset) ringColor = ringOnColor;
        }
        streamDeck.setIcon(context,"",background,2,ringColor);
        streamDeck.setTitle(name,context);
    }

    stopAll(force=false){
        if (game.user.isGM == false) {
            const payload = {
                "msgType": "stopAllPlaylists", 
                "force": force
            };
            game.socket.emit(`module.MaterialDeck`, payload);
            return;
        }
        if (force){
            let playing = game.playlists.playing;
            for (let i=0; i<playing.length; i++){
                playing[i].stopAll();
            }
        }
        else {
            let playing = game.playlists.playing;
            let settings = game.settings.get(MODULE.moduleName,'playlists');
            let selectedPlaylists = settings.selectedPlaylist;
            for (let i=0; i<playing.length; i++){
                const playlistNr = selectedPlaylists.findIndex(p => p == playing[i]._id);
                const mode = settings.playlistMode[playlistNr];
                if (mode == 0) playing[i].stopAll();
            }
        }
    }

    getPlaylist(num){
        let selectedPlaylists = game.settings.get(MODULE.moduleName,'playlists').selectedPlaylist;
        if (selectedPlaylists != undefined) 
            return game.playlists.get(selectedPlaylists[num]);
        else return undefined;
    }

    keyPress(settings,context){
        if (MODULE.getPermission('PLAYLIST','PLAY') == false ) return;
        let playlistNr = settings.playlistNr;
        if (playlistNr == undefined || playlistNr < 1) playlistNr = 1;
        playlistNr--;
        playlistNr += this.playlistOffset;
        let trackNr = settings.trackNr;
        if (trackNr == undefined || trackNr < 1) trackNr = 1;
        trackNr--;
        trackNr += this.trackOffset;

        if (settings.playlistMode == undefined) settings.playlistMode = 'playlist';
        if (settings.playlistType == undefined) settings.playlistType = 'playStop';
        if (settings.playlistMode == 'stopAll') {
            this.stopAll(true);
        } 
        else {
            if (settings.playlistType == 'playStop') {
                let playlist = this.getPlaylist(playlistNr);
                if (playlist != undefined){
                    if (settings.playlistMode == 'playlist')
                        this.playPlaylist(playlist,playlistNr);
                    else {
                        let track = playlist.data.sounds[trackNr];
                        if (track != undefined){
                            this.playTrack(track,playlist,playlistNr);
                        }
                    }
                }
            }
            else {
                if (settings.playlistMode == 'playlist') {
                    this.playlistOffset = parseInt(settings.offset);
                    if (isNaN(this.playlistOffset)) this.playlistOffset = 0;
                }
                else {
                    this.trackOffset = parseInt(settings.offset);
                    if (isNaN(this.trackOffset)) this.trackOffset = 0;
                }
                this.updateAll();
            }
        }
          
    }

    async playPlaylist(playlist,playlistNr){
        if (game.user.isGM == false) {
            const payload = {
                "msgType": "playPlaylist", 
                "playlistId": playlist.id,
                "playlistNr": playlistNr
            };
            game.socket.emit(`module.MaterialDeck`, payload);
            return;
        }
        if (playlist.playing) {
            playlist.stopAll();
            return;
        }
        let mode = game.settings.get(MODULE.moduleName,'playlists').playlistMode[playlistNr];
        if (mode == 0) {
            mode = game.settings.get(MODULE.moduleName,'playlists').playMode;
            if (mode == 2) await this.stopAll();
        }
        playlist.playAll();
    }
    
    async playTrack(track,playlist,playlistNr){
        if (game.user.isGM == false) {
            const payload = {
                "msgType": "playTrack", 
                "playlistId": playlist.id,
                "playlistNr": playlistNr,
                "trackId": track._id
            };
            game.socket.emit(`module.MaterialDeck`, payload);
            return;
        }
        let play;
        if (track.playing)
            play = false;
        else {
            play = true;
            let mode = game.settings.get(MODULE.moduleName,'playlists').playlistMode[playlistNr];
            if (mode == 0) {
                mode = game.settings.get(MODULE.moduleName,'playlists').playMode;
                if (mode == 1) await playlist.stopAll();
                else if (mode == 2) await this.stopAll();
            }
            else if (mode == 2) await playlist.stopAll();
        }
        await playlist.updateEmbeddedEntity("PlaylistSound", {_id: track._id, playing: play});
        playlist.update({playing: play});
    }
}