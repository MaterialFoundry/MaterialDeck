export class swade {
    conf; //this variable stores the configuration data for the system, set in the constructor

    constructor() {
        console.log("Material Deck: Using system 'Swade'");
        this.conf = CONFIG.SWADE; //You can use this to get various things
    }

    getActorData(token) {
        return token.actor.system;
    }

    getItemData(item) {
        return item.system;
    }

    getStatsList() {
        return [
            { value: 'HP', name: 'Wounds' },                                        //will call getHP()
            { value: 'HPbox', name: 'Wounds (box)' },                               //will call getHP()
            { value: 'AC', name: 'Parry' },                                        //will call getAC()
            { value: 'Speed', name: 'Pace' },                                  //will call getSpeed()
            { value: 'Ability', name: 'Attributes Score' },                        //will call getAbility()
            { value: 'Condition', name: 'Condition' },                         //will call getConditionValue()
            { value: 'PP', name: 'Power Points' },                         //will call getPP()'}
            { value: 'Wildcard', name: 'Wild Card' }
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
        const hp = this.getActorData(token).wounds

        return {
            value: hp.value,
            max: hp.max
        }
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
        const { parry } = this.getActorData(token).stats;
        return parry.value
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
        const { speed } = this.getActorData(token).stats;

        return speed.value;
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
        if (ability == undefined) ability = 'agility';  //default ability
        return this.getActorData(token).attributes?.[ability].die.sides;
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
        const attributes = Object.keys(this.conf.attributes);
        let attributesList = []
        for (let a of attributes) attributesList.push({ value: a, name: a.charAt(0).toUpperCase() + a.slice(1) })

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

    getPP(token) {
        const pp = this.getActorData(token).powerPoints;

        return {
            value: pp.general.value,
            max: pp.general.max
        }
    }

    getWildcard(token) {
        return this.getActorData(token).wildcard;
    }

    getToughness(token) {
        const { toughness } = this.getActorData(token).stats.toughness;

        return {
            value: toughness.value,
            armor: toughness.armor
        }
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
    getConditionActive(token, condition) {
        if (condition == undefined) condition = 'removeAll';
        return;
    }

    /**
     * Toggles a condition on a token
     * @param {Token} token         Token instance to get the value from
     * @param {string} condition    Name of the condition
     */
    async toggleCondition(token, condition) {
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
    roll(token, roll, options, ability, skill, save) {
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
    getItems(token, itemType) {
        if (itemType == undefined) itemType = 'any';
        if (itemType == 'any') return;
        else return;
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
    getFeatures(token, featureType) {
        if (featureType == undefined) featureType = 'any';
        if (featureType == 'any') return;
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
    getSpells(token, level) {
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
    getSpellUses(token, level, item) {
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
