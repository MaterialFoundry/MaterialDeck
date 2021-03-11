import * as MODULE from "../MaterialDeck.js";

export class StreamDeck{
    constructor() {
        this.pluginId;
        this.tokenHealthContext;
        this.tokenNameContext;
        this.tokenACContext;
        this.buttonContext = [];
        for (let i=0; i<31; i++){
            this.buttonContext[i] = undefined;
        }
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

    setContext(action,context,coordinates = {column:0,row:0},settings){
        const data = {
            context: context,
            action: action,
            settings: settings
        }
        let num = coordinates.column + coordinates.row*8;
        this.buttonContext[num] = data;
    }

    clearContext(action,coordinates = {column:0,row:0}){
        let num = coordinates.column + coordinates.row*8;
        this.buttonContext[num] = undefined;
        if (this.getActive(action) == false){
            if (action == 'token') MODULE.tokenControl.active = false; 
            else if (action == 'macro') MODULE.macroControl.active = false; 
            else if (action == 'combattracker') MODULE.combatTracker.active = false; 
            else if (action == 'playlist') MODULE.playlistControl.active = false;
            else if (action == 'soundboard') MODULE.soundboard.active = false;
            else if (action == 'other') MODULE.otherControls.active = false;
            else if (action == 'external') MODULE.externalModules.active = false;
            else if (action == 'scene') MODULE.sceneControl.active = false;
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
                let syllables = this.syllabify(txtNewPart);

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
            else{
                newTxtArray[counter] = txtNewPart;
                counter++;
            }
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

    setTitle(txt,context){
        if (txt == null || txt == undefined) txt = '';
        txt = this.formatTitle(txt);
        for (let i=0; i<32; i++){
            if (this.buttonContext[i] == undefined) continue;
            if (this.buttonContext[i].context == context) {
                if (this.buttonContext[i].txt != undefined)
                    if (this.buttonContext[i].txt == txt) 
                        return;
                this.buttonContext[i].txt = txt;
            }
        }
        let msg = {
            target: "SD",
            event: 'setTitle',
            context: context,
            payload: {
                title: txt,
                target: 0
            }
        };
        MODULE.sendWS(JSON.stringify(msg));
    }
    
    setColor(context,color = '#000000'){
        let msg = {
            target: "SD",
            event: 'setIcon',
            context: context,
            url: '',
            format: 'color',
            background: color
        };
        MODULE.sendWS(JSON.stringify(msg));
    }

    setImage(image,context,nr,id){
        var json = {
            target: "SD",
            event: "setImage",
            context: context,
            payload: {
                nr: nr,
                id: id,
                image: "" + image,
                target: 0
            }
        };
        MODULE.sendWS(JSON.stringify(json));
    }

    setBufferImage(context,nr,id){
        var json = {
            target: "SD",
            event: "setBufferImage",
            context: context,
            payload: {
                nr: nr,
                id: id,
                target: 0
            }
        };
        MODULE.sendWS(JSON.stringify(json));
    }

    setIcon(context,src='',options = {}){
        if (src == null || src == undefined) src = '';
        if (src == '') src = 'modules/MaterialDeck/img/black.png';
        let background = options.background ? options.background : '#000000';
        let ring = options.ring ? options.ring : 0;
        let ringColor = options.ringColor ? options.ringColor : '#000000';
        let overlay = options.overlay ? options.overlay : false;
        let uses = options.uses ? options.uses : undefined;
        let clock = options.clock ? options.clock : false;
        for (let i=0; i<32; i++){
            if (clock != false) break;
            if (this.buttonContext[i] == undefined) continue;
            if (this.buttonContext[i].context == context) {
                if (this.buttonContext[i].icon == src && this.buttonContext[i].ring == ring && this.buttonContext[i].ringColor == ringColor && this.buttonContext[i].background == background && this.buttonContext[i].uses == uses) 
                    return;
                this.buttonContext[i].icon = src;
                this.buttonContext[i].ring = ring;
                this.buttonContext[i].ringColor = ringColor;
                this.buttonContext[i].background = background;
                this.buttonContext[i].uses = uses;
            }
        }
        const data = {
            url: src,
            background:background,
            ring:ring,
            ringColor:ringColor,
            overlay:overlay,
            uses:uses,
            options:options
        }
        const imgBuffer = (clock == false) ? this.checkImageBuffer(data) : false;
        if (imgBuffer != false) {
            this.setBufferImage(context,imgBuffer,this.getImageBufferId(data))
            return;
        }
        
        let split = src.split('.');
        //filter out stuff from Tokenizer
        let format = split[split.length-1].split('?')[0];
        split = split[0].split(' ');
        if (split[0] == 'fas' || split[0] == 'far' || split[0] == 'fal' || split[0] == 'fad') format = 'icon';
        let msg = {
            target: "SD",
            event: 'setIcon',
            context: context,
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
        let msg = {
            target: "SD",
            event: 'setStateCustom',
            context: context,
            action: action,
            state: state
        };
        MODULE.sendWS(JSON.stringify(msg));
    }

    setProfile(action,device){
        let profile;
        if (action == 'playlistcontrol')
            profile = 'MaterialDeck-Playlist'
        var json = {
            target: "SD",
            source: 1,
            event: "switchToProfile",
            context: this.pluginId,
            device: device,
            payload: {
                profile: profile
            }
        };
        MODULE.sendWS(JSON.stringify(json));
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

        let canvas;
        if (canvas == null || canvas == undefined){
            canvas = document.createElement('canvas');
            canvas.width="144";
            canvas.height="144";
            canvas.style="background-color:transparent;visibility:hidden";
            document.getElementById('sdCanvasBox').appendChild(canvas); // adds the canvas to #someBox
        }
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
        if (format == 'icon' && url != ""){
            ctx.font = '600 90px "Font Awesome 5 Free"';
            ctx.fillStyle = "gray";
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

        if (format != 'jpg' && format != 'jpeg' && format != 'png' && format != 'webm' && format != 'webp' && format != 'gif' && format != 'svg') url = "modules/MaterialDeck/img/transparant.png";
        //if (url == "") url = "modules/MaterialDeck/img/transparant.png"
        let resImageURL = url;
        let img = new Image();
        img.setAttribute('crossorigin', 'anonymous');
        img.onload = () => {
            if (format == 'color') ctx.filter = "opacity(0)";
            if (data.overlay) ctx.filter = "brightness(60%)";
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
            if (uses != undefined && (uses.available > 0 || uses.maximum != undefined)) {
                let txt = uses.available;
                if (uses.maximum != undefined) txt = uses.available + '/' + uses.maximum;
                if (uses.maximum == undefined ) uses.maximum = 1;
                ctx.beginPath();
                ctx.lineWidth = 4;
                let green = Math.ceil(255*(uses.available/uses.maximum));
                let red = 255-green;
                green = green.toString(16);
                if (green.length == 1) green = "0"+green;
                red = red.toString(16);
                if (red.length == 1) red = "0"+red;
                if (uses.available == 0) ctx.strokeStyle = "#c80000";
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
            this.setImage(dataURL,data.context,nr,this.getImageBufferId(data));
        };
        img.src = resImageURL;
    }

    getImageBufferId(data){
        return data.url+data.background+data.ring+data.ringColor+data.overlay+data.uses?.available+data.uses?.maximum;
    }

    addToImageBuffer(img,data){
        const id = this.getImageBufferId(data);
        const maxBufferSize = game.settings.get(MODULE.moduleName,'imageBuffer');
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
        if (game.settings.get(MODULE.moduleName,'imageBuffer') == 0) return false;
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

    noPermission(context,showTxt=true){
        const url = 'modules/MaterialDeck/img/black.png';
        const background = '#000000';
        const txt = showTxt ? 'no\npermission' : '';
        this.setIcon(context,url,{background:background});
        this.setTitle(txt,context);
    }
}