import * as MODULE from "../MaterialDeck.js";
import {streamDeck, tokenControl} from "../MaterialDeck.js";
import {compatibleCore} from "./misc.js";

export class CombatTracker{
    constructor(){
        this.active = false;
        this.combatantLength = 0;
    }

    async updateAll(){
        if (this.active == false) return;
        for (let device of streamDeck.buttonContext) {
            if (device?.buttons == undefined) continue;
            for (let i=0; i<device.buttons.length; i++){   
                const data = device.buttons[i];
                if (data == undefined || data.action != 'combattracker') continue;
                await this.update(data.settings,data.context,device.device);
            }
        }
    }

    update(settings,context,device){
        this.active = true;
        const ctFunction = settings.combatTrackerFunction ? settings.combatTrackerFunction : 'startStop';
        const mode = settings.combatTrackerMode ? settings.combatTrackerMode : 'combatants';
        const combat = game.combat;
        let src = "modules/MaterialDeck/img/black.png";
        let txt = "";
        let background = "#000000";
        settings.combat = true;
        settings.icon = settings.displayIcon ? 'tokenIcon' : 'none';
        
        if (mode == 'combatants'){
            if (MODULE.getPermission('COMBAT','DISPLAY_COMBATANTS') == false) {
                streamDeck.noPermission(context,device,device,false,"combat tracker");
                return;
            }
            if (combat != null && combat != undefined && combat.turns.length != 0){
                const initiativeOrder = combat.turns;
                let nr = settings.combatantNr - 1;
                if (nr == undefined || nr < 1) nr = 0;
                const combatantState = (nr == combat.turn) ? 2 : 1;
                const combatant = initiativeOrder[nr]

                if (combatant != undefined){
                    const tokenId = compatibleCore("0.8.1") ? combatant.data.tokenId : combatant.tokenId;
                    tokenControl.pushData(tokenId,settings,context,device,combatantState,'#cccc00');
                    return;
                }
                else {
                    streamDeck.setIcon(context,device,src,{background:background});
                    streamDeck.setTitle(txt,context);
                } 
            }
            else {
                streamDeck.setIcon(context,device,src,{background:background});
                streamDeck.setTitle(txt,context);
            }
        }
        else if (mode == 'currentCombatant'){
            if (MODULE.getPermission('COMBAT','DISPLAY_COMBATANTS') == false) {
                streamDeck.noPermission(context,device,device);
                return;
            }
            if (combat != null && combat != undefined && combat.started){
                const tokenId = compatibleCore("0.8.1") ? combat.combatant.data.tokenId : combat.combatant.tokenId;
                tokenControl.pushData(tokenId,settings,context,device);
            }
            else {
                streamDeck.setIcon(context,device,src,{background:background});
                streamDeck.setTitle(txt,context);
            }
        }
        else if (mode == 'function'){

            if (ctFunction == 'turnDisplay' && MODULE.getPermission('COMBAT','TURN_DISPLAY') == false) {
                streamDeck.noPermission(context,device);
                return;
            }
            else if (ctFunction == 'endTurn' && MODULE.getPermission('COMBAT','END_TURN') == false) {
                streamDeck.noPermission(context,device);
                return;
            }
            else if (ctFunction != 'turnDisplay' && ctFunction != 'endTurn' && MODULE.getPermission('COMBAT','OTHER_FUNCTIONS') == false) {
                streamDeck.noPermission(context,device);
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
            else if (ctFunction == 'endTurn') {
                src = "modules/MaterialDeck/img/combattracker/nextturn.png";
            }
            else if (ctFunction == 'nextTurn') {
                src = "modules/MaterialDeck/img/combattracker/nextturn.png";
            }
            else if (ctFunction == 'prevTurn') {
                src = "modules/MaterialDeck/img/combattracker/previousturn.png";
            }
            else if (ctFunction == 'nextRound') {
                src = "modules/MaterialDeck/img/combattracker/nextround.png";
            }
            else if (ctFunction == 'prevRound') {
                src = "modules/MaterialDeck/img/combattracker/previousround.png";
            }
            else if (ctFunction == 'turnDisplay'){
                src = "modules/MaterialDeck/img/black.png";
                let round = 0;
                let turn = 0;
                if (combat != null && combat != undefined && combat.started != false){
                    round = combat.round;
                    turn = combat.turn+1;
                }
                if (settings.displayRound) txt += "Round\n"+round;
                if (txt != "") txt += "\n";
                if (settings.displayTurn) txt += "Turn\n"+turn;
            }
            streamDeck.setIcon(context,device,src,{background:background});
            streamDeck.setTitle(txt,context);
        }
    }

    keyPress(settings,context,device){
        const mode = settings.combatTrackerMode ? settings.combatTrackerMode : 'combatants';
        const combat = game.combat;

        if (mode == 'function'){
            if (combat == null || combat == undefined) return;
            const ctFunction = settings.combatTrackerFunction ? settings.combatTrackerFunction : 'startStop';

            if (ctFunction == 'turnDisplay' && MODULE.getPermission('COMBAT','TURN_DISPLAY') == false) {
                streamDeck.noPermission(context,device);
                return;
            }
            else if (ctFunction == 'endTurn' && MODULE.getPermission('COMBAT','END_TURN') == false) {
                streamDeck.noPermission(context,device);
                return;
            }
            else if (ctFunction != 'turnDisplay' && ctFunction != 'endTurn' && MODULE.getPermission('COMBAT','OTHER_FUNCTIONS') == false) {
                streamDeck.noPermission(context,device);
                return;
            }

            if (ctFunction == 'startStop'){
                let src;
                let background;
                if (game.combat.started){
                    game.combat.endCombat();
                }
                else {
                    game.combat.startCombat();
                }
                return;
            }
            if (game.combat.started == false) return;
            
            if (ctFunction == 'nextTurn') game.combat.nextTurn();
            else if (ctFunction == 'prevTurn') game.combat.previousTurn();
            else if (ctFunction == 'nextRound') game.combat.nextRound();
            else if (ctFunction == 'prevRound') game.combat.previousRound();
            else if (ctFunction == 'endTurn' && game.combat.combatant.owner) game.combat.nextTurn();
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
                    tokenId = compatibleCore("0.8.1") ? combatant.data.tokenId : combatant.tokenId;
                }
            }
            else if (mode == 'currentCombatant') 
                if (combat != null && combat != undefined && combat.started)
                    tokenId = compatibleCore("0.8.1") ? combat.combatant.data.tokenId : combat.combatant.tokenId;
                
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
        }
        
    }
}