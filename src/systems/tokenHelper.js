import { dnd5e } from "./dnd5e.js";
import { dnd35e } from "./dnd35e.js";
import { pf2e } from "./pf2e.js";
import { demonlord } from "./demonlord.js";
import { wfrp4e } from "./wfrp4e.js";
import { forbiddenlands } from "./forbidden-lands.js";
import { starfinder } from "./starfinder.js";
import { compatibleCore } from "../misc.js";
import { gamingSystem } from "../../MaterialDeck.js";

export class TokenHelper{
    constructor(){
        this.system;
        this.setSystem();
    }

    setSystem() {
        if (gamingSystem == 'D35E' || gamingSystem == 'pf1') this.system = new dnd35e(gamingSystem);
        else if (gamingSystem == 'pf2e') this.system = new pf2e();
        else if (gamingSystem == 'demonlord') this.system = new demonlord();
        else if (gamingSystem == 'wfrp4e') this.system = new wfrp4e();
        else if (gamingSystem == 'forbidden-lands') this.system = new forbiddenlands();
        else if (gamingSystem == 'sfrpg') this.system = new starfinder();
        else this.system = new dnd5e();     //default to dnd5e
    }

    /***********************************************************************
     * System agnostic functions
     ***********************************************************************/
    getToken(type,identifier) {
        if (type == 'selected') return this.getSelectedToken();
        else if (type != 'selected' && identifier == '') return;
        else if (type == 'tokenName') return this.getTokenFromTokenName(identifier);
        else if (type == 'actorName') return this.getTokenFromActorName(identifier);
        else if (type == 'tokenId') return this.getTokenFromTokenId(identifier);
        else if (type == 'actorId') return this.getTokenFromActorId(identifier);
    }
    getTokenFromTokenId(id) {
        return canvas.tokens.get(id);
    }

    getTokenFromTokenName(name) {
        return canvas.tokens.children[0].children.find(p => p.name == name);
    }

    getTokenFromActorId(id) {
        return canvas.tokens.children[0].children.find(p => p.actor.id == id);
    }

    getTokenFromActorName(name) {
        return canvas.tokens.children[0].children.find(p => p.actor.name == name);
    }

    getSelectedToken() {
        return canvas.tokens.controlled[0];
    }

    moveToken(token,dir){
        if (dir == undefined) dir = 'up';
        const gridSize = canvas.scene.grid.size;
        let x = token.x;
        let y = token.y;

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
        else if (dir == 'center') {
            let location = token.getCenter(x,y); 
            canvas.animatePan(location);
        }
        if (game.user.isGM == false && game.paused) return;
        if (game.user.isGM == false && (token.can(game.user,"control") == false || token.checkCollision(token.getCenter(x, y)))) return;
        let coords = canvas.grid.getCenter(x,y);
        coords[0] -= canvas.grid.size/2;
        coords[1] -= canvas.grid.size/2;
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
        return token.document.texture.src;
    }

    getActorIcon(token) {
        return token.actor.img;
    }

    /***********************************************************************
     * System specific functions
     ***********************************************************************/

    getStatsList() {
        return this.system.getStatsList();
    }

    getAttackModes() {
        return this.system.getAttackModes();
    }

    getOnClickList() {
        return this.system.getOnClickList();
    }

    getHP(token) {
        return this.system.getHP(token);
    }

    getTempHP(token) {
        return this.system.getTempHP(token);
    }

    getAC(token) {
        return this.system.getAC(token);
    }

    getShieldHP(token) {
        return this.system.getShieldHP(token);
    }

    getSpeed(token) {
        return this.system.getSpeed(token);
    }

    getInitiative(token) {
        return this.system.getInitiative(token);
    }

    toggleInitiative(token) {
        return this.system.toggleInitiative(token);
    }

    getPassivePerception(token) {
        return this.system.getPassivePerception(token);
    }

    getPassiveInvestigation(token) {
        return this.system.getPassiveInvestigation(token);
    }

    getAbility(token, ability) {
        return this.system.getAbility(token, ability);
    }

    getAbilityModifier(token, ability) {
        return this.system.getAbilityModifier(token, ability);
    }

