import { compatibleCore } from "../misc.js";

export class demonlord{
    constructor(){
        console.log("Material Deck: Using system 'Shadow of the Demon Lord'");
    }

    getActorData(token) {
        return compatibleCore('10.0') ? token.actor.system : token.actor.data.data;
    }

    getItemData(item) {
        return compatibleCore('10.0') ? item.system : item.data.data;
    }

    getHP(token) {
        const hp = this.getActorData(token).characteristics.health;
        return {
            value: hp.value,
            max: hp.max
        }
    }

    getTempHP(token) {
        return;
    }

    getAC(token) {
        return this.getActorData(token).characteristics.defense;
    }

    getShieldHP(token) {
        return;
    }

    getSpeed(token) {
        return this.getActorData(token).characteristics.speed;
    }

    getInitiative(token) {
        return this.getActorData(token).fastturn ? "FAST" : "SLOW";
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
        return this.getActorData(token).attributes?.[ability].value;
    } 

    getAbilityModifier(token, ability) {
        if (ability == undefined) ability = 'str';
        let val = this.getActorData(token).attributes?.[ability].modifier;
        return (val >= 0) ? `+${val}` : val;
    }

    getAbilitySave(token, ability) {
        return;
    }

    getSkill(token, skill) {
        if (skill == undefined) skill = 'acr';
        const val = this.getActorData(token).skills?.[skill].total;
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
        return {available: getItemData(item).quantity};
    }

    /**
     * Spells
     */
     getSpells(token,level) {
        if (level == undefined) level = 'any';
        const allItems = token.actor.items;
        if (level == 'any') return allItems.filter(i => i.type == 'spell')
        else return allItems.filter(i => i.type == 'spell' && getItemData(i).rank == level)
    }

    getSpellUses(token,level,item) {
        return;
    }

    rollItem(item) {
        return item.roll()
    }

    /**
     * Ring Colors
     */
    getSkillRingColor(token, skill) {
        return;
    }

    getSaveRingColor(token, save) {
        return;        
    }
}