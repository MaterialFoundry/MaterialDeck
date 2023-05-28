import { moduleName, streamDeck, getPermission } from "../../MaterialDeck.js";

export class PlaylistControl{
    constructor(){
        this.active = false;
        this.playlistOffset = 0;
        this.trackOffset = 0;
    }

    async updateAll(){
        if (this.active == false) return;
        for (let device of streamDeck.buttonContext) {
            if (device?.buttons == undefined) continue;
            for (let i=0; i<device.buttons.length; i++){   
                const data = device.buttons[i];
                if (data == undefined || data.action != 'playlist') continue;
                await this.update(data.settings,data.context,device.device);
            }
        }
    }

    update(settings,context,device){
        if (getPermission('PLAYLIST','PLAY') == false ) {
            streamDeck.noPermission(context,device);
            return;
        }
        this.active = true;
        const mode = settings.playlistMode ? settings.playlistMode : 'playlist';
        
        if (mode == 'playlist'){
            this.updatePlaylist(settings,context,device);
        }
        else if (mode == 'track'){
            this.updateTrack(settings,context,device);
        }
        else {
            let src = mode == 'stopAll' ? 'modules/MaterialDeck/img/playlist/stop.png' : 'modules/MaterialDeck/img/playlist/pause.png';
            const background = settings.background ? settings.background : '#000000';
            const ringColor = (game.playlists.playing.length > 0) ? '#00FF00' : '#000000';
            const ring = (game.playlists.playing.length > 0) ? 2 : 1;
            const txt = settings.displayPlaylistName ? this.getPlaylist(this.playlistOffset).name : '';
            let overlay = true;
            if (settings.iconOverride != '' && settings.iconOverride != undefined) {
                src = settings.iconOverride;
                overlay = false;
            }
            streamDeck.setIcon(context,device,src,{background:background,ring:ring,ringColor:ringColor,overlay});
            streamDeck.setTitle(txt,context);
        }
    }

    updatePlaylist(settings,context,device){
        let name = "";
        let ringColor = "#000000"
        const background = settings.background ? settings.background : '#000000';
        const ringOffColor = settings.offRing ? settings.offRing : '#FF0000';
        const ringOnColor = settings.onRing ? settings.onRing : '#00FF00';
        const playlistType = settings.playlistType ? settings.playlistType : 'playStop';
        let src = "modules/MaterialDeck/img/transparant.png";

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
            ringColor = (playlistOffset == this.playlistOffset) ? ringOnColor : ringOffColor;
        }
        //Relative Offset
        else if (playlistType == 'relativeOffset') {
            let playlistOffset = parseInt(settings.offset);
            if (isNaN(playlistOffset)) playlistOffset = 0;
            let number = parseInt(this.playlistOffset + playlistOffset);
            const nrOfPlaylists = parseInt(game.settings.get(moduleName,'playlists').playlistNumber);
            if (number < 0) number += nrOfPlaylists;
            else if (number >= nrOfPlaylists) number -= nrOfPlaylists;
            const targetPlaylist = this.getPlaylist(number);
            if (targetPlaylist != undefined) name = targetPlaylist.name;
        }

