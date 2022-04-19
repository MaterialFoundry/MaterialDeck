import {compatibleCore} from "../misc.js";

const proficiencyColors = {
    0: "#000000",
    0.5: "#804A00",
    1: "#C0C0C0",
    2: "#FFD700"
}

export class starfinder{
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
        return;
    }

    getStamina(token) {
        const stamina = token.actor.data.data.attributes.sp;
        return {
            value: stamina.value,
            max: stamina.max
        }
    }

    getAC(token) {
        return token.actor.data.data.attributes.eac.value;
    }

    getKinAC(token) {
        return token.actor.data.data.attributes.kac.value;
    }

    getShieldHP(token) {
        return;
    }

    getSpeed(token) {
        const movement = token.actor.data.data.attributes.speed;
        let speed = "";
        if (movement.burrowing.value > 0) speed += `Burrow: ${movement.burrowing.value}Ft`;
        if (movement.climbing.value > 0) {
            if (speed.length > 0) speed += '\n';
            speed += `Climb: ${movement.climbing.value}Ft`;
        }
        if (movement.flying.value > 0) {
            if (speed.length > 0) speed += '\n';
            speed += `Fly: ${movement.flying.value}Ft`;
        }
        if (movement.land.value > 0) {
            if (speed.length > 0) speed += '\n';
            speed += `Land: ${movement.land.value}Ft`;
        }
        if (movement.swimming.value > 0) {
            if (speed.length > 0) speed += '\n';
            speed += `Swim: ${movement.swimming.value}Ft`;
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
        else if (ability == 'ref') ability = 'reflex';
        let val = token.actor.data.data.attributes?.[ability].bonus;
        return (val >= 0) ? `+${val}` : val;
    }

    getSkill(token, skill) {
        if (skill == undefined) skill = 'acr';
        const val = token.actor.data.data.skills?.[skill].mod;
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
            if (this.getConditionActive(token,condition)) token.actor.setCondition(condition,false);
            else token.actor.setCondition(condition,true);
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
        if (itemType == 'any') return allItems.filter(i => i.type == 'weapon' || i.type == 'shield' || i.type == 'equipment' || i.type == 'consumable' || i.type == 'goods' || i.type == 'container' || i.type == 'technological' || i.type == 'fusion' || i.type == 'upgrade' || i.type == 'weaponAccessory' || i.type == 'augmentation');
        else if (itemType == 'enhancers') return allItems.filter(i => i.type == 'fusion' || i.type == 'upgrade' || i.type == 'weaponAccessory');
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
        if (featureType == 'any') return allItems.filter(i => i.type == 'class' || i.type == 'race' || i.type == 'theme'|| i.type == 'asi' || i.type == 'archetype' || i.type == 'feat' || i.type == 'actorResource')
        else if (featureType == 'activeFeat' || featureType == 'passiveFeat') {
            const features = allItems.filter(i => i.type == 'feat');
            if (featureType == 'activeFeat') return features.filter(i => i.labels.featType == 'Action');
            else return features.filter(i => i.labels.featType == 'Passive');
        }
        return allItems.filter(i => i.type == featureType)
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
        else if (level == 'innate') return allItems.filter(i => i.type == 'spell' && i.data.data.preparation.mode == 'innate');
        else return allItems.filter(i => i.type == 'spell' && i.data.data.preparation.mode == '' && i.data.data.level == level)
    }

    getSpellUses(token,level,item) {
        if (level == undefined) level = 'any';
        if (item.data.data.level == 0) return;

        const spellSlots = token.actor.data.data.spells;
        const allowedClasses = item.data.data.allowedClasses;

        let uses = {available: 0, maximum: 0};
        if (allowedClasses.myst && spellSlots?.[`spell${level}`].perClass?.mystic?.max > uses.maximum) 
            uses = {available: spellSlots?.[`spell${level}`].perClass?.mystic.value, maximum: spellSlots?.[`spell${level}`].perClass?.mystic.max}
        if (allowedClasses.precog && spellSlots?.[`spell${level}`].perClass?.precog?.max > uses.maximum) 
            uses = {available: spellSlots?.[`spell${level}`].perClass?.precog.value, maximum: spellSlots?.[`spell${level}`].perClass?.precog.max}
        if (allowedClasses.tech && spellSlots?.[`spell${level}`].perClass?.technomancer?.max > uses.maximum) 
            uses = {available: spellSlots?.[`spell${level}`].perClass?.technomancer.value, maximum: spellSlots?.[`spell${level}`].perClass?.technomancer.max}
        if (allowedClasses.wysh && spellSlots?.[`spell${level}`].perClass?.witchwarper?.max > uses.maximum) 
            uses = {available: spellSlots?.[`spell${level}`].perClass?.witchwarper.value, maximum: spellSlots?.[`spell${level}`].perClass?.witchwarper.max} 

        return uses;
    }

    rollItem(item) {
        return item.roll()
    }

    /**
     * Ring Colors
     */
     getSkillRingColor(token, skill) {
        const profLevel = token.actor.data.data?.skills[skill]?.proficient;
        if (profLevel == undefined) return;
        return proficiencyColors?.[profLevel];
    }

    getSaveRingColor(token, save) {
        const profLevel = token.actor.data.data?.abilities[save]?.proficient;        
        if (profLevel == undefined) return;
        return proficiencyColors?.[profLevel];
    }
}