import {compatibleCore} from "../misc.js";
import {otherControls} from "../../MaterialDeck.js";

export class pf2e{
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
        return token.actor.data.data.attributes.shield.value;
    }

    getSpeed(token) {
        let speed = token.actor.data.data.attributes.speed.breakdown;
        const otherSpeeds = token.actor.data.data.attributes.speed.otherSpeeds;
        if (otherSpeeds.length > 0)
            for (let i=0; i<otherSpeeds.length; i++)
                speed += `\n${otherSpeeds[i].type}: ${otherSpeeds[i].value}`;    
        return speed;
    }

    getInitiative(token) {
        let initiative = token.actor.data.data.attributes.init.value;
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
        if (ability == undefined) ability = 'fortitude';
        else if (ability == 'fort') ability = 'fortitude';
        else if (ability == 'ref') ability = 'reflex';
        else if (ability == 'will') ability = 'will';
        let val = token.actor.data.data.saves?.[ability].value;
        return (val >= 0) ? `+${val}` : val;
    }

    getSkill(token, skill) {
        if (skill == undefined) skill = 'acr';
        const val = token.actor.data.data.skills?.[skill].totalModifier;
        return (val >= 0) ? `+${val}` : val;
    }

    getProficiency(token) {
        return;
    }

    getCondition(token,condition) {
        if (condition == undefined || condition == 'removeAll') return undefined;
        const Condition = condition.charAt(0).toUpperCase() + condition.slice(1);
        const effects = token.actor.items.filter(i => i.type == 'condition');
        return effects.find(e => e.name === Condition);
    }

    getConditionIcon(condition) {
        if (condition == undefined) condition = 'removeAll';
        if (condition == 'removeAll') return window.CONFIG.controlIcons.effects;
        else return `${CONFIG.PF2E.statusEffects.effectsIconFolder}${condition}.webp`;
    }

    getConditionActive(token,condition) {
        return this.getCondition(token,condition) != undefined;
    }

    getConditionValue(token,condition) {
        const effect = this.getCondition(token, condition);
        if (effect != undefined && effect?.value != null) return effect;
    }

    async modifyConditionValue(token,condition,delta) {
        if (condition == undefined) condition = 'removeAll';
        if (condition == 'removeAll'){
            for( let effect of token.actor.items.filter(i => i.type == 'condition'))
                await effect.delete();
        } else {
            const effect = this.getConditionValue(token,condition);
            if (effect == undefined) {
                if (delta > 0) {
                    const Condition = condition.charAt(0).toUpperCase() + condition.slice(1);
                    const newCondition = game.pf2e.ConditionManager.getCondition(Condition);
                    await game.pf2e.ConditionManager.addConditionToToken(newCondition, token);
                }
            } else {
                try {
                    await game.pf2e.ConditionManager.updateConditionValue(effect.id, token, effect.value+delta);                                
                } catch (error) {
                    //Do nothing. updateConditionValue will have an error about 'documentData is not iterable' when called from an NPC token. 
                }
            }
        }
        return true;
    }

    async toggleCondition(token,condition) {
        if (condition == undefined) condition = 'removeAll';
        if (condition == 'removeAll'){
            for( let effect of token.actor.items.filter(i => i.type == 'condition'))
                await effect.delete();
        }
        else {
            const effect = this.getCondition(token,condition);
            if (effect == undefined) {
                const Condition = condition.charAt(0).toUpperCase() + condition.slice(1);
                const newCondition = game.pf2e.ConditionManager.getCondition(Condition);
                // newCondition.data.sources.hud = !0,
                await game.pf2e.ConditionManager.addConditionToToken(newCondition, token);
            }
            else {
                effect.delete();
            }
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
        if (save == undefined) save = 'fort';

        if (roll == 'ability') token.actor.data.data.abilities?.[ability].roll(options);
        else if (roll == 'save') {
            let ability = save;
            if (ability == 'fort') ability = 'fortitude';
            else if (ability == 'ref') ability = 'reflex';
            else if (ability == 'will') ability = 'will';
            token.actor.data.data.saves?.[ability].roll(options);
        }
        else if (roll == 'skill') token.actor.data.data.skills?.[skill].roll(options);
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
        return {available: item.data.data.quantity.value};
    }
    
    /**
     * Features
     */
     getFeatures(token,featureType) {
        if (featureType == undefined) featureType = 'any';
        if (featureType == 'action') return this.getActions(token);
        const allItems = token.actor.items;
        if (featureType == 'any') return allItems.filter(i => i.type == 'class' || i.type == 'feat')
        else return allItems.filter(i => i.type == featureType)
    }

    getFeatureUses(item) {
        if (item.data.type == 'class') return {available: item.actor.data.data.details.level.value};
        else return;
    }

    /**
     * Spells
     */
    getSpells(token,level) {
        if (level == undefined) level = 'any';
        const allItems = token.actor.items;
        if (level == 'any') return allItems.filter(i => i.type == 'spell')
        else return allItems.filter(i => i.type == 'spell' && i.data.data.level.value == level)
    }

    getSpellUses(token,level,item) {
        if (level == undefined) level = 'any';
        if (item.data.data.level.value == 0) return;
        const spellbook = token.actor.items.filter(i => i.data.type === 'spellcastingEntry')[0];
        if (spellbook == undefined) return;
        return {
            available: spellbook.data.data.slots?.[`slot${level}`].value,
            maximum: spellbook.data.data.slots?.[`slot${level}`].max
        }
    }

    /**
     * Actions
     */
    getActions(token) {
        const allActions = token.actor.data.data.actions;
        return allActions.filter(a=>a.type==='strike');
    }

    rollItem(item) {
        let variant = 0;
        if (otherControls.rollOption == 'map1') variant = 1;
        if (otherControls.rollOption == 'map2') variant = 2;
        if(item.type==='strike') return item.variants[variant].roll({event});
        if(item.type==='weapon') return item.parent.data.data.actions.find(a=>a.name===item.name).variants[variant].roll({event});
        return item.roll()
    }
}