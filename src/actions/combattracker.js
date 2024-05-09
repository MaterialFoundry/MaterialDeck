import { materialDeck, getPermission } from "../../MaterialDeck.js";

export class CombatTracker{
    constructor(){
        this.active = false;
        this.combatantLength = 0;
    }

    async updateAll(){
        if (this.active == false) return;
        for (let device of materialDeck.streamDeck.buttonContext) {
            if (device?.buttons == undefined) continue;
            for (let i=0; i<device.buttons.length; i++){   
                const data = device.buttons[i];
                if (data == undefined || data.action != 'combattracker') continue;
                await this.update(data.settings,data.context,device.device);
            }
        }
    }

    applyFilter(combatant, settings) {
        let conf = {
            forceIcon: undefined,
            hideName: false
        }
        const disposition = combatant.token.disposition;
        const hidden = combatant.token.hidden;
        const visibilityMode = settings.visibilityMode ? settings.visibilityMode : 'remove';
        const dispositionMode = settings.dispositionMode ? settings.dispositionMode : 'remove';
        if (hidden && (settings.visibilityFilter == 'all' || (settings.visibilityFilter == 'hostileNeutral' && disposition != 1) || (settings.visibilityFilter == 'hostile' && disposition == -1))) {
            if (visibilityMode == 'black' || visibilityMode == 'remove') conf.forceIcon = "modules/MaterialDeck/img/black.png";
            else if (visibilityMode == 'mysteryMan') conf.forceIcon = "modules/MaterialDeck/img/token/mystery-man.png";
            else if (visibilityMode == 'hideName') conf.hideName = true;
        }
        if ((settings.dispositionFilter == 'friendlyNeutral' && disposition == -1) || (settings.dispositionFilter == 'friendly' && disposition != 1))  {
            if (conf.forceIcon == undefined && (dispositionMode == 'black' || dispositionMode == 'remove')) conf.forceIcon = "modules/MaterialDeck/img/black.png";
            else if (conf.forceIcon == undefined && dispositionMode == 'mysteryMan') conf.forceIcon = "modules/MaterialDeck/img/token/mystery-man.png";
            else if (dispositionMode == 'hideName') conf.hideName = true;
        }
        return conf;
    }

