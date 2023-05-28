import { streamDeck } from "../../MaterialDeck.js";
import { } from "../misc.js";

export class ExternalModules{
    soundscapeSettings = {
        channels: [],
        master: {
            mute: false,
            volume: 1,
            playing: false,
            name: 'Master'
        },
        soundboard: [],
        soundboardVolume: 1,
        playing: false
    }
    constructor(){
        this.active = false;
        this.gmScreenOpen = false;

        let channelData = [];
        let soundboardData = [];
        for (let i=0; i<8; i++) {
            channelData.push({
                volume: 1,
                mute: false,
                solo: false,
                link: false,
                playing: false,
                pan: 1,
                name: ''
            })
        }
        for (let i=0; i<25; i++) {
            soundboardData.push({
                active: false,
                name: '',
                icon: ''
            })
        }
        this.soundscapeSettings.channels = channelData;
        this.soundscapeSettings.soundboard = soundboardData;
    }

    async updateAll(data={}){
        if (data.gmScreen != undefined){
            this.gmScreenOpen = data.gmScreen.isOpen;
        }
        if (this.active == false) return;
        for (let device of streamDeck.buttonContext) {
            if (device?.buttons == undefined) continue;
            for (let i=0; i<device.buttons.length; i++){   
                const data = device.buttons[i];
                if (data == undefined || data.action != 'external') continue;
                await this.update(data.settings,data.context,device.device);
            }
        }
    }

    update(settings,context,device){
        this.active = true;
        const module = settings.module ? settings.module : 'fxmaster';
        if (module == 'fxmaster')           this.updateFxMaster(settings,context,device);
        else if (module == 'gmscreen')      this.updateGMScreen(settings,context,device);
        else if (module == 'triggerHappy')  this.updateTriggerHappy(settings,context,device);
        else if (module == 'sharedVision')  this.updateSharedVision(settings,context,device);
        else if (module == 'notYourTurn')   this.updateNotYourTurn(settings,context,device);
        else if (module == 'lockView')      this.updateLockView(settings,context,device);
        else if (module == 'simpleCalendar')     this.updateSimpleCalendar(settings,context,device);
        else if (module == 'soundscape')    this.updateSoundscape(settings,context,device);
        else if (module == 'monksActiveTiles') this.updateMonksActiveTiles(settings,context,device);
    }

    keyPress(settings,context,device){
        if (this.active == false) return;
        const module = settings.module ? settings.module : 'fxmaster';

        if (module == 'fxmaster')           this.keyPressFxMaster(settings,context,device);
        else if (module == 'gmscreen')      this.keyPressGMScreen(settings,context,device);
        else if (module == 'triggerHappy')  this.keyPressTriggerHappy(settings,context,device);
        else if (module == 'sharedVision')  this.keyPressSharedVision(settings,context,device);
        else if (module == 'notYourTurn')   this.keyPressNotYourTurn(settings,context,device);
        else if (module == 'lockView')      this.keyPressLockView(settings,context,device);
        else if (module == 'simpleCalendar')     this.keyPressSimpleCalendar(settings,context,device);
        else if (module == 'soundscape')    this.keyPressSoundscape(settings,context,device);
        else if (module == 'monksActiveTiles') this.keyPressMonksActiveTiles(settings,context,device);
    }

