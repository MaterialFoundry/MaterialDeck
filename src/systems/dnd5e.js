import { compatibleCore } from "../misc.js";

const proficiencyColors = {
    0: "#000000",
    0.5: "#804A00",
    1: "#C0C0C0",
    2: "#FFD700"
}

export class dnd5e{
    constructor(){
        console.log("Material Deck: Using system 'Dungeons & Dragons 5e'");
    }

    getActorData(token) {
        return compatibleCore('10.0') ? token.actor.system : token.actor.data.data;
    }

    getItemData(item) {
        return compatibleCore('10.0') ? item.system : item.data.data;
    }

    getHP(token) {
        const hp = this.getActorData(token).attributes.hp;
        return {
            value: hp.value,
            max: hp.max
        }
    }

    getTempHP(token) {
        const hp = this.getActorData(token).attributes.hp;
        return {
            value: (hp.temp == null) ? 0 : hp.temp,
            max: (hp.tempmax == null) ? 0 : hp.tempmax
        }
    }

    getAC(token) {
        return this.getActorData(token).attributes.ac.value;
    }

    getShieldHP(token) {
        return;
    }

    getSpeed(token) {
        const movement = this.getActorData(token).attributes.movement;
        let speed = "";

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
        
        return speed;
    }

    getInitiative(token) {
        let initiative = this.getActorData(token).attributes.init.total;
        return (initiative >= 0) ? `+${initiative}` : initiative;
    }

    toggleInitiative(token) {
        return;
    }

    getPassivePerception(token) {
        return this.getActorData(token).skills.prc.passive;
    }

    getPassiveInvestigation(token) {
        return this.getActorData(token).skills.inv.passive;
    }

    getAbility(token, ability) {
        if (ability == undefined) ability = 'str';
        return this.getActorData(token).abilities?.[ability].value;
    } 

    getAbilityModifier(token, ability) {
        if (ability == undefined) ability = 'str';
        let val = this.getActorData(token).abilities?.[ability].mod;
        return (val >= 0) ? `+${val}` : val;
    }

    getAbilitySave(token, ability) {
        if (ability == undefined) ability = 'str';
        let val = this.getActorData(token).abilities?.[ability].save;
        return (val >= 0) ? `+${val}` : val;
    }

    getSkill(token, skill) {
        if (skill == undefined) skill = 'acr';
        const val = this.getActorData(token).skills?.[skill].total;
        return (val >= 0) ? `+${val}` : val;
    }

    getProficiency(token) {
        const val = this.getActorData(token).attributes.prof;
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
        else if (roll == 'initiative') {
            options.rerollInitiative = true;
            token.actor.rollInitiative(options);
        }
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
        return {available: this.getItemData(item).quantity};
    }

    /**
     * Features
     */
    getFeatures(token,featureType) {
        if (featureType == undefined) featureType = 'any';
        const allItems = token.actor.items;

        if (featureType == 'any')                   return allItems.filter(i => i.type == 'class' || i.type == 'feat')
        else if (featureType == 'activeAbilities')  return allItems.filter(i => i.type == 'feat' && i.labels.featType == 'Action')
        else if (featureType == 'passiveAbilities') return allItems.filter(i => i.type == 'feat' && i.labels.featType == 'Passive')
        else                                        return allItems.filter(i => i.type == featureType)
    }

    getFeatureUses(item) {
        if (item.type == 'class') return {available: this.getItemData(item).levels};
        else return {
            available: this.getItemData(item).uses.value, 
            maximum: this.getItemData(item).uses.max
        };
    }

    /**
     * Spells
     */
     getSpells(token,level) {
        if (level == undefined) level = 'any';
        const allItems = token.actor.items;
        if (level == 'any') return allItems.filter(i => i.type == 'spell')
        else return allItems.filter(i => i.type == 'spell' && this.getItemData(i).level == level)
    }

    getSpellUses(token,level,item) {
        if (level == undefined || level == 'any') level = this.getItemData(item).level;
        if (this.getItemData(item).level == 0) return;
        return {
            available: this.getActorData(token).spells?.[`spell${level}`].value,
            maximum: this.getActorData(token).spells?.[`spell${level}`].max
        }
    }

    rollItem(item, settings, rollOption) {
        let options = {
            fastForward: rollOption != 'dialog',
            advantage: rollOption == 'advantage',
            disadvantage: rollOption == 'disadvantage'
        }
        if (settings.inventoryType == 'weapon') {
            if (settings.weaponRollMode == 'attack') {
                options.fastForward = true;
                return item.rollAttack(options);
            }
            else if (settings.weaponRollMode == 'damage' || settings.weaponRollMode == 'versatile') {
                options.fastForward = true;
                return item.rollDamage({
                    options,
                    critical:false,
                    versatile: settings.weaponRollMode == 'versatile'
                });
            }
            else if (settings.weaponRollMode == 'damageCrit' || settings.weaponRollMode == 'versatileCrit') {
                options.fastForward = true;
                return item.rollDamage({
                    options,
                    critical:true,
                    versatile: settings.weaponRollMode == 'versatile' || settings.weaponRollMode == 'versatileCrit'
                });
            }
            else if (settings.weaponRollMode == 'otherFormula') {
                return item.rollFormula(options);
            }
        }

        if (compatibleCore('10.0')) item.use(options)
        else item.roll(options)
    }

    /**
     * Ring Colors
     */
     getSkillRingColor(token, skill) {
        const profLevel = this.getActorData(token).skills[skill]?.proficient;
        if (profLevel == undefined) return;
        return proficiencyColors?.[profLevel];
    }

    getSaveRingColor(token, save) {
        const profLevel = this.getActorData(token).abilities[save]?.proficient;        
        if (profLevel == undefined) return;
        return proficiencyColors?.[profLevel];
    }
}