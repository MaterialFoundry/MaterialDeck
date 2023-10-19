import { streamDeck } from "../../MaterialDeck.js";

let customButtons = [];

export class CustomControl{
    constructor(){

    }

    context = {};

    registerButton(data) {
        let config = customButtons.find(b => b.buttonId === data.buttonId);
        if (config) {
            config = data;
            return;
        }
        customButtons.push(data);
    }

    appear(settings,context,device){
        const buttonState = customButtons.find(b => b.buttonId === settings.buttonId);
        if (buttonState == undefined || buttonState?.appear == undefined) return;
        
        this.context = {
            button: context,
            device: device
        }
        buttonState.appear(this);
    }

    disappear(settings, context, device) {
        const buttonState = customButtons.find(b => b.buttonId === settings.buttonId);
        if (buttonState == undefined || buttonState?.disappear == undefined) return;
        
        this.context = {
            button: context,
            device: device
        }
        buttonState.disappear(this);
    }

    keyDown(settings, context, device) {
        const buttonState = customButtons.find(b => b.buttonId === settings.buttonId);
        if (buttonState == undefined || buttonState?.keyDown == undefined) return;
        
        this.context = {
            button: context,
            device: device
        }
        buttonState.keyDown(this);
    }
    
    keyUp(settings, context, device) {
        const buttonState = customButtons.find(b => b.buttonId === settings.buttonId);
        if (buttonState == undefined || buttonState?.keyUp == undefined) return;
        this.context = {
            button: context,
            device: device
        }
        buttonState.keyUp(this);
    }

    setText(text) {
        streamDeck.setTitle(text,this.context.button);
    }

    setIcon(icon, options) {
        streamDeck.setIcon(this.context.button, this.context.device, icon || '<empty>', options);
    }
    
}
