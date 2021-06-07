import {compatibleCore} from "../misc.js";

export class dnd5e{
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
        return token.actor.data.data.attributes.ac.value;
    }

    getShieldHP(token) {
        return;
    }

    getSpeed(token) {
        const movement = token.actor.data.data.attributes.movement;
        let speed = "";
        if (movement != undefined){
            if (movement.burrow > 0) speed += `${game.i18n.localize("DND5E.MovementBurrow")}: ${movement.burrow + movement.units}`;
            if (movement.climb > 0) {
                if (speed.length > 0) speed += '\n';
                speed += `${game.i18n.localize("DND5E.MovementClimb")}: ${movement.climb + movement.units}`;
            }
            if (movement.fly > 0) {
                if (speed.length > 0) speed += '\n';
                speed += `${game.i18n.localize("DND5E.MovementFly")}: ${movement.fly + movement.units}`;
            }
            if (movement.hover > 0) {
                if (speed.length > 0) speed += '\n';
                speed += `${game.i18n.localize("DND5E.MovementHover")}: ${movement.hover + movement.units}`;
            }
            if (movement.swim > 0) {
                if (speed.length > 0) speed += '\n';
                speed += `${game.i18n.localize("DND5E.MovementSwim")}: ${movement.swim + movement.units}`;
            }
            if (movement.walk > 0) {
                if (speed.length > 0) speed += '\n';
                speed += `${game.i18n.localize("DND5E.MovementWalk")}: ${movement.walk + movement.units}`;
            }
        }
        else {
            const spd = token.actor.data.data.attributes.speed;
            speed = spd.value;
            if (spd.special.length > 0) speed + "\n" + spd.special;
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
        return token.actor.data.data.skills.prc.passive;
    }

    getPassiveInvestigation(token) {
        return token.actor.data.data.skills.inv.passive;
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
        if (ability == undefined) ability = 'str';
        let val = token.actor.data.data.abilities?.[ability].save;
        return (val >= 0) ? `+${val}` : val;
    }

    getSkill(token, skill) {
        if (skill == undefined) skill = 'acr';
        const val = token.actor.data.data.skills?.[skill].total;
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
        if (skill == undefined) skill = 'acr';
        if (save == undefined) save = 'str';

        if (roll == 'ability') token.actor.rollAbilityTest(ability,options);
        else if (roll == 'save') token.actor.rollAbilitySave(save,options);
        else if (roll == 'skill') token.actor.rollSkill(skill,options);
        else if (roll == 'initiative') token.actor.rollInitiative(options);
        else if (roll == 'deathSave') token.actor.rollDeathSave(options);
    }

    /**
     * Items
     */
    getItems(token,itemType) {
        if (itemType == undefined) itemType = 'any';
        const allItems = token.actor.items;
        if (itemType == 'any') return allItems.filter(i => i.type == 'weapon' || i.type == 'equipment' || i.type == 'consumable' || i.type == 'loot' || i.type == 'container');
        else return allItems.filter(i => i.type == itemType);
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
            available: token.actor.data.data.spells?.[`spell${level}`].value,
            maximum: token.actor.data.data.spells?.[`spell${level}`].max
        }
    }

    rollItem(item) {
        return item.roll()
    }
}