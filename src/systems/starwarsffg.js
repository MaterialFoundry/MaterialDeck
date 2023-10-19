/**
 * This is a template for adding a new gaming system.
 * Edit it to suit your system, for inspiration, look at other system files.
 * Functions that are unused in your system can be left empty, but don't delete the function.
 * 
 * Use the compatibleCore function to get the right value for the Foundry core:
 * return compatibleCore('10.0') ? [value in v10+] : [value pre v10];
 * 
 * Use the compatibleSystem function to get the right value for the gaming system version:
 * return compatibleSystem('1.6.3') ? [value in v1.6.3+] : [value pre v1.6.3];
 */

import { compatibleCore, compatibleSystem } from "../misc.js";

/**
 * Proficiency colors to show if a token is proficient in for example a skill
 */
const proficiencyColors = {
    0: "#000000", //black
    1: "#4E7927", //green
    2: "#4E7927", //green
    3: "#F3E900", //yellow
    4: "#F3E900", //yellow
    5: "#72CCDC" //blue
}

export class starwarsffg{
    conf; //this variable stores the configuration data for the system, set in the constructor

    constructor(){
        console.log("Material Deck: Using system 'Star Wars FFG'");
        this.conf = CONFIG.FFG;
    }

    getActorData(token) {
        return token.actor.system;
    }

    getItemData(item) {
        return item.system;
    }

    getCharacteristicAbbreviation(characteristic) {
        return {
            "Brawn": "Br",
            "Agility": "Ag",
            "Intellect": "Int",
            "Cunning": "Cun",
            "Willpower": "Will",
            "Presence": "Pr"
        }[characteristic]
    }

    /**
     * This generates a list of stats to be displayed on the SD: Token Action => Stats.
     * Choose the ones you want to use and change the 'name' value if desired. If you add new ones, you will need to add a function to handle them in src/token.js.
     * After each option you'll find what function it will call after the button is pressed on the SD
     */
    getStatsList() {
        return [
            {value:'HP', name:'Wounds'},                                        //will call getHP()
            // {value:'HPbox', name:'HP (box)'},                               //will call getHP()
            //{value:'TempHP', name:'Temp HP'},                               //will call getTempHP()
            {value:'AC', name:'Soak'},                                        //will call getAC()
            //{value:'ShieldHP', name:'Shield HP'},                           //will call getShieldHP()
            //{value:'Speed', name:'Speed'},                                  //will call getSpeed()
            {value:'Init', name:'Initiative'},                              //will call getInitiative()
            {value:'Ability', name:'Charcteristic'},                        //will call getAbility()
            //{value:'AbilityMod', name:'Ability Score Modifier'},            //will call getAbilityModifier()
            //{value:'Save', name:'Saving Throw Modifier'},                   //will call getAbilitySave()
            //{value:'Skill', name:'Skill Modifier'},                         //will call getSkill()
            //{value:'PassivePerception', name:'Passive Perception'},         //will call getPassivePerception()
            //value:'PassiveInvestigation', name:'Passive Investigation'},   //will call getPassiveInvestigation()
            //{value:'Prof', name:'Proficiency'},                             //will call getProficiency()
            {value:'Condition', name: 'Condition'},                         //will call getConditionValue()
            {value:'DefenseMelee', name:'Defense Melee'},
            {value:'DefenseRanged', name:'Defense Ranged'},
            {value:'Encumbrance', name:'Encum'},
            {value:'ForcePool', name:'Force Pool'},
            // {value:'Soak', name:'Soak'},
            {value:'Strain', name:'Strain'}
        ]
    }

    /**
     * Adds an on click option to the SD: Token Action => On Click
     * Currently only supports toggling initiative (for Shadow of the Demonlord)
     */
    getOnClickList() {
        return [
            //{value:'initiative',name:'Toggle Initiative'}
        ]
    }

    getDefenseMelee(token) {
      const defence = this.getActorData(token).stats.defence
      return defence.melee 
    }
    getDefenseRanged(token) {
      const defence = this.getActorData(token).stats.defence
      return defence.ranged
    }
    getEncumbrance(token) {
      const encumbrance = this.getActorData(token).stats.encumbrance
      return encumbrance
    }
    getForcePool(token) {
      const forcePool = this.getActorData(token).stats.forcePool
      return forcePool
    }
    
    getStrain(token) {
      const strain = this.getActorData(token).stats.strain
      return strain
    }
    getHP(token) {
      const wounds = this.getActorData(token).stats.wounds
      return wounds
    }

    /**
     * Returns the temporary HP of the token
     * @param {Token} token Token instance to get the temp HP from
     * @returns {object}    Token temp hp value and max: {value: ##, max: ##}
     */
    getTempHP(token) {
        return;
    }

