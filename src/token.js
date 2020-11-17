import * as MODULE from "../MaterialDeck.js";
import {streamDeck} from "../MaterialDeck.js";

export class TokenControl{
    constructor(){
        this.active = false;
    }

    async update(tokenId){
        if (this.active == false) return;
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
            else {
                //Other systems




            }
            if (settings.onClick == 4) { //toggle visibility
                ring = 1;
                if (token.data.hidden){
                    ring = 2;
                    ringColor = "#FF7B00";
                }
                if (icon == false) {
                    iconSrc = window.CONFIG.controlIcons.visibility;
                    streamDeck.setIcon(1,context,iconSrc,background,ring,ringColor,true);
                }
            }
            else if (settings.onClick == 5) { //toggle combat state
                ring = 1;
                if (token.inCombat){
                    ring = 2;
                    ringColor = "#FF7B00";
                }
                if (icon == false) {
                    iconSrc = window.CONFIG.controlIcons.combat;
                    streamDeck.setIcon(1,context,iconSrc,background,ring,ringColor,true);
                }
            }
            else if (settings.onClick == 6) { //target token
                ring = 1;
                if (token.isTargeted){
                    ring = 2;
                    ringColor = "#FF7B00";
                }
                if (icon == false) {
                    iconSrc = "fas fa-bullseye";
                    streamDeck.setIcon(1,context,iconSrc,background,ring,ringColor);
                }
            }
            else if (settings.onClick == 7) { //toggle condition
                ring = 1;
                let condition = settings.condition;
                if (condition == undefined) condition = 0;

                if (condition == 0 && icon == false){
                    iconSrc = window.CONFIG.controlIcons.effects;
                }
                else if (icon == false) {
                    let effect = CONFIG.statusEffects.find(e => e.id === this.getStatusId(condition));
                    iconSrc = effect.icon;
                    let effects = token.actor.effects.entries;
                    let active = effects.find(e => e.isTemporary === this.getStatusId(condition));
                    if (active != undefined){
                        ring = 2;
                        ringColor = "#FF7B00";
                    }
                } 
                streamDeck.setIcon(1,context,iconSrc,background,ring,ringColor,true);
            }
        }
        else {
            iconSrc += "";
            if (settings.onClick == 4) { //toggle visibility
                if (icon == false) {
                    iconSrc = window.CONFIG.controlIcons.visibility;
                    streamDeck.setIcon(1,context,iconSrc,background,1,'#000000',true);
                }
            }
            else if (settings.onClick == 5) { //toggle combat state
                if (icon == false) {
                    iconSrc = window.CONFIG.controlIcons.combat;
                    streamDeck.setIcon(1,context,iconSrc,background,1,'#000000',true);
                }
            }
            else if (settings.onClick == 6) { //target token
                if (icon == false) {
                    iconSrc = "fas fa-bullseye";
                    streamDeck.setIcon(1,context,iconSrc,background,1,'#000000');
                }
            }
            else if (settings.onClick == 7) { //toggle condition
                let condition = settings.condition;
                if (condition == undefined) condition = 0;

                if (condition == 0 && icon == false){
                    iconSrc = window.CONFIG.controlIcons.effects;
                }
                else if (icon == false) {
                    iconSrc = CONFIG.statusEffects.find(e => e.id === this.getStatusId(condition)).icon;
                } 
                streamDeck.setIcon(1,context,iconSrc,background,1,'#000000',true);
            }
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
    
    async keyPress(settings){
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
        else if (onClick == 3) {  //Open token config
            token.sheet._render(true);
        }
        else if (onClick == 4) {    //Toggle visibility
            token.toggleVisibility();
        }
        else if (onClick == 5) {    //Toggle combat state
            token.toggleCombat();
        }
        else if (onClick == 6) {    //Target token
            token.setTarget(!token.isTargeted,{releaseOthers:false});
        }
        else if (onClick == 7) {    //Toggle condition
            let condition = settings.condition;
            if (condition == undefined) condition = 0;

            if (condition == 0){
                const effects = token.actor.effects.entries;
                for (let i=0; i<effects.length; i++){
                    const effect = CONFIG.statusEffects.find(e => e.icon === effects[i].data.icon);
                    await token.toggleEffect(effect)
                }
            }
            else {
                const effect = CONFIG.statusEffects.find(e => e.id === this.getStatusId(condition));
                token.toggleEffect(effect);
            }
            
        }
    }

    getStatusId(nr){
        let id;
        if (nr == 1) id = 'dead';
        else if (nr == 2) id = 'unconscious';
        else if (nr == 3) id = 'sleep';
        else if (nr == 4) id = 'stun';
        else if (nr == 5) id = 'prone';
        else if (nr == 6) id = 'restrain';
        else if (nr == 7) id = 'paralysis';
        else if (nr == 8) id = 'fly';
        else if (nr == 9) id = 'bind';
        else if (nr == 10) id = 'deaf';
        else if (nr == 11) id = 'silence';
        else if (nr == 12) id = 'fear';
        else if (nr == 13) id = 'burning';
        else if (nr == 14) id = 'frozen';
        else if (nr == 15) id = 'shock';
        else if (nr == 16) id = 'corrode';
        else if (nr == 17) id = 'bleeding';
        else if (nr == 18) id = 'disease';
        else if (nr == 19) id = 'poison';
        else if (nr == 20) id = 'radiation';
        else if (nr == 21) id = 'regen';
        else if (nr == 22) id = 'degen';
        else if (nr == 23) id = 'upgrade';
        else if (nr == 24) id = 'downgrade';
        else if (nr == 25) id = 'target';
        else if (nr == 26) id = 'eye';
        else if (nr == 27) id = 'curse';
        else if (nr == 28) id = 'bless';
        else if (nr == 29) id = 'fireShield';
        else if (nr == 30) id = 'coldShield';
        else if (nr == 31) id = 'magicShield';
        else if (nr == 32) id = 'holyShield';

        return id;
    }
}