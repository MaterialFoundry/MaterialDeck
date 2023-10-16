import { moduleName, sendWS, tokenControl, macroControl, combatTracker, playlistControl, soundboard, otherControls, externalModules, sceneControl } from "../MaterialDeck.js";

export class StreamDeck{
    constructor() {
        this.pluginId;
        this.tokenHealthContext;
        this.tokenNameContext;
        this.tokenACContext;
        this.buttonContext = [];
        this.buttonsState = {};
        this.playlistTrackBuffer = [];
        this.playlistSelector = 0;
        this.trackSelector = 0;
        for (let i=0; i<23; i++)
            this.playlistTrackBuffer[i] = {state: 3, name: ""};
        this.playlistBuffer = [];
        for (let i=0; i<3; i++)
            this.playlistBuffer[i] = {state: 3, name: ""};
        this.counter = 0;

        let canvasBox = document.createElement('div');
        canvasBox.id = 'sdCanvasBox';
        document.body.appendChild(canvasBox); // adds the canvas to the body element

        this.syllableRegex = /[^aeiouy]*[aeiouy]+(?:[^aeiouy]*$|[^aeiouy](?=[^aeiouy]))?/gi;

        
        this.imageBuffer = [];
        this.imageBufferCounter = 0;
        
    }

    setScreen(action){
       
    }

    //getButtonContext

    newDevice(iteration,device) {
        if (this.buttonContext[iteration] == undefined) {
            const deckSize = device.size.columns*device.size.rows;
            let buttons = [];
            for (let i=0; i<deckSize; i++){
                buttons[i] = undefined;
            }
            this.buttonContext[iteration] = {
                device: device.id,
                name: device.name,
                type: device.type,
                size: deckSize,
                buttons: buttons
            }
        }
    }

    removeDevice(iteration) {
        this.buttonContext[iteration] = undefined;
    }

    setContext(device,size,iteration,action,context,coordinates = {column:0,row:0},settings, name, type){
        if (device == undefined) return;
        if (this.buttonContext[iteration] == undefined) {
            const deckSize = size.columns*size.rows;
            let buttons = [];
            for (let i=0; i<deckSize; i++){
                buttons[i] = undefined;
            }
            this.buttonContext[iteration] = {
                device: device,
                name: name,
                type: type,
                size: size,
                buttons: buttons
            }
        }

        const data = {
            context: context,
            action: action,
            settings: settings
        }

        const num = coordinates.column + coordinates.row*size.columns;
        this.buttonContext[iteration].buttons[num] = data;
    }

    clearContext(device,action,coordinates = {column:0,row:0}){
        for (let d of this.buttonContext) {
            if (d?.device == device) {
                const num = coordinates.column + coordinates.row*d.size.columns;
                d.buttons[num] = undefined;
                return;
            }
        }

        if (this.getActive(action) == false){
            if (action == 'token') tokenControl.active = false; 
            else if (action == 'macro') macroControl.active = false; 
            else if (action == 'combattracker') combatTracker.active = false; 
            else if (action == 'playlist') playlistControl.active = false;
            else if (action == 'soundboard') soundboard.active = false;
            else if (action == 'other') otherControls.active = false;
            else if (action == 'external') externalModules.active = false;
            else if (action == 'scene') sceneControl.active = false;
        }
    }

    getActive(action){
        for (let i=0; i<this.buttonContext.length; i++){
            if (this.buttonContext[i] != undefined && this.buttonContext[i].action == action)
                return true;
        }
        return false;
    }
    
    /*
    *  Get syllables of a word. Taken from: https://stackoverflow.com/a/49407494
    */
    syllabify(words) {
        return words.match(this.syllableRegex);
    }

