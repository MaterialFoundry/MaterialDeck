import { compatibleCore } from "../misc.js";

export class forbiddenlands{
    conf;

    constructor(){
        console.log("Material Deck: Using system 'Forbidden Lands'");
        this.conf = CONFIG.fbl;
    }

    getActorData(token) {
        return token.actor.system;
    }

    getItemData(item) {
        return item.system;
    }

    getStatsList() {
        return [
            {value:'HP', name:'Strength'},
            {value:'HPbox', name:'Strength (box)'},
            {value:'Agility', name:'Agility'},
            {value:'Wits', name:'Wits'},
            {value:'Empathy', name:'Empathy'},
            {value:'WillPower', name:'Will Power'},
            {value:'AC', name:'Armor'},
            {value:'Skill', name:'Skill'}
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
        const hp = this.getActorData(token).attribute.strength;
        return {
            value: hp.value,
            max: hp.max
        }
    }

    getAgility(token) {
        const agility = this.getActorData(token).attribute.agility;
        return {
            value: agility.value,
            max: agility.max
        }
    }

    getWits(token) {
        const wits = this.getActorData(token).attribute.wits;
        return {
            value: wits.value,
            max: wits.max
        }
    }

    getEmpathy(token) {
        const empathy = this.getActorData(token).attribute.empathy;
        return {
            value: empathy.value,
            max: empathy.max
        }
    }

    getWillPower(token) {
        const wp = this.getActorData(token).bio.willpower;
        return {
            value: wp.value,
            max: wp.max
        }
    }

    getTempHP(token) {
        return 0;
    }

    getAC(token) {
        const totalArmor = token.actor.itemTypes.armor.reduce((sum, armor) => {
			if (armor.itemProperties.part === "shield") return sum;
			const value = armor.itemProperties.bonus.value;
			return (sum += value);
		}, 0);
        return totalArmor;
    }

    getShieldHP(token) {
        return;
    }

    getSpeed(token) {
        return 1;
    }

    getInitiative(token) {
        return 0;
    }

    toggleInitiative(token) {
        return;
    }

    getPassivePerception(token) {
        return 0;
    }

    getPassiveInvestigation(token) {
        return;
    }

    getAbility(token, ability) {
        if (ability == undefined) ability = 'strength';
        return this.getActorData(token).attribute?.[ability].value;
    } 

    getAbilityModifier(token, ability) {
        return;
    }

    getAbilitySave(token, ability) {
        return this.getAbility(token, ability);
    }

    getAbilityList() {
        const abilityList = this.conf.attributes;
        let abilities = [];
        for (let a of abilityList) abilities.push({value:a, name:a.charAt(0).toUpperCase() + a.slice(1)})
        return abilities;
    }

    getSavesList() {
        return this.getAbilityList();
    }

    getSkill(token, skill) {
        if (skill == undefined) skill = 'might';
        let skillComp = token.actor.sheet.getSkill(skill);
        const val = skillComp.skill.value + skillComp.attribute.value;
        return game.i18n.localize(skillComp.skill.label)+`-${val}`;
    }

    getSkillList() {
        const keys = Object.keys(this.conf.skillAttributeMap);
        let skills = [];
        for (let s of keys) {
            const nameArr = s.split('-');
            let name = '';
            for (let p of nameArr) name += p.charAt(0).toUpperCase() + p.slice(1) + ' ';
            skills.push({value:s, name})
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
        if (ability == undefined) ability = 'strength';
        if (skill == undefined) skill = 'might';
        if (save == undefined) save = 'strength';

        if (roll == 'ability') token.actor.sheet.rollAttribute(ability);
        else if (roll == 'save') token.actor.sheet.rollAttribute(save);
        else if (roll == 'skill') token.actor.sheet.rollSkill(skill);
        else if (roll == 'rollFood') token.actor.sheet.rollConsumable('food');
        else if (roll == 'rollWater') token.actor.sheet.rollConsumable('water');
        else if (roll == 'rollArrows') token.actor.sheet.rollConsumable('arrows');
        else if (roll == 'rollTorches') token.actor.sheet.rollConsumable('torches');
        else if (roll == 'rollArmor') token.actor.sheet.rollArmor();
        else if (roll == 'monsterAttack') token.actor.sheet.rollAttack();
        //else if (roll == 'initiative') token.actor.rollInitiative(options);
    }

    getRollTypes() {
        return [
            {value:'rollFood', name:'Roll Food'},
            {value:'rollWater', name:'Roll Water'},
            {value:'rollArrows', name:'Roll Arrows'},
            {value:'rollTorches', name:'Roll Torches'},
            {value:'rollArmor', name:'Roll Armor'},
            {value:'monsterAttack', name:'Roll Monster Attack'}
        ]
    }

    /**
     * Items
     */
    getItems(token,itemType) {
        if (itemType == undefined) itemType = 'any';
        const allItems = token.actor.items;
        if (itemType == 'any') return allItems.filter(i => i.type == 'weapon' || i.type == 'armor' || i.type == 'gear' || i.type == 'rawMaterial');
        else if (token.actor.type == 'monster' && itemType == 'weapon')
        {
            return allItems.filter(i => i.type == 'monsterAttack');
        }
        return allItems.filter(i => i.type == itemType);
    }

    getItemUses(item) {
        if (item.type == 'monsterAttack') return;
        if (item.type == 'rawMaterial') return {available: this.getItemData(item).quantity};
        return {available: this.getItemData(item).bonus.value,
            maximum: this.getItemData(item).bonus.max};
    }

    getItemTypes() {
        return [
            {value:'armor', name: "Armour"},
            {value:'gear', name: "Gear"},
            {value:'weapon', name: "Weapons"},
            {value:'rawMaterial', name: "Raw Material"}
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
        if (featureType == 'any') return allItems.filter(i => i.type == 'talent')
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
        return []
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
            available: this.getActorData(token).spells?.[`spell${level}`].value,
            maximum: this.getActorData(token).spells?.[`spell${level}`].max
        }
    }

    getSpellLevels() {
        return [];
    }

    getSpellTypes() {
        return [
        ]
    }

    rollItem(item) {
        const sheet = item.actor.sheet;
        if (item.type === "armor")
        return sheet.rollSpecificArmor(item.id);
        else if (item.type === "weapon")
        return sheet.rollGear(item.id);
        else if (item.type === "spell")
        return sheet.rollSpell(item.id);
        else if (item.type === "monsterAttack")
        sheet.rollSpecificAttack(item.id);
        return item.sendToChat();
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