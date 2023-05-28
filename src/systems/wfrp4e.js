import { compatibleCore } from "../misc.js";

export class wfrp4e {
    conf;

    constructor(){
        console.log("Material Deck: Using system 'Warhammer Fantasy Roleplaying 4e'");
        this.conf = game.wfrp4e.config;
    }

    getActorData(token) {
        return token.actor.system;
    }

    getItemData(item) {
        return item.system;
    }

    getStatsList() {
        return [
            {value: 'Advantage', name: 'Advantage'},
            {value: 'Corruption', name: 'Corruption'},
            {value: 'CriticalWounds', name: 'Critical Wounds'},
            {value: 'Encumbrance', name: 'Encumbrance'},
            {value: 'Fate', name: 'Fate'},
            {value: 'Fortune', name: 'Fortune'},
            {value: 'Wounds', name: 'Wounds'},
            {value: 'Movement', name: 'Movement'},
            {value: 'Resilience', name: 'Resilience'},
            {value: 'Resolve', name: 'Resolve'},
            {value: 'Ability', name: 'Characteristics' } //value is ability to conform to the interface
        ]
    }

    getAttackModes() {
        return [
        ]
    }

    getOnClickList() {
        return []
    }

    getFate(token) {
        return this.getActorData(token).status.fate.value
    }

    getFortune(token) {
        return this.getActorData(token).status.fortune.value
    }

    getWounds(token) {
        const wounds =  this.getActorData(token).status.wounds
        return {
            value: wounds.value,
            max: wounds.max
        } 
    }

    getCriticalWounds(token) {
        const criticalWounds = this.getActorData(token).status.criticalWounds
        return {
            value: criticalWounds.value,
            max: criticalWounds.max
        } 
    }

    getCorruption(token) {
        return this.getActorData(token).status.corruption.value
    }

    getAdvantage(token) {
        return this.getActorData(token).status.advantage.value
    }

    getResolve(token) {
        return this.getActorData(token).status.resolve.value
    }

    getResilience(token) {
        return this.getActorData(token).status.resilience.value
    }

    getAbility(token, abilityName) {
        return this.getCharacteristics(token, abilityName); 
    }

    getAbilityList() {
        const keys = Object.keys(this.conf.characteristics);
        let abilities = [];
        for (let k of keys) abilities.push({value:k, name:this.conf.characteristics?.[k]})
        return abilities;
    }

    getCharacteristics(token, characteristicName) {
        if (characteristicName == undefined ) characteristicName = `AG`;
        const characteristic = this.getActorData(token).characteristics[characteristicName.toLowerCase()]
        const val = characteristic.value;
        return (val >= 0) ? `+${val}` : val;
    }

    getFeatures(token,featureType) {
        if (featureType == undefined) featureType = 'any';
        const allItems = token.actor.items;
        if (featureType == 'any') return allItems.filter(i => i.type == 'skill' || i.type == 'talent' || i.type == "career" || i.type == 'trait');
        return allItems.filter(i => i.type == featureType);
    }

    getFeatureTypes() {
        return [
            {value: 'skill', name: 'Skills'}
        ]
    }

    getSpells(token,spellLevel,type) {
        const allItems = token.actor.items;
        return allItems.filter(i => i.type == 'spell')
    }

    getSpellUses(token,level,item) {
        return;
    }

    getSpellLevels() {
        return [
            {value:'0', name:'Cantrip'},
            {value:'1', name:'1st Level'},
            {value:'2', name:'2nd Level'},
            {value:'3', name:'3rd Level'},
            {value:'4', name:'4th Level'},
            {value:'5', name:'5th Level'},
            {value:'6', name:'6th Level'},
            {value:'7', name:'7th Level'},
            {value:'8', name:'8th Level'},
            {value:'9', name:'9th Level'}
        ]
    }

    getSpellTypes() {
        return [
        ]
    }

    getFeatureUses(item) {
        return {available: `+${this.getItemData(item).total.value}`};
    }
    
    getHP(token) {
        return this.getWounds(token);
    }

    rollItem(item) {
        return game.wfrp4e.utility.rollItemMacro(item.name, item.type, false);
    }

    getRollTypes() {
        return [
            {value:'initiative', name:'Initiative'},
            {value:'deathSave', name:'Death Save'}
        ]
    }

    getSpeed(token) {
        return this.getActorData(token).details.move.value;
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

    roll(token,roll,options,ability,skill,save) {
        if (ability == undefined) ability = 'ag';
        return game.wfrp4e.utility.rollItemMacro(ability, "characteristic", false);
    }

    getItems(token,itemType) {
        if (itemType == undefined) itemType = 'any';
        const allItems = token.actor.items;
        if (itemType == 'any') return allItems.filter(i => i.type == 'weapon' || 
        i.type == 'ammunition' || 
        i.type == 'armour' || 
        i.type == 'trapping');
        else {
            return allItems.filter(i => i.type == itemType);
        }
    }

    getItemUses(item) {
        if ( item.type == 'ammunition') {
            return {available: this.getItemData(item).quantity.value};
        }
        else {
            return;
        }
    }

    getItemTypes() {
        return [
            {value:'weapon', name: "Weapons"},
            {value:'ammunition', name: "Ammunition"},
            {value:'trapping', name: "Trapping"},
            {value:'armour', name: "Armour"},
            {value:'cargo', name: "Cargo"}
        ]
    }

    getSkillList() {
        return this.getAbilityList();
    }

    
    /* this is all cargo-culted in and some of it could be deleted once the interface is resolved
       to not be the superset of all possible systems 
    */ 

    getAC(token) {
        return;
    }

    getShieldHP(token) {
        return;
    }

    getInitiative(token) {
        return;
    }

    toggleInitiative(token) {
        return;
    }


    getConditionIcon(condition) {
        return;
    }

    getConditionActive(token,condition) {
        return;
    }

    getTempHP(token) {
        return;
    }

    getSavesList() {
        return [];
    }

    getWeaponRollModes() {
        return []
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