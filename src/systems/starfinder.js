import { compatibleCore } from "../misc.js";

const proficiencyColors = {
    0: "#000000",
    0.5: "#804A00",
    1: "#C0C0C0",
    2: "#FFD700"
}

export class starfinder{
    conf;

    constructor(){
        console.log("Material Deck: Using system 'Starfinder'");
        this.conf = CONFIG.SFRPG;
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
            {value:'Stamina', name:'Stamina'},
            {value:'AC', name:'Energy AC'},
            {value:'KinAC', name:'Kinetic AC'},
            {value:'Speed', name:'Speed'},
            {value:'Init', name:'Initiative'},
            {value:'Ability', name:'Ability Score'},
            {value:'AbilityMod', name:'Ability Score Modifier'},
            {value:'Save', name:'Saving Throw Modifier'},
            {value:'Skill', name:'Skill Modifier'}
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
        return;
    }

    getStamina(token) {
        const stamina = this.getActorData(token).attributes.sp;
        return {
            value: stamina.value,
            max: stamina.max
        }
    }

    getAC(token) {
        return this.getActorData(token).attributes.eac.value;
    }

    getKinAC(token) {
        return this.getActorData(token).attributes.kac.value;
    }

    getShieldHP(token) {
        return;
    }

    getSpeed(token) {
        const movement = this.getActorData(token).attributes.speed;
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
        else if (ability == 'ref') ability = 'reflex';
        let val = this.getActorData(token).attributes?.[ability].bonus;
        return (val >= 0) ? `+${val}` : val;
    }

    getAbilityList() {
        const keys = Object.keys(this.conf.abilities);
        let abilities = [];
        for (let k of keys) abilities.push({value:k, name:this.conf.abilities?.[k]})
        return abilities;
    }

    getSavesList() {
        const keys = Object.keys(this.conf.saves);
        let saves = [];
        for (let k of keys) saves.push({value:k, name:this.conf.saves?.[k]})
        return saves;
    }

    getSkill(token, skill) {
        if (skill == undefined) skill = 'acr';
        const val = this.getActorData(token).skills?.[skill].mod;
        return (val >= 0) ? `+${val}` : val;
    }

    getSkillList() {
        const keys = Object.keys(this.conf.skills);
        let skills = [];
        for (let s of keys) {
            const skill = this.conf.skills?.[s];
            skills.push({value:s, name:skill.label})
        }
        return skills;
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

    getConditionList() {
        let conditions = [];
        for (let c of CONFIG.statusEffects) conditions.push({value:c.id, name:c.label});
        return conditions;
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

    getRollTypes() {
        return [
            {value:'initiative', name:'Initiative'},
            {value:'deathSave', name:'Death Save'}
        ]
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
        return {available: this.getItemData(item).quantity};
    }

    getItemTypes() {
        return [
            {value:'weapon', name:'Weapons'},
            {value:'shield', name:'Shields'},
            {value:'equipment', name:'Armor'},
            {value:'ammunition', name:'Ammunition'},
            {value:'consumable', name:'Consumables'},
            {value:'goods', name:'Goods'},
            {value:'container', name:'Containers'},
            {value:'technological', name:'Technological, Magical, and Hybrid Items'},
            {value:'enhancers', name:'Equipment Enhancers'},
            {value:'augmentation', name:'Augmentations'}
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
        if (featureType == 'any') return allItems.filter(i => i.type == 'class' || i.type == 'race' || i.type == 'theme'|| i.type == 'asi' || i.type == 'archetype' || i.type == 'feat' || i.type == 'actorResource')
        else if (featureType == 'activeFeat' || featureType == 'passiveFeat') {
            const features = allItems.filter(i => i.type == 'feat');
            if (featureType == 'activeFeat') return features.filter(i => i.labels.featType == 'Action');
            else return features.filter(i => i.labels.featType == 'Passive');
        }
        return allItems.filter(i => i.type == featureType)
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
            {value:'race', name:'Race'},
            {value:'theme', name:'Theme'},
            {value:'asi', name:'Ability Score Increases'},
            {value:'archetypes', name:'Archetypes'},
            {value:'activeFeat', name:'Active Feats'},
            {value:'passiveFeat', name:'Passive Feats'},
            {value:'actorResource', name:'Actor Resources'}
        ]
    }

    /**
     * Spells
     */
     getSpells(token,level,type) {
        if (level == undefined) level = 'any';
        const allItems = token.actor.items;
        if (level == 'any') return allItems.filter(i => i.type == 'spell')
        else if (level == 'innate') return allItems.filter(i => i.type == 'spell' && this.getItemData(i).preparation.mode == 'innate');
        else return allItems.filter(i => i.type == 'spell' && this.getItemData(i).preparation.mode == '' && this.getItemData(i).level == level)
    }

    getSpellUses(token,level,item) {
        if (level == undefined) level = 'any';
        if (this.getItemData(item).level == 0) return;

        const spellSlots = this.getActorData(token).spells;
        const allowedClasses = this.getItemData(item).allowedClasses;

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

    getSpellLevels() {
        const keys = Object.keys(this.conf.spellLevels);
        let levels = [{label:'innate', name:game.i18n.localize("SFRPG.SpellPreparationModesInnate")}];
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
        const profLevel = this.getActorData(token)?.skills[skill]?.proficient;
        if (profLevel == undefined) return;
        return proficiencyColors?.[profLevel];
    }

    getSaveRingColor(token, save) {
        const profLevel = this.getActorData(token)?.abilities[save]?.proficient;        
        if (profLevel == undefined) return;
        return proficiencyColors?.[profLevel];
    }
}