    /**
     * Returns the armor class of the token
     * @param {Token} token Token instance to get the AC from
     * @returns {number}    AC value
     */
    getAC(token) {
        const soak = this.getActorData(token).stats.soak
        return soak.value
    }

    /**
     * Returns the shield HP of the token
     * @param {Token} token Token instance to get the shield HP from
     * @returns {number}    Shield HP
     */
    getShieldHP(token) {
        return;
    }

    /**
     * Returns a string with movement speeds of the token
     * @param {Token} token Token instance to get the speed from
     * @returns {string}    Movement speed string
     */
    getSpeed(token) {
        return;
    }

    /**
     * Returns the initiative of the token
     * @param {Token} token Token instance to get the initiative from
     * @returns {number}    Initiative value
     */
    getInitiative(token) {
        return;
    }

    /**
     * Toggles the initiative of the token
     * @param {Token} token Token instance to toggle the initiative for
     */
    toggleInitiative(token) {
        
    }

    /**
     * Returns the passive perception of the token
     * @param {Token} token Token instance to get the passive perception from
     * @returns {number}    Passive perception value
     */
    getPassivePerception(token) {
        return;
    }

    /**
     * Returns the passive investigation of the token
     * @param {Token} token Token instance to get the passive investigation from
     * @returns {number}    Passive investigation value
     */
    getPassiveInvestigation(token) {
        return;
    }

    /**
     * Returns the ability value of the token
     * @param {Token} token     Token instance to get the ability value from
     * @param {string} ability  Ability to get the value from
     * @returns {number}        Ability value
     */
    getAbility(token, characteristic) {
        if (characteristic == undefined) characteristic = '';  //default ability
        return this.getActorData(token).characteristics[characteristic].value;
    } 

    /**
     * Returns the ability modifier of the token
     * @param {Token} token     Token instance to get the ability modifier from
     * @param {string} ability  Ability to get the value from
     * @returns {number}        Ability modifier
     */
    getAbilityModifier(token, ability) {
        if (ability == undefined) ability = ''; //default ability
        return;
    }

    /**
     * Returns the ability save of the token
     * @param {Token} token     Token instance to get the ability save from
     * @param {string} ability  Ability to get the value from
     * @returns {number}        Ability save
     */
    getAbilitySave(token, ability) {
        if (ability == undefined) ability = ''; //default ability
        return;
    }

    /**
     * Returns a list of abilities available to the system
     * Each array item must be {value:'abilityId', name:'abilityName'}
     * 'abilityId' is defined by the system, the name can be anything you want
     * @returns 
     */
    getAbilityList() {
        let characteristics = []
        const keys = Object.keys(this.conf.characteristics);
        for (let s of keys) {
            const characteristic = this.conf.characteristics[s];
            characteristics.push({value:s, name:game.i18n.localize(characteristic.label)})
        }
        return characteristics;
    }

    /**
     * Returns the skill value of the token
     * @param {Token} token     Token instance to get the skill value from
     * @param {string} skill    Skill to get the value from
     * @returns {number}        Skill value
     */
    getSkill(token, skill) {
        if (skill == undefined) return ''
        const rank = this.getActorData(token).skills?.[skill].rank;
        const characteristic = this.getActorData(token).skills?.[skill].characteristic;
        const ability = this.getActorData(token).characteristics?.[characteristic].value;
        const characteristic_abbreviation = this.getCharacteristicAbbreviation(characteristic)
        return `(${characteristic_abbreviation}, ${ability}) Rank ${rank}`;
    }

    /**
     * Returns the proficiency value of the token
     * @param {Token} token Token instance to get the proficiency from
     * @returns {number}    Proficiency value
     */
    getProficiency(token) {
        return;
    }

    /**
     * Returns the icon location of a condition
     * @param {string} condition    Name of the condition
     * @returns {string}            Icon location
     */
    getConditionIcon(condition) {
        if (condition == undefined) condition = 'removeAll';
        if (condition == 'removeAll') return;
        else return;
    }

    /**
     * Returns whether a condition is active on the token
     * @param {Token} token         Token instance to get the value from
     * @param {string} condition    Name of the condition
     * @returns {boolean}           Condition is active or not
     */
    getConditionActive(token,condition) {
        if (condition == undefined) condition = 'removeAll';
        return;
    }

    /**
     * Toggles a condition on a token
     * @param {Token} token         Token instance to get the value from
     * @param {string} condition    Name of the condition
     */
    async toggleCondition(token,condition) {
        if (condition == undefined) condition = 'removeAll';

    }

