import * as MODULE from "../MaterialDeck.js";
import {streamDeck, macroControl, otherControls, tokenHelper} from "../MaterialDeck.js";
import { compatibleCore } from "./misc.js";

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
        const mode = settings.tokenMode ? settings.tokenMode : 'token';
    
        let validToken = false;
        let token;
        if (settings.combatTrackerMode) token = tokenHelper.getTokenFromTokenId(tokenId);
        else token = tokenHelper.getToken(selection,tokenIdentifier);

        if (token != undefined) validToken = true;
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

            if (mode == 'token') {
                if (name) txt += tokenHelper.getTokenName(token);
                txt += prependTitle;
    
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
    
                if (icon == 'tokenIcon') iconSrc = tokenHelper.getTokenIcon(token);
                else if (icon == 'actorIcon') iconSrc = tokenHelper.getActorIcon(token);
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
                
                if (stats == 'HP' || stats == 'Wounds') {
                    const hp = tokenHelper.getHP(token);
                    txt += hp.value + "/" + hp.max;
                    
                    if (icon == 'stats')
                        uses = {
                            available: hp.value,
                            maximum: hp.max,
                            heart: "#FF0000"
                        };
                        
                }

                if (stats == 'Agility') { /* forbidden-lands */
                    const wits = tokenHelper.getAgility(token);
                    txt += wits.value + "/" + wits.max;
                    
                    if (icon == 'stats')
                        uses = {
                            available: wits.value,
                            maximum: wits.max,
                            heart: "#FF0000"
                        };
                        
                }

                if (stats == 'Wits') { /* forbidden-lands */
                    const wits = tokenHelper.getWits(token);
                    txt += wits.value + "/" + wits.max;
                    
                    if (icon == 'stats')
                        uses = {
                            available: wits.value,
                            maximum: wits.max,
                            heart: "#FF0000"
                        };
                        
                }

                if (stats == 'Empathy') { /* forbidden-lands */
                    const wits = tokenHelper.getEmpathy(token);
                    txt += wits.value + "/" + wits.max;
                    
                    if (icon == 'stats')
                        uses = {
                            available: wits.value,
                            maximum: wits.max,
                            heart: "#FF0000"
                        };
                        
                }

                if (stats == 'WillPower') { /* forbidden-lands */
                    const wits = tokenHelper.getWillPower(token);
                    txt += wits.value + "/" + wits.max;
                    
                    if (icon == 'stats')
                        uses = {
                            available: wits.value,
                            maximum: wits.max,
                            heart: "#FF0000"
                        };
                        
                }

                if (stats == 'CriticalWounds') { /* WFRP4e */
                    const criticalWounds = tokenHelper.getCriticalWounds(token);
                    txt += criticalWounds.value + "/" + criticalWounds.max;
                    
                    if (icon == 'stats')
                        uses = {
                            available: criticalWounds.value,
                            maximum: criticalWounds.max,
                            heart: "#FF0000"
                        };
                        
                }
                else if (stats == 'HPbox') {
                    const hp = tokenHelper.getHP(token);
                    uses = {
                        available: hp.value,
                        maximum: hp.max
                    }
                }
                else if (stats == 'TempHP') {
                    const tempHP = tokenHelper.getTempHP(token);
                    txt += (tempHP.max == 0) ? tempHP.value : `${tempHP.value}/${tempHP.max}`;
                    
                    if (icon == 'stats') 
                        uses = {
                            available: tempHP.value,
                            maximum: tempHP.max,
                            heart: "#00FF00"
                        };
                }
                else if (stats == 'Stamina') {    //starfinder
                    const stamina = tokenHelper.getStamina(token);
                    txt += `${stamina.value}/${stamina.max}`;
                }
                else if (stats == 'KinAC') {    //starfinder
                    txt += tokenHelper.getKinAC(token);
                }
                else if (stats == 'AC') txt += tokenHelper.getAC(token);
                else if (stats == 'ShieldHP') txt += tokenHelper.getShieldHP(token);
                else if (stats == 'Speed') txt += tokenHelper.getSpeed(token);
                else if (stats == 'Init') txt += tokenHelper.getInitiative(token);
                else if (stats == 'PassivePerception') txt += tokenHelper.getPassivePerception(token);
                else if (stats == 'PassiveInvestigation') txt += tokenHelper.getPassiveInvestigation(token);
                else if (stats == 'Ability') txt += tokenHelper.getAbility(token, settings.ability);
                else if (stats == 'AbilityMod') txt += tokenHelper.getAbilityModifier(token, settings.ability);
                else if (stats == 'Save') {
                    txt += tokenHelper.getAbilitySave(token, settings.save);
                    ringColor = tokenHelper.getSaveRingColor(token, settings.save);
                    if (ringColor != undefined) ring = 2;
                }
                else if (stats == 'Skill') {
                    txt += tokenHelper.getSkill(token, settings.skill);
                    ringColor = tokenHelper.getSkillRingColor(token, settings.skill);
                    if (ringColor != undefined) ring = 2;
                }
                else if (stats == 'Prof') txt += tokenHelper.getProficiency(token);
                else if (stats == 'Fate') txt += tokenHelper.getFate(token) /* WFRP4e */
                else if (stats == 'Fortune') txt += tokenHelper.getFortune(token) /* WFRP4e */
                else if (stats == 'Corruption') txt += tokenHelper.getCorruption(token) /* WFRP4e */
                else if (stats == 'Advantage') txt += tokenHelper.getAdvantage(token) /* WFRP4e */
                else if (stats == 'Resolve') txt += tokenHelper.getResolve(token) /* WFRP4e */
                else if (stats == 'Resilience') txt += tokenHelper.getResilience(token) /* WFRP4e */
                else if (stats == 'Perception') txt += tokenHelper.getPerception(token) /* PF2E */
                else if (stats == 'Condition') { /* PF2E */
                    const valuedCondition = tokenHelper.getConditionValue(token, settings.condition);
                    if (valuedCondition != undefined) {
                        txt += valuedCondition?.value;
                    }
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
                else if (settings.onClick == 'condition') { //handle condition
                    if (MODULE.getPermission('TOKEN','CONDITIONS') == false ) {
                        streamDeck.noPermission(context,device);
                        return;
                    }
                    ring = 1;
                    overlay = true;
                    if (icon == 'stats') {
                        iconSrc = tokenHelper.getConditionIcon(settings.condition);
                        if (tokenHelper.getConditionActive(token,settings.condition)) {
                            ring = 2;
                            ringColor = "#FF7B00";
                        }
                    }  
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
                        iconSrc = CONFIG.statusEffects.find(e => e.label === condition).icon;
                        if (tokenHelper.getConditionActive(token,condition)){
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
                else if (settings.onClick == 'initiative') //Initiative
                    iconSrc = "modules/MaterialDeck/img/token/init.png";
            }
            //Items
            else {
                txt += prependTitle;
                const allItems = token.actor.items;
                const itemNr = settings.itemNr ? settings.itemNr - 1 : 0;
                const displayUses = settings.displayUses ? settings.displayUses : false;
                const displayName = settings.displayInventoryName ? settings.displayInventoryName : false;
                const displayIcon = settings.displayInventoryIcon ? settings.displayInventoryIcon : false;
                let items = allItems;
                let item;
                if (mode == 'inventory') {
                    items = tokenHelper.getItems(token,settings.inventoryType);
                    items = this.sortItems(items);
                    item = items[itemNr];
                    if (item != undefined && displayUses) uses = tokenHelper.getItemUses(item);
                }
                else if (mode == 'features') {
                    items = tokenHelper.getFeatures(token,settings.featureType);
                    items = this.sortItems(items);
                    item = items[itemNr];
                    if (item != undefined && displayUses) uses = tokenHelper.getFeatureUses(item);
                }
                else if (mode == 'spellbook') {
                    items = tokenHelper.getSpells(token,settings.spellType);
                    items = this.sortItems(items);
                    item = items[itemNr];
                    if (displayUses && item != undefined) uses = tokenHelper.getSpellUses(token,settings.spellType,item);
                }
                if (item != undefined) {
                    if (displayIcon) iconSrc = item.img;
                    if (displayName) txt = item.name;
                }
            }
            
        } 
        //No valid token found:
        else {
            if (mode == 'token') {
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
                    ring = 1;
                    overlay = true;
                    if (icon == 'stats') iconSrc = tokenHelper.getConditionIcon(settings.condition);
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
        }

        if (icon == 'stats'){
            if (MODULE.getPermission('TOKEN','STATS') == false) stats = statsOld;
            if (stats == 'HP') //HP
                iconSrc = "modules/MaterialDeck/img/token/hp_empty.png";
            if (stats == 'TempHP') //Temp HP
                iconSrc = "modules/MaterialDeck/img/token/temp_hp_empty.png";
            else if (stats == 'AC' || stats == 'ShieldHP' || stats == 'KinAC') //AC
                iconSrc = "modules/MaterialDeck/img/token/ac.webp";
            else if (stats == 'Speed') //Speed
                iconSrc = "modules/MaterialDeck/img/token/speed.webp";
            else if (stats == 'Init' || settings.onClick == 'initiative') //Initiative
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
                let ability = (stats == 'Save') ? settings.save : settings.ability;
                if (ability == undefined) ability = 'str';
                if (ability == 'con') iconSrc = "modules/MaterialDeck/img/token/abilities/cons.png";
                else iconSrc = "modules/MaterialDeck/img/token/abilities/" + ability + ".png";
            }
            else if (stats == 'Skill') {
                overlay = true;
                let skill = settings.skill;
                if (skill == undefined) skill = 'acr';
                else iconSrc = "modules/MaterialDeck/img/token/skills/" + (skill.startsWith('lor')? 'lor' : skill) + ".png";
            }
            else if (settings.onClick == 'center' || settings.onClick == 'centerSelect') {
                overlay = true;
                iconSrc = "modules/MaterialDeck/img/move/center.png";
            }
            else if (settings.onClick == 'move') {
                overlay = true;
                const dir = settings.dir ? settings.dir : 'center';
                if (dir == 'up') //up
                    iconSrc = "modules/MaterialDeck/img/move/up.png";
                else if (dir == 'down') //down
                    iconSrc = "modules/MaterialDeck/img/move/down.png";
                else if (dir == 'right') //right
                    iconSrc = "modules/MaterialDeck/img/move/right.png";
                else if (dir == 'left') //left
                    iconSrc = "modules/MaterialDeck/img/move/left.png";
                else if (dir == 'upRight') 
                    iconSrc = "modules/MaterialDeck/img/move/upright.png";
                else if (dir == 'upLeft') 
                    iconSrc = "modules/MaterialDeck/img/move/upleft.png";
                else if (dir == 'downRight') 
                    iconSrc = "modules/MaterialDeck/img/move/downright.png";
                else if (dir == 'downLeft') 
                    iconSrc = "modules/MaterialDeck/img/move/downleft.png";
            }   
            else if (settings.onClick == 'rotate') {
                overlay = true;
                const value = isNaN(parseInt(settings.rotValue)) ? 0 : parseInt(settings.rotValue);
            if (value >= 0) 
                iconSrc = "modules/MaterialDeck/img/move/rotatecw.png";
            else
                iconSrc = "modules/MaterialDeck/img/move/rotateccw.png";
            }
        }
        streamDeck.setIcon(context,device,iconSrc,{background:background,ring:ring,ringColor:ringColor,overlay:overlay,uses:uses,hp:hp});
        streamDeck.setTitle(txt,context);
    }

    sortItems(items) {
        let sorted = Object.values(items);
        sorted.sort((a,b) => a.data.sort - b.data.sort);
        return sorted;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    async keyPress(settings){
        const tokenId = canvas.tokens.controlled[0]?.id;

        const selection = settings.selection ? settings.selection : 'selected';
        const tokenIdentifier = settings.tokenName ? settings.tokenName : '';
        const mode = settings.tokenMode ? settings.tokenMode : 'token';
        
        let token;
        if (selection == 'selected') token = canvas.tokens.controlled[0];
        else token = tokenHelper.getToken(selection,tokenIdentifier);

        if (token == undefined) return;
        if (token.owner == false && token.observer == true && MODULE.getPermission('TOKEN','OBSERVER') == false ) return;
        if (token.owner == false && token.observer == false && MODULE.getPermission('TOKEN','NON_OWNED') == false ) return;
        
        if (mode == 'token') {

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
            else if (onClick == 'move') {    //move token
                tokenHelper.moveToken(token,settings.dir);
            }
            else if (onClick == 'rotate') {    //rotate token
                tokenHelper.rotateToken(token,settings.rot,settings.rotValue);
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
            else if (onClick == 'condition') {    //Handle condition
                if (MODULE.getPermission('TOKEN','CONDITIONS') == false ) return;
                const func = settings.conditionFunction ? settings.conditionFunction : 'toggle';

                if (func == 'toggle'){ //toggle
                    await tokenHelper.toggleCondition(token,settings.condition);
                    this.update(tokenId);
                }
                else if (func == 'increase'){ //increase
                    await tokenHelper.modifyConditionValue(token, settings.condition, +1)
                    this.update(tokenId);
                }
                else if (func == 'decrease'){ //decrease
                    await tokenHelper.modifyConditionValue(token, settings.condition, -1)
                    this.update(tokenId);
                }

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

                let light = {};


                if (isNaN(dimRadius)==false) light.dim = dimRadius;
                if (isNaN(brightRadius)==false) light.bright = brightRadius;
                if (isNaN(emissionAngle)==false) light.angle = emissionAngle;
                light.color = lightColor;
                light.alpha = Math.sqrt(colorIntensity).toNearest(0.05)

                let animation = {
                    type: '',
                    speed: tokenData.light.animation.speed,
                    intensity: tokenData.light.animation.intensity
                };
                if (animationType != 'none'){
                    animation.type = animationType;
                    animation.intensity = animationIntensity;
                    animation.speed = animationSpeed;
                }
                light.animation = animation;
                data.light = light;
                if (compatibleCore('0.8.1')) token.document.update(data);
                else token.update(data);
            }
            else if (onClick == 'initiative'){
                tokenHelper.toggleInitiative(token);
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
                if (compatibleCore('0.8.1')) token.document.update({img: iconSrc});
                else token.update({img: iconSrc})
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
                tokenHelper.roll(token,settings.roll,options,settings.rollAbility,settings.rollSkill,settings.rollSave)
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
                            if (compatibleCore('0.8.1')) await token.document.update({[path]:value});
                            else await token.update({[path]:value})
                            this.update(token.id);
                        }
                        
                    }
                }
            }
        }
        else {
            const allItems = token.actor.items;
            const itemNr = settings.itemNr ? settings.itemNr - 1 : 0;
            let items = allItems;
            if (mode == 'inventory') {
                items = tokenHelper.getItems(token,settings.inventoryType);
            }
            else if (mode == 'features') {
                items = tokenHelper.getFeatures(token,settings.featureType);
            }
            else if (mode == 'spellbook') {
                items = tokenHelper.getSpells(token,settings.spellType);
            }
            items = this.sortItems(items);

            const item = items[itemNr];
            if (item != undefined) {
                tokenHelper.rollItem(item, settings);
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