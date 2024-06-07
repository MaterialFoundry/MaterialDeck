import { compatibleCore } from "./misc.js";

let isV12 = false;

function selectMP(selected, options) {
    const escapedValue = RegExp.escape(Handlebars.escapeExpression(selected));
    const rgx = new RegExp(` value=[\"']${escapedValue}[\"\']`);
    const html = options.fn(this);
    return html.replace(rgx, "$& selected");
}

export function compatibilityInit() {
    isV12 = compatibleCore('12');

    /**
     * This is to prevent the handlebar compatibility warning in forms by temporarily registering a custom handlebar. When v11 support is dropped, replace all {{#selectMP}} instances with {{#selectOptions}}
     */
    if (isV12)           Handlebars.registerHelper('selectMP', selectMP);
    else                                Handlebars.registerHelper('selectMP', Handlebars.helpers.select);
}

export function compatibilityHandler(id, ...args) {
    //console.log('combatibiliyHandler',id, args)

    if (id == 'isEmpty')                    return isEmptyHandler(args[0]);
    else if (id == 'sceneDarkness')         return sceneDarkness();
    else if (id == 'toggleCombatant')       toggleCombatant(args[0]);
    else if (id == 'tokenOwner')            return tokenOwner(args[0]);
    else if (id == 'mergeObject')           return mergeObj(args);
    else if (id == 'rollDice')              return rollDice(args[0]);
    else if (id == 'compendiumOwnership')   return compendiumOwnership(args[0]);
    else if (id == 'audioHelper')           return audioHelper();
    else if (id == 'onSoundEnd')            return onSoundEnd(args[0], args[1]);
    else if (id == 'tokenCenter')           return tokenCenter(args[0]);
}

function isEmptyHandler(data) {
    if (isV12)   return foundry.utils.isEmpty(data);
    else         return isEmpty(data);
}

function sceneDarkness() {
    if (isV12)   return canvas.scene.environment.darknessLevel;
    else         return canvas.scene.darkness;
}

function toggleCombatant(token) {
    if (isV12)   token.document.toggleCombatant();
    else         token.toggleCombat();
}

function tokenOwner(token) {
    if (isV12)   return token.isOwner;
    else         return token.owner;
}

function mergeObj(args) {
    if (isV12)   return foundry.utils.mergeObject(args[0], args[1], args[2]);
    else         return mergeObject(args[0], args[1], args[2]);
}

async function rollDice(roll) {
    if (isV12)   return await roll.evaluate();
    else         return await roll.evaluate({async:false});
}

function compendiumOwnership(compendium) {
    if (isV12)  return compendium.ownership;
    else        return compendium.private;
}

function audioHelper(compendium) {
    if (isV12)  return foundry.audio.AudioHelper;
    else        return AudioHelper;
}

function onSoundEnd(sound, cb) {
    if (isV12)  sound.addEventListener('end', cb);
    else        sound.on('end', cb);
}

function tokenCenter(token) {
    if (isV12)  return token.getCenterPoint({x:token.x, y:token.y});
    else        return token.getCenter(token.x,token.y);
}