    formatTitle(txt=''){
        let txtArrayOriginal = txt.split("\n");
        let txtArray = [];
        let counter = 0;
        for (let i=0; i<txtArrayOriginal.length; i++){
            if (i>0){
                txtArray[counter] = '';
                counter++;
            }
            let txtArrayTemp = txtArrayOriginal[i].split(" ");
            for (let j=0; j<txtArrayTemp.length; j++){
                txtArray[counter] = txtArrayTemp[j];
                counter++;
            }
        }

        let txtNew = "";
        let newTxtArray = ['','','','','','','','','','','','','','','','','','','',''];
        counter = 0;
        for (let i=0; i<txtArray.length; i++){
            
            let txtNewPart = txtArray[i];
            
            if (txtNewPart != undefined && txtNewPart.length > 10){
                let syllables = [];
                if (game.i18n.lang == "ru") {
                    newTxtArray[counter] = txtNewPart.slice(0,txtNewPart.length/2) + '-';
                    counter++;
                    newTxtArray[counter] = txtNewPart.slice(txtNewPart.length/2+1,txtNewPart.length);
                    counter++;
                }
                else {
                    syllables = this.syllabify(txtNewPart);
                    if (syllables == null) {
                        newTxtArray[counter] = txtNewPart;
                        counter++;
                    }
                    else {
                        for (let j=0; j<syllables.length; j++){
                            if (syllables.length == 0){
                                newTxtArray[counter] = txtNewPart;
                                counter++;
                            }
                            else if (syllables[j+1] == undefined){
                                newTxtArray[counter] = syllables[j];
                                counter++;
                            }
                            else if ((syllables[j].length+syllables[j+1].length) < 10){
                                newTxtArray[counter] = syllables[j]+syllables[j+1]; 
                                if (syllables.length-2 > j) newTxtArray[counter] += '-';
                                counter++;
                                j++;
                            }
                            else {
                                newTxtArray[counter] = syllables[j];
                                if (syllables.length > j) newTxtArray[counter] += '-';
                                counter++;
                            }
                        }
                    }
                }
            }
            else{
                newTxtArray[counter] = txtNewPart;
                counter++;
            }
            if (counter == 1 && newTxtArray[0] == "") counter = 0;
        }
        
        for (let i=0; i<counter; i++){
            if (txtNew.length > 0)
                txtNew += "\n";
            if (i<counter-1 && newTxtArray[i].length + newTxtArray[i+1].length < 10) {
                txtNew += newTxtArray[i] + " " + newTxtArray[i+1];
                i++;
            }
            else
                txtNew += newTxtArray[i];
        }
        return txtNew;
    }

    setTitle(txt, context) {
        let btnText;
        for (let device of this.buttonContext) {
            if (device == undefined) continue;
            const btn = device.buttons.find(b => b?.context == context);
            if (btn == undefined) continue;
          
            // Fallback to state value, if it exists
            const deviceState = this.buttonsState[device.device];
            btnText = txt || (deviceState && deviceState[context]?.text) || '';
            btn.txt = btnText;
        }

        let msg = {
            target: "MaterialDeck_Device",
            source: "MaterialDeck_Foundry",
            userId: game.userId,
            device: thisDevice,
            event: 'setTitle',
            context: context,
            payload: {
                title: this.formatTitle(btnText),
                target: 0
            }
        };
        sendWS(JSON.stringify(msg));
    }
    
    setColor(context,color = '#000000'){
let thisDevice;
        for (let device of this.buttonContext) {
            if (device == undefined) continue;
            thisDevice = device.buttons.find(b => b?.context == context);
        }
        let msg = {
            target: "MaterialDeck_Device",
            source: "MaterialDeck_Foundry",
            userId: game.userId,
            device: thisDevice,
            event: 'setIcon',
            context: context,
            url: '',
            format: 'color',
            background: color
        };
        sendWS(JSON.stringify(msg));
    }

    setImage(image,context,device,nr,id){
        var json = {
            target: "MaterialDeck_Device",
            source: "MaterialDeck_Foundry",
            userId: game.userId,
            event: "setImage",
            context: context,
            device: device,
            payload: {
                nr: nr,
                id: id,
                image: "" + image,
                target: 0
            }
        };
        sendWS(JSON.stringify(json));
    }

    setBufferImage(context,device,nr,id){
        var json = {
            target: "MaterialDeck_Device",
            source: "MaterialDeck_Foundry",
            userId: game.userId,
            event: "setBufferImage",
            context: context,
            device: device,
            payload: {
                nr: nr,
                id: id,
                target: 0
            }
        };
        sendWS(JSON.stringify(json));
    }

