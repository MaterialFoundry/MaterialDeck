import * as MODULE from "../MaterialDeck.js";
import {streamDeck, macroControl, otherControls} from "../MaterialDeck.js";
import {compatibleCore} from "./misc.js";

export class TokenControl{
    constructor(){
        this.active = false;
        this.wildcardOffset = 0;
    }

    async update(tokenId=null){
        if (this.active == false) return;
        for (let device of streamDeck.buttonContext) {
            if (device?.buttons == undefined) continue;
            for (let i=0; i<device.buttons.length; i++){   
                const data = device.buttons[i];
                if (data == undefined || data.action != 'token') continue;
                await this.pushData(tokenId,data.settings,data.context,device.device);
            }
        }
    }

    async pushData(tokenId,settings,context,device,ring=0,ringColor='#000000'){
        const name = settings.displayName ? settings.displayName : false;
        const icon = settings.icon ? settings.icon : 'none';
        const background = settings.background ? settings.background : "#000000";
        let stats =  settings.stats ? settings.stats : 'none';
        const selection = settings.selection ? settings.selection : 'selected';
        const tokenIdentifier = settings.tokenName ? settings.tokenName : '';
        const prependTitle = settings.prependTitle ? settings.prependTitle : '';
    
        let validToken = false;
        let token;
        if (settings.combatTrackerMode) {
            const mode = settings.combatTrackerMode;
            token = canvas.tokens.children[0].children.find(p => p.id == tokenId);
        }
        else if (selection == 'selected') token = canvas.tokens.controlled[0];
        else if (selection != 'selected' && tokenIdentifier == '') {}
        else if (selection == 'tokenName') token = canvas.tokens.children[0].children.find(p => p.name == tokenIdentifier);
        else if (selection == 'actorName') token = canvas.tokens.children[0].children.find(p => p.actor.name == tokenIdentifier);
        else if (selection == 'tokenId') token = canvas.tokens.children[0].children.find(p => p.id == tokenIdentifier);
        else if (selection == 'actorId') token = canvas.tokens.children[0].children.find(p => p.actor.id == tokenIdentifier);

        if (token != undefined) validToken = true;
        let tokenName = "";
        let txt = "";
        let iconSrc = "";
        let overlay = false;
        let statsOld;
        let uses = undefined;
        let hp = undefined;
        if (validToken) {
            if (token.owner == false && token.observer == true && MODULE.getPermission('TOKEN','OBSERVER') == false ) {
                streamDeck.noPermission(context,device);
                return;
            }
            if (token.owner == false && token.observer == false && MODULE.getPermission('TOKEN','NON_OWNED') == false ) {
                streamDeck.noPermission(context,device);
                return;
            }

            tokenName = token.data.name;
            if (name) txt += tokenName;
            else txt += prependTitle;

            const permission = token.actor?.permission;
            if (settings.combat){
                if (permission == 0 && MODULE.getPermission('COMBAT','DISPLAY_ALL_NAMES') == false) txt = "";
                else if (permission == 1 && MODULE.getPermission('COMBAT','DISPLAY_LIMITED_NAME') == false) txt = "";
                else if (permission == 2 && MODULE.getPermission('COMBAT','DISPLAY_OBSERVER_NAME') == false) txt = "";

                if (permission == 0 && stats == 'HP') stats = 'none';
                else if (stats == 'HP' && permission == 1 && MODULE.getPermission('COMBAT','DISPLAY_LIMITED_HP') == false) stats = 'none';
                else if (stats == 'HP' && permission == 2 && MODULE.getPermission('COMBAT','DISPLAY_OBSERVER_HP') == false) stats = 'none';
                else if (stats != 'HP' && permission < 3 && MODULE.getPermission('COMBAT','DISPLAY_NON_OWNED_STATS') == false) stats = 'none';
            }
            else if (MODULE.getPermission('TOKEN','STATS') == false) {
                statsOld = stats;
                stats = 'none';
            }

            if (icon == 'tokenIcon') iconSrc = token.data.img;
            else if (icon == 'actorIcon') iconSrc = token.actor.data.img;
            if (name && stats != 'none' && stats != 'HPbox') txt += "\n";
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
            else if (game.system.id == 'dnd5e'){
                let attributes = token.actor.data.data.attributes;
                if (stats == 'HP') {
                    if (icon == 'stats') {
                        uses = {
                            available: attributes.hp.value,
                            maximum: attributes.hp.max,
                            heart: "#FF0000"
                        };
                    }
                    
                    txt += attributes.hp.value + "/" + attributes.hp.max;
                }
                else if (stats == 'HPbox') {
                    uses = {
                        available: attributes.hp.value,
                        maximum: attributes.hp.max,
                        heart: false
                    }
                }
                else if (stats == 'TempHP') {
                    const val = (attributes.hp.temp == null) ? 0 : attributes.hp.temp;
                    const max = (attributes.hp.tempmax == null) ? 0 : attributes.hp.tempmax
                    if (icon == 'stats') {
                        uses = {
                            available: (attributes.hp.temp == null) ? 0 : attributes.hp.temp,
                            maximum: (max == 0) ? 1 : attributes.hp.tempmax,
                            heart: "#00FF00"
                        };
                    }
                    txt += val;
                    if (max != 0) txt += "/" + max;
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
                else if (stats == 'Init') {
                    const value = attributes.init.total;
                    if (value >= 0) txt += '+';
                    txt += value;
                }
                else if (stats == 'PassivePerception') txt += token.actor.data.data.skills.prc.passive;
                else if (stats == 'PassiveInvestigation') txt += token.actor.data.data.skills.inv.passive;
                else if (stats == 'Ability') {        
                    const ability = settings.ability ? settings.ability : 'str';
                    txt += token.actor.data.data.abilities?.[ability].value;
                }
                else if (stats == 'AbilityMod') {        
                    const ability = settings.ability ? settings.ability : 'str';
                    const value = token.actor.data.data.abilities?.[ability].mod;
                    if (value >= 0) txt += '+';
                    txt += value;
                }
                else if (stats == 'Save') {        
                    const ability = settings.save ? settings.save : 'str';
                    const value = token.actor.data.data.abilities?.[ability].save;
                    if (value >= 0) txt += '+';
                    txt += value;
                }
                else if (stats == 'Skill') {
                    const skill = settings.skill ? settings.skill : 'acr';
                    const value = token.actor.data.data.skills?.[skill].total;
                    if (value >= 0) txt += '+';
                    txt += value;
                }
                else if (stats == 'Prof') {
                    const value = token.actor.data.data.attributes.prof;
                    if (value >= 0) txt += '+';
                    txt += value;
                }
            }

            else if (game.system.id == 'D35E' || game.system.id == 'pf1'){
                let attributes = token.actor.data.data.attributes;
                if (stats == 'HP') {
                    if (icon == 'stats') {
                        uses = {
                            available: attributes.hp.value,
                            maximum: attributes.hp.max,
                            heart: true
                        };
                    }
                    txt += attributes.hp.value + "/" + attributes.hp.max;
                }
                else if (stats == 'HPbox') {
                    uses = {
                        available: attributes.hp.value,
                        maximum: attributes.hp.max
                    }
                }
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
                else if (stats == 'Init') {
                    const value = attributes.init.total;
                    if (value >= 0) txt += '+';
                    txt += value;
                }
                else if (stats == 'Ability') {        
                    const ability = settings.ability ? settings.ability : 'str';
                    txt += token.actor.data.data.abilities?.[ability].value;
                }
                else if (stats == 'AbilityMod') {        
                    const ability = settings.ability ? settings.ability : 'str';
                    const value = token.actor.data.data.abilities?.[ability].mod;
                    if (value >= 0) txt += '+';
                    txt += value;
                }
                else if (stats == 'Save') {        
                    const ability = settings.save ? settings.save : 'fort';
                    const value = token.actor.data.data.attributes.savingThrows?.[ability].total;
                    if (value >= 0) txt += '+';
                    txt += value;
                }
                else if (stats == 'Skill') {
                    const skill = settings.skill ? settings.skill : 'apr';
                    const value = token.actor.data.data.skills?.[skill].mod;
                    if (value >= 0) txt += '+';
                    txt += value;
                }
                else if (stats == 'Prof') txt += token.actor.data.data.attributes.prof;
            }
            else if (game.system.id == 'pf2e'){
                let attributes = token.actor.data.data.attributes;
                if (stats == 'HP') {
                    if (icon == 'stats') {
                        uses = {
                            available: attributes.hp.value,
                            maximum: attributes.hp.max,
                            heart: true
                        };
                    }
                    
                    txt += attributes.hp.value + "/" + attributes.hp.max;
                }
                else if (stats == 'HPbox') {
                    uses = {
                        available: attributes.hp.value,
                        maximum: attributes.hp.max
                    }
                }
                else if (stats == 'TempHP') {
                    if (attributes.hp.temp == null) txt += '0';
                    else {
                        txt += attributes.hp.temp;
                        if (attributes.hp.tempmax > 0) txt += '/' + attributes.hp.tempmax;
                    }  
                }
                else if (stats == 'AC') txt += attributes.ac.value;
                else if (stats == 'Speed'){
                    let speed = attributes.speed.breakdown;
                    const otherSpeeds = attributes.speed.otherSpeeds;
                    if (otherSpeeds.length > 0)
                        for (let i=0; i<otherSpeeds.length; i++)
                            speed += '\n' + otherSpeeds[i].type + ": " + otherSpeeds[i].value;    
                    txt += speed;
                }
                else if (stats == 'Init') {
                    const value = attributes.init.value;
                    if (value != undefined) {
                        if (value >= 0) txt += "+";
                        txt += value;
                    }
                }
                else if (stats == 'Ability') {        
                    const ability = settings.ability ? settings.ability : 'str';
                    txt += token.actor.data.data.abilities?.[ability].value;
                }
                else if (stats == 'AbilityMod') {        
                    const ability = settings.ability ? settings.ability : 'str';
                    const value = token.actor.data.data.abilities?.[ability].mod;
                    if (value >= 0) txt += '+';
                    txt += value;
                }
                else if (stats == 'Save') {        
                    let ability = settings.save ? settings.save : 'fort';
                    if (ability == 'fort') ability = 'fortitude';
                    else if (ability == 'ref') ability = 'reflex';
                    else if (ability == 'will') ability = 'will';
                    const value = token.actor.data.data.saves?.[ability].value;
                    if (value >= 0) txt += "+";
                    txt += value;
                }
                else if (stats == 'Skill') {
                    const skill = settings.skill ? settings.skill : 'acr';
                    const value = token.actor.data.data.skills?.[skill].totalModifier;
                    if (value >= 0) txt += '+';
                    txt += value;
                }
            }
            else if (game.system.id == 'demonlord'){
                let characteristics = token.actor.data.data.characteristics;
                if (stats == 'HP') {
                    if (icon == 'stats') {
                        uses = {
                            available: attributes.hp.value,
                            maximum: attributes.hp.max,
                            heart: true
                        };
                    }
                    
                    characteristics.health.value + "/" + characteristics.health.max;
                }
                else if (stats == 'HPbox') {
                    uses = {
                        available: characteristics.health.value,
                        maximum: characteristics.health.max
                    }
                }
                else if (stats == 'AC') txt += characteristics.defense;
                else if (stats == 'Speed') txt += characteristics.speed;
                else if (stats == 'Init') txt += token.actor.data.data.fastturn ? "FAST" : "SLOW";
                else if (stats == 'Ability') {        
                    const ability = settings.ability ? settings.ability : 'strength';
                    const value = token.actor.data.data.attributes?.[ability].value;
                    if (value >=0) txt += '+';
                    txt += value;
                }
                else if (stats == 'AbilityMod') {        
                    const ability = settings.ability ? settings.ability : 'strength';
                    const value = token.actor.data.data.attributes?.[ability].modifier;
                    if (value >=0) txt += '+';
                    txt += value;
                }
            }
            else {
                //Other systems




            }

            if (settings.onClick == 'visibility') { //toggle visibility
                if (MODULE.getPermission('TOKEN','VISIBILITY') == false ) {
                    streamDeck.noPermission(context,device);
                    return;
                }
                ring = 1;
                if (token.data.hidden){
                    ring = 2;
                    ringColor = "#FF7B00";
                }
                if (icon == 'stats') {
                    iconSrc = window.CONFIG.controlIcons.visibility;
                    overlay = true;
                }
            }
            else if (settings.onClick == 'combatState') { //toggle combat state
                if (MODULE.getPermission('TOKEN','COMBAT') == false ) {
                    streamDeck.noPermission(context,device);
                    return;
                }
                ring = 1;
                if (token.inCombat){
                    ring = 2;
                    ringColor = "#FF7B00";
                }
                if (icon == 'stats') {
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
                if (icon == 'stats') {
                    iconSrc = "fas fa-bullseye";
                }
            }
            else if (settings.onClick == 'condition') { //toggle condition
                if (MODULE.getPermission('TOKEN','CONDITIONS') == false ) {
                    streamDeck.noPermission(context,device);
                    return;
                }
                ring = 1;
                if (game.system.id == 'dnd5e' || game.system.id == 'D35E' || game.system.id == 'pf1'){
                    const condition = settings.condition ? settings.condition : 'removeAll';
                    if (condition == 'removeAll' && icon == 'stats')
                        iconSrc = window.CONFIG.controlIcons.effects;
                    else if (icon == 'stats') {
                        let effect = CONFIG.statusEffects.find(e => e.id === condition);
                        iconSrc = effect.icon;
                        let effects = compatibleCore("0.8.1") ? token.actor.effects.contents : token.actor.effects.entries;
                        let active = effects.find(e => e.isTemporary === condition);
                        if (active != undefined){
                            ring = 2;
                            ringColor = "#FF7B00";
                        } 
                    } 
                }
                else if (game.system.id == 'pf2e') {
                    const condition = settings.condition ? settings.condition : 'removeAll';
                    if (condition == 'removeAll' && icon == 'stats')
                        iconSrc = window.CONFIG.controlIcons.effects;
                    else if (icon == 'stats') {
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
                else if (game.system.id == 'demonlord'){
                    const condition = settings.condition ? settings.condition : 'removeAll';
                    if (condition == 'removeAll' && icon == 'stats')
                        iconSrc = window.CONFIG.controlIcons.effects;
                    else if (icon == 'stats') {
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
            else if (settings.onClick == 'cubCondition') { //Combat Utility Belt conditions
                if (MODULE.getPermission('TOKEN','CONDITIONS') == false ) {
                    streamDeck.noPermission(context,device);
                    return;
                }
                ring = 1;
                overlay = true;
                const condition = settings.cubConditionName;
                if (condition == undefined || condition == '') return;
                if (icon == 'stats') {
                    let effect = CONFIG.statusEffects.find(e => e.label === condition);
                    iconSrc = effect.icon;
                    let effects = compatibleCore("0.8.1") ? token.actor.effects.contents : token.actor.effects.entries;
                    let active = effects.find(e => e.isTemporary === effect.id);
                    if (active != undefined){
                        ring = 2;
                        ringColor = "#FF7B00";
                    } 
                }
            }
            else if (settings.onClick == 'wildcard') { //wildcard images
                if (MODULE.getPermission('TOKEN','WILDCARD') == false ) {
                    streamDeck.noPermission(context,device);
                    return;
                }
                if (icon != 'stats') return;
                const method = settings.wildcardMethod ? settings.wildcardMethod : 'iterate';
                let value = parseInt(settings.wildcardValue);
                if (isNaN(value)) value = 1;

                const images = await token.actor.getTokenImages();
                let currentImgNr = 0
                let imgNr;
                for (let i=0; i<images.length; i++) 
                    if (images[i] == token.data.img){
                        currentImgNr = i;
                        break;
                    }
                
                if (method == 'iterate'){
                    imgNr = currentImgNr + value + this.wildcardOffset;
                    while (imgNr >= images.length) imgNr -= images.length; 
                    while (imgNr < 0) imgNr += images.length; 
                    iconSrc = images[imgNr];
                }
                else if (method == 'set'){
                    imgNr = value - 1 + this.wildcardOffset;
                    if (value >= images.length) iconSrc = "modules/MaterialDeck/img/black.png";
                    else iconSrc = images[imgNr];
                    ring = 1;
                    if (currentImgNr == imgNr) {
                        ring = 2;
                        ringColor = "#FF7B00";
                    }
                }
                else return;
            } 
        }
        else {
            iconSrc += "";
            if (settings.onClick == 'visibility') { //toggle visibility
                if (MODULE.getPermission('TOKEN','VISIBILITY') == false ) {
                    streamDeck.noPermission(context,device);
                    return;
                }
                if (icon == 'stats') {
                    iconSrc = window.CONFIG.controlIcons.visibility;
                    ring = 2;
                    overlay = true;
                }
            }
            else if (settings.onClick == 'combatState') { //toggle combat state
                if (MODULE.getPermission('TOKEN','COMBAT') == false ) {
                    streamDeck.noPermission(context,device);
                    return;
                }
                if (icon == 'stats') {
                    iconSrc = window.CONFIG.controlIcons.combat;
                    ring = 2;
                    overlay = true;
                }
            }
            else if (settings.onClick == 'target') { //target token
                if (icon == 'stats') {
                    iconSrc = "fas fa-bullseye";
                    ring = 2;
                    overlay = true;
                }
            }
            else if (settings.onClick == 'condition') { //toggle condition
                if (MODULE.getPermission('TOKEN','CONDITIONS') == false ) {
                    streamDeck.noPermission(context,device);
                    return;
                }
                if (game.system.id == 'dnd5e' || game.system.id == 'D35E' || game.system.id == 'pf1'){
                    const condition = settings.condition ? settings.condition : 'removeAll';
                    if (condition == 'removeAll' && icon == false)
                        iconSrc = window.CONFIG.controlIcons.effects;
                    else if (icon == 'stats') 
                        iconSrc = CONFIG.statusEffects.find(e => e.id === condition).icon;
                }
                else if (game.system.id == 'pf2e') {
                    const condition = settings.condition ? settings.condition : 'removeAll';
                    if (condition == 'removeAll' && icon == 'stats')
                        iconSrc = window.CONFIG.controlIcons.effects;
                    else if (icon == 'stats') 
                        iconSrc = this.pf2eCondition(condition);
                }
                else if (game.system.id == 'demonlord'){
                    const condition = settings.condition ? settings.condition : 'removeAll';
                    if (condition == 'removeAll' && icon == 'stats')
                        iconSrc = window.CONFIG.controlIcons.effects;
                    else if (icon == 'stats') 
                        iconSrc = CONFIG.statusEffects.find(e => e.id === condition).icon;
                }
                ring = 1;
                overlay = true;
            }
            else if (settings.onClick == 'cubCondition') { //Combat Utility Belt conditions
                if (MODULE.getPermission('TOKEN','CONDITIONS') == false ) {
                    streamDeck.noPermission(context,device);
                    return;
                }
                const condition = settings.cubConditionName;
                if (condition == undefined || condition == '') return;
                if (icon == 'stats') {
                    iconSrc = CONFIG.statusEffects.find(e => e.label === condition).icon;
                }
                ring = 1;
                overlay = true;
            }
        }

        if (icon == 'stats'){
            if (MODULE.getPermission('TOKEN','STATS') == false) stats = statsOld;
            if (stats == 'HP') //HP
                iconSrc = "modules/MaterialDeck/img/token/hp_empty.png";
            if (stats == 'TempHP') //Temp HP
                iconSrc = "modules/MaterialDeck/img/token/temp_hp_empty.png";
            else if (stats == 'AC' || stats == 'ShieldHP') //AC
                iconSrc = "modules/MaterialDeck/img/token/ac.webp";
            else if (stats == 'Speed') //Speed
                iconSrc = "modules/MaterialDeck/img/token/speed.webp";
            else if (stats == 'Init') //Initiative
                iconSrc = "modules/MaterialDeck/img/token/init.png";
            else if (stats == 'PassivePerception') {
                iconSrc = "modules/MaterialDeck/img/token/skills/prc.png";
                overlay = true;
                ring = 1;
            }
            else if (stats == 'PassiveInvestigation') {
                iconSrc = "modules/MaterialDeck/img/token/skills/inv.png";
                overlay = true;
                ring = 1;
            }
            else if (stats == 'Ability' || stats == 'AbilityMod' || stats == 'Save') {
                overlay = true;
                ring = 1;
                let ability = (stats == 'Save') ? settings.save : settings.ability;
                if (ability == undefined) ability = 'str';
                if (ability == 'con') iconSrc = "modules/MaterialDeck/img/token/abilities/cons.png";
                else iconSrc = "modules/MaterialDeck/img/token/abilities/" + ability + ".png";
            }
            else if (stats == 'Skill') {
                overlay = true;
                ring = 1;
                let skill = settings.skill;
                if (skill == undefined) skill = 'acr';
                else iconSrc = "modules/MaterialDeck/img/token/skills/" + skill + ".png";
            }     
        } 
        streamDeck.setIcon(context,device,iconSrc,{background:background,ring:ring,ringColor:ringColor,overlay:overlay,uses:uses,hp:hp});
        streamDeck.setTitle(txt,context);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    async keyPress(settings){
        const tokenId = canvas.tokens.controlled[0]?.id;

        const selection = settings.selection ? settings.selection : 'selected';
        const tokenIdentifier = settings.tokenName ? settings.tokenName : '';
        
        let token;
        if (selection == 'selected') token = canvas.tokens.controlled[0];
        else if (selection != 'selected' && tokenIdentifier == '') {}
        else if (selection == 'tokenName') token = canvas.tokens.children[0].children.find(p => p.name == tokenIdentifier);
        else if (selection == 'actorName') token = canvas.tokens.children[0].children.find(p => p.actor.name == tokenIdentifier);
        else if (selection == 'tokenId') token = canvas.tokens.children[0].children.find(p => p.id == tokenIdentifier);
        else if (selection == 'actorId') token = canvas.tokens.children[0].children.find(p => p.actor.id == tokenIdentifier);

        if (token == undefined) return;
        if (token.owner == false && token.observer == true && MODULE.getPermission('TOKEN','OBSERVER') == false ) return;
        if (token.owner == false && token.observer == false && MODULE.getPermission('TOKEN','NON_OWNED') == false ) return;

        const onClick = settings.onClick ? settings.onClick : 'doNothing';
        
        if (onClick == 'doNothing')   //Do nothing
            return;
        else if (onClick == 'select'){ //select token
            token.control();
        }
        else if (onClick == 'center'){ //center on token
            let location = token.getCenter(token.x,token.y); 
            canvas.animatePan(location);
        }
        else if (onClick == 'centerSelect'){ //center on token and select
            const location = token.getCenter(token.x,token.y); 
            canvas.animatePan(location);
            token.control();
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
            if (MODULE.getPermission('TOKEN','VISIBILITY') == false ) return;
            token.toggleVisibility();
        }
        else if (onClick == 'combatState') {    //Toggle combat state
            if (MODULE.getPermission('TOKEN','COMBAT') == false ) return;
            token.toggleCombat();
        }
        else if (onClick == 'target') {    //Target token
            token.setTarget(!token.isTargeted,{releaseOthers:false});
        }
        else if (onClick == 'condition') {    //Toggle condition
            if (MODULE.getPermission('TOKEN','CONDITIONS') == false ) return;
            if (game.system.id == 'dnd5e' || game.system.id == 'D35E' || game.system.id == 'pf1'){
                const condition = settings.condition ? settings.condition : 'removeAll';
                if (condition == 'removeAll'){
                    for( let effect of token.actor.effects)
                        await effect.delete();
                }
                else {
                    const effect = CONFIG.statusEffects.find(e => e.id === condition);
                    await token.toggleEffect(effect);
                }
            }
            else if (game.system.id == 'pf2e'){
                const condition = settings.condition ? settings.condition : 'removeAll';
                if (condition == 'removeAll'){
                    for( let effect of token.actor.effects)
                        await effect.delete();
                }
                else {
                    const effect = this.pf2eCondition(condition);
                    await token.toggleEffect(effect);
                }
            }  
            else if (game.system.id == 'demonlord'){
                const condition = settings.condition ? settings.condition : 'removeAll';
                if (condition == 'removeAll'){
                    for( let effect of token.actor.effects)
                        await effect.delete();
                }
                else {
                    const effect = CONFIG.statusEffects.find(e => e.id === condition);
                    await token.toggleEffect(effect);
                }
            }  
            this.update(tokenId);
            
        }
        else if (onClick == 'cubCondition') { //Combat Utility Belt conditions
            if (MODULE.getPermission('TOKEN','CONDITIONS') == false ) return;
            const condition = settings.cubConditionName;
            if (condition == undefined || condition == '') return;

            const effect = CONFIG.statusEffects.find(e => e.label === condition);
            await token.toggleEffect(effect);
            this.update(tokenId); 
        }
        else if (onClick == 'vision'){
            if (MODULE.getPermission('TOKEN','VISION') == false ) return;
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
        else if (game.system.id == 'demonlord' && onClick == 'initiative'){
            token.actor.update({
                'data.fastturn': !token.actor.data?.data?.fastturn
            })
            
        }
        else if (onClick == 'wildcard') { //wildcard images
            if (MODULE.getPermission('TOKEN','WILDCARD') == false ) return;
            const method = settings.wildcardMethod ? settings.wildcardMethod : 'iterate';
            let value = parseInt(settings.wildcardValue);
            if (isNaN(value)) value = 1;

            const images = await token.actor.getTokenImages();
            let imgNr;
            let iconSrc;
            if (method == 'iterate'){
                let currentImgNr = 0
                for (let i=0; i<images.length; i++) 
                    if (images[i] == token.data.img){
                        currentImgNr = i;
                        break;
                    }
                
                imgNr = currentImgNr + value + this.wildcardOffset;
                while (imgNr >= images.length) imgNr -= images.length;  
                while (imgNr < 0) imgNr += images.length;   
            }
            else if (method == 'set'){
                imgNr = value - 1 + this.wildcardOffset;
                if (value >= images.length || value < 1) return;
                
            }
            else if (method == 'offset'){
                this.wildcardOffset = value;
                this.update(canvas.tokens.controlled[0]?.id);
            }
            else return;

            iconSrc = images[imgNr];
            token.update({img: iconSrc})
        }
        else if (onClick == 'macro') {  //call a macro
            const settingsNew = {
                target: token,
                macroMode: settings.macroMode,
                macroNumber: settings.macroId,
                macroArgs: settings.macroArgs
            }
            macroControl.keyPress(settingsNew);
        }
        else if (onClick == 'roll') {   //roll skill/save/ability
            const roll = settings.roll ? settings.roll : 'ability';
            const ability = settings.rollAbility ? settings.rollAbility : 'str';
            const skill = settings.rollSkill ? settings.rollSkill : 'acr';
            const save = settings.rollSave ? settings.rollSave : 'str';
            const rollMode = settings.rollMode ? settings.rollMode : 'default';
            let options;
            if (rollMode == 'default')
                options = {
                    fastForward: (otherControls.rollOption != 'dialog'),
                    advantage: (otherControls.rollOption == 'advantage'),
                    disadvantage: (otherControls.rollOption == 'disadvantage')
                }
            else if (rollMode == 'normal') options = {fastForward:true}
            else if (rollMode == 'advantage') options = {fastForward:true,advantage:true}
            else if (rollMode == 'disadvantage') options = {fastForward:true,disadvantage:true}

            if (game.system.id == 'pf2e') {
                if (roll == 'ability') token.actor.data.data.saves?.[ability].roll(options);
                else if (roll == 'save') {
                    let ability = save;
                    if (ability == 'fort') ability = 'fortitude';
                    else if (ability == 'ref') ability = 'reflex';
                    else if (ability == 'will') ability = 'will';
                    token.actor.data.data.saves?.[ability].roll(options);
                }
                else if (roll == 'skill') token.actor.data.data.skills?.[skill].roll(options);
            }
            if (roll == 'ability') token.actor.rollAbilityTest(ability,options);
            else if (roll == 'save') {
                if (game.system.id == 'dnd5e') token.actor.rollAbilitySave(save,options);
                else token.actor.rollSavingThrow(save,options);
            }
            else if (roll == 'skill') token.actor.rollSkill(skill,options);
            else if (roll == 'initiative') token.actor.rollInitiative(options);
            else if (roll == 'deathSave') token.actor.rollDeathSave(options);
            else if (roll == 'grapple') token.actor.rollGrapple(options);
            else if (roll == 'bab') token.actor.rollBAB(options);
            else if (roll == 'melee') token.actor.rollMelee(options);
            else if (roll == 'ranged') token.actor.rollRanged(options);
            else if (roll == 'cmb') token.actor.rollCMB(options);
            else if (roll == 'attack') token.actor.rollAttack(options);
            else if (roll == 'defenses') token.actor.rollDefenses(options);
            
            if (otherControls.rollOption != 'dialog') otherControls.setRollOption('normal');
        }
        else if (onClick == 'custom') {//custom onClick function
            if (MODULE.getPermission('TOKEN','CUSTOM') == false ) return;
            const formula = settings.customOnClickFormula ? settings.customOnClickFormula : '';
            if (formula == '') return;

            let targetArrayTemp;
            let formulaArrayTemp;
            let split1 = formula.split(';');
            for (let i=0; i<split1.length; i++){
                let macro = false;
                let furnaceArguments = "";
                let split2 = split1[i].split(' = ');
                targetArrayTemp = split2[0];
                formulaArrayTemp = split2[1];
                let targetArray = this.splitCustom(targetArrayTemp);
                for (let i=0; i<targetArray.length; i++){
                    if (targetArray[i][0] == '@') {
                        const dataPath = targetArray[i].split('@')[1].split('.');
                        targetArray[i] = dataPath;
                        if (dataPath == 'macro') {
                            macro = true;
                        }
                    }
                    else if (macro) {
                        const data = targetArray[i].split('[');
                        if (data != undefined && data.length > 1) targetArray[i] = data[1];
                        if (i > 1) {
                            if (furnaceArguments != "") furnaceArguments += " ";
                            furnaceArguments += "\"" + targetArray[i] + "\"";
                        }
                    } 
                }
                if (macro) {
                    const settingsNew = {
                        target: token,
                        macroMode: 'name',
                        macroNumber: targetArray[1],
                        macroArgs: furnaceArguments
                    }
                    macroControl.keyPress(settingsNew);
                    continue;
                }
                let formulaArray = this.splitCustom(formulaArrayTemp);

                let value = 0;
                let previousOperation = '+';
                if (formulaArray.length == 1 && formulaArray[0][0] == '[')
                    value = formulaArray[0].split('[')[1];
                else if (formulaArray.length == 1)
                    value = formulaArray[0];
                else {
                    for (let i=0; i<formulaArray.length; i++){
                    let val;
                    if (formulaArray[i][0] == '@') {
                        let dataPath;
                        if (formulaArray[i] == '@this') dataPath = targetArray[0];
                        else dataPath = formulaArray[i].split('@')[1].split('.');
                        let data = token;
    
                        for (let j=0; j<dataPath.length; j++)
                                data = data?.[dataPath[j]];
                        if (data == undefined) return;
                        formulaArray[i] = data;
                        val = data;
                    }
                    else if (isNaN(formulaArray[i])) {
                        previousOperation = formulaArray[i];
                        if (previousOperation == '++') value++;
                        else if (previousOperation == '--') value--;
                        continue;
                    }
                    else
                        val = parseFloat(formulaArray[i]);
                    if (previousOperation == '+') value += val;
                    else if (previousOperation == '-') value -= val;
                    else if (previousOperation == '*') value *= val;
                    else if (previousOperation == '/') value /= val;
                    else if (previousOperation == '**') value **= val;
                    else if (previousOperation == '%') value %= val;
                    else if (previousOperation == '<' && value >= val) {value = val-1;}
                    else if (previousOperation == '>' && value <= val) {value = val+1;}
                    else if (previousOperation == '<=' && value > val) {value = val;}
                    else if (previousOperation == '>=' && value < val) {value = val;}
                }
                }
    
                for (let i=0; i<targetArray.length; i++){
                    const dataPath = targetArray[i];
                    let data;
                    if (dataPath[0] == 'actor') {
                        let actor = token.actor;
    
                        if (dataPath[1] == 'data'){
                            let path = '';
                            for (let j=2; j<targetArray[i].length; j++){
                                if (path != '') path += '.';
                                path += targetArray[i][j];
                            }
                            await actor.update({[path]:value})
                        }
                        else {
                            let path = '';
                            for (let j=1; j<targetArray[i].length; j++){
                                if (path != '') path += '.';
                                path += targetArray[i][j];
                            }
                            await actor.update({[path]:value})
                        }
                        this.update(token.id);
                    }
                    else {
                        data = token;
                        let path = '';
                        for (let j=1; j<targetArray[i].length; j++){
                            if (path != '') path += '.';
                            path += targetArray[i][j];
                        }
                        await token.update({[path]:value})
                        this.update(token.id);
                    }
                    
                }
            }
        }
    }

    splitCustom(string){
        const split = string.split('[');
        let array1 = [];
        for (let i=0; i<split.length; i++){
            if (i>0 && split[i][0] != '@' && split[i] != "" && isNaN(split[i])) split[i] = '['+split[i]
            const split2 = split[i].split(']');
            for (let j=0; j<split2.length; j++){
                array1.push(split2[j]);
            }  
        }

        let array2 = [];
        for (let i=0; i<array1.length; i++){
            if (array1[i][0] == '[') {
                array2.push(array1[i]);
                continue;
            }
            const split3 = array1[i].split(' ');
            for (let j=0; j<split3.length; j++){
                array2.push(split3[j]);
            }  
        }

        let array3 = [];
        for (let i=0; i<array2.length; i++){
            if (array2[i] == "") continue;
            array3.push(array2[i]);
        }
        return array3;
    }

    pf2eCondition(condition){
        return "systems/pf2e/icons/conditions-2/" + condition + ".png";
    }
}