    update(settings,context,device){
        this.active = true;
        const ctFunction = settings.combatTrackerFunction ? settings.combatTrackerFunction : 'startStop';
        const mode = settings.combatTrackerMode ? settings.combatTrackerMode : 'combatants';
        settings.combatTrackerMode = mode;
        const sceneMode = settings.sceneMode ? settings.sceneMode : 'current';
        const sceneName = settings.sceneName ? settings.sceneName : '';
        const encounterNr = settings.encounterNr ? settings.encounterNr : '';

        let combats;
        if (sceneMode == 'current') combats = [game.combat];
        else if (sceneMode == 'active') {combats = game.combats.contents.filter(c => c.scene?.active == true || c.scene == null)}
        else if (sceneMode == 'name') {combats = game.combats.contents.filter(c => c.scene?.name == sceneName)}
        else if (sceneMode == 'unlinked') {combats = game.combats.contents.filter(c => c.scene == null)}

        let combat;
        if (encounterNr == '') {
            combat = combats.filter(c => c.id == game.combats.viewed.id)[0];
            if (combat == undefined)
            combat = combats[0];
        }
        else if (parseInt(encounterNr) != NaN) {
            
            combat = combats[parseInt(encounterNr)-1];
        }
        else {
            combat = null;
        }
            
        let src = "modules/MaterialDeck/img/black.png";
        let txt = "";
        let background = "#000000";
        settings.combat = true;
        settings.icon = settings.displayIcon ? 'tokenIcon' : 'none';
        if (mode == 'combatants'){
            if (getPermission('COMBAT','DISPLAY_COMBATANTS') == false) {
                materialDeck.streamDeck.noPermission(context,device,device,false,"combat tracker");
                return;
            }
            if (combat != null && combat != undefined && combat.turns.length != 0){
                let initiativeOrder = combat.turns;
                const dispositionMode = settings.dispositionMode ? settings.dispositionMode : 'remove';
                if (dispositionMode == 'remove' && settings.dispositionFilter == 'friendly') initiativeOrder = initiativeOrder.filter(c => c.token.disposition == 1);
                else if (dispositionMode == 'remove' && settings.dispositionFilter == 'friendlyNeutral') initiativeOrder = initiativeOrder.filter(c => c.token.disposition != -1);
                const visibilityMode = settings.visibilityMode ? settings.visibilityMode : 'none';
                if (visibilityMode == 'remove' && settings.visibilityFilter == 'hostile') initiativeOrder = initiativeOrder.filter(c => c.token.disposition != -1 && c.token.hidden == false)
                else if (visibilityMode == 'remove' && settings.visibilityFilter == 'hostileNeutral') initiativeOrder = initiativeOrder.filter(c => c.token.disposition == 1 && c.token.hidden == false)
                else if (visibilityMode == 'remove' && settings.visibilityFilter == 'all') initiativeOrder = initiativeOrder.filter(c => c.token.hidden == false)
                const nr = settings.combatantNr ? settings.combatantNr - 1 : 0;
                const combatant = initiativeOrder[nr]
                const combatantState = (combatant?.token.id == combat.current.tokenId) ? 2 : 1;

                if (combatant != undefined){
                    const filterConfig = this.applyFilter(combatant, settings);
                    const tokenId = combatant.token.id;
                    //materialDeck.tokenControl.pushData(tokenId,settings,context,device,combatantState,'#cccc00', filterConfig.forceIcon, filterConfig.hideName);

                    materialDeck.tokenControl.pushData({
                        token: combatant.token,
                        tokenId,
                        settings,
                        context,
                        device,
                        ring: combatantState,
                        ringColor: '#cccc00',
                        forceIcon : filterConfig.forceIcon,
                        hideName: filterConfig.hideName
                    });
                    return;
                }
                else {
                    if (settings.iconOverride != '' && settings.iconOverride != undefined) src = settings.iconOverride;
                    materialDeck.streamDeck.setIcon(context,device,src,{background:background});
                    materialDeck.streamDeck.setTitle(txt,context);
                } 
            }
            else {
                if (settings.iconOverride != '' && settings.iconOverride != undefined) src = settings.iconOverride;
                materialDeck.streamDeck.setIcon(context,device,src,{background:background});
                materialDeck.streamDeck.setTitle(txt,context);
            }
        }
        else if (mode == 'currentCombatant'){
            if (getPermission('COMBAT','DISPLAY_COMBATANTS') == false) {
                materialDeck.streamDeck.noPermission(context,device,device);
                return;
            }
            if (combat != null && combat != undefined && combat.started){
                const filterConfig = this.applyFilter(combat.combatant, settings);
                const tokenId = combat.combatant.token.id;
                //materialDeck.tokenControl.pushData(tokenId,settings,context,device,undefined,undefined, filterConfig.forceIcon, filterConfig.hideName);
                materialDeck.tokenControl.pushData({
                    token: undefined,
                    tokenId,
                    settings,
                    context,
                    device,
                    forceIcon : filterConfig.forceIcon,
                    hideName: filterConfig.hideName
                });
            }
            else {
                if (settings.iconOverride != '' && settings.iconOverride != undefined) src = settings.iconOverride;
                materialDeck.streamDeck.setIcon(context,device,src,{background:background});
                materialDeck.streamDeck.setTitle(txt,context);
            }
        }
        else if (mode == 'function'){

            if (ctFunction == 'turnDisplay' && getPermission('COMBAT','TURN_DISPLAY') == false) {
                materialDeck.streamDeck.noPermission(context,device);
                return;
            }
            else if (ctFunction == 'endTurn' && getPermission('COMBAT','END_TURN') == false) {
                materialDeck.streamDeck.noPermission(context,device);
                return;
            }
            else if (ctFunction != 'turnDisplay' && ctFunction != 'endTurn' && getPermission('COMBAT','OTHER_FUNCTIONS') == false) {
                materialDeck.streamDeck.noPermission(context,device);
                return;
            }
            else if (ctFunction == 'addTokens' && getPermission('COMBAT','OTHER_FUNCTIONS') == false) {
                materialDeck.streamDeck.noPermission(context,device);
                return;
            }

            if (ctFunction == 'startStop') {
                if (combat == null || combat == undefined || combat.combatants.length == 0) {
                    src = "modules/MaterialDeck/img/combattracker/startcombat.png";
                    background = "#000000";
                }
                else {
                    if (combat.started == false) {
                        src = "modules/MaterialDeck/img/combattracker/startcombat.png";
                        background = "#008000";
                    }
                    else {
                        src = "modules/MaterialDeck/img/combattracker/stopcombat.png";
                        background = "#FF0000";
                    }
                }
            }
            else if (ctFunction == 'endTurn') 
                src = "modules/MaterialDeck/img/combattracker/nextturn.png";
            else if (ctFunction == 'nextTurn') 
                src = "modules/MaterialDeck/img/combattracker/nextturn.png";
            
            else if (ctFunction == 'prevTurn') 
                src = "modules/MaterialDeck/img/combattracker/previousturn.png";
            else if (ctFunction == 'nextRound') 
                src = "modules/MaterialDeck/img/combattracker/nextround.png";
            else if (ctFunction == 'prevRound')
                src = "modules/MaterialDeck/img/combattracker/previousround.png";
            else if (ctFunction == 'turnDisplay'){
                src = "modules/MaterialDeck/img/black.png";
                let round = 0;
                let turn = 0;
                if (combat != null && combat != undefined && combat.started != false){
                    round = combat.round;
                    turn = combat.turn+1;
                }
                if (settings.displayRound) txt += "Round\n"+round;
                if (settings.displayRound && settings.displayTurn) txt += "\n";
                if (settings.displayTurn) txt += "Turn\n"+turn;
            }
            else if (ctFunction == 'rollInitiative' || ctFunction == 'rollInitiativeNPC')
                src = "modules/MaterialDeck/img/token/init.png";
            else if (ctFunction == 'addTokens') 
                src = window.CONFIG.controlIcons.combat;

            if (settings.iconOverride != '' && settings.iconOverride != undefined) {
                src = settings.iconOverride;
                background = settings.background ? settings.background : '#000000'
            }

            materialDeck.streamDeck.setIcon(context,device,src,{background:background});
            materialDeck.streamDeck.setTitle(txt,context);
        }
    }

