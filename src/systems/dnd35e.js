import { compatibleCore } from "../misc.js";

export class dnd35e{
    conf;
    system;

    constructor(gamingSystem){
        console.log("Material Deck: Using system 'Dungeons & Dragons 3.5e'/'Pathfinder 1e'");
        if (gamingSystem == 'D35E') this.conf = CONFIG.D35E;
        else if (gamingSystem == 'pf1') this.conf = CONFIG.PF1;
        this.system = gamingSystem;
    }

    getActorData(token) {
        return token.actor.system;
    }

    getItemData(item) {
        return item.system;
    }

    getStatsList() {
        return [
            {value:'HP', name:'HP'},
            {value:'HPbox', name:'HP (box)'},
            {value:'TempHP', name:'Temp HP'},
            {value:'AC', name:'AC'},
            {value:'Speed', name:'Speed'},
            {value:'Init', name:'Initiative'},
            {value:'Ability', name:'Ability Score'},
            {value:'AbilityMod', name:'Ability Score Modifier'},
            {value:'Save', name:'Saving Throw Modifier'},
            {value:'Skill', name:'Skill Modifier'},
            {value:'Prof', name:'Proficiency'}
        ]
    }

    getAttackModes() {
        return [
        ]
    }

    getOnClickList() {
        return []
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
        return this.getActorData(token).attributes.ac.normal.total;
    }

    getShieldHP(token) {
        return;
    }

    getSpeed(token) {
        const movement = this.getActorData(token).attributes.speed;
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
        let initiative = this.getActorData(token).attributes.init.total;
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
        return this.getActorData(token).abilities?.[ability].value;
    } 

    getAbilityModifier(token, ability) {
        if (ability == undefined) ability = 'str';
        let val = this.getActorData(token).abilities?.[ability].mod;
        return (val >= 0) ? `+${val}` : val;
    }

    getAbilitySave(token, ability) {
        if (ability == undefined) ability = 'fort';
        let val = this.getActorData(token).attributes.savingThrows?.[ability].total;
        return (val >= 0) ? `+${val}` : val;
    }

    getAbilityList() {
        const keys = Object.keys(this.conf.abilities);
        let abilities = [];
        for (let k of keys) abilities.push({value:this.conf.abilityAbbreviations?.[k], name:this.conf.abilities?.[k]})
        return abilities;
    }

    getSavesList() {
        const keys = Object.keys(this.conf.savingThrows);
        let saves = [];
        for (let k of keys) saves.push({value:k, name:this.conf.savingThrows?.[k]})
        return saves;
    }

    getSkill(token, skill) {
        if (skill == undefined) skill = 'apr';
        const val = this.getActorData(token).skills?.[skill].mod;
        return (val >= 0) ? `+${val}` : val;
    }

    getSkillList() {
        const keys = Object.keys(this.conf.skills);
        let skills = [];
        for (let s of keys) {
            const skill = this.conf.skills?.[s];
            skills.push({value:s, name:skill})
        }
        return skills;
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

    getConditionList() {
        let conditions = [];
        for (let c of CONFIG.statusEffects) conditions.push({value:c.id, name:game.i18n.localize(c.label)});
        return conditions;
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
        else if (roll == 'initiative') {
            options.rerollInitiative = true;
            token.actor.rollInitiative(options);
        }
        else if (roll == 'grapple') token.actor.rollGrapple(options);
        else if (roll == 'bab') token.actor.rollBAB(options);
        else if (roll == 'melee') token.actor.rollMelee(options);
        else if (roll == 'ranged') token.actor.rollRanged(options);
    }

    getRollTypes() {
        if (this.system == 'D35E') {
            return [
                {value:'initiative', name:'Initiative'},
                {value:'grapple', name:'Grapple'},
                {value:'bab', name:'Base Attack Bonus'},
                {value:'melee', name:'Melee'},
                {value:'ranged', name:'Ranged'}
            ]
        }
        else if (this.system == 'pf1') {
            return [
                {value:'initiative', name:'Initiative'},
                {value:'cmb', name:'Combat Maneuver Bonus'},
                {value:'bab', name:'Base Attack Bonus'},
                {value:'attack', name:'Attack'},
                {value:'defenses', name:'Defenses'}
            ]
        }
    }

    /**
     * Items
     */
    getItems(token,itemType) {
        if (itemType == undefined) itemType = 'any';
        const allItems = token.actor.items;
        if (itemType == 'any') return allItems.filter(i => i.type == 'weapon' || i.type == 'equipment' || i.type == 'consumable' || i.type == 'loot' || i.type == 'container');
        else if (game.system.id == 'D35E' && itemType == 'container') return allItems.filter(i => i.type == 'loot' && this.getItemData(i).subType == itemType);
        else {
            if (itemType == 'gear' || itemType == 'ammo' || itemType == 'misc' || itemType == 'tradeGoods') 
                return allItems.filter(i => i.type == 'loot' && this.getItemData(i).subType == itemType);
            else return allItems.filter(i => i.type == itemType);
        }
    }

    getItemUses(item) {
        return {available: this.getItemData(item).quantity};
    }

    getItemTypes() {
        return [
            {value:'weapon', name:'Weapons'},
            {value:'equipment', name:'Armor/Equipment'},
            {value:'consumable', name:'Consumables'},
            {value:'gear', name:'Gear'},
            {value:'ammo', name:'Ammunition'},
            {value:'misc', name:'Miscellaneous'},
            {value:'tradeGoods', name:'Trade Goods'},
            {value:'container', name:'Containers'}
        ]
    }

    getWeaponRollModes() {
        return []
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
        if (item.data.type == 'class') return {available: this.getItemData(item).levels};
        else return {
            available: this.getItemData(item).uses.value, 
            maximum: this.getItemData(item).uses.max
        };
    }

    getFeatureTypes() {
        return [
            {value:'class', name:'Class'},
            {value:'feat', name:'Abilities'}
        ]
    }

    /**
     * Spells
     */
     getSpells(token,level,type) {
        if (level == undefined) level = 'any';
        const allItems = token.actor.items;
        if (level == 'any') return allItems.filter(i => i.type == 'spell')
        else return allItems.filter(i => i.type == 'spell' && this.getItemData(i).level == level)
    }

    getSpellUses(token,level,item) {
        if (level == undefined) level = 'any';
        if (this.getItemData(item).level == 0) return;
        return {
            available: item.charges, 
            maximum: item.maxCharges
        }
    }

    getSpellLevels() {
        const keys = Object.keys(this.conf.spellLevels);
        let levels = [];
        for (let l of keys) levels.push({value:l, name:this.conf.spellLevels?.[l]});
        return levels;
    }

    getSpellTypes() {
        return [
        ]
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