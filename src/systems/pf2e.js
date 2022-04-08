import {compatibleCore} from "../misc.js";
import {otherControls} from "../../MaterialDeck.js";

const limitedSheets = ['loot', 'vehicle'];
const proficiencyColors = 
{
    untrained: "#424242",
    trained: "#171F69",
    expert: "#3C005E",
    master: "#664400",
    legendary: "#5E0000"
};

export class pf2e{

    constructor(){
        
    }

    getHP(token) {
        const hp = token.actor.attributes?.hp;
        return {
            value: (hp?.value == null) ? 0 : hp.value,
            max: (hp?.max == null) ? 0 : hp.max
        }
    }

    getTempHP(token) {
        const hp = token.actor.attributes?.hp;
        return {
            value: (hp?.temp == null) ? 0 : hp.temp,
            max: (hp?.tempmax == null) ? 0 : hp.tempmax
        }
    }

    getAC(token) {
        const ac = token.actor.attributes?.ac;
        return (ac?.value == null) ? 10 : ac?.value;
    }

    getShieldHP(token) {
        const shieldhp = token.actor.attributes.shield
        return (shieldhp?.value == null) ? 0 : shieldhp?.value;
    }

    getSpeed(token) {
        if (this.isLimitedSheet(token.actor) || token.actor.type == 'hazard') {
            if (token.actor.type == 'vehicle') {
                return token.actor.data.data.details.speed;
            } else return '';
        }
        let speed = `${token.actor.attributes.speed?.total}'`;
        const otherSpeeds = token.actor.attributes.speed?.otherSpeeds;
        if (otherSpeeds.length > 0)
            for (let os of otherSpeeds) 
                 speed += `\n${os.type} ${os.total}'`;    
        return speed;
    }

    getInitiative(token) {
        if (this.isLimitedSheet(token.actor) || token.actor.type == 'familiar') return '';
        if (token.actor.type == 'hazard') {
            let initiative = token.actor.attributes?.stealth?.value;
            return `Init: Stealth (${initiative})`; 
        }
        let initiative = token.actor.attributes.initiative;
        let initiativeModifier = initiative?.totalModifier;
        let initiativeLabel = initiative?.label.replace('iative',''); //Initiative is too long for the button
        if (initiativeModifier > 0) {
            initiativeModifier = `+${initiativeModifier}`;
        } else {
            initiativeModifier = this.getPerception(token); //NPCs won't have a valid Initiative value, so default to use Perception
        } 
        return `${initiativeLabel} (${initiativeModifier})`;
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
        if (this.isLimitedSheet(token.actor) || token.actor.type == 'hazard') return '';
        let perception = token.actor.attributes.perception?.totalModifier;
        return (perception >= 0) ? `+${perception}` : perception;
    }

    getAbility(token, ability) {
        if (this.isLimitedSheet(token.actor) || token.actor.type == 'familiar') return '';
        if (ability == undefined) ability = 'str';
        return token.actor.abilities?.[ability]?.value;
    } 

    getAbilityModifier(token, ability) {
        if (this.isLimitedSheet(token.actor) || token.actor.type == 'hazard' || token.actor.type == 'familiar') return '';
        if (ability == undefined) ability = 'str';
        let val = token.actor.abilities?.[ability]?.mod;
        return (val >= 0) ? `+${val}` : val;
    }

    getAbilitySave(token, ability) {
        ability = this.fixSave(ability);
        const save = this.findSave(token, ability);
        if (save == undefined) return '';
        let val = save?.value;
        return (val >= 0) ? `+${val}` : val;
    }

    findSave(token, ability) {
        if (this.isLimitedSheet(token.actor)) return;
        return token.actor.data.data.saves?.[ability];
    }

    fixSave(ability) {
        if (ability == undefined) return 'fortitude';
        else if (ability == 'fort') return 'fortitude';
        else if (ability == 'ref') return 'reflex';
        else if (ability == 'will') return 'will';
    }

