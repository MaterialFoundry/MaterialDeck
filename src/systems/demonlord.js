import {compatibleCore} from "../misc.js";

export class demonlord{
    constructor(){
        
    }

    getHP(token) {
        const hp = token.actor.data.data.characteristics.health;
        return {
            value: hp.value,
            max: hp.max
        }
    }

    getTempHP(token) {
        return;
    }

    getAC(token) {
        return token.actor.data.data.characteristics.defense;
    }

    getShieldHP(token) {
        return;
    }

    getSpeed(token) {
        return token.actor.data.data.characteristics.speed;
    }

    getInitiative(token) {
        return token.actor.data.data.fastturn ? "FAST" : "SLOW";
    }

    toggleInitiative(token) {
        token.actor.update({
            'data.fastturn': !token.actor.data?.data?.fastturn
        });
        return;
    }

    getPassivePerception(token) {
        return;
    }

    getPassiveInvestigation(token) {
        return;
    }

    getAbility(token, ability) {
        if (ability == undefined) ability = 'strength';
        return token.actor.data.data.attributes?.[ability].value;
    } 

    getAbilityModifier(token, ability) {
        if (ability == undefined) ability = 'str';
        let val = token.actor.data.data.attributes?.[ability].modifier;
        return (val >= 0) ? `+${val}` : val;
    }

    getAbilitySave(token, ability) {
        return;
    }

    getSkill(token, skill) {
        if (skill == undefined) skill = 'acr';
        const val = token.actor.data.data.skills?.[skill].total;
        return (val >= 0) ? `+${val}` : val;
    }

    getProficiency(token) {
        return;
    }

    getConditionIcon(condition) {
        if (condition == undefined) condition = 'removeAll';
        if (condition == 'removeAll') return window.CONFIG.controlIcons.effects;
        else return CONFIG.statusEffects.find(e => e.id === condition).icon;
    }

    getConditionActive(token,condition) {
        if (condition == undefined) condition = 'removeAll';
        return token.actor.effects.find(e => e.isTemporary === condition) != undefined;
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
        if (level == undefined) level = 'any';
        const allItems = token.actor.items;
        if (level == 'any') return allItems.filter(i => i.type == 'spell')
        else return allItems.filter(i => i.type == 'spell' && i.data.data.rank == level)
    }

    getSpellUses(token,level,item) {
        return;
    }

    rollItem(item) {
        return item.roll()
    }
}