    /**
     * Roll for a token
     * @param {Token} token         Token instance to roll for
     * @param {string} roll         Roll type (ability/save/skill/initiative/deathSave)
     * @param {bbject} options      Roll options
     * @param {string} ability      Name of the ability to roll
     * @param {string} skill        Name of the skill to roll
     * @param {string} save         Name of the save to roll
     */
     roll(token,roll,options,ability,skill,save) {
        if (roll == undefined) roll = '';       
        if (ability == undefined) ability = ''; //default ability
        if (skill == undefined) skill = '';     //default skill
        if (save == undefined) save = '';       //default save

        let difficulty = 2;
            if (roll.disadvantage) {
                difficulty = 3;
            } else if (roll.advantage) {
            difficulty = 1;
        }

        if (roll == 'ability') {}
        else if (roll == 'save') {}
        else if (roll == 'skill') { 
            const skill_obj = this.getActorData(token).skills[skill];
            const characteristic = this.getActorData(token).characteristics[skill_obj.characteristic];
            game.ffg.DiceHelpers.rollSkillDirect(
                skill_obj,
                characteristic,
                difficulty,
                token.actor
            );
        }
        else if (roll == 'initiative') {}
        else if (roll == 'deathSave') {}
    }

    /**
     * Get array of items
     * @param {Token} token     Token instance to get the items from
     * @param {string} itemType Item type
     * @returns {array}         Array of items
     */
    getItems(token,itemType) {
        // if (this.isLimitedSheet(token.actor)) return [];
        if (itemType == undefined) itemType = 'any';
        const allItems = token.actor.items;
        if (itemType == 'any') return allItems.filter(i => i.type == 'weapon' || i.type == 'gear' || i.type == 'itemattachment');
        if (itemType == 'weapon') return allItems.filter(i => i.type == 'weapon')  
        if (itemType == 'armour') return allItems.filter(i => i.type == 'armour') 
        else return allItems.filter(i => i.type == itemType);
    }

    /**
     * Returns uses/quantity of an item
     * @param {Item} item       Item instance to get the uses/quantity from
     * @returns {object}        Uses/quantity available {available: ###, maximum: ###}
     */
    getItemUses(item) {
        return;
    }
 
    /**
     * Returns the features of a token
     * @param {Token} token         Token instance to get the features from
     * @param {string} featureType  Feature types to return
     * @returns {array}             Array of features
     */
    getFeatures(token,featureType) {
        const allItems = token.actor.items;
        const allFeatureTypes = this.getFeatureTypes().map(f => f.value)

        if (featureType == undefined) featureType = 'any';
        if (featureType == 'ability') return allItems.filter(i => i.type == 'ability')
        if (featureType == 'criticaldamage') return allItems.filter(i => i.type == 'criticaldamage')
        if (featureType == 'criticalinjury') return allItems.filter(i => i.type == 'criticalinjury')
        if (featureType == 'career') return allItems.filter(i => i.type == 'career')
        if (featureType == 'signatureability') return allItems.filter(i => i.type == 'signatureability')
        if (featureType == 'specialization') return allItems.filter(i => i.type == 'specialization')
        if (featureType == 'species') return allItems.filter(i => i.type == 'species')
        if (featureType == 'talent') return allItems.filter(i => i.type == 'talent')
        if (featureType == 'any')  return allItems.filter(i => allFeatureTypes.includes(i.type));
        else return;
    }

    /**
     * Returns uses/quantity of a feature
     * @param {Item} item       Item/feature instance to get the uses/quantity from
     * @returns {object}        Uses/quantity available {available: ###, maximum: ###}
     */
    getFeatureUses(item) {
        return {};
    }

    /**
     * Returns the spells of a token
     * @param {Token} token     Token instance to get the spells from
     * @param {string} level    Spell level
     * @returns {array}         Array of spells
     */
    getSpells(token,level) {
        if (level == undefined) level = 'any';
        if (level == 'any') return;
        else return;
    }

    /**
     * Returns the spell uses of a specific spell for a token
     * @param {Token} token     Token instance to get the spell uses from
     * @param {string} level    Spell level
     * @param {Item} item       Spell instance to get the uses from
     * @returns {object}        Spell uses left: {available: ###, maximum: ###}
     */
    getSpellUses(token,level,item) {
        return {
        }
    }

    /**
     * Roll an item
     * @param {Token} item          Item instance to roll
     * @param {object} settings     Settings of the action
     * @param {object} rollOption   Roll options
     */
    rollItem(item, settings, rollOption, attackMode, token) {
        game.ffg.DiceHelpers.rollItem(item.id, token.actor.id);
    }

    /**
     * Returns a color to display proficiency for saves
     * @param {Token} token     Token instance to get the proficiency from
     * @param {string} save     Save name
     * @returns {string}        Hex color string from proficiencyColors array
     */
    getSaveRingColor(token, save) {
        // const profLevel = undefined;        
        // if (profLevel == undefined) return;
        // return proficiencyColors?.[profLevel];
    }

