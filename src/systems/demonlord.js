import { compatibleCore } from "../misc.js";

export class demonlord{
    conf;

    constructor(){
        console.log("Material Deck: Using system 'Shadow of the Demon Lord'");
        this.conf = CONFIG.DL;
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
            {value:'AC', name:'AC'},
            {value:'Speed', name:'Speed'},
            {value:'Init', name:'Initiative'},
            {value:'Ability', name:'Ability Score'},
            {value:'AbilityMod', name:'Ability Score Modifier'}
        ]
    }

    getAttackModes() {
        return [
            {value:'attack', name:'Attack'},
            {value:'damage', name:'Damage'},
            {value:'damageCrit', name:'Critical Damage'},
            {value:'versatile', name:'Versatile Damage'},
            {value:'versatileCrit', name:'Versatile Critical Damage'},
            {value:'otherFormula', name:'Other Formula'},
        ]
    }

    getHP(token) {
        const hp = this.getActorData(token).characteristics.health;
        return {
            value: hp.value,
            max: hp.max
        }
    }

    getTempHP(token) {
        return;
    }

    getAC(token) {
        return this.getActorData(token).characteristics.defense;
    }

    getShieldHP(token) {
        return;
    }

    getSpeed(token) {
        return this.getActorData(token).characteristics.speed;
    }

    getInitiative(token) {
        return this.getActorData(token).fastturn ? "FAST" : "SLOW";
    }

    toggleInitiative(token) {
        token.actor.update({
            'data.fastturn': !token.actor.data?.data?.fastturn
        });
        return;
    }

    getPassivePerception(token) {
        return;
    }

    getPassiveInvestigation(token) {
        return;
    }

    getAbility(token, ability) {
        if (ability == undefined) ability = 'strength';
        return this.getActorData(token).attributes?.[ability].value;
    } 

    getAbilityModifier(token, ability) {
        if (ability == undefined) ability = 'str';
        let val = this.getActorData(token).attributes?.[ability].modifier;
        return (val >= 0) ? `+${val}` : val;
    }

    getAbilitySave(token, ability) {
        return;
    }

    getSavesList() {
        return [];
    }

    getAbilityList() {
        const keys = Object.keys(this.conf.attributes);
        let abilities = [];
        for (let k of keys) abilities.push({value:k, name:this.conf.attributes?.[k]})
        return abilities;
    }
    
    getSkill(token, skill) {
        if (skill == undefined) skill = 'acr';
        const val = this.getActorData(token).skills?.[skill].total;
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

    getConditionList() {
        let conditions = [];
        for (let c of CONFIG.statusEffects) if (c.disabled != undefined) conditions.push({value:c.id, name:c.label});
        return conditions;
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
        return;
    }

    /**
     * Items
     */
    getItems(token,itemType) {
        if (itemType == undefined) itemType = 'any';
        const allItems = token.actor.items;
        if (itemType == 'any') return allItems.filter(i => i.type == 'item');
    }

    getItemUses(item) {
        return {available: getItemData(item).quantity};
    }

    /**
     * Spells
     */
     getSpells(token,level,type) {
        if (level == undefined) level = 'any';
        const allItems = token.actor.items;
        if (level == 'any') return allItems.filter(i => i.type == 'spell')
        else return allItems.filter(i => i.type == 'spell' && getItemData(i).rank == level)
    }

    getSpellUses(token,level,item) {
        return;
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

    getSkillList() {
        return [];
    }

    getOnClickList() {
        return [{value:'initiative',name:'Toggle Initiative'}]
    }

    getRollTypes() {
        return []
    }

    getItemTypes() {
        return []
    }

    getWeaponRollModes() {
        return []
    }

    getFeatureTypes() {
        return [
            {value:'class', name:'Class'},
            {value:'feat', name:'Abilities'}
        ]
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
}