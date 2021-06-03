import {compatibleCore} from "../misc.js";

export class wfrp4e {
    constructor(){
        
    }

    getFate(token) {
        return token.actor.data.data.status.fate.value
    }

    getWounds(token) {
        const wounds =  token.actor.data.data.status.wounds
        return {
            value: wounds.value,
            max: wounds.max
        } 
        
    }

    getHP(token) {
        return this.getWounds(token);
    }

    getTempHP(token) {
        return;
    }

    getAC(token) {
        return;
    }

    getShieldHP(token) {
        return;
    }

    getSpeed(token) {
        return token.actor.data.data.details.move.value;
    }

    getInitiative(token) {
        return;
    }

    toggleInitiative(token) {
        return;
    }

    getPassivePerception(token) {
        return;
    }

    getPassiveInvestigation(token) {
        return;
    }

    getAbility(token, ability) {
        return;
    } 

    getAbilityModifier(token, ability) {
        return;
    }

    getAbilitySave(token, ability) {
        return;
    }

    getSkill(token, skill) {
        return;
    }

    getProficiency(token) {
        return;
    }

    getConditionIcon(condition) {
        return;
    }

    getConditionActive(token,condition) {
        return;
    }

    async toggleCondition(token,condition) {
        if (condition == undefined) condition = 'removeAll';
        if (condition == 'removeAll'){
            for( let effect of token.actor.effects)
                await effect.delete();
        }
        else {
            const effect = CONFIG.statusEffects.find(e => e.id === condition);
            await token.toggleEffect(effect);
        }
        return true;
    }

    /**
     * Roll
     */
     roll(token,roll,options,ability,skill,save) {
        return;
    }

    /**
     * Items
     */
    getItems(token,itemType) {
        if (itemType == undefined) itemType = 'any';
        const allItems = token.actor.items;
        if (itemType == 'any') return allItems.filter(i => i.type == 'item');
    }

    getItemUses(item) {
        return {available: item.data.data.quantity};
    }

    /**
     * Spells
     */
     getSpells(token,level) {
        return;
    }

    getSpellUses(token,level,item) {
        return;
    }
}