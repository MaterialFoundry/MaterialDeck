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

    rollItem(item) {
        return game.wfrp4e.utility.rollItemMacro(item.name, item.type, false);
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
    
    getItems(token,itemType) {

        if (itemType == undefined) itemType = 'any';
        const allItems = token.actor.items;
        console.log("allitems: "+ allItems);
        if (itemType == 'any') return allItems.filter(i => i.type == itemType);
    }  */

    getItems(token,itemType) {
        if (itemType == undefined) itemType = 'any';
        const allItems = token.actor.items;
        if (itemType == 'any') return allItems.filter(i => i.type == 'weapon' || 
        i.type == 'ammunition' || 
        i.type == 'armour' || 
        i.type == 'trapping');
        else {
            return allItems.filter(i => i.type == itemType);
        }
    }


    getItemUses(item) {
        console.log("getItemUses(" , item , ")")
        if ( item.type == 'ammunition') {
            return {available: item.data.data.quantity.value};
        }
        else {
            return;
        }
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