import { moduleName, streamDeck, getPermission } from "../../MaterialDeck.js";

export class SoundboardControl{
    constructor(){
        this.active = false;
        this.offset = 0;
        this.activeSounds = [];
    }

    async updateAll(){
        if (this.active == false) return;
        for (let device of streamDeck.buttonContext) {
            if (device?.buttons == undefined) continue;
            for (let i=0; i<device.buttons.length; i++){   
                const data = device.buttons[i];
                if (data == undefined || data.action != 'soundboard') continue;
                await this.update(data.settings,data.context,device.device);
            }
        }
    }

    update(settings,context,device){
        if (getPermission('SOUNDBOARD','PLAY') == false ) {
            streamDeck.noPermission(context,device);
            return;
        }
        this.active = true;
        const mode = settings.soundboardMode ? settings.soundboardMode : 'playSound';
        const background = settings.background ? settings.background : '#000000';
        let ringColor = "#000000"

        let txt = "";
        let src = "";
        
        if (mode == 'playSound'){ //play sound
            let soundNr = parseInt(settings.soundNr);
            if (isNaN(soundNr)) soundNr = 1;
            soundNr--;
            soundNr += this.offset;

            let soundboardSettings = game.settings.get(moduleName, 'soundboardSettings');
            ringColor = (this.activeSounds[soundNr]==undefined) ? soundboardSettings.colorOff[soundNr] : soundboardSettings.colorOn[soundNr];

            if (settings.displayName && soundboardSettings.name != undefined) txt = soundboardSettings.name[soundNr];
            if (settings.displayIcon && soundboardSettings.img != undefined) src = soundboardSettings.img[soundNr];

            streamDeck.setTitle(txt,context);
            if (settings.iconOverride != '' && settings.iconOverride != undefined) src = settings.iconOverride;
            streamDeck.setIcon(context,device,src,{background:background,ring:2,ringColor:ringColor});
        }
        else if (mode == 'offset') { //Offset
            const ringOffColor = settings.offRing ? settings.offRing : '#000000';
            const ringOnColor = settings.onRing ? settings.onRing : '#00FF00';

            let offset = parseInt(settings.offset);
            if (isNaN(offset)) offset = 0;
            if (offset == this.offset) ringColor = ringOnColor;
            else ringColor = ringOffColor;

            streamDeck.setTitle(txt,context);
            let src = '';
            if (settings.iconOverride != '' && settings.iconOverride != undefined) src = settings.iconOverride;
            streamDeck.setIcon(context,device,src,{background:background,ring:2,ringColor:ringColor});
        }
        else if (mode == 'stopAll') {   //Stop all sounds
            let src = 'modules/MaterialDeck/img/playlist/stop.png';
            let soundPlaying = false;
            const background = settings.background ? settings.background : '#000000';
            for (let i=0; i<this.activeSounds.length; i++)
                if (this.activeSounds[i]) 
                    soundPlaying = true;
            if (settings.iconOverride != '' && settings.iconOverride != undefined) src = settings.iconOverride;
            if (soundPlaying)
                streamDeck.setIcon(context,device,src,{background:background,ring:2,ringColor:'#00FF00',overlay:true});
            else
                streamDeck.setIcon(context,device,src,{background:background,ring:1,ringColor:'#000000',overlay:true});
        }
    }

    keyPressDown(settings){
        if (getPermission('SOUNDBOARD','PLAY') == false ) return;
        const mode = settings.soundboardMode ? settings.soundboardMode : 'playSound';

        if (mode == 'playSound') {    //Play sound
            let soundNr = parseInt(settings.soundNr);
            if (isNaN(soundNr)) soundNr = 1;
            soundNr--;
            soundNr += this.offset;

            const playMode = game.settings.get(moduleName,'soundboardSettings').mode[soundNr];
            const repeat = (playMode > 0) ? true : false;
            const play = (this.activeSounds[soundNr] == undefined) ? true : false;

            this.prePlaySound(soundNr,repeat,play);
        }
        else if (mode == 'offset') { //Offset
            let offset = parseInt(settings.offset);
            if (isNaN(offset)) offset = 0;
            this.offset = offset;
            this.updateAll();
        }
        else if (mode == 'stopAll') {  //Stop All Sounds
            for (let i=0; i<this.activeSounds.length; i++) {
                if (this.activeSounds[i] != undefined){
                    this.prePlaySound(i,false,false);
                }
            }
        }
    }

    keyPressUp(settings){
        if (getPermission('SOUNDBOARD','PLAY') == false ) return;
        const mode = settings.soundboardMode ? settings.soundboardMode : 'playSound';

        if (mode != 'playSound') return;

        let soundNr = parseInt(settings.soundNr);
        if (isNaN(soundNr)) soundNr = 1;
        soundNr--;
        soundNr += this.offset;

        const playMode = game.settings.get(moduleName,'soundboardSettings').mode[soundNr];
        
        if (playMode == 2)
            this.prePlaySound(soundNr,false,false);
    }

    async prePlaySound(soundNr,repeat,play){  
        const soundBoardSettings = game.settings.get(moduleName,'soundboardSettings');
        const playlistId = (soundBoardSettings.selectedPlaylists != undefined) ? soundBoardSettings.selectedPlaylists[soundNr] : undefined;
        let src;
        if (playlistId == "" || playlistId == undefined) return;
        if (playlistId == 'none') return;
        else if (playlistId == 'FP') {
            src = soundBoardSettings.src[soundNr];
            const ret = await FilePicker.browse("data", src, {wildcard:true});
            const files = ret.files;
            if (files.length == 1) 
                src = files;
            else {
                let value = Math.floor(Math.random() * Math.floor(files.length));
                src = files[value];
            }
        }
        else {
            const soundId = soundBoardSettings.sounds[soundNr];
            const sounds = game.playlists.get(playlistId).sounds;
            if (sounds == undefined) return;
            const sound = sounds.find(p => p.id == soundId);
            if (sound == undefined) return;
            src = sound.path;
        }

        let volume = game.settings.get(moduleName,'soundboardSettings').volume[soundNr]/100;
        volume = AudioHelper.inputToVolume(volume);
        
        let payload = {
            "msgType": "playSound", 
            "trackNr": soundNr,
            "src": src,
            "repeat": repeat,
            "play": play,
            "volume": volume
        };
        game.socket.emit(`module.MaterialDeck`, payload);

        this.playSound(soundNr,src,play,repeat,volume)
    }

    async playSound(soundNr,src,play,repeat,volume){
        if (play){
            volume *= game.settings.get("core", "globalAmbientVolume");

            let newSound = new Sound(src);
            if(newSound.loaded == false) await newSound.load({autoplay:true});
            newSound.on('end', ()=>{
                if (repeat == false) {
                    this.activeSounds[soundNr] = undefined;
                    this.updateAll();
                }
            });
            newSound.play({loop:repeat,volume:volume});
            this.activeSounds[soundNr] = newSound;
        }
        else {
            if (this.activeSounds[soundNr] != undefined) this.activeSounds[soundNr].stop();
            this.activeSounds[soundNr] = undefined;
        }
        this.updateAll();
    }

    ambientVolumeChanged(ambientVolume) {
        for (let i = 0; i<this.activeSounds.length; i++) {
            let sound = this.activeSounds[i];
            if (sound == undefined) continue;
            let volume = game.settings.get(moduleName,'soundboardSettings').volume[i]/100;
            volume = AudioHelper.inputToVolume(volume) * ambientVolume;
            sound.gain.value = volume;
        }
    }
}