    getSkill(token, skill) {
        const tokenSkill = this.findSkill(token, skill);
        if (tokenSkill == undefined) return '';
        
        if (skill.startsWith('lor')) {
            return `${tokenSkill.name}: +${tokenSkill.totalModifier}`;
        }

        const val = tokenSkill.totalModifier;
        return (val >= 0) ? `+${val}` : val;
    }

    findSkill(token, skill) {
        if (this.isLimitedSheet(token.actor)) return;
        if (skill == undefined) skill = 'acr';
        if (skill.startsWith('lor')) {
            const index = parseInt(skill.split('_')[1])-1;
            const loreSkills = this.getLoreSkills(token);
            if (loreSkills.length > index) {
                return loreSkills[index];
            } else {
                return;
            }
        }
        return token.actor.data.data.skills?.[skill];
    }

    getLoreSkills(token) {
        if (this.isLimitedSheet(token.actor)) return [];
        const skills = token.actor.data.data.skills;
        return Object.keys(skills).map(key => skills[key]).filter(s => s.lore == true);
    }

    getProficiency(token) {
        return;
    }

    getCondition(token,condition) {
        if (condition == undefined || condition == 'removeAll') return undefined;
        const Condition = this.getConditionName(condition);
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
                    await game.pf2e.ConditionManager.addConditionToToken(condition, token);
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

    getConditionName(condition) {
        if ("flatFooted" == condition) {
            return 'Flat-Footed'; //An inconsistency has been introduced on the PF2E system. The icon is still using 'flatFooted' as the name, but the condition in the manager has been renamed to 'Flat-Footed'
        } else return condition.charAt(0).toUpperCase() + condition.slice(1);
    }

    async toggleCondition(token,condition) {
        if (condition == undefined) condition = 'removeAll';
        if (condition == 'removeAll'){
            for( let existing of token.actor.items.filter(i => i.type == 'condition'))
                await game.pf2e.ConditionManager.removeConditionFromToken(existing.data._id, token);
        }
        else {
            const effect = this.getCondition(token,condition);
            if (effect == undefined) {
                await game.pf2e.ConditionManager.addConditionToToken(condition, token);
            }
            else {
                await game.pf2e.ConditionManager.removeConditionFromToken(effect.data._id, token);
            }
        }
        return true;
    }

    /**
     * Roll
     */
     roll(token,roll,options,ability,skill,save) {
        if (this.isLimitedSheet(token.actor)) return;
        options.skipDialog = true;
        if (roll == undefined) roll = 'skill';
        if (ability == undefined) ability = 'str';
        if (skill == undefined) skill = 'acr';
        if (save == undefined) save = 'fort';
        if (roll == 'perception') {
            this.checkRoll(`Perception Check`, token.actor.perception, 'perception-check', token.actor);
        }
        if (roll == 'initiative') {
            token.actor.rollInitiative({createCombatants:true, initiativeOptions: {skipDialog: true}});
        }
            
        if (roll == 'ability') return; //Ability Checks are not supported in pf2e
        else if (roll == 'save') {
            let ability = save;
            if (ability == 'fort') ability = 'fortitude';
            else if (ability == 'ref') ability = 'reflex';
            else if (ability == 'will') ability = 'will';
            if (token.actor.type == 'hazard' && ability == 'will') return; //Hazards don't have Will saves
            let abilityName = ability.charAt(0).toUpperCase() + ability.slice(1);
            this.checkRoll(`${abilityName} Saving Throw`, token.actor.saves?.[ability], 'saving-throw', token.actor);
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
            let skillName = token.actor.data.data.skills?.[skill].name;
            skillName = skillName.charAt(0).toUpperCase() + skillName.slice(1);
            this.checkRoll(`Skill Check: ${skillName}`, token.actor.skills?.[skill], 'skill-check', token.actor);
        }
    }

    checkRoll(checkLabel,stat,type,actor) {
        let checkModifier = new game.pf2e.CheckModifier(checkLabel, stat);
        game.pf2e.Check.roll(checkModifier, {type:type, actor: actor, skipDialog: true}, null);
    }

    /**
     * Items
     */
    getItems(token,itemType) {
        if (this.isLimitedSheet(token.actor)) return [];
        if (itemType == undefined) itemType = 'any';
        const allItems = token.actor.items;
        if (itemType == 'any') return allItems.filter(i => i.type == 'weapon' || i.type == 'equipment' || i.type == 'consumable' || i.type == 'loot' || i.type == 'container');
        if (itemType == 'weapon') return allItems.filter(i => i.type == 'weapon' || i.type == 'melee')  //Include melee actions for NPCs without equipment
        else return allItems.filter(i => i.type == itemType);
    }

    getItemUses(item) {
        return {available: item.quantity.value};
    }
    
    /**
     * Features
     */
     getFeatures(token,featureType) {
        if (this.isLimitedSheet(token.actor)) return [];
        if (featureType == undefined) featureType = 'any';
        const allItems = token.actor.items;
        if (featureType == 'any') return allItems.filter(i => i.type == 'ancestry' || i.type == 'background' || i.type == 'class' || i.type == 'feat' || i.type == 'action');
        if (featureType == 'action-any') return allItems.filter(i => i.type == 'action');
        if (featureType == 'action-def') return allItems.filter(i => i.type == 'action' && i.data.data.actionCategory?.value == 'defensive');
        if (featureType == 'action-int') return allItems.filter(i => i.type == 'action' && i.data.data.actionCategory?.value == 'interaction');
        if (featureType == 'action-off') return allItems.filter(i => i.type == 'action' && i.data.data.actionCategory?.value == 'offensive');
        if (featureType == 'strike') { //Strikes are not in the actor.items collection
            if (token.actor.type == 'hazard' || token.actor.type == 'familiar') {
                return allItems.filter(i => i.type == 'melee' || i.type == 'ranged');
            }
            let actions = token.actor.data.data.actions?.filter(a=>a.type == 'strike');
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
        if (item.data.type == 'class') return {available: item.actor.details.level.value};
        else return;
    }

    /**
     * Spells
     */
    getSpells(token,level) {
        if (this.isLimitedSheet(token.actor)) return '';
        if (level == undefined) level = 'any';
        const allItems = token.actor.items;
        if (level == 'any') return allItems.filter(i => i.type == 'spell')
        if (level == '0') return allItems.filter(i => i.type == 'spell' && i.isCantrip == true)
        else return allItems.filter(i => i.type == 'spell' && i.level == level && i.isCantrip == false)
    }

    getSpellUses(token,level,item) {
        if (this.isLimitedSheet(token.actor)) return '';
        if (level == undefined || level == 'any') level = item.level;
        if (item.isCantrip == true) return;
        const spellbook = token.actor.items.filter(i => i.data.type === 'spellcastingEntry')[0];
        if (spellbook == undefined) return;
        return {
            available: spellbook.slots?.[`slot${level}`].value,
            maximum: spellbook.slots?.[`slot${level}`].max
        }
    }

    rollItem(item) {
        let variant = 0;
        if (otherControls.rollOption == 'map1') variant = 1;
        if (otherControls.rollOption == 'map2') variant = 2;
        if (item?.parent?.type == 'hazard' && item.type==='melee') return item.rollNPCAttack({}, variant+1);
        if (item.type==='strike') return item.variants[variant].roll({event});
        if (item?.parent?.type !== 'hazard' && (item.type==='weapon' || item.type==='melee')) return item.parent.actions.find(a=>a.name===item.name).variants[variant].roll({event});
        return game.pf2e.rollItemMacro(item.id);
    }

    isLimitedSheet(actor) {
        return limitedSheets.includes(actor.type);
    }

    /**
    * Ring Colors
    */
    getSkillRingColor(token, skill) {
        return this.getRingColor(this.findSkill(token, skill));
    }

    getSaveRingColor(token, save) {
        save = this.fixSave(save);
        return this.getRingColor(this.findSave(token, save));
    }

    getRingColor(stat) {
        if (stat == undefined) return;
        let statModifiers = stat?.modifiers || stat?._modifiers;
        const profLevel = statModifiers?.find(m => m.type == 'proficiency')?.slug;
        // console.log(`Proficiency Level for ${stat.name}: ${profLevel}`);
        if (profLevel != undefined) {
            return proficiencyColors?.[profLevel];
        }
        return;
    }
}