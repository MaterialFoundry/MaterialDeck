import { materialDeck } from "../MaterialDeck.js";
import { transmitInitData } from "./websocket.js";

export class SystemHelper {
    systems = [];
    systemsSetting = {};
    system;
    systemData = {};
    systemLoaded = false;
    systemNotificationTimer = Date.now()-5000;
    systemNotificationTimeout = 5000;
    hexMovementDir = 'upRight';

    constructor() {
        this.systemsSetting[""] = game.i18n.localize("MaterialDeck.AutoDetect");
    }

    async registerSystem(data) {
        console.log(`Material Deck system registered: '${data.systemName}'`);
        
        if (materialDeck.gamingSystem == data.systemId) {
            this.systemLoaded = true;
            this.system = await new data.system();
            this.systemData = {
                conditions: this.getConditionList(),
                abilities: this.getAbilityList(),
                saves: this.getSavesList(),
                skills: this.getSkillList(),
                itemTypes: this.getItemTypes(),
                weaponRollModes: this.getWeaponRollModes(),
                featureTypes: this.getFeatureTypes(),
                spellLevels: this.getSpellLevels(),
                spellTypes: this.getSpellTypes(),
                stats: this.getStatsList(),
                onClick: this.getOnClickList(),
                rollTypes: this.getRollTypes(),
                attackModes: this.getAttackModes()
            }
            transmitInitData();
        }

        this.systems.push({
            id: data.systemId,
            name: data.systemName,
            version: data.version,
            manifest: data.manifest,
            moduleId: data.moduleId
        });
        
        this.systemsSetting[data.systemId] = data.systemName;
        game.settings.settings.get("MaterialDeck.systemOverride").choices = this.systemsSetting;
    }

    /***********************************************************************
     * System agnostic functions
     ***********************************************************************/
    getToken(type,identifier) {
        if (type == 'selected') return this.getSelectedToken();
        else if (type == 'user') return this.getUserCharacter();
        else if (identifier == '') return;
        else if (type == 'tokenName') return this.getTokenFromTokenName(identifier);
        else if (type == 'actorName') return this.getTokenFromActorName(identifier);
        else if (type == 'tokenId') return this.getTokenFromTokenId(identifier);
        else if (type == 'actorId') return this.getTokenFromActorId(identifier);
    }
    getTokenFromTokenId(id) {
        return canvas.tokens.get(id);
    }

    getTokenFromTokenName(name) {
        return canvas.tokens.placeables.find(p => p.name == name);
    }

    getTokenFromActorId(id) {
        return canvas.tokens.placeables.find(p => p.actor.id == id);
    }

    getTokenFromActorName(name) {
        return canvas.tokens.placeables.find(p => p.actor.name == name);
    }

    getSelectedToken() {
        return canvas.tokens.controlled[0];
    }

    getUserCharacter() {
        return canvas.tokens.placeables.find(p => p.actor.id == game.user.character.id);
    }

