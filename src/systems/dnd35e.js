import {compatibleCore} from "../misc.js";

export class dnd35e{
    constructor(){
        
    }

    getHP(token) {
        const hp = token.actor.data.data.attributes.hp;
        return {
            value: hp.value,
            max: hp.max
        }
    }

    getTempHP(token) {
        const hp = token.actor.data.data.attributes.hp;
        return {
            value: (hp.temp == null) ? 0 : hp.temp,
            max: (hp.tempmax == null) ? 0 : hp.tempmax
        }
    }

    getAC(token) {
        return token.actor.data.data.attributes.ac.normal.total;
    }

    getShieldHP(token) {
        return;
    }

    getSpeed(token) {
        const movement = token.actor.data.data.attributes.speed;
        let speed = "";
        if (movement.burrow.total > 0) speed += `Burrow: ${movement.burrow.total}Ft`;
        if (movement.climb.total > 0) {
            if (speed.length > 0) speed += '\n';
            speed += `Climb: ${movement.climb.total}Ft`;
        }
        if (movement.fly.total > 0) {
            if (speed.length > 0) speed += '\n';
            speed += `Fly: ${movement.fly.total}Ft`;
        }
        if (movement.land.total > 0) {
            if (speed.length > 0) speed += '\n';
            speed += `Land: ${movement.land.total}Ft`;
        }
        if (movement.swim.total > 0) {
            if (speed.length > 0) speed += '\n';
            speed += `Swim: ${movement.swim.total}Ft`;
        }
        return speed;
    }

    getInitiative(token) {
        let initiative = token.actor.data.data.attributes.init.total;
        return (initiative >= 0) ? `+${initiative}` : initiative;
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
        if (ability == undefined) ability = 'str';
        return token.actor.data.data.abilities?.[ability].value;
    } 

    getAbilityModifier(token, ability) {
        if (ability == undefined) ability = 'str';
        let val = token.actor.data.data.abilities?.[ability].mod;
        return (val >= 0) ? `+${val}` : val;
    }

    getAbilitySave(token, ability) {
        if (ability == undefined) ability = 'fort';
        let val = token.actor.data.data.attributes.savingThrows?.[ability].total;
        return (val >= 0) ? `+${val}` : val;
    }

    getSkill(token, skill) {
        if (skill == undefined) skill = 'apr';
        const val = token.actor.data.data.skills?.[skill].mod;
        return (val >= 0) ? `+${val}` : val;
    }

    getProficiency(token) {
        const val = token.actor.data.data.attributes.prof;
        return (val >= 0) ? `+${val}` : val;
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
        if (roll == undefined) roll = 'ability';
        if (ability == undefined) ability = 'str';
        if (skill == undefined) skill = 'apr';
        if (save == undefined) save = 'fort';

        if (roll == 'ability') token.actor.rollAbilityTest(ability,options);
        else if (roll == 'save') token.actor.rollSavingThrow(save, null, null,options);
        else if (roll == 'skill') token.actor.rollSkill(skill,options);
        else if (roll == 'initiative') token.actor.rollInitiative(options);
        else if (roll == 'grapple') token.actor.rollGrapple(options);
        else if (roll == 'bab') token.actor.rollBAB(options);
        else if (roll == 'melee') token.actor.rollMelee(options);
        else if (roll == 'ranged') token.actor.rollRanged(options);
    }

    /**
     * Items
     */
    getItems(token,itemType) {
        if (itemType == undefined) itemType = 'any';
        const allItems = token.actor.items;
        if (itemType == 'any') return allItems.filter(i => i.type == 'weapon' || i.type == 'equipment' || i.type == 'consumable' || i.type == 'loot' || i.type == 'container');
        else if (game.system.id == 'D35E' && itemType == 'container') return allItems.filter(i => i.type == 'loot' && i.data.data.subType == itemType);
        else {
            if (itemType == 'gear' || itemType == 'ammo' || itemType == 'misc' || itemType == 'tradeGoods') 
                return allItems.filter(i => i.type == 'loot' && i.data.data.subType == itemType);
            else return allItems.filter(i => i.type == itemType);
        }
    }

    getItemUses(item) {
        return {available: item.data.data.quantity};
    }

    /**
     * Features
     */
     getFeatures(token,featureType) {
        if (featureType == undefined) featureType = 'any';
        const allItems = token.actor.items;
        if (featureType == 'any') return allItems.filter(i => i.type == 'class' || i.type == 'feat')
        else return allItems.filter(i => i.type == featureType)
    }

    getFeatureUses(item) {
        if (item.data.type == 'class') return {available: item.data.data.levels};
        else return {
            available: item.data.data.uses.value, 
            maximum: item.data.data.uses.max
        };
    }

    /**
     * Spells
     */
     getSpells(token,level) {
        if (level == undefined) level = 'any';
        const allItems = token.actor.items;
        if (level == 'any') return allItems.filter(i => i.type == 'spell')
        else return allItems.filter(i => i.type == 'spell' && i.data.data.level == level)
    }

    getSpellUses(token,level,item) {
        if (level == undefined) level = 'any';
        if (item.data.data.level == 0) return;
        return {
            available: item.charges, 
            maximum: item.maxCharges
        }
    }

    rollItem(item) {
        return item.roll()
    }
}