    getAbilitySave(token, ability) {
        return this.system.getAbilitySave(token, ability);
    }

    getAbilityList() {
        return this.system.getAbilityList();
    }

    getSavesList() {
        return this.system.getSavesList();
    }

    getSkill(token, skill) {
        return this.system.getSkill(token, skill);
    }

    getSkillList() {
        return this.system.getSkillList();
    }

    getProficiency(token) {
        return this.system.getProficiency(token);
    }

    /* WFRP 4E */
    getFate(token) {
        return this.system.getFate(token)
    }

    /* WFRP 4E */
    getFortune(token) {
        return this.system.getFortune(token)
    }
    
    /* WFRP 4E */
    getCriticalWounds(token) {
        return this.system.getCriticalWounds(token)
    }

    /* WFRP 4E */
    getCorruption(token) {
        return this.system.getCorruption(token)
    }

    /* WFRP 4E */
    getAdvantage(token) {
        return this.system.getAdvantage(token)
    }

    /* WFRP 4E */
    getResolve(token) {
        return this.system.getResolve(token)
    }

    /* WFRP 4E */
    getResilience(token) {
        return this.system.getResilience(token)
    }

    /* PF2E */
    getPerception(token) {
        return this.system.getPerception(token)
    }

    /* forbidden-lands */
    getAgility(token) {
        return this.system.getAgility(token)
    }    

    /* forbidden-lands */
    getWits(token) {
        return this.system.getWits(token)
    }

    /* forbidden-lands */
    getEmpathy(token) {
        return this.system.getEmpathy(token)
    }
     /* forbidden-lands */
    getWillPower(token) {
        return this.system.getWillPower(token)
    }

    /* starfinder */
    getStamina(token) {
        return this.system.getStamina(token);
    }

    /* starfinder */
    getKinAC(token) {
        return this.system.getKinAC(token);
    }
    

    /**
     * Conditions
     */
    getConditionIcon(condition) {
        return this.system.getConditionIcon(condition);
    }

    getConditionActive(token,condition) {
        return this.system.getConditionActive(token,condition);
    }

    toggleCondition(token,condition) {
        return this.system.toggleCondition(token,condition);
    }

    getConditionList() {
        return this.system.getConditionList();
    }

    /* PF2E */
    getConditionValue(token,condition) {
        return this.system.getConditionValue(token,condition);
    }

    /* PF2E */
    modifyConditionValue(token,condition,delta) {
        return this.system.modifyConditionValue(token,condition,delta);
    }

    /**
     * Roll
     */
     roll(token,roll,options,ability,skill,save) {
        return this.system.roll(token,roll,options,ability,skill,save);
    }

    getRollTypes() {
        return this.system.getRollTypes();
    }

    /**
     * Items
     */
    getItems(token,itemType) {
        return this.system.getItems(token,itemType);
    }

    getItemUses(item) {
        return this.system.getItemUses(item);
    }

    getItemTypes() {
        return this.system.getItemTypes();
    }

    getWeaponRollModes() {
        return this.system.getWeaponRollModes();
    }

    /**
     * Features
     */
    getFeatures(token,featureType) {
        return this.system.getFeatures(token,featureType);
    }

    getFeatureUses(item) {
        return this.system.getFeatureUses(item);
    }

    getFeatureTypes() {
        return this.system.getFeatureTypes();
    }

    /**
     * Spells
     */
     getSpells(token,level,type) {
        return this.system.getSpells(token,level,type);
    }

    getSpellUses(token,level,item) {
        return this.system.getSpellUses(token,level,item);
    }

    rollItem(item, settings, rollOption, attackMode) {
        return this.system.rollItem(item, settings, rollOption, attackMode);
    }

    getSpellLevels() {
        return this.system.getSpellLevels();
    }

    getSpellTypes() {
        return this.system.getSpellTypes();
    }

    /**
     * Ring Colors
     */
     getSkillRingColor(token,skill) {
        return this.system.getSkillRingColor(token,skill);
    }
    getSaveRingColor(token,save) {
        return this.system.getSaveRingColor(token,save);
    }
}