    moveToken(token,dir){
        if (dir == 'center') {
            let location = token.getCenter(x,y); 
            canvas.animatePan(location);
            return;
        }

        if (game.user.isGM == false && game.paused) return;

        if (dir == undefined) dir = 'up';
        const gridSize = canvas.scene.grid.size;
        let x = token.x;
        let y = token.y;
    
        if (canvas.grid.type <= 1) {
            if (dir == 'up') y -= gridSize;
            else if (dir == 'down') y += gridSize;
            else if (dir == 'right') x += gridSize;
            else if (dir == 'left') x -= gridSize;
            else if (dir == 'upRight') {
                x += gridSize;
                y -= gridSize;
            }
            else if (dir == 'upLeft') {
                x -= gridSize;
                y -= gridSize;
            }
            else if (dir == 'downRight') {
                x += gridSize;
                y += gridSize;
            }
            else if (dir == 'downLeft') {
                x -= gridSize;
                y += gridSize;
            }
        }
        else if (canvas.grid.type == 2 || canvas.grid.type == 3) {
            if (dir == 'up') {
                if (this.hexMovementDir == 'upRight') dir = 'upLeft';
                else dir = 'upRight';
                this.hexMovementDir = dir;
            }
            else if (dir == 'down') {
                if (this.hexMovementDir == 'downRight') dir = 'downLeft';
                else dir = 'downRight';
                this.hexMovementDir = dir;
            }
            
            if (dir == 'right') x += gridSize;
            else if (dir == 'left') x -= gridSize;
            else if (dir == 'upRight') {
                x += gridSize*0.5;
                y -= gridSize*0.5;
            }
            else if (dir == 'upLeft') {
                x -= gridSize*0.5;
                y -= gridSize*0.5;
            }
            else if (dir == 'downRight') {
                x += gridSize*0.5;
                y += gridSize*0.87;
            }
            else if (dir == 'downLeft') {
                x -= gridSize*0.5;
                y += gridSize*0.87;
            }
        }
        else if (canvas.grid.type == 4 || canvas.grid.type == 5) {
            if (dir == 'right') {
                if (this.hexMovementDir == 'upRight') dir = 'downRight';
                else dir = 'upRight';
                this.hexMovementDir = dir;
            }
            else if (dir == 'left') {
                if (this.hexMovementDir == 'upLeft') dir = 'downLeft';
                else dir = 'upLeft';
                this.hexMovementDir = dir;
            }

            if (dir == 'up') y -= gridSize;
            else if (dir == 'down') y += gridSize;
            else if (dir == 'upRight') {
                x += gridSize*0.87;
                y -= gridSize*0.5;
            }
            else if (dir == 'upLeft') {
                x -= gridSize*0.5;
                y -= gridSize*0.5;
            }
            else if (dir == 'downRight') {
                x += gridSize*0.87;
                y += gridSize*0.5;
            }
            else if (dir == 'downLeft') {
                x -= gridSize*0.5;
                y += gridSize*0.5;
            }
        }

        if (token.can(game.user,"control") == false || token.checkCollision(token.getCenter(x, y))) return;
        
        const coords = canvas.grid.getTopLeft(x,y);
        token.document.update({x:coords[0],y:coords[1]});
    };

    rotateToken(token,move,value) {
        if (move == undefined) move = 'to';
        value = isNaN(parseInt(value)) ? 0 : parseInt(value);

        let rotationVal;
        if (move == 'by') rotationVal = token.document.rotation + value;
        else rotationVal = value;
        
        token.document.update({rotation: rotationVal});
    }

    ///////////////////////////////////////////////

    /**
     * Get name/id
     */
    getTokenName(token) {
        return token.name;
    }

    getTokenId(token) {
        return token.id;
    }

    getActorName(token) {
        return token.actor.name;
    }

    getActorId(token) {
        return token.actor.id;
    }

    ////////////////////////////////////////////////////
    getTokenIcon(token) {
        if (token.document) return token.document.texture.src;
        else return token.texture.src;
    }

    getActorIcon(token) {
        return token.actor.img;
    }

    /***********************************************************************
     * System specific functions
     ***********************************************************************/
    
    checkIfSystemLoaded() {
        if (this.systemLoaded) return true;
        if (Date.now() - this.systemNotificationTimer > this.systemNotificationTimeout) {
            this.systemNotificationTimer = Date.now();
            ui.notifications.warn("Material Deck: "+game.i18n.localize("MaterialDeck.Notifications.NoSystem"));
        }
        return false;
    }

    getStatsList() {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getStatsList();
    }

    getAttackModes() {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getAttackModes();
    }

    getOnClickList() {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getOnClickList();
    }

    getHP(token) {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getHP(token);
    }

    getTempHP(token) {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getTempHP(token);
    }

    getAC(token) {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getAC(token);
    }

    getShieldHP(token) {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getShieldHP(token);
    }

    getSpeed(token) {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getSpeed(token);
    }

    getInitiative(token) {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getInitiative(token);
    }

    toggleInitiative(token) {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.toggleInitiative(token);
    }

    getPassivePerception(token) {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getPassivePerception(token);
    }

    getPassiveInvestigation(token) {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getPassiveInvestigation(token);
    }

    getAbility(token, ability) {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getAbility(token, ability);
    }

    getAbilityModifier(token, ability) {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getAbilityModifier(token, ability);
    }