        if (settings.iconOverride != '' && settings.iconOverride != undefined) src = settings.iconOverride;
        streamDeck.setIcon(context,device,src,{background:background,ring:2,ringColor:ringColor});
        streamDeck.setTitle(name,context);
    }

    updateTrack(settings,context,device){
        let name = "";
        let ringColor = "#000000"
        const background = settings.background ? settings.background : '#000000';
        const ringOffColor = settings.offRing ? settings.offRing : '#FF0000';
        const ringOnColor = settings.onRing ? settings.onRing : '#00FF00';
        const playlistType = settings.playlistType ? settings.playlistType : 'playStop';
        let src = "modules/MaterialDeck/img/transparant.png";

        //Play/Stop
        if (playlistType == 'playStop' || playlistType == 'incDecVol' || playlistType == 'setVol'){
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
                const track = playlist.sounds.contents[trackNr];
                if (track != undefined){
                    if (track.playing) 
                        ringColor = ringOnColor;
                    else
                        ringColor = ringOffColor;
                    if (settings.displayName)
                        name = track.name;
                    if (settings.displayTrackVolume) {
                        if (settings.displayName) name += ' ';
                        name += Math.round(AudioHelper.volumeToInput(track.volume)*100)/100
                    }
                        
                }
            } 
        }
        //Offset
        else if (playlistType == 'offset') {
            let trackOffset = parseInt(settings.offset);
            if (isNaN(trackOffset)) trackOffset = 0;
            ringColor = (trackOffset == this.trackOffset) ? ringOnColor : ringOffColor;
        }
        //Relative Offset
        else if (playlistType == 'relativeOffset') {
        }
        if (settings.iconOverride != '' && settings.iconOverride != undefined) src = settings.iconOverride;
        streamDeck.setIcon(context,device,src,{background:background,ring:2,ringColor:ringColor});
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
            let settings = game.settings.get(moduleName,'playlists');
            let selectedPlaylists = settings.selectedPlaylist;
            for (let i=0; i<playing.length; i++){
                const playlistNr = selectedPlaylists.findIndex(p => p == playing[i]._id);
                const mode = settings.playlistMode[playlistNr];
                if (mode == 0) playing[i].stopAll();
            }
        }
    }

    pauseAll(){
        if (game.user.isGM == false) {
            const payload = {
                "msgType": "pauseAllPlaylists"
            };
            game.socket.emit(`module.MaterialDeck`, payload);
            return;
        }

        /*
        let playing = game.playlists.playing;
        for (let i=0; i<playing.length; i++){
            for (let sound of playing[i].sounds.contents) {
                if (sound.playing) sound.sound.pause();
            }
        }
        */
        for (let elmnt of document.getElementsByClassName('sound-control pause'))
            elmnt.click();
    }

    getPlaylist(num){
        let selectedPlaylists = game.settings.get(moduleName,'playlists').selectedPlaylist;
        if (selectedPlaylists != undefined) 
            return game.playlists.get(selectedPlaylists[num]);
        else return undefined;
    }

    keyPress(settings,context,device){
        if (getPermission('PLAYLIST','PLAY') == false ) return;
        let playlistNr = settings.playlistNr;
        if (playlistNr == undefined || playlistNr < 1) playlistNr = 1;
        playlistNr--;
        playlistNr += this.playlistOffset;
        let trackNr = settings.trackNr;
        if (trackNr == undefined || trackNr < 1) trackNr = 1;
        trackNr--;
        trackNr += this.trackOffset;

        const playlistMode =  settings.playlistMode ? settings.playlistMode : 'playlist';
        const playlistType = settings.playlistType ? settings.playlistType : 'playStop';
        
        if (playlistMode == 'stopAll') {
            this.stopAll(true);
        } 
        else if (playlistMode == 'pauseAll') {
            this.pauseAll();
        } 
        else {
            if (playlistType == 'playStop') {
                let playlist = this.getPlaylist(playlistNr);
                if (playlist != undefined){
                    if (playlistMode == 'playlist')
                        this.playPlaylist(playlist,playlistNr);
                    else {
                        const track = playlist.sounds.contents[trackNr];
                        if (track != undefined){
                            this.playTrack(track,playlist,playlistNr);
                        }
                    }
                }
            }
            else if (playlistType == 'playNext') {
                this.getPlaylist(playlistNr).playNext();
            }
            else if (playlistType == 'playPrev') {
                this.getPlaylist(playlistNr).playNext(null,{direction:-1});
            }
            else if (playlistType == 'offset'){
                if (playlistMode == 'playlist') {
                    this.playlistOffset = parseInt(settings.offset);
                    if (isNaN(this.playlistOffset)) this.playlistOffset = 0;
                }
                else  {
                    this.trackOffset = parseInt(settings.offset);
                    if (isNaN(this.trackOffset)) this.trackOffset = 0;
                }
                this.updateAll();
            }
            else if (playlistType == 'relativeOffset'){
                if (playlistMode == 'playlist') {
                    let playlistOffset = parseInt(settings.offset);
                    if (isNaN(playlistOffset)) playlistOffset = 0;
                    let number = parseInt(this.playlistOffset + playlistOffset);
                    const nrOfPlaylists = parseInt(game.settings.get(moduleName,'playlists').playlistNumber);
                    if (number < 0) number += nrOfPlaylists;
                    else if (number >= nrOfPlaylists) number -= nrOfPlaylists;
                    this.playlistOffset = number;
                }
                else  {
                    let value = parseInt(settings.offset);
                    if (isNaN(value)) return;
                    this.trackOffset += value;
                }
                this.updateAll();
            }
            else if (playlistType == 'incDecVol' || playlistType == 'setVol') {
                const value = settings.trackVolumeValue ? parseFloat(settings.trackVolumeValue) : 0.1;
                let playlist = this.getPlaylist(playlistNr);
                if (playlist != undefined){
                    if (playlistMode != 'track') return;
                    const track = playlist.sounds.contents[trackNr];
                    if (track != undefined){
                        let newVolume = playlistType == 'incDecVol' ? AudioHelper.volumeToInput(track.volume) + value : value;
                        if (newVolume > 1) newVolume = 1;
                        else if (newVolume < 0) newVolume = 0;
                        track.updateSource({volume:AudioHelper.inputToVolume(newVolume)})
                        track.sound?.fade(track.effectiveVolume, {duration: PlaylistSound.VOLUME_DEBOUNCE_MS});
                        if ( track.isOwner ) track.debounceVolume(AudioHelper.inputToVolume(newVolume));
                        for (let elmnt of document.getElementById('currently-playing').getElementsByClassName('sound')) {
                            if (elmnt.getAttribute('data-sound-id') == track.id) {
                                elmnt.getElementsByClassName('sound-volume')[0].value = newVolume;
                                return;
                            }
                        }
                        this.updateAll();
                    }
                }
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
        let mode = game.settings.get(moduleName,'playlists').playlistMode[playlistNr];
        //const originalPlayMode = playlist.mode;
        //await playlist.update({mode: CONST.PLAYLIST_MODES.SEQUENTIAL});
        if (mode == 0) {
            mode = game.settings.get(moduleName,'playlists').playMode;
            if (mode == 2) await this.stopAll(true);
        }
        playlist.playAll();
        //await playlist.update({mode: originalPlayMode});
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
        const originalPlayMode = playlist.mode;
        if (track.playing)
            play = false;
        else {
            play = true;
            let mode = game.settings.get(moduleName,'playlists').playlistMode[playlistNr];
            if (mode == 0) {
                mode = game.settings.get(moduleName,'playlists').playMode;
                if (mode == 0) await playlist.update({mode: CONST.PLAYLIST_MODES.SIMULTANEOUS});
                else if (mode == 1) await playlist.stopAll();
                else if (mode == 2) await this.stopAll(true);
            }
            else if (mode == 2) await playlist.stopAll(true);
        }
        
        if (play) await playlist.playSound(track);
        else await playlist.stopSound(track);
        
        playlist.update({playing: play});
        await playlist.update({mode: originalPlayMode});
    }
}