    setIcon(context,device,src='',options = {}){
        const deviceState = this.buttonsState[device];

        src = src || deviceState && deviceState[context]?.icon || 'modules/MaterialDeck/img/black.png';
        let background = options.background || deviceState && deviceState[context]?.options.background || '#000000';
        let ring = options.ring || deviceState && deviceState[context]?.options.ring || 0;
        let ringColor = options.ringColor || deviceState && deviceState[context]?.options.ringColor || '#000000';
        let overlay = options.overlay || false;
        let uses = options.uses || undefined;
        let clock = options.clock || false;

        for (let d of this.buttonContext) {
            if (d?.device == device) {
                for (let i=0; i<d.buttons.length; i++){
                    if (clock != false) break;
                    if (d.buttons[i] == undefined) continue;
                    if (d.buttons[i].context == context) {
                        if (d.buttons[i].icon == src && d.buttons[i].ring == ring && d.buttons[i].ringColor == ringColor && d.buttons[i].background == background && d.buttons[i].uses == uses) 
                            return;
                        d.buttons[i].icon = src;
                        d.buttons[i].ring = ring;
                        d.buttons[i].ringColor = ringColor;
                        d.buttons[i].background = background;
                        d.buttons[i].uses = uses;
                    }
                }
                break;
            }
        }

        const data = {
            url: src,
            background:background,
            ring:ring,
            ringColor:ringColor,
            overlay:overlay,
            uses:uses,
            options:options,
            devide:device
        }
        const imgBuffer = (clock == false) ? this.checkImageBuffer(data) : false;
        if (imgBuffer != false) {
            this.setBufferImage(context,device,imgBuffer,this.getImageBufferId(data))
            return;
        }
        
        let split = src.split('.');
        //filter out stuff from Tokenizer
        let format = split[split.length-1].split('?')[0];
        split = split[0].split(' ');
        if (split[0] == 'fas' || split[0] == 'far' || split[0] == 'fal' || split[0] == 'fad') format = 'icon';
        let split2 = split[0].split('-');
        if (split2[0] == 'fa') format = 'icon';
        let msg = {
            target: "MaterialDeck_Device",
            source: "MaterialDeck_Foundry",
            userId: game.userId,
            event: 'setIcon',
            context: context,
            device: device,
            url: src,
            format: format,
            background: background,
            ring: ring,
            ringColor: ringColor,
            overlay: overlay,
            uses:uses,
            options:options
        };
        this.getImage(msg);
    }

    setState(state,context,action){
        let thisDevice;
        for (let device of this.buttonContext) {
            if (device == undefined) continue;
            thisDevice = device.buttons.find(b => b?.context == context);
        }
        let msg = {
            target: "MaterialDeck_Device",
            source: "MaterialDeck_Foundry",
            userId: game.userId,
            event: 'setStateCustom',
            device: thisDevice,
            context: context,
            action: action,
            state: state
        };
        sendWS(JSON.stringify(msg));
    }

    setButtonState(buttonContext, deviceContext, state) {
        // Store button state as
        // {
        //   "deviceContext": {
        //     "buttonContext": {
        //       ...state
        //     }
        //   }
        if (!this.buttonsState[deviceContext]) {
            this.buttonsState[deviceContext] = {};
        }
        this.buttonsState[deviceContext][buttonContext] = state;
    }

    setProfile(action,device){
        let profile;
        if (action == 'playlistcontrol')
            profile = 'MaterialDeck-Playlist'
        var json = {
            target: "MaterialDeck_Device",
            source: "MaterialDeck_Foundry",
            userId: game.userId,
            event: "switchToProfile",
            context: this.pluginId,
            device: device,
            payload: {
                profile: profile
            }
        };
        sendWS(JSON.stringify(json));
    }

    setPluginId(id){
        this.pluginId = id;
    }

    getFAChar = function (name) {
        var elm = document.createElement('i');
        elm.className = name;
        elm.style.display = 'none';
        document.body.appendChild(elm);
        var content = window.getComputedStyle(
            elm, ':before'
        ).getPropertyValue('content')
        document.body.removeChild(elm);
        return content;
    };