    getAbilitySave(token, ability) {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getAbilitySave(token, ability);
    }

    getAbilityList() {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getAbilityList();
    }

    getSavesList() {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getSavesList();
    }

    getSkill(token, skill) {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getSkill(token, skill);
    }

    getSkillList() {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getSkillList();
    }

    getProficiency(token) {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getProficiency(token);
    }

    /* WFRP 4E */
    getFate(token) {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getFate(token)
    }

    /* WFRP 4E */
    getFortune(token) {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getFortune(token)
    }
    
    /* WFRP 4E */
    getCriticalWounds(token) {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getCriticalWounds(token)
    }

    /* WFRP 4E */
    getCorruption(token) {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getCorruption(token)
    }

    /* WFRP 4E */
    getAdvantage(token) {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getAdvantage(token)
    }

    /* WFRP 4E */
    getResolve(token) {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getResolve(token)
    }

    /* WFRP 4E */
    getResilience(token) {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getResilience(token)
    }

    /* PF2E */
    getPerception(token) {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getPerception(token)
    }

    /* forbidden-lands */
    getAgility(token) {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getAgility(token)
    }    

    /* forbidden-lands */
    getWits(token) {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getWits(token)
    }

    /* forbidden-lands */
    getEmpathy(token) {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getEmpathy(token)
    }
     /* forbidden-lands */
    getWillPower(token) {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getWillPower(token)
    }

    /* starfinder */
    getStamina(token) {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getStamina(token);
    }

    /* starfinder */
    getKinAC(token) {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getKinAC(token);
    }

    /* starwarsffg */
    getDefenseMelee(token){
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getDefenseMelee(token);
    }
    /* starwarsffg */
    getDefenseRanged(token){
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getDefenseRanged(token);
    } 
    /* starwarsffg */
    getEncumbrance(token){
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getEncumbrance(token);
    } 
    /* starwarsffg */
    getForcePool(token){
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getForcePool(token);
    } 

    /* starwarsffg */
    getStrain(token){
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getStrain(token);
    } 
    

    /**
     * Conditions
     */
    getConditionIcon(condition) {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getConditionIcon(condition);
    }

    getConditionActive(token,condition) {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getConditionActive(token,condition);
    }

    toggleCondition(token,condition) {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.toggleCondition(token,condition);
    }

    getConditionList() {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getConditionList();
    }

    /* PF2E */
    getConditionValue(token,condition) {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getConditionValue(token,condition);
    }

    /* PF2E */
    modifyConditionValue(token,condition,delta) {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.modifyConditionValue(token,condition,delta);
    }

    /**
     * Roll
     */
     roll(token,roll,options,ability,skill,save) {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.roll(token,roll,options,ability,skill,save);
    }

    getRollTypes() {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getRollTypes();
    }

    /**
     * Items
     */
    getItems(token,itemType) {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getItems(token,itemType);
    }

    getItemUses(item) {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getItemUses(item);
    }

    getItemTypes() {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getItemTypes();
    }

    getWeaponRollModes() {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getWeaponRollModes();
    }

    /**
     * Features
     */
    getFeatures(token,featureType) {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getFeatures(token,featureType);
    }

    getFeatureUses(item) {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getFeatureUses(item);
    }

    getFeatureTypes() {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getFeatureTypes();
    }

    /**
     * Spells
     */
     getSpells(token,level,type) {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getSpells(token,level,type);
    }

    getSpellUses(token,level,item) {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getSpellUses(token,level,item);
    }

    rollItem(item, settings, rollOption, attackMode, token) {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.rollItem(item, settings, rollOption, attackMode, token);
    }

    getSpellLevels() {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getSpellLevels();
    }

    getSpellTypes() {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getSpellTypes();
    }

    /**
     * Ring Colors
     */
     getSkillRingColor(token,skill) {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getSkillRingColor(token,skill);
    }
    getSaveRingColor(token,save) {
        if (!this.checkIfSystemLoaded()) return;
        return this.system.getSaveRingColor(token,save);
    }

    getAttackModes(){
        if (!this.checkIfSystemLoaded()) return;
        return;
    }
}