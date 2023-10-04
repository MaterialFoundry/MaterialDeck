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
    0: "#000000",
    0.5: "#804A00",
    1: "#C0C0C0",
    2: "#FFD700"
}

//Rename 'template' to the name of your system
export class template{
    conf; //this variable stores the configuration data for the system, set in the constructor

    constructor(){
        console.log("Material Deck: Using system 'SystemName'");
        this.conf = CONFIG.DND5E; //You can use this to get various things like the list of ability scores, conditions, etc. Make sure you set it to the correct value for your system
    }

    getActorData(token) {
        return token.actor.system;
    }

    getItemData(item) {
        return item.system;
    }

    /**
     * This generates a list of stats to be displayed on the SD: Token Action => Stats.
     * Choose the ones you want to use and change the 'name' value if desired. If you add new ones, you will need to add a function to handle them in src/token.js.
     * After each option you'll find what function it will call after the button is pressed on the SD
     */
    getStatsList() {
        return [
            {value:'HP', name:'HP'},                                        //will call getHP()
            {value:'HPbox', name:'HP (box)'},                               //will call getHP()
            {value:'TempHP', name:'Temp HP'},                               //will call getTempHP()
            {value:'AC', name:'AC'},                                        //will call getAC()
            {value:'ShieldHP', name:'Shield HP'},                           //will call getShieldHP()
            {value:'Speed', name:'Speed'},                                  //will call getSpeed()
            {value:'Init', name:'Initiative'},                              //will call getInitiative()
            {value:'Ability', name:'Ability Score'},                        //will call getAbility()
            {value:'AbilityMod', name:'Ability Score Modifier'},            //will call getAbilityModifier()
            {value:'Save', name:'Saving Throw Modifier'},                   //will call getAbilitySave()
            {value:'Skill', name:'Skill Modifier'},                         //will call getSkill()
            {value:'PassivePerception', name:'Passive Perception'},         //will call getPassivePerception()
            {value:'PassiveInvestigation', name:'Passive Investigation'},   //will call getPassiveInvestigation()
            {value:'Prof', name:'Proficiency'},                             //will call getProficiency()
            {value:'Condition', name: 'Condition'},                         //will call getConditionValue()
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

    /**
     * Returns the HP of the token
     * @param {Token} token Token instance to get the HP from
     * @returns {object}    Token hp value and max: {value: ##, max: ##}
     */
    getHP(token) {
        return;
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
        return;
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
    getAbility(token, ability) {
        if (ability == undefined) ability = '';  //default ability
        return;
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
        let abilities = [];
        return abilities;
    }

    /**
     * Returns the skill value of the token
     * @param {Token} token     Token instance to get the skill value from
     * @param {string} skill    Skill to get the value from
     * @returns {number}        Skill value
     */
    getSkill(token, skill) {
        if (skill == undefined) skill = '';
        return;
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
        if (roll == undefined) roll = 'ability';       
        if (ability == undefined) ability = ''; //default ability
        if (skill == undefined) skill = '';     //default skill
        if (save == undefined) save = '';       //default save

        if (roll == 'ability')
        else if (roll == 'save')
        else if (roll == 'skill')
        else if (roll == 'initiative')
        else if (roll == 'deathSave')
    }

    /**
     * Get array of items
     * @param {Token} token     Token instance to get the items from
     * @param {string} itemType Item type
     * @returns {array}         Array of items
     */
    getItems(token,itemType) {
        if (itemType == undefined) itemType = 'any';
        if (itemType == 'any') return ;
        else return ;
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
        if (featureType == undefined) featureType = 'any';
        if (featureType == 'any')                   return;
        else                                        return;
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
    rollItem(item, settings, rollOption) {
        
    }

    /**
     * Returns a color to display proficiency for skills
     * @param {Token} token     Token instance to get the proficiency from
     * @param {string} skill    Skill name
     * @returns {string}        Hex color string from proficiencyColors array
     */
    getSkillRingColor(token, skill) {
        const profLevel = ;
        if (profLevel == undefined) return;
        return proficiencyColors?.[profLevel];
    }

    /**
     * Returns a color to display proficiency for saves
     * @param {Token} token     Token instance to get the proficiency from
     * @param {string} save     Save name
     * @returns {string}        Hex color string from proficiencyColors array
     */
    getSaveRingColor(token, save) {
        const profLevel = ;        
        if (profLevel == undefined) return;
        return proficiencyColors?.[profLevel];
    }
}