    getImage(data){
        if (data == undefined) 
            return;
        const context = data.context;
        const device = data.device;
        var url = data.url;
        const format = data.format;
        var background = data.background;
        const uses = data.uses;
        let BGvalid = true;
        if (background.length != 7) BGvalid = false;
        if (background[0] != '#') BGvalid = false;
        for (let i=1; i<background.length; i++)
            if(isNaN(parseInt(background[i],16)))
                BGvalid = false;
        if (BGvalid == false) background = '#000000';
        
        let canvas = document.createElement('canvas');
        canvas.width="144";
        canvas.height="144";
        canvas.style="background-color:transparent;visibility:hidden;display:none";
        document.getElementById('sdCanvasBox').appendChild(canvas); // adds the canvas to #someBox
      
        this.counter++;
        if (this.counter > 31) this.counter = 0;
    
        let ctx = canvas.getContext("2d");
        ctx.filter = "none";
    
        let margin = 0;
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (data.ring != undefined && data.ring > 0){
            ctx.fillStyle = background;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            margin = 10;
            if (data.ring == 2) {
                ctx.fillStyle = data.ringColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = background;
                ctx.fillRect(margin, margin, canvas.width-2*margin, canvas.height-2*margin);
            }
        }
        else {
            
        }
        if (uses != undefined && uses.heart != undefined && (uses.available > 0 || uses.maximum != undefined)) {
            const percentage = 102*uses.available/uses.maximum;
            ctx.fillStyle = uses.heart;
            ctx.fillRect(0, 121,144,-percentage);
        }
        if (format == 'icon' && url != ""){
            ctx.font = '600 90px "Font Awesome 5 Free"';
            ctx.fillStyle = "#545454";
            var elm = document.createElement('i');
            elm.className = url;
            elm.style.display = 'none';
            canvas.appendChild(elm);
            var content = window.getComputedStyle(
            elm, ':before'
            ).getPropertyValue('content')
            canvas.removeChild(elm);
            const iconMeasurement = ctx.measureText(content[1]);
            const horOffset = (144-iconMeasurement.width)/2;
            const vertOffset = 144-(iconMeasurement.actualBoundingBoxAscent-iconMeasurement.actualBoundingBoxDescent)/2;
            ctx.fillText(content[1], horOffset, vertOffset);
        }

        if (format != 'jpg' && format != 'jpeg' && format != 'png' && format != 'PNG' && format != 'webm' && format != 'webp' && format != 'gif' && format != 'svg') url = "modules/MaterialDeck/img/transparant.png";
        //if (url == "") url = "modules/MaterialDeck/img/transparant.png"
        
        let resImageURL = url;
        let img = new Image();
        img.setAttribute('crossorigin', 'anonymous');
        img.onload = () => {
            if (format == 'color') ctx.filter = "opacity(0)";
            
            if (data.overlay == true) ctx.filter = "brightness(" + game.settings.get(moduleName,'imageBrightness') + "%)";
            //ctx.filter = "brightness(0) saturate(100%) invert(38%) sepia(62%) saturate(2063%) hue-rotate(209deg) brightness(90%) contrast(95%)";
            var imageAspectRatio = img.width / img.height;
            var canvasAspectRatio = canvas.width / canvas.height;
            var renderableHeight, renderableWidth, xStart, yStart;
    
            // If image's aspect ratio is less than canvas's we fit on height
            // and place the image centrally along width
            if(imageAspectRatio < canvasAspectRatio) {
                renderableHeight = canvas.height;
                renderableWidth = img.width * (renderableHeight / img.height);
                xStart = (canvas.width - renderableWidth) / 2;
                yStart = 0;
            }
    
            // If image's aspect ratio is greater than canvas's we fit on width
            // and place the image centrally along height
            else if(imageAspectRatio > canvasAspectRatio) {
                renderableWidth = canvas.width
                renderableHeight = img.height * (renderableWidth / img.width);
                xStart = 0;
                yStart = (canvas.height - renderableHeight) / 2;
            }
    
            // Happy path - keep aspect ratio
            else {
                renderableHeight = canvas.height;
                renderableWidth = canvas.width;
                xStart = 0;
                yStart = 0;
            }
            ctx.drawImage(img, xStart+margin, yStart+margin, renderableWidth - 2*margin, renderableHeight - 2*margin);
            if (uses != undefined && uses.heart == undefined) {
                
                let txt = '';
                let noMaxUses = false;
                if (uses.available != undefined) {
                    txt = uses.available;
                    if (uses.maximum != undefined) txt = uses.available + '/' + uses.maximum;
                    if (uses.maximum == undefined ) {
                        uses.maximum = 1;
                        noMaxUses = true;
                    }
                }
                ctx.beginPath();
                ctx.lineWidth = 4;
                let green = Math.ceil(255*(uses.available/uses.maximum));
                let red = 255-green;
                green = green.toString(16);
                if (green.length == 1) green = "0"+green;
                red = red.toString(16);
                if (red.length == 1) red = "0"+red;
                if (noMaxUses) ctx.strokeStyle = "#c000000";
                else if (uses.available == 0) ctx.strokeStyle = "#c80000";
                else ctx.strokeStyle = "#"+red.toString(16)+green.toString(16)+"00";
                const rect = {height:35, paddingSides:20, paddingBottom: 4}
                ctx.rect(rect.paddingSides, 144-rect.height-rect.paddingBottom,144-2*rect.paddingSides,rect.height);
                ctx.globalAlpha = 0.5;
                ctx.fillRect(rect.paddingSides, 144-rect.height-rect.paddingBottom,144-2*rect.paddingSides,rect.height);
                ctx.globalAlpha = 1;
                ctx.fillStyle = "white";
                ctx.font = "24px Arial";
                ctx.fillText(txt, (canvas.width  - ctx.measureText(txt).width) / 2, 144-rect.height-rect.paddingBottom+25);
                ctx.stroke();
            }
            
            if (data.options.clock != undefined) {
                if (data.options.clock != false && data.options.clock != 'none') {
                    const hourAngle = (data.options.clock.hours+data.options.clock.minutes/60)*Math.PI/6;
                    const minuteAngle = data.options.clock.minutes*Math.PI/30;

                    ctx.translate(72,72);
                    //Draw outer circle
                    ctx.beginPath();
                    ctx.lineWidth = 6;
                    ctx.strokeStyle = "gray";
                    ctx.arc(0,0, 50, 0, 2 * Math.PI);
                    ctx.stroke(); 
    
                    //Draw hour marks
                    ctx.fillStyle = "gray";
                    ctx.beginPath();
                    for (let i=0; i<12; i++) {
                        ctx.fillRect(-2,40,4,10);
                        const angle = 2*Math.PI/12;
                        ctx.rotate(angle);
                    }
    
    
                    //Draw hour arm
    
                    ctx.rotate(Math.PI + hourAngle);
                    ctx.rotate(0);
                    ctx.fillRect(-4,0,8,30);
                    ctx.stroke();
                   // ctx.rotate 8*Math.PI/12;
                   ctx.beginPath();
                    ctx.rotate(-hourAngle + minuteAngle);
                    ctx.fillStyle = "lightgray";
                    ctx.fillRect(-2,0,4,40);
                    ctx.rotate(2*Math.PI/12);
                    ctx.stroke();
    
                    //Draw inner circle
                    ctx.beginPath();
                    ctx.arc(0,0, 5, 0, 2 * Math.PI);
                    ctx.fill();
                    
                }
            }
            
            var dataURL = canvas.toDataURL();
            canvas.remove();
            const nr = this.addToImageBuffer(dataURL,data);
            this.setImage(dataURL,data.context,device,nr,this.getImageBufferId(data));
        };
        img.src = resImageURL;
    }