    getModuleEnable(moduleId){
        const module = game.modules.get(moduleId);
        if (module == undefined || module.active == false) return false;
        return true;
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //FxMaster
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    updateFxMaster(settings,context,device){
        if (game.user.isGM == false) return;
        const fxmaster = game.modules.get("fxmaster");
        if (fxmaster == undefined || fxmaster.active == false) return;

        const type = (settings.fxMasterType == undefined) ? 'weatherControls' : settings.fxMasterType;
        const displayIcon = settings.displayFxMasterIcon;
        const displayName = settings.displayFxMasterName;
        let ring = 0;
        let ringColor = "#000000";
        let background = "#000000"

        let icon = '';
        let name = '';
        if (type == 'weatherControls') {
            const effect = (settings.weatherEffect == undefined) ? 'leaves' : settings.weatherEffect;
            name =game.i18n.localize(CONFIG.fxmaster.particleEffects[effect].label);
            icon = CONFIG.fxmaster.particleEffects[effect].icon;
            ring = canvas.scene.getFlag("fxmaster", "effects")?.[`core_${effect}`] ? 2 : 1;
            ringColor = ring < 2 ? '#000000' : "#00ff00";
        }
        else if (type == 'filters') {
            const filter = (settings.fxMasterFilter == undefined) ? 'underwater' : settings.fxMasterFilter;
            name = game.i18n.localize(CONFIG.fxmaster.filterEffects[filter].label);
            background = "#340057";
            if (displayIcon){
                if (filter == 'lightning') icon = "fas fa-bolt";
                else if (filter == 'underwater') icon = "fas fa-water";
                else if (filter == 'predator') icon = "fas fa-wave-square";
                else if (filter == 'color') icon = "fas fa-palette";
                else if (filter == 'oldfilm') icon = "fas fa-film";
                else if (filter == 'bloom') icon = "fas fa-ghost";
            }
            const fxmaster = canvas.scene.getFlag("fxmaster", "filters");
            ring = 1;
            if (fxmaster != undefined) {
                const objKeys = Object.keys(fxmaster);
                for (let i=0; i<objKeys.length; i++){
                    if (objKeys[i] == "core_"+filter) {
                        ring = 2;
                        ringColor = "#A600FF";
                        break;
                    }
                }
            }
            if (filter == 'color') background = settings.fxMasterFilterColor ? settings.fxMasterFilterColor : '#ffffff';
        }
        else if (type == 'clear'){
            icon = "fas fa-trash";
            name = game.i18n.localize("MaterialDeck.FxMaster.Clear");
        }

        if (settings.iconOverride != '' && settings.iconOverride != undefined) icon = settings.iconOverride;
        if (displayIcon) streamDeck.setIcon(context,device,icon,{background:background,ring:ring,ringColor:ringColor});
        else streamDeck.setIcon(context,device, "", {background:background,ring:ring,ringColor:ringColor});
        if (displayName == 0) name = ""; 
        streamDeck.setTitle(name,context);
    }

    keyPressFxMaster(settings,context,device){
        if (game.user.isGM == false) return;
        const fxmaster = game.modules.get("fxmaster");
        if (fxmaster == undefined || fxmaster.active == false) return;

        const type = (settings.fxMasterType == undefined) ? 'weatherControls' : settings.fxMasterType;

        if (type == 'weatherControls') {
            const effect = (settings.weatherEffect == undefined) ? 'leaves' : settings.weatherEffect;

            const options = {
                density: (settings.densitySlider == undefined) ? 0.25 : settings.densitySlider,
                speed: (settings.speedSlider == undefined) ? 1 : settings.speedSlider,
                direction: (settings.directionSlider == undefined) ? 15 : settings.directionSlider,
                scale: (settings.scaleSlider == undefined) ? 1 : settings.scaleSlider,
                color: (settings.fxMasterWeatherColor == undefined) ? "#000000" : settings.fxMasterWeatherColor,
                applyColor: (settings.fxWeatherEnColor == undefined) ? false : settings.fxWeatherEnColor
            }

            Hooks.call("fxmaster.switchParticleEffect", {
                name: `core_${effect}`,
                type: effect,
                options,
              });

        }
        else if (type == 'filters') {
            const filter = (settings.fxMasterFilter == undefined) ? 'underwater' : settings.fxMasterFilter;

            let options = {color: {value:"#000000", apply:false}};
            if (filter == 'lightning') {
                options.period = settings.fxMasterFilterPeriod ? parseFloat(settings.fxMasterFilterPeriod) : 500;
                options.duration = settings.fxMasterFilterDuration ? parseFloat(settings.fxMasterFilterDuration) : 300;
                options.brightness = settings.fxMasterFilterBrightness ? parseFloat(settings.fxMasterFilterBrightness) : 1.3;
            }
            else if (filter == 'underwater') {
                options.speed = settings.fxMasterFilterSpeed ? parseFloat(settings.fxMasterFilterSpeed) : 0.3;
                options.scale = settings.fxMasterFilterScale ? parseFloat(settings.fxMasterFilterScale) : 4;
            }
            else if (filter == 'predator') {
                options.noise = settings.fxMasterFilterNoise ? parseFloat(settings.fxMasterFilterNoise) : 4;
                options.speed = settings.fxMasterFilterSpeed ? parseFloat(settings.fxMasterFilterSpeed)*0.1 : 0.03;
            }
            
            else if (filter == 'bloom') {
                options.blur = settings.fxMasterFilterBlur ? parseFloat(settings.fxMasterFilterBlur) : 1;
                options.bloom = settings.fxMasterFilterBloom ? parseFloat(settings.fxMasterFilterBloom) : 0.1;
                options.threshold = settings.fxMasterFilterThreshold ? parseFloat(settings.fxMasterFilterThreshold) : 0.5;
            }
            else if (filter == 'oldfilm') {
                options.sepia = settings.fxMasterFilterSepia ? parseFloat(settings.fxMasterFilterSepia) : 0.3;
                options.noise = settings.fxMasterFilterNoise ? parseFloat(settings.fxMasterFilterNoise) : 4;
            }

            if (filter == 'color') {
                options.color = {
                    apply: settings.fxMasterFilterTint ? settings.fxMasterFilterTint : false,
                    value: settings.fxMasterFilterColor ? settings.fxMasterFilterColor : '#ffffff'
                }
                options.saturation = settings.fxMasterFilterSaturation ? parseFloat(settings.fxMasterFilterSaturation) : 1;
                options.contrast = settings.fxMasterFilterContrast ? parseFloat(settings.fxMasterFilterContrast) : 1;
                options.brightness = settings.fxMasterFilterBrightness ? parseFloat(settings.fxMasterFilterBrightness) : 1;
                options.Gamma = settings.fxMasterFilterGamma ? parseFloat(settings.fxMasterFilterGamma) : 1;
            }

            FXMASTER.filters.switch(`core_${filter}`, filter, options);
        }
        else if (type == 'clear'){
            canvas.scene.unsetFlag("fxmaster", "filters");
            canvas.scene.unsetFlag("fxmaster", "effects");
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //GM Screen
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////

    updateGMScreen(settings,context,device){
        if (this.getModuleEnable("gm-screen") == false) return;
        if (game.user.isGM == false) return;
        const background = settings.gmScreenBackground ? settings.gmScreenBackground : '#000000';
        let ring = 1;
        const ringColor = '#00FF00'
        let src = '';
        let txt = '';

        if (this.gmScreenOpen) ring = 2;
        
        if (settings.displayGmScreenIcon) src = "fas fa-book-reader";
        if (settings.iconOverride != '' && settings.iconOverride != undefined) src = settings.iconOverride;
        streamDeck.setIcon(context,device,src,{background:background,ring:ring,ringColor:ringColor});
        if (settings.displayGmScreenName) txt = game.i18n.localize(`GMSCR.gmScreen.Open`); 
        streamDeck.setTitle(txt,context);
    }

    keyPressGMScreen(settings,context,device){
        if (this.getModuleEnable("gm-screen") == false) return;
        if (game.user.isGM == false) return;
        game.modules.get('gm-screen')?.api?.toggleGmScreenVisibility?.();
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Trigger Happy
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////

    updateTriggerHappy(settings,context,device) {
        if (this.getModuleEnable("trigger-happy") == false) return;
        if (game.user.isGM == false) return;
        
        const displayName = settings.displayTriggerHappyName ? settings.displayTriggerHappyName : false;
        const displayIcon = settings.displayTriggerHappyIcon ? settings.displayTriggerHappyIcon : false;

        const background = "#340057";
        const ringColor = game.settings.get("trigger-happy", "enableTriggers") ? "#A600FF" : "#340057";

        let txt = '';
        let src = "fas fa-grin-squint-tears";
        if (settings.iconOverride != '' && settings.iconOverride != undefined) src = settings.iconOverride;
        if (displayIcon) streamDeck.setIcon(context,device,src,{background:background,ring:2,ringColor:ringColor});
        else streamDeck.setIcon(context,device,'',{background:'#000000'});
        if (displayName) txt = 'Trigger Happy';
        
        streamDeck.setTitle(txt,context);
    }

    keyPressTriggerHappy(settings,context,device){
        if (this.getModuleEnable("trigger-happy") == false) return;
        if (game.user.isGM == false) return;
        const mode = settings.triggerHappyMode ? settings.triggerHappyMode : 'toggle';

        let val = game.settings.get("trigger-happy", "enableTriggers");
        if (mode == 'toggle') val = !val;
        else if (mode == 'enable') val = true;
        else if (mode == 'disable') val = false;

        game.settings.set("trigger-happy", "enableTriggers", val);

        const control = ui.controls.controls.find(c => c.name == 'token');
        if (control == undefined) return;
        let tool = control.tools.find(t => t.name == 'triggers');
        if (tool == undefined) return;
        tool.active = val;
        ui.controls.render(); 
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Shared Vision
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    updateSharedVision(settings,context,device) {
        if (this.getModuleEnable("SharedVision") == false) return;
        if (game.user.isGM == false) return;
        
        const displayName = settings.sharedVisionName ? settings.sharedVisionName : false;
        const displayIcon = settings.sharedVisionIcon ? settings.sharedVisionIcon : false;

        const background = "#340057";
        const ringColor = game.settings.get("SharedVision", "enable") ? "#A600FF" : "#340057";

        let txt = '';
        let src = "fas fa-eye";
        if (settings.iconOverride != '' && settings.iconOverride != undefined) src = settings.iconOverride;
        if (displayIcon) streamDeck.setIcon(context,device,src,{background:background,ring:2,ringColor:ringColor});
        else streamDeck.setIcon(context,device,'',{background:'#000000'});
        if (displayName) txt = 'Shared Vision';
        streamDeck.setTitle(txt,context);
    }

    keyPressSharedVision(settings,context,device) {
        if (this.getModuleEnable("SharedVision") == false) return;
        if (game.user.isGM == false) return;

        const mode = settings.sharedVisionMode ? settings.sharedVisionMode : 'toggle';

        if (mode == 'toggle') Hooks.call("setShareVision",{enable:'toggle'});
        else if (mode == 'enable') Hooks.call("setShareVision",{enable:true});
        else if (mode == 'disable') Hooks.call("setShareVision",{enable:false});
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Not Your Turn!
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    updateNotYourTurn(settings,context,device) {
        
        if (this.getModuleEnable("NotYourTurn") == false) return;
        if (game.user.isGM == false) return;

        const mode = settings.notYourTurnMode ? settings.notYourTurnMode : 'toggle';
        const displayName = settings.notYourTurnName ? settings.notYourTurnName : false;
        const displayIcon = settings.notYourTurnIcon ? settings.notYourTurnIcon : false;

        const background = "#340057";
        let ringColor = "#340057" ;

        let txt = '';
        let icon = '';
        if (mode == 'toggle' || mode == 'enable' || mode == 'disable') {
            icon = "fas fa-fist-raised";
            txt = "Block Combat Movement";
            ringColor = game.settings.get('NotYourTurn','enable') ?  "#A600FF": "#340057" ;
        }
        else {
            icon = "fas fa-lock";
            txt = "Block Non-Combat Movement";
            ringColor = game.settings.get('NotYourTurn','nonCombat') ?  "#A600FF": "#340057" ;
        }
        if (settings.iconOverride != '' && settings.iconOverride != undefined) icon = settings.iconOverride;
        if (displayIcon) streamDeck.setIcon(context,device,icon,{background:background,ring:2,ringColor:ringColor});
        else streamDeck.setIcon(context,device,'',{background:'#000000'});
        if (displayName == false) txt = '';
        streamDeck.setTitle(txt,context);
    }

    async keyPressNotYourTurn(settings,context,device) {
        if (this.getModuleEnable("NotYourTurn") == false) return;
        if (game.user.isGM == false) return;

        const mode = settings.notYourTurnMode ? settings.notYourTurnMode : 'toggle';

        if (mode == 'toggle') Hooks.call("setNotYourTurn",{combat:'toggle'});
        else if (mode == 'enable') Hooks.call("setNotYourTurn",{combat:true});
        else if (mode == 'disable') Hooks.call("setNotYourTurn",{combat:false});
        else if (mode == 'toggleNonCombat') Hooks.call("setNotYourTurn",{nonCombat:'toggle'});
        else if (mode == 'enableNonCombat') Hooks.call("setNotYourTurn",{nonCombat:true});
        else if (mode == 'disableNonCombat') Hooks.call("setNotYourTurn",{nonCombat:false});
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Lock View
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////

    updateLockView(settings,context,device) {
        
        if (this.getModuleEnable("LockView") == false) return;
        if (game.user.isGM == false) return;

        const mode = settings.lockViewMode ? settings.lockViewMode : 'panLock';
        const displayName = settings.lockViewName ? settings.lockViewName : false;
        const displayIcon = settings.lockViewIcon ? settings.lockViewIcon : false;

        const background = "#340057";
        let ringColor = "#340057" ;

        let txt = '';
        let icon = '';
        if (mode == 'panLock') {
            icon = "fas fa-arrows-alt";
            txt = "Pan Lock";
            ringColor = canvas.scene.getFlag('LockView', 'lockPan') ?  "#A600FF": "#340057" ;
        }
        else if (mode == 'zoomLock') {
            icon = "fas fa-search-plus";
            txt = "Zoom Lock";
            ringColor = canvas.scene.getFlag('LockView', 'lockZoom') ?  "#A600FF": "#340057" ;
        }
        else if (mode == 'boundingBox') {
            icon = "fas fa-box";
            txt = "Bounding Box";
            ringColor = canvas.scene.getFlag('LockView', 'boundingBox') ?  "#A600FF": "#340057" ;
        }
        
        if (settings.iconOverride != '' && settings.iconOverride != undefined) icon = settings.iconOverride;
        if (displayIcon) streamDeck.setIcon(context,device,icon,{background:background,ring:2,ringColor:ringColor});
        else streamDeck.setIcon(context,device,'',{background:'#000000'});
        if (displayName == false) txt = '';
        streamDeck.setTitle(txt,context);
    }

    async keyPressLockView(settings,context,device) {
        if (this.getModuleEnable("LockView") == false) return;
        if (game.user.isGM == false) return;

        const mode = settings.lockViewMode ? settings.lockViewMode : 'panLock';
        let toggle = settings.lockViewToggle ? settings.lockViewToggle : 'toggle';
        if (toggle == 'enable') toggle = true;
        else if (toggle == 'disable') toggle = false;
        let msg = {};

        if (mode == 'panLock') msg = {panLock:toggle};
        else if (mode == 'zoomLock') msg = {zoomLock:toggle};
        else if (mode == 'boundingBox') msg = {boundingBox:toggle};

        Hooks.call("setLockView",msg);
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //About Time
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    updateSimpleCalendar(settings,context,device) {
        if (this.getModuleEnable("foundryvtt-simple-calendar") == false) return;
        if (game.user.isGM == false) return;

        const displayTime = settings.simpleCalendarDisplayTime ? settings.simpleCalendarDisplayTime : 'none';
        const displayDate = settings.simpleCalendarDisplayDate ? settings.simpleCalendarDisplayDate : 'none';
        const background = settings.simpleCalendarBackground ? settings.simpleCalendarBackground : '#000000';
        const ringOffColor = settings.simpleCalendarOffRing ? settings.simpleCalendarOffRing : '#000000';
        const ringOnColor = settings.simpleCalendarOnRing ? settings.simpleCalendarOnRing : '#00FF00';

        let ring = 0;
        let ringColor = '#000000';
        let txt = '';
        let currentTime = SimpleCalendar.api.currentDateTime();
        let clock = 'none';

        if (displayTime == 'clock') {
            const hours = currentTime.hour > 12 ? currentTime.hour-12 : currentTime.hour;
            clock = {
                hours: hours,
                minutes: currentTime.minute
            }
        }
        else if (displayTime != 'none') {
            let hours;
            let AMPM = "";
            if ((displayTime == 'compact12h' || displayTime == 'full12h' || displayTime == 'hours12h') && currentTime.hour > 12) {
                hours = currentTime.hour - 12;
                AMPM = " PM";
            }
            else if ((displayTime == 'compact12h' || displayTime == 'full12h' || displayTime == 'hours12h') && currentTime.hour <= 12) {
                hours = currentTime.hour;
                AMPM = " AM";
            }
            else {
                hours = currentTime.hour;
            }
            if (displayTime == 'hours24h' || displayTime == 'hours12h') txt = hours;
            else if (displayTime == 'minutes') txt = currentTime.minute;
            else if (displayTime == 'seconds') txt = currentTime.seconds;
            else {
                if (currentTime.minute < 10) currentTime.minute = '0' + currentTime.minute;
                if (currentTime.seconds < 10) currentTime.seconds = '0' + currentTime.seconds;
                txt += hours + ':' + currentTime.minute;
                if (displayTime == 'full24h' || displayTime == 'full12h') txt += ':' + currentTime.seconds;
            }
            if (displayTime == 'compact12h' || displayTime == 'full12h' || displayTime == 'hours12h') txt += AMPM;
        }
        if (displayTime != 'none' && displayTime != 'clock' && displayDate != 'none') txt += '\n';

        if (displayDate == 'day') txt += currentTime.day;
        else if (displayDate == 'dayName') txt += SimpleCalendar.api.getCurrentWeekday().name;
        else if (displayDate == 'month') txt += currentTime.month;
        else if (displayDate == 'monthName') txt += SimpleCalendar.api.getCurrentMonth().name;
        else if (displayDate == 'year') txt += currentTime.year;
        else if (displayDate == 'small') txt += currentTime.day + '-' + currentTime.month;
        else if (displayDate == 'smallInv') txt += currentTime.month + '-' + currentTime.day;
        else if (displayDate == 'full') txt += currentTime.day + '-' + currentTime.month + '-' + currentTime.year;
        else if (displayDate == 'fullInv') txt += currentTime.month + '-' + currentTime.day + '-' + currentTime.year;
        else if (displayDate == 'text' || displayDate == 'textDay' || displayDate == 'textAbbr' || displayDate == 'textDayAbbr') {
            if (displayDate == 'textDay') txt += SimpleCalendar.api.getCurrentWeekday().name + ' ';
            else if (displayDate == 'textDayAbbr') txt += SimpleCalendar.api.getCurrentWeekday().abbreviation + ' ';
            txt += currentTime.day;
            if (currentTime.day % 10 == 1 && currentTime != 11) txt += game.i18n.localize("MaterialDeck.SimpleCalendar.First");
            else if (currentTime.day % 10 == 2 && currentTime != 12) txt += game.i18n.localize("MaterialDeck.SimpleCalendar.Second");
            else if (currentTime.day % 10 == 3 && currentTime != 13) txt += game.i18n.localize("MaterialDeck.SimpleCalendar.Third");
            else txt += game.i18n.localize("MaterialDeck.SimpleCalendar.Fourth");
            txt += ' ' + game.i18n.localize("MaterialDeck.SimpleCalendar.Of") + ' '
            if (displayDate == 'textAbbr' || displayDate == 'textDayAbbr') txt += SimpleCalendar.api.getCurrentMonth().abbreviation
            else txt += SimpleCalendar.api.getCurrentMonth().name
            txt += ', ' + currentTime.year;
        }

        if (settings.simpleCalendarActive) {
            const clockRunning = SimpleCalendar.api.clockStatus().started;
            ringColor = clockRunning ? ringOnColor : ringOffColor;
            ring = 2;
        }
        
        streamDeck.setTitle(txt.toString(),context);
        streamDeck.setIcon(context,device,'',{background:background,ring:ring,ringColor:ringColor, clock:clock});
    }

    keyPressSimpleCalendar(settings,context,device) {
        if (this.getModuleEnable("foundryvtt-simple-calendar") == false) return;
        if (game.user.isGM == false) return;

        const onClick = settings.simpleCalendarOnClick ? settings.simpleCalendarOnClick : 'none';
        if (onClick == 'none') return;
        else if (onClick == 'startStop') {
            const clockRunning = SimpleCalendar.api.clockStatus().started;
            const startMode = settings.simpleCalendarStartStopMode ? settings.simpleCalendarStartStopMode : 'toggle';
            if (clockRunning && (startMode == 'toggle' || startMode == 'stop')) SimpleCalendar.api.stopClock();
            else if (!clockRunning && (startMode == 'toggle' || startMode == 'start')) SimpleCalendar.api.startClock();
        }
        else if (onClick == 'advance') {
            const advanceMode = settings.simpleCalendarAdvanceMode ? settings.simpleCalendarAdvanceMode : 'dawn';
            if (advanceMode == 'sunrise') SimpleCalendar.api.advanceTimeToPreset(SimpleCalendar.api.PresetTimeOfDay.Sunrise);
            if (advanceMode == 'midday') SimpleCalendar.api.advanceTimeToPreset(SimpleCalendar.api.PresetTimeOfDay.Midday);
            if (advanceMode == 'sunset') SimpleCalendar.api.advanceTimeToPreset(SimpleCalendar.api.PresetTimeOfDay.Sunset);
            if (advanceMode == 'midnight') SimpleCalendar.api.advanceTimeToPreset(SimpleCalendar.api.PresetTimeOfDay.Midnight);
            else if (advanceMode == '1s') SimpleCalendar.api.changeDate({seconds: 1});
            else if (advanceMode == '30s') SimpleCalendar.api.changeDate({seconds: 30});
            else if (advanceMode == '1m') SimpleCalendar.api.changeDate({minute: 1});
            else if (advanceMode == '5m') SimpleCalendar.api.changeDate({minute: 5});
            else if (advanceMode == '15m') SimpleCalendar.api.changeDate({minute: 15});
            else if (advanceMode == '1h')  SimpleCalendar.api.changeDate({hour: 1});
            else if (advanceMode == '6h')  SimpleCalendar.api.changeDate({hour: 6});
            else if (advanceMode == '12h')  SimpleCalendar.api.changeDate({hour: 12});
            else if (advanceMode == '1d')  SimpleCalendar.api.changeDate({day: 1});
            else if (advanceMode == '7d')  SimpleCalendar.api.changeDate({day: 7});
            else if (advanceMode == '1M')  SimpleCalendar.api.changeDate({month: 1});
            else if (advanceMode == '1y')  SimpleCalendar.api.changeDate({year: 1});
        }
        else if (onClick == 'recede') {
            const advanceMode = settings.simpleCalendarAdvanceMode ? settings.simpleCalendarAdvanceMode : 'dawn';
            let now = SimpleCalendar.api.currentDateTime();
            if (advanceMode == 'sunrise') {
                SimpleCalendar.api.changeDate({day: -1});
                SimpleCalendar.api.advanceTimeToPreset(SimpleCalendar.api.PresetTimeOfDay.Sunrise);
            }
            else if (advanceMode == 'midday') {
                SimpleCalendar.api.changeDate({day: -1});
                SimpleCalendar.api.advanceTimeToPreset(SimpleCalendar.api.PresetTimeOfDay.Midday);
            }
            else if (advanceMode == 'sunset') {
                SimpleCalendar.api.changeDate({day: -1});
                SimpleCalendar.api.advanceTimeToPreset(SimpleCalendar.api.PresetTimeOfDay.Sunset);
            }
            else if (advanceMode == 'midnight') {
                SimpleCalendar.api.changeDate({day: -1});
                SimpleCalendar.api.advanceTimeToPreset(SimpleCalendar.api.PresetTimeOfDay.Midnight);
            }
            else if (advanceMode == '1s') SimpleCalendar.api.changeDate({seconds: -1});
            else if (advanceMode == '30s') SimpleCalendar.api.changeDate({seconds: -30});
            else if (advanceMode == '1m') SimpleCalendar.api.changeDate({minute: -1});
            else if (advanceMode == '5m') SimpleCalendar.api.changeDate({minute: -5});
            else if (advanceMode == '15m') SimpleCalendar.api.changeDate({minute: -15});
            else if (advanceMode == '1h')  SimpleCalendar.api.changeDate({hour: -1});
            else if (advanceMode == '6h')  SimpleCalendar.api.changeDate({hour: -6});
            else if (advanceMode == '12h')  SimpleCalendar.api.changeDate({hour: -12});
            else if (advanceMode == '1d')  SimpleCalendar.api.changeDate({day: -1});
            else if (advanceMode == '7d')  SimpleCalendar.api.changeDate({day: -7});
            else if (advanceMode == '1M')  SimpleCalendar.api.changeDate({month: -1});
            else if (advanceMode == '1y')  SimpleCalendar.api.changeDate({year: -1});
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Soundscape
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////

    updateSoundscape(settings,context,device) {
        
        if (this.getModuleEnable("soundscape") == false) return;
        if (game.user.isGM == false) return;

        const target = settings.soundscapeTarget ? settings.soundscapeTarget : 'mixer';
        let channel = settings.soundscapeChannel ? settings.soundscapeChannel : 1;
        
        let background = '#000000';
        let ring = 0;
        let ringColor = '#000000';

        let txt = '';
        let src = 'modules/MaterialDeck/img/transparant.png';
        let name = '';

        if (target == 'mixer') {
            let mode = settings.soundscapeMixerMode ? settings.soundscapeMixerMode : 'startStopAll';
            const displayName = settings.soundscapeMixerName;
            const displayChannel = settings.soundscapeDisplayMixerChannel;

            if (mode == 'startStopAll') {
                channel = 'master';
                mode = 'startStop';
            }

            if (channel == 'Master') channel = 'master';

            let channelSettings;
            if (channel == 'master') {
                channelSettings = this.soundscapeSettings.master;
                channelSettings.playing = this.soundscapeSettings.playing;
                channelSettings.name = 'Master';
            }
            else channelSettings = this.soundscapeSettings.channels[channel-1];
            if (displayChannel && channel == 'master') txt += 'Master';
            else if (displayChannel) txt += channel;

            if (mode == 'startStop') {
                if (displayChannel) txt += '\n';
                if (channelSettings.playing) {
                    src = "fas fa-stop";
                    ringColor = '#00ff00';
                }
                else {
                    src = "fas fa-play";
                    ringColor = '#006600';
                }
                ring=2;
                
            }
            else if (mode == 'mute') {
                if (displayChannel) txt += '\n';
                txt += 'M';
                if (displayName) txt += '\n';
                ring=2;
                ringColor = '#ff0000';
                background = channelSettings.mute ? '#ff0000' : '#660000'
            }
            else if (mode == 'solo') {
                if (channel == 'master') return;
                if (displayChannel) txt += '\n';
                txt += 'S';
                if (displayName) txt += '\n';
                ring=2;
                ringColor = '#ffff00';
                background = channelSettings.solo ? '#ffff00' : '#666600'
            }
            else if (mode == 'link') {
                if (channel == 'master') return;
                if (displayChannel) txt += '\n';
                txt += 'L';
                if (displayName) txt += '\n';
                ring=2;
                ringColor = '#00ffff';
                background = channelSettings.link ? '#00ffff' : '#000066'
            }
            else if (displayName && displayChannel) txt += '\n';

            if (displayName) txt += channelSettings.name;

            if (mode == 'volume') {
                const displayValue = settings.soundscapeDisplayMixerValue;
                const volume = Math.floor(channelSettings.volume*100);
                if (displayValue && (displayName || displayChannel)) txt += '\n';
                if (displayValue) txt += volume;
            }
            
        }
        else if (target == 'soundboard') {
            const displayName = settings.soundscapeSoundboardName;
            const displayIcon = settings.soundscapeSoundboardIcon;
            const displayChannel = settings.soundscapeDisplayChannel;
            const displayValue = settings.soundscapeSoundboardValue;
            const mode = settings.soundscapeSoundboardMode ? settings.soundscapeSoundboardMode : 'play';

            if (mode == 'play') {
                channel -= 1;
                let sound = this.soundscapeSettings.soundboard[channel];

                if (displayChannel) txt += channel+1;
                if (displayChannel && displayName) txt += '\n';
                if (displayName) txt += sound.name;
                if (displayIcon) src = sound.icon;
            }
            else if (mode == 'volume') {
                const volume = Math.floor(this.soundscapeSettings.soundboardVolume*100);
                if (displayValue) txt += volume;
            }
            else if (mode == 'stop') {
                src = 'modules/MaterialDeck/img/playlist/stop.png';
            }
        }
       
        streamDeck.setTitle(txt,context);
        if (settings.iconOverride != '' && settings.iconOverride != undefined) src = settings.iconOverride;
        streamDeck.setIcon(context,device,src,{background:background,ring:ring,ringColor:ringColor});
    }

    async keyPressSoundscape(settings,context,device) {
        if (this.getModuleEnable("soundscape") == false) return;
        if (game.user.isGM == false) return;

        const target = settings.soundscapeTarget ? settings.soundscapeTarget : 'mixer';
        let channel = settings.soundscapeChannel ? settings.soundscapeChannel : 1;

        if (target == 'mixer') {
            const mode = settings.soundscapeMixerMode ? settings.soundscapeMixerMode : 'startStopAll';

            if (mode == 'startStopAll') {
                const playing = !this.soundscapeSettings.playing;
                if (playing) {
                    Hooks.call('setSoundscape',{"msgType":"start","channelNr":undefined});
                    return;
                }
                else {
                    Hooks.call('setSoundscape',{"msgType":"stop","channelNr":undefined});
                    return;
                }
            }

            if (channel == 'Master') channel = 'master';

            let channelSettings;
            if (channel == 'master') {
                channelSettings = this.soundscapeSettings.master;
                channelSettings.playing = this.soundscapeSettings.playing;
            }
            else channelSettings = this.soundscapeSettings.channels[channel-1];

            let mute, solo, link, playing;
            let setChannel = false;

            if (mode == 'startStop') {
                setChannel = true;
                playing = !channelSettings.playing;
                if (channel == 'master' && playing) {
                    Hooks.call('setSoundscape',{"msgType":"stop"});
                    return;
                }
                else if (channel == 'master') {
                    Hooks.call('setSoundscape',{"msgType":"start"});
                    return;
                }
            }
            else if (mode == 'mute') {
                setChannel = true;
                mute = !channelSettings.mute;
            }
            else if (mode == 'solo') {
                if (channel == 'master') return;
                setChannel = true;
                solo = !channelSettings.solo;
            }
            else if (mode == 'link') {
                if (channel == 'master') return;
                setChannel = true;
                link = !channelSettings.link;
            }
            if (setChannel) {
                const channelNr = channel == 'master' ? 'master' : channel-1;
                const payload = {
                    "msgType": "setChannel",
                    "channelNr": channelNr,
                    mute,
                    solo,
                    link,
                    playing
                };
                Hooks.call('setSoundscape',payload);
                return;
            }

            if (mode == 'volume') {
                const volumeMode = settings.soundscapeMixerValueMode ? settings.soundscapeMixerValueMode : 'incrementDecrement';
                const value = parseInt(settings.soundscapeMixerValue);
                if (isNaN(value) == false) {
                    let volume = channelSettings.volume*100;
                    
                    if (volumeMode == 'set') 
                        volume = value;
                    else
                        volume += value;
                    
                    volume = Math.floor(volume*100)/10000;
                    const channelNr = channel == 'master' ? 'master' : channel-1;
                    const payload = {
                        "msgType": "setVolume",
                        "channelNr": channelNr,
                        volume
                    };
                    Hooks.call('setSoundscape',payload);
                }
            }


        }
        else if (target == 'soundboard') {
            const mode = settings.soundscapeSoundboardMode ? settings.soundscapeSoundboardMode : 'play';

            if (mode == 'play') {
                channel -= 1;
                const payload = {
                    "msgType": "playSoundboard",
                    channelNr: channel
                };
                Hooks.call('setSoundscape',payload);
            }
            else if (mode == 'volume') {
                const volumeMode = settings.soundscapeSoundboardValueMode ? settings.soundscapeSoundboardValueMode : 'incrementDecrement';
                const value = parseInt(settings.soundscapeSoundboardValue);
                if (isNaN(value) == false) {
                    let volume = this.soundscapeSettings.soundboardVolume*100;
                    
                    if (volumeMode == 'set') 
                        volume = value;
                    else
                        volume += value;
                    
                    volume = Math.floor(volume*100)/10000;
                    const payload = {
                        "msgType": "setSoundboardVolume",
                        volume
                    };
                    Hooks.call('setSoundscape',payload);
                }
            }
            else if (mode == 'stop') {
                const payload = {
                    "msgType": "stopSoundboard"
                };
                Hooks.call('setSoundscape',payload);
            }
        }
    }

    newSoundscapeData(data) {
        let channel;
        if (data.channel != undefined) channel = data.channel;
        else if (data.channelNr != undefined) channel = data.channelNr;

        let channelSettings = channel == 'master' ? this.soundscapeSettings.master : this.soundscapeSettings.channels[channel]
        if (data.msgType == 'soundConfig') {
            
            let newChannelSettings = {
                volume: data.data.settings.volume,
                mute: data.data.settings.mute,
                solo: data.data.settings.solo,
                link: data.data.settings.link,
                playing: false,
                pan: data.data.settings.pan,
                name: data.data.settings.name
            };
            this.soundscapeSettings.channels[channel] = newChannelSettings;
        }
        else if (data.msgType == 'setMute') channelSettings.mute = data.mute;
        else if (data.msgType == 'setSolo') channelSettings.solo = data.solo;
        else if (data.msgType == 'setLink') channelSettings.link = data.link;
        else if (data.msgType == 'setVolume') {
            if (channel >= 100) return;
            channelSettings.volume = data.volume;
        }
        else if (data.msgType == 'start') {
            this.soundscapeSettings.playing = true;
            this.soundscapeSettings.master.playing = true;
            if (data.channel == undefined) for (let i=0; i<8; i++) this.soundscapeSettings.channels[i].playing = true;
            else this.soundscapeSettings.channels[data.channel].playing = true;
        }
        else if (data.msgType == 'stop') {
            
            if (data.channel == undefined) {
                for (let i=0; i<8; i++) this.soundscapeSettings.channels[i].playing = false;
                this.soundscapeSettings.playing = false;
            }
            else {
                this.soundscapeSettings.channels[data.channel].playing = false;
                let check = 0;
                for (let i=0; i<8; i++) if (this.soundscapeSettings.channels[data.channel].playing) check++;
                if (check == 0) this.soundscapeSettings.playing = false;
            }
        }
        else if (data.msgType == 'sbSoundConfig') {
            
            const channel = data.channel - 100;
            let active = true;
            if (data.data.soundArray == undefined) active = false;
            this.soundscapeSettings.soundboard[channel] = {
                active,
                name: data.data.name,
                icon: data.data.imageSrc
            };
        }
        else if (data.msgType == 'setSoundboardVolume')
            this.soundscapeSettings.soundboardVolume = data.volume;

        this.updateAll();
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Monks Active Tile Triggers
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    updateMonksActiveTiles(settings,context,device) {
        const id = settings.monksActiveTilesId;
        if (id == undefined || id == '') return;
        let tile = canvas.tiles.placeables.find(t => t.id == id);
        if (tile == undefined) return;
        const tileData = tile.document.flags?.['monks-active-tiles'];
        if (tileData == undefined) return;

        let ring = 1;
        let ringColor = '#000000';
        let background = '#000000';
        if (tileData.active) {
            ring = 2;
            ringColor = '#00ff00'
        }
        let src =  tile.document.texture.sr;

        streamDeck.setTitle('',context);
        if (settings.iconOverride != '' && settings.iconOverride != undefined) src = settings.iconOverride;
        streamDeck.setIcon(context,device,src,{background:background,ring:ring,ringColor:ringColor});
    }

    keyPressMonksActiveTiles(settings,context,device) {
        const mode = settings.monksActiveTilesMode ? settings.monksActiveTilesMode : 'toggle';
        const id = settings.monksActiveTilesId;
        if (id == undefined || id == '') return;
        let tile = canvas.tiles.placeables.find(t => t.id == id);
        if (tile == undefined) return;
        const tileData = tile.document.flags?.['monks-active-tiles'];
        if (tileData == undefined) return;

        if (mode == 'toggle') tile.document.setFlag('monks-active-tiles','active',!tileData.active);
    }
}


