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
        let speed = `${token.actor.data.data.attributes.speed.total}'`;
        const otherSpeeds = token.actor.data.data.attributes.speed.otherSpeeds;
        if (otherSpeeds.length > 0)
            for (let os of otherSpeeds) 
                 speed += `\n${os.type} ${os.total}'`;    
        return speed;
    }

    getInitiative(token) {
        let initiativeModifier = token.actor.data.data.attributes?.initiative.totalModifier;
        let initiativeAbility = token.actor.data.data.attributes?.initiative.ability;
        if (initiativeModifier > 0) {
            initiativeModifier = `+${initiativeModifier}`;
        } else {
            initiativeModifier = this.getPerception(token); //NPCs won't have a valid Initiative value, so default to use Perception
        } 
        return (initiativeAbility != '') ? `(${initiativeAbility}): ${initiativeModifier}` : `(perception): ${initiativeModifier}`;
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

    getPerception(token) {
        let perception = token.actor.data.data.attributes?.perception.totalModifier;
        return (perception >= 0) ? `+${perception}` : perception;
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
        if (skill.startsWith('lor')) {
            const index = parseInt(skill.split('_')[1])-1;
            const loreSkills = this.getLoreSkills(token);
            if (loreSkills.length > index) {
                return `${loreSkills[index].name}: +${loreSkills[index].totalModifier}`;
            } else {
                return '';
            }
        }
        const val = token.actor.data.data.skills?.[skill].totalModifier;
        return (val >= 0) ? `+${val}` : val;
    }

    getLoreSkills(token) {
        const skills = token.actor.data.data.skills;
        return Object.keys(skills).map(key => skills[key]).filter(s => s.lore == true);
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
                newCondition.data.sources.hud = !0,
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
        if (roll == undefined) roll = 'skill';
        if (ability == undefined) ability = 'str';
        if (skill == undefined) skill = 'acr';
        if (save == undefined) save = 'fort';
        if (roll == 'perception') token.actor.data.data.attributes.perception.roll(options);
        if (roll == 'initiative') token.actor.rollInitiative(options);
        if (roll == 'ability') token.actor.rollAbility(options, ability);
        else if (roll == 'save') {
            let ability = save;
            if (ability == 'fort') ability = 'fortitude';
            else if (ability == 'ref') ability = 'reflex';
            else if (ability == 'will') ability = 'will';
            token.actor.rollSave(options, ability);
        }
        else if (roll == 'skill') {
            if (skill.startsWith('lor')) {
                const index = parseInt(skill.split('_')[1])-1;
                const loreSkills = this.getLoreSkills(token);
                if (loreSkills.length > index) {
                    let loreSkill = loreSkills[index];
                    skill = loreSkill.shortform == undefined? loreSkills[index].expanded : loreSkills[index].shortform;
                } else {
                    return;
                }
            }  
            token.actor.data.data.skills?.[skill].roll(options);
        }
    }

    /**
     * Items
     */
    getItems(token,itemType) {
        if (itemType == undefined) itemType = 'any';
        const allItems = token.actor.items;
        if (itemType == 'any') return allItems.filter(i => i.type == 'weapon' || i.type == 'equipment' || i.type == 'consumable' || i.type == 'loot' || i.type == 'container');
        if (itemType == 'weapon') return allItems.filter(i => i.type == 'weapon' || i.type == 'melee')  //Include melee actions for NPCs without equipment
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
        const allItems = token.actor.items;
        if (featureType == 'any') return allItems.filter(i => i.type == 'ancestry' || i.type == 'background' || i.type == 'class' || i.type == 'feat' || i.type == 'action');
        if (featureType == 'action-any') return allItems.filter(i => i.type == 'action');
        if (featureType == 'action-def') return allItems.filter(i => i.type == 'action' && i.data.data.actionCategory?.value == 'defensive');
        if (featureType == 'action-int') return allItems.filter(i => i.type == 'action' && i.data.data.actionCategory?.value == 'interaction');
        if (featureType == 'action-off') return allItems.filter(i => i.type == 'action' && i.data.data.actionCategory?.value == 'offensive');
        if (featureType == 'strike') { //Strikes are not in the actor.items collection
            let actions = token.actor.data.data.actions.filter(a=>a.type == 'strike');
            for (let a of actions) {
                a.img = a.imageUrl;
                a.data = {
                    sort: 1
                };
            }
            return actions;
        }
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
        if (level == '0') return allItems.filter(i => i.type == 'spell' && i.isCantrip == true)
        else return allItems.filter(i => i.type == 'spell' && i.level == level && i.isCantrip == false)
    }

    getSpellUses(token,level,item) {
        if (level == undefined || level == 'any') level = item.level;
        if (item.isCantrip == true) return;
        const spellbook = token.actor.items.filter(i => i.data.type === 'spellcastingEntry')[0];
        if (spellbook == undefined) return;
        return {
            available: spellbook.data.data.slots?.[`slot${level}`].value,
            maximum: spellbook.data.data.slots?.[`slot${level}`].max
        }
    }

    rollItem(item) {
        let variant = 0;
        if (otherControls.rollOption == 'map1') variant = 1;
        if (otherControls.rollOption == 'map2') variant = 2;
        if (item.type==='strike') return item.variants[variant].roll({event});
        if (item.type==='weapon' || item.type==='melee') return item.parent.data.data.actions.find(a=>a.name===item.name).variants[variant].roll({event});
        return game.pf2e.rollItemMacro(item.id);
    }
}