    getImageBufferId(data){
        return data.url+data.background+data.ring+data.ringColor+data.overlay+data.uses?.available+data.uses?.maximum;
    }

    addToImageBuffer(img,data){
        const id = this.getImageBufferId(data);
        const maxBufferSize = game.settings.get(moduleName,'imageBuffer');
        if (maxBufferSize == 0) return false;
        if (this.imageBufferCounter > maxBufferSize) this.imageBufferCounter = 0;
        
        const newData = {
            id: id,
            img: img
        }

        if (this.imageBuffer[this.imageBufferCounter] == undefined) this.imageBuffer.push(newData);
        else this.imageBuffer[this.imageBufferCounter] = newData;
        this.imageBufferCounter++;
        
        return this.imageBufferCounter - 1;
    }

    checkImageBuffer(data){
        if (game.settings.get(moduleName,'imageBuffer') == 0) return false;
        const id = this.getImageBufferId(data);
        
        for (let i=0; i<this.imageBuffer.length; i++){
            if (this.imageBuffer[i].id == id) return i;
        }
        return false;
    }

    resetImageBuffer(){
        this.imageBufferCounter = 0;
        this.imageBuffer = [];
    }

    noPermission(context,device,showTxt=true, origin = ""){
        console.warn("Material Deck: User lacks permission for function "+origin);
        const url = 'modules/MaterialDeck/img/black.png';
        const background = '#000000';
        const txt = showTxt ? 'no\npermission' : '';
        this.setIcon(context,device,url,{background:background});
        this.setTitle(txt,context);
    }
}
