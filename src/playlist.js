import * as MODULE from "../MaterialDeck.js";
import {streamDeck} from "../MaterialDeck.js";

export class PlaylistControl{
    constructor(){
        this.playlistOffset = 0;
        this.trackOffset = 0;
    }

    async updateAll(){
        for (let i=0; i<32; i++){   
            let data = streamDeck.buttonContext[i];
            if (data == undefined || data.action != 'playlist') continue;
            await this.update(data.settings,data.context);
        }
    }

    update(settings,context){
        if (settings.playlistMode == undefined) settings.playlistMode = 0;
        if (settings.playlistMode == 0){
            this.updatePlaylist(settings,context);
        }
        else if (settings.playlistMode == 1){
            this.updateTrack(settings,context);
        }
        else {
            let src = 'action/images/playlist/stop.png';
            streamDeck.setIcon(0,context,src,settings.background);
        }
    }

    updatePlaylist(settings,context){
        let name = "";
        let src = 'action/images/Black.png';
        let background = '#000000';

        let playlistType = settings.playlistType;
        if (playlistType == undefined) playlistType = 0;

        //Play/Stop
        if (playlistType == 0){
            let playlistNr = parseInt(settings.playlistNr);
            if (isNaN(playlistNr) || playlistNr < 1) playlistNr = 1;
            playlistNr--;
            playlistNr += this.playlistOffset;

            let playBackground = settings.playBackground;
            if (playBackground == undefined) playBackground == '#00FF00';
            let stopBackground = settings.stopBackground;
            if (stopBackground == undefined) stopBackground == '#FF0000';

            let playlist = this.getPlaylist(playlistNr);
            if (playlist != undefined){
                if (playlist.playing) {
                    background = playBackground;
                    src = 'action/images/playlist/stop.png';
                }
                else {
                    background = stopBackground;
                    src = 'action/images/playlist/play.png';
                }
                if (settings.displayName)
                    name = playlist.name;
            }
            
        }
        //Offset
        else {
            src = "";
            let onBackground = settings.onBackground;
            if (onBackground == undefined) onBackground = '#00FF00';
            let offBackground = settings.offBackground;
            if (offBackground == undefined) offBackground = '#000000';
            
            let playlistOffset = parseInt(settings.offset);
            if (isNaN(playlistOffset)) playlistOffset = 0;
            if (playlistOffset == this.playlistOffset) background = onBackground;
            else background = offBackground;
        }
        streamDeck.setIcon(0,context,src,background);
        streamDeck.setTitle(name,context);
    }

    updateTrack(settings,context){
        let name = "";
        let src = 'action/images/Black.png';
        let background = '#000000';

        let playlistType = settings.playlistType;
        if (playlistType == undefined) playlistType = 0;

        //Play/Stop
        if (playlistType == 0){
            let playlistNr = parseInt(settings.playlistNr);
            if (isNaN(playlistNr) || playlistNr < 1) playlistNr = 1;
            playlistNr--;
            playlistNr += this.playlistOffset;
            let trackNr = parseInt(settings.trackNr);
            if (isNaN(trackNr) || trackNr < 1) trackNr = 1;
            trackNr--;
            trackNr += this.trackOffset;

            let playBackground = settings.playBackground;
            if (playBackground == undefined) playBackground == '#00FF00';
            let stopBackground = settings.stopBackground;
            if (stopBackground == undefined) stopBackground == '#FF0000';

            let playlist = this.getPlaylist(playlistNr);
            if (playlist != undefined){
                let track = playlist.data.sounds[trackNr];
                if (track != undefined){
                    if (track.playing) {
                        background = playBackground;
                        src = 'action/images/playlist/stop.png';
                    }
                    else {
                        background = stopBackground;
                        src = 'action/images/playlist/play.png';
                    }
                    if (settings.displayName)
                        name = track.name;
                }
            }
            
        }
        //Offset
        else {
            src = "";
            let onBackground = settings.onBackground;
            if (onBackground == undefined) onBackground = '#00FF00';
            let offBackground = settings.offBackground;
            if (offBackground == undefined) offBackground = '#000000';
            
            let trackOffset = parseInt(settings.offset);
            if (isNaN(trackOffset)) trackOffset = 0;
            if (trackOffset == this.trackOffset) background = onBackground;
            else background = offBackground;
        }
        streamDeck.setIcon(0,context,src,background);
        streamDeck.setTitle(name,context);
    }

    stopAll(){
        let playing = game.playlists.playing;
        for (let i=0; i<playing.length; i++){
            playing[i].stopAll();
        }
    }

    getPlaylist(num){
        let playlistId = game.settings.get(MODULE.moduleName,'selectedPlaylists')[num];
        return game.playlists.entities.find(p => p._id == playlistId);
    }

    keyPress(settings,context){
        let playlistNr = settings.playlistNr;
        if (playlistNr == undefined || playlistNr < 1) playlistNr = 1;
        playlistNr--;
        playlistNr += this.playlistOffset;
        let trackNr = settings.trackNr;
        if (trackNr == undefined || trackNr < 1) trackNr = 1;
        trackNr--;
        trackNr += this.trackOffset;

        if (settings.playlistMode == undefined) settings.playlistMode = 0;
        if (settings.playlistType == undefined) settings.playlistType = 0;
        if (settings.playlistMode < 2){
            if (settings.playlistType == 0) {
                let playlist = this.getPlaylist(playlistNr);
                if (playlist != undefined){
                    if (settings.playlistMode == 0)
                        this.playPlaylist(playlist);
                    else {
                        let track = playlist.data.sounds[trackNr];
                        if (track != undefined){
                            this.playTrack(track,playlist);
                        }
                    }
                }
            }
            else {
                if (settings.playlistMode == 0) {
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
        else {
            this.stopAll();
        }   
    }

    async playPlaylist(playlist){
        if (playlist.playing) {
            playlist.stopAll();
            return;
        }
        let mode = game.settings.get(MODULE.moduleName,'playlistMethod');
        if (mode == 2) await this.stopAll();
        playlist.playAll();
    }
    
    async playTrack(track,playlist){
        let play;
        if (track.playing)
            play = false;
        else {
            play = true;
            let mode = game.settings.get(MODULE.moduleName,'playlistMethod');
            if (mode == 1) await playlist.stopAll();
            else if (mode == 2) await this.stopAll();
        }
        await playlist.updateEmbeddedEntity("PlaylistSound", {_id: track._id, playing: play});
        playlist.update({playing: play});
    }



}