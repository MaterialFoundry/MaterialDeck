import { getPermission } from "../../MaterialDeck.js";

export class TokenControl{
    constructor(){
        this.active = false;
        this.wildcardOffset = 0;
        this.itemOffset = 0;
    }

    async update(tokenId=null){
        if (this.active == false) return;
        for (let device of game.materialDeck.streamDeck.buttonContext) {
            if (device?.buttons == undefined) continue;
            for (let i=0; i<device.buttons.length; i++){   
                const data = device.buttons[i];
                if (data == undefined || data.action != 'token') continue;
                //await this.pushData(tokenId,data.settings,data.context,device.device);
                await this.pushData({
                    token: undefined,
                    tokenId,
                    settings: data.settings,
                    context: data.context,
                    device: device.device
                });
            }
        }
    }

    async pushData(data){ 
        const tokenId = data.tokenId;   
        const settings = data.settings;
        const context = data.context;
        const device = data.device;
        let ring = data.ring ? data.ring : 0;
        let ringColor = data.ringColor ? data.ringColor : '#000000';
        const forceIcon = data.forceIcon;
        const hideName = data.hideName ? data.hideName : false;

        const name = settings.displayName ? settings.displayName : false;
        const icon = settings.icon ? settings.icon : 'none';
        let stats =  settings.stats ? settings.stats : 'none';
        const selection = settings.selection ? settings.selection : 'selected';
        const tokenIdentifier = settings.tokenName ? settings.tokenName : '';
        const prependTitle = settings.prependTitle ? settings.prependTitle : '';
        const mode = settings.tokenMode ? settings.tokenMode : 'token';
        const background = (mode == 'inventory') ? (settings.inventoryBackground ? settings.inventoryBackground : "#000000") : (settings.background ? settings.background : "#000000");

        let token;
        if (data.token == undefined) {
            if (settings.combatTrackerMode) token = game.materialDeck.systemHelper.getTokenFromTokenId(tokenId);
            else token = game.materialDeck.systemHelper.getToken(selection,tokenIdentifier);
        }
        else
            token = data.token;
        
        let validToken = token != undefined;
        let txt = "";
        let iconSrc = "";
        let overlay = false;
        let statsOld;
        let uses = undefined;
        let hp = undefined;

        if (validToken) {
            if (token.owner == false && token.observer == true && getPermission('TOKEN','OBSERVER') == false ) {
                game.materialDeck.streamDeck.noPermission(context,device);
                return;
            }
            if (token.owner == false && token.observer == false && getPermission('TOKEN','NON_OWNED') == false ) {
                game.materialDeck.streamDeck.noPermission(context,device);
                return;
            }

            if (mode == 'token') {
                if (name) txt += game.materialDeck.systemHelper.getTokenName(token);
                txt += prependTitle;
    
                const permission = token.actor?.permission;
                if (settings.combat){
                    if (permission == 0 && getPermission('COMBAT','DISPLAY_ALL_NAMES') == false) txt = "";
                    else if (permission == 1 && getPermission('COMBAT','DISPLAY_LIMITED_NAME') == false) txt = "";
                    else if (permission == 2 && getPermission('COMBAT','DISPLAY_OBSERVER_NAME') == false) txt = "";
    
                    if (permission == 0 && stats == 'HP') stats = 'none';
                    else if (stats == 'HP' && permission == 1 && getPermission('COMBAT','DISPLAY_LIMITED_HP') == false) stats = 'none';
                    else if (stats == 'HP' && permission == 2 && getPermission('COMBAT','DISPLAY_OBSERVER_HP') == false) stats = 'none';
                    else if (stats != 'HP' && permission < 3 && getPermission('COMBAT','DISPLAY_NON_OWNED_STATS') == false) stats = 'none';
                }
                else if (getPermission('TOKEN','STATS') == false) {
                    statsOld = stats;
                    stats = 'none';
                }
    
                if (icon == 'tokenIcon') iconSrc = game.materialDeck.systemHelper.getTokenIcon(token);
                else if (icon == 'actorIcon') iconSrc = game.materialDeck.systemHelper.getActorIcon(token);
                if (name && stats != 'none' && stats != 'HPbox') txt += "\n";
                
                if (stats == 'custom'){
                    const custom = settings.custom ? settings.custom : '';
                    txt += this.decodeCustomStat(custom, token);
                }
                
                if (stats == 'HP' || stats == 'Wounds') {
                    const hp = game.materialDeck.systemHelper.getHP(token);
                    txt += hp.value + "/" + hp.max;
                    
                    if (icon == 'stats')
                        uses = {
                            available: hp.value,
                            maximum: hp.max,
                            heart: "#FF0000"
                        };
                        
                }

                if (stats == 'Agility') { /* forbidden-lands */
                    const wits = game.materialDeck.systemHelper.getAgility(token);
                    txt += wits.value + "/" + wits.max;
                    
                    if (icon == 'stats')
                        uses = {
                            available: wits.value,
                            maximum: wits.max,
                            heart: "#FF0000"
                        };
                        
                }

                if (stats == 'Wits') { /* forbidden-lands */
                    const wits = game.materialDeck.systemHelper.getWits(token);
                    txt += wits.value + "/" + wits.max;
                    
                    if (icon == 'stats')
                        uses = {
                            available: wits.value,
                            maximum: wits.max,
                            heart: "#FF0000"
                        };
                        
                }

                if (stats == 'Empathy') { /* forbidden-lands */
                    const wits = game.materialDeck.systemHelper.getEmpathy(token);
                    txt += wits.value + "/" + wits.max;
                    
                    if (icon == 'stats')
                        uses = {
                            available: wits.value,
                            maximum: wits.max,
                            heart: "#FF0000"
                        };
                        
                }

                if (stats == 'WillPower') { /* forbidden-lands */
                    const wits = game.materialDeck.systemHelper.getWillPower(token);
                    txt += wits.value + "/" + wits.max;
                    
                    if (icon == 'stats')
                        uses = {
                            available: wits.value,
                            maximum: wits.max,
                            heart: "#FF0000"
                        };
                        
                }

                if (stats == 'CriticalWounds') { /* WFRP4e */
                    const criticalWounds = game.materialDeck.systemHelper.getCriticalWounds(token);
                    txt += criticalWounds.value + "/" + criticalWounds.max;
                    
                    if (icon == 'stats')
                        uses = {
                            available: criticalWounds.value,
                            maximum: criticalWounds.max,
                            heart: "#FF0000"
                        };
                        
                }
                else if (stats == 'HPbox' || stats == 'HPbar') {
                    const hp = game.materialDeck.systemHelper.getHP(token);
                    uses = {
                        available: hp.value,
                        maximum: hp.max,
                        bar: stats == 'HPbar'
                    }
                }
                else if (stats == 'TempHP') {
                    const tempHP = game.materialDeck.systemHelper.getTempHP(token);
                    txt += (tempHP.max == 0) ? tempHP.value : `${tempHP.value}/${tempHP.max}`;
                    
                    if (icon == 'stats') 
                        uses = {
                            available: tempHP.value,
                            maximum: tempHP.max,
                            heart: "#00FF00"
                        };
                }
                else if (stats == 'Stamina') {    //starfinder
                    const stamina = game.materialDeck.systemHelper.getStamina(token);
                    txt += `${stamina.value}/${stamina.max}`;
                }
                else if (stats == 'KinAC') {    //starfinder
                    txt += game.materialDeck.systemHelper.getKinAC(token);
                }
                else if (stats == 'AC') txt += game.materialDeck.systemHelper.getAC(token);
                else if (stats == 'ShieldHP') txt += game.materialDeck.systemHelper.getShieldHP(token);
                else if (stats == 'Speed') txt += game.materialDeck.systemHelper.getSpeed(token);
                else if (stats == 'Init') txt += game.materialDeck.systemHelper.getInitiative(token);
                else if (stats == 'PassivePerception') txt += game.materialDeck.systemHelper.getPassivePerception(token);
                else if (stats == 'PassiveInvestigation') txt += game.materialDeck.systemHelper.getPassiveInvestigation(token);
                else if (stats == 'Ability') txt += game.materialDeck.systemHelper.getAbility(token, settings.ability);
                else if (stats == 'AbilityMod') txt += game.materialDeck.systemHelper.getAbilityModifier(token, settings.ability);
                else if (stats == 'Save') {
                    txt += game.materialDeck.systemHelper.getAbilitySave(token, settings.save);
                    ringColor = game.materialDeck.systemHelper.getSaveRingColor(token, settings.save);
                    if (ringColor != undefined) ring = 2;
                }
                else if (stats == 'Skill') {
                    txt += game.materialDeck.systemHelper.getSkill(token, settings.skill);
                    ringColor = game.materialDeck.systemHelper.getSkillRingColor(token, settings.skill);
                    if (ringColor != undefined) ring = 2;
                }
                else if (stats == 'Prof') txt += game.materialDeck.systemHelper.getProficiency(token);
                else if (stats == 'Fate') txt += game.materialDeck.systemHelper.getFate(token) /* WFRP4e */
                else if (stats == 'Fortune') txt += game.materialDeck.systemHelper.getFortune(token) /* WFRP4e */
                else if (stats == 'Corruption') txt += game.materialDeck.systemHelper.getCorruption(token) /* WFRP4e */
                else if (stats == 'Advantage') txt += game.materialDeck.systemHelper.getAdvantage(token) /* WFRP4e */
                else if (stats == 'Resolve') txt += game.materialDeck.systemHelper.getResolve(token) /* WFRP4e */
                else if (stats == 'Resilience') txt += game.materialDeck.systemHelper.getResilience(token) /* WFRP4e */
                else if (stats == 'Perception') txt += game.materialDeck.systemHelper.getPerception(token) /* PF2E */
                else if (stats == 'Condition') { /* PF2E */
                    const valuedCondition = game.materialDeck.systemHelper.getConditionValue(token, settings.condition);
                    if (valuedCondition != undefined) {
                        txt += valuedCondition?.value;
                    }
                }
                else if (stats == 'DefenseMelee') txt += game.materialDeck.systemHelper.getDefenseMelee(token); /* SWFFG */
                else if (stats == 'DefenseRanged') txt += game.materialDeck.systemHelper.getDefenseRanged(token); /* SWFFG */
                else if (stats == 'Encumbrance') { /* SWFFG */
                    const encumbrance = game.materialDeck.systemHelper.getEncumbrance(token);
                    txt += `${encumbrance.value}/${encumbrance.max}`;
                } 
                else if (stats == 'Force Pool') { /* SWFFG */   
                    const encumbrance = game.materialDeck.systemHelper.getForcePool(token);
                    txt += `${encumbrance.value}/${encumbrance.max}`;
                } /* SWFFG */
                   
                else if (stats == 'Strain') { /* SWFFG */
                    const strain = game.materialDeck.systemHelper.getStrain(token);
                    txt += `${strain.value}/${strain.max}`;
                }
                
                if (settings.onClick == 'visibility') { //toggle visibility
                    if (getPermission('TOKEN','VISIBILITY') == false ) {
                        game.materialDeck.streamDeck.noPermission(context,device);
                        return;
                    }
                    ring = 1;
                    if (token.document.hidden){
                        ring = 2;
                        ringColor = "#FF7B00";
                    }
                    if (icon == 'stats') {
                        iconSrc = window.CONFIG.controlIcons.visibility;
                        overlay = true;
                    }
                }
                else if (settings.onClick == 'combatState') { //toggle combat state
                    if (getPermission('TOKEN','COMBAT') == false ) {
                        game.materialDeck.streamDeck.noPermission(context,device);
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
                    if (getPermission('TOKEN','CONDITIONS') == false ) {
                        game.materialDeck.streamDeck.noPermission(context,device);
                        return;
                    }
                    ring = 1;
                    overlay = true;
                    if (icon == 'stats') {
                        iconSrc = game.materialDeck.systemHelper.getConditionIcon(settings.condition);
                        if (game.materialDeck.systemHelper.getConditionActive(token,settings.condition)) {
                            ring = 2;
                            ringColor = "#FF7B00";
                        }
                    }  
                }
                else if (settings.onClick == 'cubCondition') { //Combat Utility Belt conditions
                    if (getPermission('TOKEN','CONDITIONS') == false ) {
                        game.materialDeck.streamDeck.noPermission(context,device);
                        return;
                    }
                    ring = 1;
                    overlay = true;
                    const condition = settings.cubConditionName;
                    if (condition == undefined || condition == '') return;
                    if (icon == 'stats') {
                        iconSrc = CONFIG.statusEffects.find(e => e.label === condition).icon;
                        if (game.materialDeck.systemHelper.getConditionActive(token,condition)){
                            ring = 2;
                            ringColor = "#FF7B00";
                        } 
                    }
                }
                else if (settings.onClick == 'wildcard') { //wildcard images
                    if (getPermission('TOKEN','WILDCARD') == false ) {
                        game.materialDeck.streamDeck.noPermission(context,device);
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
                        if (images[i] == game.materialDeck.systemHelper.getTokenIcon(token)){
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
            else if (mode == 'offset') {
                iconSrc = "modules/MaterialDeck/img/black.png";
                const itemOffset = settings.itemOffset ? settings.itemOffset : 0;
                ringColor = settings.offRing ? settings.offRing : '#000000';
                const ringOnColor = settings.onRing ? settings.onRing : '#00FF00';
                ring = 1;
                if (itemOffset == this.itemOffset) {
                    
                    ring = 2;
                    ringColor = ringOnColor;
                }
            }
            else if (mode == 'offsetRel') {
                
            }
            else if (mode == 'dispOffset') {
                iconSrc = "modules/MaterialDeck/img/black.png";
                const prependTitle = settings.offsetPrepend ? settings.offsetPrepend : '';
                txt += prependTitle + this.itemOffset;
            }
            //Items
            else {
                txt += prependTitle;
                const allItems = token.actor.items;
                let itemNr = settings.itemNr ? settings.itemNr - 1 : 0;
                itemNr += this.itemOffset;
                const displayUses = settings.displayUses ? settings.displayUses : false;
                const displayName = settings.displayInventoryName ? settings.displayInventoryName : false;
                const displayIcon = settings.displayInventoryIcon ? settings.displayInventoryIcon : false;
                const selectionMode = settings.inventorySelection ? settings.inventorySelection : 'order';
                let items = allItems;
                let item;
                if (mode == 'inventory') {
                    items = game.materialDeck.systemHelper.getItems(token,settings.inventoryType);
                    items = this.sortItems(items);
                    if (selectionMode == 'order')       item = items[itemNr];
                    else if (selectionMode == 'name')   item = items.filter(i => i.name == settings.itemName)[0];
                    else if (selectionMode == 'id')     item = items.filter(i => i.id == settings.itemName)[0];
                    
                    if (item != undefined && displayUses) uses = game.materialDeck.systemHelper.getItemUses(item);
                }
                else if (mode == 'features') {
                    items = game.materialDeck.systemHelper.getFeatures(token,settings.featureType);
                    items = this.sortItems(items);
                    if (selectionMode == 'order')       item = items[itemNr];
                    else if (selectionMode == 'name')   item = items.filter(i => i.name == settings.itemName)[0];
                    else if (selectionMode == 'id')     item = items.filter(i => i.id == settings.itemName)[0];
                    if (item != undefined && displayUses) uses = game.materialDeck.systemHelper.getFeatureUses(item);
                }
                else if (mode == 'spellbook') {
                    items = game.materialDeck.systemHelper.getSpells(token,settings.spellType,settings.spellMode);
                    items = this.sortItems(items);
                    if (selectionMode == 'order')       item = items[itemNr];
                    else if (selectionMode == 'name')   item = items.filter(i => i.name == settings.itemName)[0];
                    else if (selectionMode == 'id')     item = items.filter(i => i.id == settings.itemName)[0];
                    if (displayUses && item != undefined) uses = game.materialDeck.systemHelper.getSpellUses(token,settings.spellType,item);
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
                    if (getPermission('TOKEN','VISIBILITY') == false ) {
                        game.materialDeck.streamDeck.noPermission(context,device);
                        return;
                    }
                    if (icon == 'stats') {
                        iconSrc = window.CONFIG.controlIcons.visibility;
                        ring = 2;
                        overlay = true;
                    }
                }
                else if (settings.onClick == 'combatState') { //toggle combat state
                    if (getPermission('TOKEN','COMBAT') == false ) {
                        game.materialDeck.streamDeck.noPermission(context,device);
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
                    if (getPermission('TOKEN','CONDITIONS') == false ) {
                        game.materialDeck.streamDeck.noPermission(context,device);
                        return;
                    }
                    ring = 1;
                    overlay = true;
                    if (icon == 'stats') iconSrc = game.materialDeck.systemHelper.getConditionIcon(settings.condition);
                }
                else if (settings.onClick == 'cubCondition') { //Combat Utility Belt conditions
                    if (getPermission('TOKEN','CONDITIONS') == false ) {
                        game.materialDeck.streamDeck.noPermission(context,device);
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
    
        if (icon == 'stats' && mode != 'offset' && mode != 'offsetRel'){
            if (getPermission('TOKEN','STATS') == false) stats = statsOld;
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
                let skill = settings.skill ? settings.skill : 'acr';
                iconSrc = "modules/MaterialDeck/img/token/skills/" + (skill.startsWith('lor')? 'lor' : skill) + ".png";
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

        if (forceIcon) {
            iconSrc = forceIcon;
            txt = "";
        }
        else if (hideName) txt = "";
        if (settings.iconOverride != '' && settings.iconOverride != undefined) iconSrc = settings.iconOverride;
        game.materialDeck.streamDeck.setIcon(context,device,iconSrc,{background:background,ring:ring,ringColor:ringColor,overlay:overlay,uses:uses,hp:hp});
        game.materialDeck.streamDeck.setTitle(txt,context);
    }

    sortItems(items) {
        let sorted = Object.values(items);
        sorted.sort((a,b) => a.sort - b.sort);
        return sorted;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    async keyPress(settings){
        const tokenId = canvas.tokens.controlled[0]?.id;

        const selection = settings.selection ? settings.selection : 'selected';
        const tokenIdentifier = settings.tokenName ? settings.tokenName : '';
        const mode = settings.tokenMode ? settings.tokenMode : 'token';
        
        let token = game.materialDeck.systemHelper.getToken(selection,tokenIdentifier);

        if (token == undefined) return;
        if (token.owner == false && token.observer == true && getPermission('TOKEN','OBSERVER') == false ) return;
        if (token.owner == false && token.observer == false && getPermission('TOKEN','NON_OWNED') == false ) return;
        
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
                game.materialDeck.systemHelper.moveToken(token,settings.dir,settings.grid);
            }
            else if (onClick == 'rotate') {    //rotate token
                game.materialDeck.systemHelper.rotateToken(token,settings.rot,settings.rotValue);
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
                if (getPermission('TOKEN','VISIBILITY') == false ) return;
                token.toggleVisibility();
            }
            else if (onClick == 'combatState') {    //Toggle combat state
                if (getPermission('TOKEN','COMBAT') == false ) return;
                token.toggleCombat();
            }
            else if (onClick == 'target') {    //Target token
                token.setTarget(!token.isTargeted,{releaseOthers:false});
            }
            else if (onClick == 'condition') {    //Handle condition
                if (getPermission('TOKEN','CONDITIONS') == false ) return;
                const func = settings.conditionFunction ? settings.conditionFunction : 'toggle';

                if (func == 'toggle'){ //toggle
                    await game.materialDeck.systemHelper.toggleCondition(token,settings.condition);
                    this.update(tokenId);
                }
                else if (func == 'increase'){ //increase
                    await game.materialDeck.systemHelper.modifyConditionValue(token, settings.condition, +1)
                    this.update(tokenId);
                }
                else if (func == 'decrease'){ //decrease
                    await game.materialDeck.systemHelper.modifyConditionValue(token, settings.condition, -1)
                    this.update(tokenId);
                }

            }
            else if (onClick == 'cubCondition') { //Combat Utility Belt conditions
                if (getPermission('TOKEN','CONDITIONS') == false ) return;
                const condition = settings.cubConditionName;
                if (condition == undefined || condition == '') return;
                const effect = CONFIG.statusEffects.find(e => e.label === condition);
                await token.toggleEffect(effect);
                this.update(tokenId); 
            }
            else if (onClick == 'vision'){
                if (getPermission('TOKEN','VISION') == false ) return;

                let sight = {};
                let light = {
                    animation: {}
                }
                
                //Vision basic config
                if (settings.visionEnabled && settings.visionEnabled != 'noChange') {
                    if (settings.visionEnabled == 'toggle')
                        sight.enabled = !token.document.sight.enabled;
                    else
                        sight.enabled = settings.visionEnabled == 'enable';
                }
                if (settings.visionRange && isNaN(settings.visionRange) == false) sight.range = parseInt(settings.visionRange);
                if (settings.visionDimRange && isNaN(settings.visionDimRange) == false) sight.dimSight = parseInt(settings.visionDimRange);
                if (settings.visionBrightRange && isNaN(settings.visionBrightRange) == false) sight.brightSight = parseInt(settings.visionBrightRange);
                if (settings.visionAngle && isNaN(settings.visionAngle) == false) sight.angle = parseInt(settings.visionAngle);
                if (settings.visionMode && settings.visionMode != 'noChange') sight.visionMode = settings.visionMode;

                //Vision detection modes
                let detectionModes = token.document.detectionModes;
                if (settings.visionDetectionModeEnable && settings.visionDetectionModeEnable != 'noChange' && settings.visionDetectionModeNumber && detectionModes[settings.visionDetectionModeNumber-1] != undefined) {
                    if (settings.visionDetectionModeEnable == 'toggle')
                        detectionModes[settings.visionDetectionModeNumber-1].enabled = !detectionModes[settings.visionDetectionModeNumber-1].enabled;
                    else if (settings.visionDetectionModeEnable == 'enable') 
                        detectionModes[settings.visionDetectionModeNumber-1].enabled = true;
                    else if (settings.visionDetectionModeEnable == 'disable') 
                        detectionModes[settings.visionDetectionModeNumber-1].enabled = false;
                    detectionModes = detectionModes;
                }

                //Vision advanced options
                if (settings.visionColorEnable) sight.color = settings.visionColor ? (settings.visionColor == '#000000' ? null : settings.visionColor) : null;
                if (settings.visionAttenuationEnable) sight.attenuation = settings.visionAttenuation ? parseFloat(settings.visionAttenuation) : 0;
                if (settings.visionBrightnessEnable) sight.brightness = settings.visionBrightness ? parseFloat(settings.visionBrightness) : 0;
                if (settings.visionSaturationEnable) sight.saturation = settings.visionSaturation ? parseFloat(settings.visionSaturation) : 0;
                if (settings.visionContrastEnable) sight.contrast = settings.visionContrast ? parseFloat(settings.visionContrast) : 0;

                //Light basic config
                if (settings.lightDimRadius && isNaN(settings.lightDimRadius) == false) light.dim = parseInt(settings.lightDimRadius);
                if (settings.lightBrightRadius && isNaN(settings.lightBrightRadius) == false) light.bright = parseInt(settings.lightBrightRadius);
                if (settings.lightEmissionAngle && isNaN(settings.lightEmissionAngle) == false) light.angle = parseInt(settings.lightEmissionAngle);
                if (settings.lightColorEnable) light.color = settings.lightColor ? (settings.lightColor == '#000000' ? null : settings.lightColor) : null;
                if (settings.lightColorIntensityEnable) light.alpha = settings.lightColorIntensity ? parseFloat(settings.lightColorIntensity) : 0;

                //Light animation
                if (settings.lightAnimationType && settings.lightAnimationType != 'noChange') light.animation.type = settings.lightAnimationType == 'none' ? null : settings.lightAnimationType;
                if (settings.lightAnimationSpeedEnable) light.animation.speed = settings.lightAnimationSpeed ? parseFloat(settings.lightAnimationSpeed) : 5;
                if (settings.lightAnimationReverseDirection && settings.lightAnimationReverseDirection != 'noChange') {
                    if (settings.lightAnimationReverseDirection == 'toggle')
                        light.animation.reverse = !token.document.light.animation.reverse;
                    else if (settings.lightAnimationReverseDirection == 'enable') 
                        light.animation.reverse = true;
                    else if (settings.lightAnimationReverseDirection == 'disable') 
                        light.animation.reverse = false;
                }
                if (settings.lightAnimationIntensityEnable) light.animation.intensity = settings.lightAnimationIntensity ? parseFloat(settings.lightAnimationIntensity) : 5;

                //Light advanced options
                if (settings.lightColorationTechnique && settings.lightColorationTechnique != 'noChange') light.coloration = parseInt(settings.lightColorationTechnique);
                if (settings.lightLuminosityEnable) light.luminosity = settings.lightLuminosity ? parseFloat(settings.lightLuminosity) : 0.5;
                if (settings.lightGradualIllumination && settings.lightGradualIllumination != 'noChange') {
                    if (settings.lightGradualIllumination == 'toggle')
                        light.gradual = !token.data.light.gradual;
                    else if (settings.lightGradualIllumination == 'enable') 
                        light.gradual = true;
                    else if (settings.lightGradualIllumination == 'disable') 
                        light.gradual = false;
                }
                if (settings.lightAttenuationEnable) light.attenuation = settings.lightAttenuation ? parseFloat(settings.lightAttenuation) : 0.5;
                if (settings.lightSaturationEnable) light.saturation = settings.lightSaturation ? parseFloat(settings.lightSaturation) : 0;
                if (settings.lightContrastEnable) light.contrast = settings.lightContrast ? parseFloat(settings.lightContrast) : 0;
                if (settings.lightShadowsEnable) light.shadows = settings.lightShadows ? parseFloat(settings.lightShadows) : 0;

                let data;
                data = {
                    sight,
                    light
                }
                token.document.update(data);
            }
            else if (onClick == 'initiative'){
                game.materialDeck.systemHelper.toggleInitiative(token);
            }
            else if (onClick == 'wildcard') { //wildcard images
                if (getPermission('TOKEN','WILDCARD') == false ) return;
                const method = settings.wildcardMethod ? settings.wildcardMethod : 'iterate';
                let value = parseInt(settings.wildcardValue);
                if (isNaN(value)) value = 1;

                const images = await token.actor.getTokenImages();
                let imgNr;
                let iconSrc;
                if (method == 'iterate'){
                    let currentImgNr = 0
                    for (let i=0; i<images.length; i++) 
                        if (images[i] == game.materialDeck.systemHelper.getTokenIcon(token)){
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
                token.document.update({img: iconSrc});
            }
            else if (onClick == 'macro') {  //call a macro
                const settingsNew = {
                    target: token,
                    macroMode: settings.macroMode,
                    macroNumber: settings.macroId,
                    macroArgs: settings.macroArgs
                }
                game.materialDeck.macroControl.keyPress(settingsNew);
            }
            else if (onClick == 'roll') {   //roll skill/save/ability
                const rollMode = settings.rollMode ? settings.rollMode : 'default';
                const rollPrivacyMode = settings.rollPrivacyMode ? settings.rollPrivacyMode : 'default';

                let options;
                
                if (rollMode == 'default')
                    options = {
                        fastForward: (game.materialDeck.otherControls.rollOption != 'dialog'),
                        advantage: (game.materialDeck.otherControls.rollOption == 'advantage'),
                        disadvantage: (game.materialDeck.otherControls.rollOption == 'disadvantage')
                    }
                else if (rollMode == 'normal') options = {fastForward:true}
                else if (rollMode == 'advantage') options = {fastForward:true,advantage:true}
                else if (rollMode == 'disadvantage') options = {fastForward:true,disadvantage:true}

                if (rollPrivacyMode != 'default') options['rollMode'] = rollPrivacyMode;
                game.materialDeck.systemHelper.roll(token,settings.roll,options,settings.rollAbility,settings.rollSkill,settings.rollSave)
                if (game.materialDeck.otherControls.rollOption != 'dialog') game.materialDeck.otherControls.setRollOption('normal');
            }
            else if (onClick == 'custom') {//custom onClick function
                if (getPermission('TOKEN','CUSTOM') == false ) return;
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
                        game.materialDeck.macroControl.keyPress(settingsNew);
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
                            await token.document.update({[path]:value});
                            this.update(token.id);
                        }
                        
                    }
                }
            }
        }
        else if (mode == 'offset') {
            const itemOffset = settings.itemOffset ? settings.itemOffset : 0;
            this.itemOffset = parseInt(itemOffset);
            this.update(tokenId);
        }
        else if (mode == 'offsetRel') {
            const itemOffset = settings.itemOffset ? settings.itemOffset : 0;
            this.itemOffset += parseInt(itemOffset);
            this.update(tokenId);
        }
        else {
            const allItems = token.actor.items;
            let itemNr = settings.itemNr ? settings.itemNr - 1 : 0;
            itemNr += this.itemOffset;
            const selectionMode = settings.inventorySelection ? settings.inventorySelection : 'order';
            let items = allItems;
            if (mode == 'inventory') {
                items = game.materialDeck.systemHelper.getItems(token,settings.inventoryType);
            }
            else if (mode == 'features') {
                items = game.materialDeck.systemHelper.getFeatures(token,settings.featureType);
            }
            else if (mode == 'spellbook') {
                items = game.materialDeck.systemHelper.getSpells(token,settings.spellType);
            }
            items = this.sortItems(items);
            let item;
            if (selectionMode == 'order')       item = items[itemNr];
            else if (selectionMode == 'name')   item = items.filter(i => i.name == settings.itemName)[0];
            else if (selectionMode == 'id')     item = items.filter(i => i.id == settings.itemName)[0];
            if (item != undefined) {
                game.materialDeck.systemHelper.rollItem(item, settings, game.materialDeck.otherControls.rollOption, game.materialDeck.otherControls.attackMode, token);
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

    decodeCustomStat(custom, token) {
        let txt = "";

        let split = custom.split(/\[|\]/g)
        
        for (let segment of split) {
            if (segment.startsWith('if')) {
                let ifA;
                let ifMode;
                let ifB;
                let ifThen;
                let ifElse;

                let spaceSplit = segment.split(' ');
                let count = 0;
                for (let segment of spaceSplit) {
                    if (segment.startsWith('if')) ifA = this.decodeIfSegment(segment, token);
                    else if (segment.startsWith('then')) ifThen = this.decodeIfSegment(segment, token);
                    else if (segment.startsWith('else')) ifElse = this.decodeIfSegment(segment, token);
                    else {
                        segment = segment.split(')')[0];
                        if (count == 1) ifMode = segment;
                        else if (count == 2) ifB = segment.startsWith('@') ? this.getCustomDataPath(segment, token) : segment;
                    }
                    count++;
                }

                if (ifMode == '>') txt += ifA > ifB ? ifThen : ifElse;
                else if (ifMode == '>=') txt += ifA >= ifB ? ifThen : ifElse;
                else if (ifMode == '<') txt += ifA < ifB ? ifThen : ifElse;
                else if (ifMode == '<=') txt += ifA <= ifB ? ifThen : ifElse;
                else if (ifMode == '==') txt += ifA == ifB ? ifThen : ifElse;
            }
            else if (segment.startsWith('@')) txt += this.getCustomDataPath(segment, token);
            else txt += segment;
        }

        return txt;
    }

    decodeIfSegment(segment, token) {
        let split = segment.split(/\(|\)/g);
        if (split[1].startsWith('@')) return this.getCustomDataPath(split[1], token);
        return split[1];
    }

    getCustomDataPath(path, token) {
        const dataPath = path.split('@')[1].split('.');
        let data;
        if (dataPath[0] == 'actor') data = token.actor;
        else if (dataPath[0] == 'token') data = token;
        
        for (let i=1; i<dataPath.length; i++) {
            data = data?.[dataPath[i]];
        }
            
        if (data == undefined) return '[undef]';
        return data;
    }
}