    async keyPress(settings,context,device){
        const mode = settings.combatTrackerMode ? settings.combatTrackerMode : 'combatants';
        const selectCombatant = settings.selectCombatant ? settings.selectCombatant : false;
        const combat = game.combat;

        if (mode == 'function'){
            if (combat == null || combat == undefined) return;
            const ctFunction = settings.combatTrackerFunction ? settings.combatTrackerFunction : 'startStop';

            if (ctFunction == 'turnDisplay' && getPermission('COMBAT','TURN_DISPLAY') == false) {
                materialDeck.streamDeck.noPermission(context,device);
                return;
            }
            else if (ctFunction == 'endTurn' && getPermission('COMBAT','END_TURN') == false) {
                materialDeck.streamDeck.noPermission(context,device);
                return;
            }
            else if (ctFunction != 'turnDisplay' && ctFunction != 'endTurn' && getPermission('COMBAT','OTHER_FUNCTIONS') == false) {
                materialDeck.streamDeck.noPermission(context,device);
                return;
            }
            else if (ctFunction == 'startStop'){
                if (game.combat.started){
                    game.combat.endCombat();
                }
                else {
                    game.combat.startCombat();
                }
                return;
            }
            else if (ctFunction == 'rollInitiative' && getPermission('COMBAT','OTHER_FUNCTIONS')) game.combat.rollAll();
            else if (ctFunction == 'rollInitiativeNPC' && getPermission('COMBAT','OTHER_FUNCTIONS')) game.combat.rollNPC();
            else if (ctFunction == 'addTokens' && getPermission('COMBAT','OTHER_FUNCTIONS')) {
                const controlledToken = canvas.tokens.controlled[0];
                if (controlledToken != undefined) controlledToken.toggleCombat();
            }
            
            if (game.combat.started == false) return;
            if (ctFunction == 'nextTurn') await game.combat.nextTurn();
            else if (ctFunction == 'prevTurn') await game.combat.previousTurn();
            else if (ctFunction == 'nextRound') await game.combat.nextRound();
            else if (ctFunction == 'prevRound') await game.combat.previousRound();
            else if (ctFunction == 'endTurn' && game.combat.combatant.owner) await game.combat.nextTurn();
            
            if (selectCombatant) {
                const token = canvas.tokens.placeables.filter(token => token.id == game.combat.combatant.token.id)[0];
                if (token.can(game.userId,"control")) token.control();
            }
        }
        else {
            const onClick = settings.onClick ? settings.onClick : 'doNothing';
            let tokenId;
            if (mode == 'combatants') {
                if (combat != null && combat != undefined && combat.turns.length != 0){
                    const initiativeOrder = combat.turns;
                    let nr = settings.combatantNr - 1;
                    if (nr == undefined || nr < 1) nr = 0;
                    const combatant = initiativeOrder[nr]
                    if (combatant == undefined) return;
                    tokenId = combatant.token.id;
                }
            }
            else if (mode == 'currentCombatant') 
                if (combat != null && combat != undefined && combat.started)
                    tokenId = combat.combatant.token.id;
                
            let token = (canvas.tokens.children[0] != undefined) ? canvas.tokens.children[0].children.find(p => p.id == tokenId) : undefined;
            if (token == undefined) return;
            if (onClick == 'doNothing')   //Do nothing
                return;
            else if (onClick == 'select'){ //select token
                token.control();
            }
            else if (onClick == 'center'){ //center on token
                let location = token.getCenter(token.x,token.y); 
                canvas.animatePan(location);
            }
            else if (onClick == 'centerSelect'){ //center on token and select
                const location = token.getCenter(token.x,token.y); 
                canvas.animatePan(location);
                token.control();
            }
            else if (onClick == 'charSheet'){ //Open character sheet
                const element = document.getElementById(token.actor.sheet.id);
                if (element == null) token.actor.sheet.render(true);
                else token.actor.sheet.close();
            }
            else if (onClick == 'tokenConfig'){  //Open token config
                const element = document.getElementById(token.sheet.id);
                if (element == null) token.sheet.render(true);
                else token.sheet.close();
            }
            else if (onClick == 'rollInitiative') {
                token.actor.rollInitiative({rerollInitiative:true});
            }
            else if (onClick == 'target') {
                token.setTarget(!token.isTargeted,{releaseOthers:false})
            }
        }
        
    }
}