    getConditionList(token,level) {
        let conditions = [];
        // for (let c of CONFIG.statusEffects) conditions.push({value:c.id, name:game.i18n.localize(c.label)});
        return conditions;
    }

    getSavesList() {
        let saves = [];
        // return this.getAbilityList();
        return saves;
    }

    getSkillList() {
        const keys = Object.keys(this.conf.skills);
        let skills = [];
        for (let s of keys) {
            const skill = this.conf.skills?.[s];
            skills.push({value:s, name:game.i18n.localize(skill.label)})
        }
        return skills;
    }

    getItemTypes() {
        return [
            {value:'armour', name:'Armour'}, 
            {value:'forcepower', name:'Force power'}, 
            {value:'gear', name:'Gear'}, 
            {value:'homesteadupgrade', name:'Homestead upgrade'}, 
            {value:'itemattachment', name:'Item attachment'}, 
            {value:'itemmodifier', name:'Item modifier'}, 
            {value:'shipattachment', name:'Ship attachment'}, 
            {value:'shipweapon', name:'Ship weapon'}, 
            {value:'weapon', name:'Weapon'}            
        ]
    }

    getRollTypes() {
        return [
            // {value:'initiative', name:'Initiative'},
            // {value:'deathSave', name:'Death Save'}
        ]
    }

    getWeaponRollModes() {
        return [
            {value:'default', name:'Default'},
            // {value:'attack', name:'Attack'},
            // {value:'damage', name:'Damage'},
            // {value:'damageCrit', name:'Damage (Critical)'},
            // {value:'versatile', name:'Versatile'},
            // {value:'versatileCrit', name:'Versatile (Critical)'},
            // {value:'otherFormula', name:'Other Formula'}
        ]
    }

    getFeatureUses(item) {
        // if (item.type == 'class') return {available: this.getItemData(item).levels};
        // else return {
        //     available: this.getItemData(item).uses.value, 
        //     maximum: this.getItemData(item).uses.max
        // };
        return;
    }

    getFeatureTypes() {
        return [
            {value:'ability', name:'Ability'}, 
            {value:'criticaldamage', name:'Critical damage'}, 
            {value:'criticalinjury', name:'Critical injury'}, 
            {value:'career', name:'Career'},
            {value:'signatureability', name:'Signature ability'}, 
            {value:'specialization', name:'Specialization'}, 
            {value:'species', name:'Species'}, 
            {value:'talent', name:'Talent'} 
        ]
    }

    /**
     * Spells
     */
     getSpells(token,level,type) {
        // if (level == undefined) level = 'any';
        // if (type == undefined) type = 'any';
        // const allItems = token.actor.items;
        // if (level == 'any') return allItems.filter(i => i.type == 'spell')
        // else if (type == 'any') return allItems.filter(i => i.type == 'spell' && this.getItemData(i).level == level)
        // else if (type == 'prepared') return allItems.filter(i => i.type == 'spell' && this.getItemData(i).level == level && i.system.preparation.prepared == true)
        // else if (type == 'unprepared') return allItems.filter(i => i.type == 'spell' && this.getItemData(i).level == level && i.system.preparation.prepared == false)
        return [];
    }

    getSpellUses(token,level,item) {
        // if (level == undefined || level == 'any') level = this.getItemData(item).level;
        // if (this.getItemData(item).level == 0) return;
        // return {
        //     available: this.getActorData(token).spells?.[`spell${level}`].value,
        //     maximum: this.getActorData(token).spells?.[`spell${level}`].max
        // }
        return {};
    }

    getSpellLevels() {
        // const keys = Object.keys(this.conf.spellLevels);
        let levels = [];
        // for (let l of keys) levels.push({value:l, name:this.conf.spellLevels?.[l]});
        return levels;
    }

    
    getSpellTypes() {
        return [
            // {value: 'prepared', name:'Prepared'},
            // {value: 'unprepared', name:'Unprepared'}
        ]
    }

    /**
     * Returns a color to display proficiency for skills
     * @param {Token} token     Token instance to get the proficiency from
     * @param {string} skill    Skill name
     * @returns {string}        Hex color string from proficiencyColors array
     */
     getSkillRingColor(token, skill) {
        const profLevel = this.getActorData(token).skills[skill]?.rank;
        if (profLevel == undefined) return;
        return proficiencyColors?.[profLevel];
    }

    getSaveRingColor(token, save) {
        // const profLevel = this.getActorData(token).abilities[save]?.proficient;        
        // if (profLevel == undefined) return;
        // return proficiencyColors?.[profLevel];
        return;
    }
}