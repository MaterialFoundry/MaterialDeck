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
        let stats =  settings.stats;
        let background = "#000000";

        if (settings.displayIcon) icon = true;
        if (settings.displayName) name = true;
        let system = settings.system;
        if (system == undefined) system = 'dnd5e';
        if (system == 'demonlord') stats = settings.statsDemonlord;
        if (stats == undefined) stats = 'none';
        if (settings.background) background = settings.background;

        let tokenName = "";
        let txt = "";
        let iconSrc = "";
        let overlay = false;
        if (tokenId != undefined) {
            let token = canvas.tokens.children[0].children.find(p => p.id == tokenId);
            tokenName = token.data.name;
            if (name) txt += tokenName;
            if (name && stats != 'none') txt += "\n";
            iconSrc = token.data.img;
            let actor = canvas.tokens.children[0].children.find(p => p.id == tokenId).actor;
            if (stats == 'custom'){
                const custom = settings.custom ? settings.custom : '';
                let split = custom.split('[');
                for (let i=0; i<split.length; i++) split[i] = split[i].split(']');
                for (let i=0; i<split.length; i++)
                    for (let j=0; j<split[i].length; j++){
                        if (split[i][j][0] != '@') txt += split[i][j];
                        else {
                            const dataPath = split[i][j].split('@')[1].split('.');
                            let data = token;
                            
                            for (let i=0; i<dataPath.length; i++)
                                data = data?.[dataPath[i]];
                            if (data == undefined) txt += '[undef]';
                            else txt += data;
                        }
                    }
            }
            else if (system == 'dnd5e' && game.system.id == 'dnd5e'){
                let attributes = actor.data.data.attributes;
                if (stats == 'HP') {
                    txt += attributes.hp.value + "/" + attributes.hp.max;
                }
                else if (stats == 'TempHP') {
                    txt += attributes.hp.temp;
                    if (attributes.hp.tempmax != null)
                    txt += "/" + attributes.hp.tempmax;
                }
                else if (stats == 'AC') txt += attributes.ac.value;
                else if (stats == 'Speed'){
                    let speed = "";
                    if (attributes.movement != undefined){
                        if (attributes.movement.burrow > 0) speed += game.i18n.localize("DND5E.MovementBurrow") + ': ' +  attributes.movement.burrow + attributes.movement.units;
                        if (attributes.movement.climb > 0) {
                            if (speed.length > 0) speed += '\n';
                            speed += game.i18n.localize("DND5E.MovementClimb") + ': ' + attributes.movement.climb + attributes.movement.units;
                        }
                        if (attributes.movement.fly > 0) {
                            if (speed.length > 0) speed += '\n';
                            speed += game.i18n.localize("DND5E.MovementFly") + ': ' + attributes.movement.fly + attributes.movement.units;
                        }
                        if (attributes.movement.hover > 0) {
                            if (speed.length > 0) speed += '\n';
                            speed += game.i18n.localize("DND5E.MovementHover") + ': ' + attributes.movement.hover + attributes.movement.units;
                        }
                        if (attributes.movement.swim > 0) {
                            if (speed.length > 0) speed += '\n';
                            speed += game.i18n.localize("DND5E.MovementSwim") + ': ' + attributes.movement.swim + attributes.movement.units;
                        }
                        if (attributes.movement.walk > 0) {
                            if (speed.length > 0) speed += '\n';
                            speed += game.i18n.localize("DND5E.MovementWalk") + ': ' + attributes.movement.walk + attributes.movement.units;
                        }
                    }
                    else {
                        speed = attributes.speed.value;
                        if (attributes.speed.special.length > 0) speed + "\n" + attributes.speed.special;
                    }
                    txt += speed;
                }
                else if (stats == 'Init') txt += attributes.init.total;
                else if (stats == 'PassivePerception') txt += actor.data.data.skills.prc.passive;
                else if (stats == 'PassiveInvestigation') txt += actor.data.data.skills.inv.passive;
            }
            else if ((system == 'dnd3.5e' && game.system.id == 'D35E') || (system == 'pf1e' && game.system.id == 'pf1')){
                let attributes = actor.data.data.attributes;
                if (stats == 'HP') txt += attributes.hp.value + "/" + attributes.hp.max;
                else if (stats == 'TempHP') {
                    if (attributes.hp.temp == null) txt += '0';
                    else txt += attributes.hp.temp;
                }
                else if (stats == 'AC') txt += attributes.ac.normal.total;
                else if (stats == 'Speed'){
                    let speed = "";
                    if (attributes.speed.burrow.total > 0) speed += 'Burrow: ' +  attributes.speed.burrow.total + 'Ft';
                    if (attributes.speed.climb.total > 0) {
                        if (speed.length > 0) speed += '\n';
                        speed += 'Climb: ' + attributes.speed.climb.total + 'Ft';
                    }
                    if (attributes.speed.fly.total > 0) {
                        if (speed.length > 0) speed += '\n';
                        speed += 'Fly: ' + attributes.speed.fly.total + 'Ft';
                    }
                    if (attributes.speed.land.total > 0) {
                        if (speed.length > 0) speed += '\n';
                        speed += 'Land: ' + attributes.speed.land.total + 'Ft';
                    }
                    if (attributes.speed.swim.total > 0) {
                        if (speed.length > 0) speed += '\n';
                        speed += 'Swim: ' + attributes.speed.swim.total + 'Ft';
                    }
                    txt += speed;
                }
                else if (stats == 'Init') txt += attributes.init.total;
            }
            else if (system == 'pf2e' && game.system.id == 'pf2e'){
                let attributes = actor.data.data.attributes;
                if (stats == 'HP') txt += attributes.hp.value + "/" + attributes.hp.max;
                else if (stats == 'TempHP') {
                    if (attributes.hp.temp == null) txt += '0';
                    else {
                        txt += attributes.hp.temp;
                        if (attributes.hp.tempmax > 0) txt += '/' + attributes.hp.tempmax;
                    }  
                }
                else if (stats == 'AC') txt += attributes.ac.value;
                else if (stats == 'Speed'){
                    let speed = "Land: " + attributes.speed.value.replace('feet','') + ' feet';
                    const otherSpeeds = attributes.speed.otherSpeeds;
                    if (otherSpeeds.length > 0)
                        for (let i=0; i<otherSpeeds.length; i++)
                            speed += '\n' + otherSpeeds[i].type + ": " + otherSpeeds[i].value;    
                    txt += speed;
                }
                else if (stats == 'Init') {
                    let init = attributes.initiative.totalModifier;
                    if (init != undefined) txt += init;
                }
            }
            else if (system == 'demonlord' && game.system.id == 'demonlord'){
                let characteristics = actor.data.data.characteristics;
                if (statsDemonlord == 'HP') txt += characteristics.health.value + "/" + characteristics.health.max;
                else if (statsDemonlord == 'AC') txt += characteristics.defense;
                else if (statsDemonlord == 'Speed') txt += characteristics.speed;
                else if (statsDemonlord == 'Init') txt += actor.data.data.fastturn ? "FAST" : "SLOW";
            }
            else {
                //Other systems




            }

            if (settings.onClick == 'visibility') { //toggle visibility
                ring = 1;
                if (token.data.hidden){
                    ring = 2;
                    ringColor = "#FF7B00";
                }
                if (icon == false) {
                    iconSrc = window.CONFIG.controlIcons.visibility;
                    overlay = true;
                }
            }
            else if (settings.onClick == 'combatState') { //toggle combat state
                ring = 1;
                if (token.inCombat){
                    ring = 2;
                    ringColor = "#FF7B00";
                }
                if (icon == false) {
                    iconSrc = window.CONFIG.controlIcons.combat;
                    overlay = true;
                }
            }
            else if (settings.onClick == 'target') { //target token
                ring = 1;
                if (token.isTargeted){
                    ring = 2;
                    ringColor = "#FF7B00";
                }
                if (icon == false) {
                    iconSrc = "fas fa-bullseye";
                }
            }
            else if (settings.onClick == 'condition') { //toggle condition
                ring = 1;
                if ((system == 'dnd5e' && game.system.id == 'dnd5e') || (system == 'dnd3.5e' && game.system.id == 'D35E') || (system == 'pf1e' && game.system.id == 'pf1')){
                    let condition = settings.condition;
                    if (condition == undefined) condition = 'removeAll';
                    if (condition == 'removeAll' && icon == false)
                        iconSrc = window.CONFIG.controlIcons.effects;
                    else if (icon == false) {
                        let effect = CONFIG.statusEffects.find(e => e.id === condition);
                        iconSrc = effect.icon;
                        let effects = token.actor.effects.entries;
                        let active = effects.find(e => e.isTemporary === condition);
                        if (active != undefined){
                            ring = 2;
                            ringColor = "#FF7B00";
                        } 
                    } 
                }
                else if (system == 'pf2e' && game.system.id == 'pf2e') {
                    let condition = settings.conditionPF2E;
                    if (condition == undefined) condition = 'removeAll';
                    if (condition == 'removeAll' && icon == false)
                        iconSrc = window.CONFIG.controlIcons.effects;
                    else if (icon == false) {
                        let effects = token.data.effects;
                        for (let i=0; i<effects.length; i++){
                            if (this.pf2eCondition(condition) == effects[i]){
                                ring = 2;
                                ringColor = "#FF7B00";
                            }       
                        }
                        iconSrc = this.pf2eCondition(condition);
                    } 
                }
                else if (system == 'demonlord' && game.system.id == 'demonlord'){
                    let condition = settings.conditionDemonlord;
                    if (condition == undefined) condition = 'removeAll';
                    if (condition == 'removeAll' && icon == false)
                        iconSrc = window.CONFIG.controlIcons.effects;
                    else if (icon == false) {
                        let effect = CONFIG.statusEffects.find(e => e.id === condition);
                        iconSrc = effect.icon;
                        let effects = token.actor.effects.entries;
                        let active = effects.find(e => e.isTemporary === condition);
                        if (active != undefined){
                            ring = 2;
                            ringColor = "#FF7B00";
                        } 
                    } 
                }
                else
                    iconSrc = "";
                overlay = true;
            }
        }
        else {
            iconSrc += "";
            if (settings.onClick == 'visibility') { //toggle visibility
                if (icon == false) {
                    iconSrc = window.CONFIG.controlIcons.visibility;
                    ring = 2;
                    overlay = true;
                }
            }
            else if (settings.onClick == 'combatState') { //toggle combat state
                if (icon == false) {
                    iconSrc = window.CONFIG.controlIcons.combat;
                    ring = 2;
                    overlay = true;
                }
            }
            else if (settings.onClick == 'target') { //target token
                if (icon == false) {
                    iconSrc = "fas fa-bullseye";
                    ring = 2;
                    overlay = true;
                }
            }
            else if (settings.onClick == 'condition') { //toggle condition
                if ((system == 'dnd5e' && game.system.id == 'dnd5e') || (system == 'dnd3.5e' && game.system.id == 'D35E') || (system == 'pf1e' && game.system.id == 'pf1')){
                    let condition = settings.condition;
                    if (condition == undefined) condition = 'removeAll';

                    if (condition == 'removeAll' && icon == false)
                        iconSrc = window.CONFIG.controlIcons.effects;
                    else if (icon == false) 
                        iconSrc = CONFIG.statusEffects.find(e => e.id === condition).icon;
                }
                else if (system == 'pf2e' && game.system.id == 'pf2e') {
                    let condition = settings.conditionPF2E;
                    if (condition == undefined) condition = 'removeAll';
    
                    if (condition == 'removeAll' && icon == false)
                        iconSrc = window.CONFIG.controlIcons.effects;
                    else if (icon == false) 
                        iconSrc = this.pf2eCondition(condition);
                }
                else if (system == 'demonlord' && game.system.id == 'demonlord'){
                    let condition = settings.conditionDemonlord;
                    if (condition == undefined) condition = 'removeAll';

                    if (condition == 'removeAll' && icon == false)
                        iconSrc = window.CONFIG.controlIcons.effects;
                    else if (icon == false) 
                        iconSrc = CONFIG.statusEffects.find(e => e.id === condition).icon;
                }
                ring = 1;
                overlay = true;
            }
        }
        if (icon == false){
            if (stats == 'HP' || stats == 'TempHP') //HP
                iconSrc = "modules/MaterialDeck/img/token/hp.png";
            else if (stats == 'AC' || stats == 'ShieldHP') //AC
                iconSrc = "modules/MaterialDeck/img/token/ac.webp";
            else if (stats == 'Speed') //Speed
                iconSrc = "modules/MaterialDeck/img/token/speed.webp";
            else if (stats == 'Init') //Initiative
                iconSrc = "modules/MaterialDeck/img/token/init.png";
            else if (stats == 'PassivePerception') 
                iconSrc = "modules/MaterialDeck/img/black.png";
            else if (stats == 'PassiveInvestigation') 
                iconSrc = "modules/MaterialDeck/img/black.png";
        } 
        streamDeck.setIcon(context,iconSrc,background,ring,ringColor,overlay);
        
        streamDeck.setTitle(txt,context);
    }
    
    async keyPress(settings){
        if (MODULE.selectedTokenId == undefined) return;
        const tokenId = MODULE.selectedTokenId;

        let onClick = settings.onClick;
        if (onClick == undefined) onClick = 'doNothing';

        const token = canvas.tokens.children[0].children.find(p => p.id == tokenId);
        if (token == undefined) return;

        let system = settings.system;
        if (system == undefined) system = 'dnd5e';

        if (onClick == 'doNothing')   //Do nothing
            return;
        else if (onClick == 'center'){ //center on token
            let location = token.getCenter(token.x,token.y); 
            canvas.animatePan(location);
        }
        else if (onClick == 'charSheet'){ //Open character sheet
            const element = document.getElementById(token.actor.sheet.id);
            if (element == null) token.actor.sheet.render(true);
            else token.actor.sheet.close();
        }
        else if (onClick == 'tokenConfig') {  //Open token config
            const element = document.getElementById(token.sheet.id);
            if (element == null) token.sheet.render(true);
            else token.sheet.close();
        }
        else if (onClick == 'visibility') {    //Toggle visibility
            token.toggleVisibility();
        }
        else if (onClick == 'combatState') {    //Toggle combat state
            token.toggleCombat();
        }
        else if (onClick == 'target') {    //Target token
            token.setTarget(!token.isTargeted,{releaseOthers:false});
        }
        else if (onClick == 'condition') {    //Toggle condition
            if ((system == 'dnd5e' && game.system.id == 'dnd5e') || (system == 'dnd3.5e' && game.system.id == 'D35E') || (system == 'pf1e' && game.system.id == 'pf1')){
                let condition = settings.condition;
                if (condition == undefined) condition = 'removeAll';

                if (condition == 'removeAll'){
                    const effects = token.actor.effects.entries;
                    for (let i=0; i<effects.length; i++){
                        const effect = CONFIG.statusEffects.find(e => e.icon === effects[i].data.icon);
                        await token.toggleEffect(effect)
                    }
                }
                else {
                    const effect = CONFIG.statusEffects.find(e => e.id === condition);
                    await token.toggleEffect(effect);
                }
            }
            else if (system == 'pf2e' && game.system.id == 'pf2e'){
                let condition = settings.conditionPF2E;
                if (condition == undefined) condition = 'removeAll';
                if (condition == 'removeAll'){
                    const effects = token.actor.effects.entries;
                    for (let i=0; i<effects.length; i++){
                        const effect = this.pf2eCondition(condition);
                        await token.toggleEffect(effect)
                    }
                }
                else {
                    const effect = this.pf2eCondition(condition);
                    await token.toggleEffect(effect);
                }
            }  
            else if (system == 'demonlord' && game.system.id == 'demonlord'){
                let condition = settings.conditionDemonlord;
                if (condition == undefined) condition = 'removeAll';

                if (condition == 'removeAll'){
                    const effects = token.actor.effects.entries;
                    for (let i=0; i<effects.length; i++){
                        const effect = CONFIG.statusEffects.find(e => e.icon === effects[i].data.icon);
                        await token.toggleEffect(effect)
                    }
                }
                else {
                    const effect = CONFIG.statusEffects.find(e => e.id === condition);
                    await token.toggleEffect(effect);
                }
            }  
            this.update(tokenId);
            
        }
        else if (onClick == 'vision'){
            const token = canvas.tokens.children[0].children.find(p => p.id == tokenId);
            if (token == undefined) return;
            let tokenData = token.data;

            const dimVision = parseInt(settings.dimVision);
            const brightVision = parseInt(settings.brightVision);
            const sightAngle = parseInt(settings.sightAngle);
            const dimRadius = parseInt(settings.dimRadius);
            const brightRadius = parseInt(settings.brightRadius);
            const emissionAngle = parseInt(settings.emissionAngle);
            const lightColor = settings.lightColor ? settings.lightColor : '#000000';
            const colorIntensity = isNaN(parseInt(settings.colorIntensity)) ? 0 : parseInt(settings.colorIntensity)/100;
            const animationType = settings.animationType ? settings.animationType : 'none';
            const animationSpeed = isNaN(parseInt(settings.animationSpeed)) ? 1 : parseInt(settings.animationSpeed);
            const animationIntensity = isNaN(parseInt(settings.animationIntensity)) ? 1 : parseInt(settings.animationIntensity);

            let data = {};
            if (isNaN(dimVision)==false) data.dimSight = dimVision;
            if (isNaN(brightVision)==false) data.brightSight = brightVision;
            if (isNaN(sightAngle)==false) data.sightAngle = sightAngle;
            if (isNaN(dimRadius)==false) data.dimLight = dimRadius;
            if (isNaN(brightRadius)==false) data.brightLight = brightRadius;
            if (isNaN(emissionAngle)==false) data.lightAngle = emissionAngle;
            data.lightColor = lightColor;
            data.lightAlpha = Math.sqrt(colorIntensity).toNearest(0.05)
            let animation = {
                type: '',
                speed: tokenData.lightAnimation.speed,
                intensity: tokenData.lightAnimation.intensity
            };
            if (animationType != 'none'){
                animation.type = animationType;
                animation.intensity = animationIntensity;
                animation.speed = animationSpeed;
            }
            data.lightAnimation = animation;

            token.update(data);
        }
        else if (system == 'demonlord' && game.system.id == 'demonlord' && onClick == 'initiative'){
            token.actor.update({
                'data.fastturn': !token.actor.data?.data?.fastturn
            })
            
        }
    }

    pf2eCondition(condition){
        return "systems/pf2e/icons/conditions-2/" + condition + ".png";
    }
}