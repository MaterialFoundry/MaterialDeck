import * as MODULE from "../MaterialDeck.js";
import {streamDeck} from "../MaterialDeck.js";

export class TokenControl{
    constructor(){
    }

    async update(tokenId){
        for (let i=0; i<32; i++){   
            let data = streamDeck.buttonContext[i];
            if (data == undefined || data.action != 'token') continue;
            await this.pushData(tokenId,data.settings,data.context);
        }
    }

    pushData(tokenId,settings,context,ring=0,ringColor='#000000'){
        let name = false;
        let icon = false;
        let type = 0;
        let background = "#000000";

        if (settings.displayIcon) icon = true;
        if (settings.displayName) name = true;
        if (settings.stats != undefined) type = settings.stats;
        if (settings.background) background = settings.background;
        
        let tokenName = "";
        let hp = "";
        let AC = "";
        let speed = "";
        let initiative = "";
        let txt = "";
        let iconSrc = "";
        if (tokenId != undefined) {
            let token = canvas.tokens.children[0].children.find(p => p.id == tokenId);
            tokenName = token.data.name;
            iconSrc += token.data.img;
            let actor = canvas.tokens.children[0].children.find(p => p.id == tokenId).actor;
            let system = game.system.id;
            if (system == 'dnd5e'){
                let attributes = actor.data.data.attributes;
                let hpCurrent = attributes.hp.value;
                let hpMax = attributes.hp.max;
                hp = hpCurrent + "/" + hpMax;
                AC = attributes.ac.value;
                
                if (attributes.speed._deprecated){
                    if (attributes.movement.burrow > 0) speed += attributes.movement.burrow + attributes.movement.units + " burrow";
                    if (attributes.movement.climb > 0) {
                        if (speed.length > 0) speed += '\n';
                        speed += attributes.movement.climb + attributes.movement.units + " climb";
                    }
                    if (attributes.movement.fly > 0) {
                        if (speed.length > 0) speed += '\n';
                        speed += attributes.movement.fly + attributes.movement.units + " fly";
                    }
                    if (attributes.movement.hover > 0) {
                        if (speed.length > 0) speed += '\n';
                        speed += attributes.movement.hover + attributes.movement.units + " hover";
                    }
                    if (attributes.movement.swim > 0) {
                        if (speed.length > 0) speed += '\n';
                        speed += attributes.movement.swim + attributes.movement.units + " swim";
                    }
                    if (attributes.movement.walk > 0) {
                        if (speed.length > 0) speed += '\n';
                        speed += attributes.movement.walk + attributes.movement.units + " walk";
                    }
                }
                else {
                    speed = attributes.speed.value;
                    if (attributes.speed.special.length > 0) speed + "\n" + attributes.speed.special;
                }
                initiative = attributes.init.total;
            }
            else return;
        }
        else {
            iconSrc += "";
        }
        if (icon) streamDeck.setIcon(1,context,iconSrc,background,ring,ringColor);
        
        if (name) txt += tokenName;
        if (name && type > 0) txt += "\n";
        if (type == 1) txt += hp;
        else if (type == 2) txt += AC;
        else if (type == 3) txt += speed;
        else if (type == 4) txt += initiative;
        streamDeck.setTitle(txt,context);
    }
    
    keyPress(settings){
        if (MODULE.selectedTokenId == undefined) return;
        const tokenId = MODULE.selectedTokenId;

        let onClick = settings.onClick;
        if (onClick == undefined) conClick = 0;

        const token = canvas.tokens.children[0].children.find(p => p.id == tokenId);
        if (token == undefined) return;

        if (onClick == 0)   //Do nothing
            return;
        else if (onClick == 1){ //center on token
            let location = token.getCenter(token.x,token.y); 
            canvas.animatePan(location);
        }
        else if (onClick == 2){ //Open character sheet
            token.actor.sheet.render(true);
        }
        else {  //Open token config
            token.sheet._render(true);
        }
    }
}