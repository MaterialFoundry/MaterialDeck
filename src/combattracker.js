import * as MODULE from "../MaterialDeck.js";
import {streamDeck, tokenControl} from "../MaterialDeck.js";

export class CombatTracker{
    constructor(){
        this.active = false;
        this.combatantLength = 0;
    }

    async updateAll(){
        if (this.active == false) return;
        for (let i=0; i<32; i++){   
            let data = streamDeck.buttonContext[i];
            if (data == undefined || data.action != 'combattracker') continue;
            await this.update(data.settings,data.context);
        }
    }

    update(settings,context){
        this.active = true;
        let ctFunction = settings.combatTrackerFunction;
        if (ctFunction == undefined) ctFunction == 0;
        

        let combat = game.combat;
        let src = "action/images/black.png";
        let txt = "";
        let background = "#000000";
        let mode = settings.combatTrackerMode;
        if (mode == undefined) mode = 0;

        if (mode == 0){
            if (combat != null && combat != undefined && combat.turns.length != 0){
                let initiativeOrder = combat.turns;
                let nr = settings.combatantNr - 1;
                if (nr == undefined || nr < 1) nr = 0;
                let combatantState = 1;
                if (nr == combat.turn) combatantState = 2;
                let combatant = initiativeOrder[nr]

                if (combatant != undefined){
                    let tokenId = combatant.tokenId;
                    tokenControl.pushData(tokenId,settings,context,combatantState,'#cccc00');
                    return;
                }
                else {
                    streamDeck.setIcon(0,context,src,background);
                    streamDeck.setTitle(txt,context);
                }
                
            }
            else {
                streamDeck.setIcon(0,context,src,background);
                streamDeck.setTitle(txt,context);
            }
        }
        else if (mode == 1){
            if (combat != null && combat != undefined && combat.started){
                let tokenId = combat.combatant.tokenId;
                tokenControl.pushData(tokenId,settings,context);
            }
            else {
                streamDeck.setIcon(0,context,src,background);
                streamDeck.setTitle(txt,context);
            }
            

        }
        else if (mode == 2){
            
            if (ctFunction == 0) {
                if (combat == null || combat == undefined || combat.combatants.length == 0) {
                    src = "action/images/combattracker/startcombat.png";
                    background = "#000000";
                }
                else {
                    if (combat.started == false) {
                        src = "action/images/combattracker/startcombat.png";
                        background = "#008000";
                    }
                    else {
                        src = "action/images/combattracker/stopcombat.png";
                        background = "#FF0000";
                    }
                }
            }
            else if (ctFunction == 1) {
                src = "action/images/combattracker/nextturn.png";
            }
            else if (ctFunction == 2) {
                src = "action/images/combattracker/previousturn.png";
            }
            else if (ctFunction == 3) {
                src = "action/images/combattracker/nextround.png";
            }
            else if (ctFunction == 4) {
                src = "action/images/combattracker/previousround.png";
            }
            else if (ctFunction == 5){
                src = "action/images/black.png";
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
            streamDeck.setIcon(0,context,src,background);
            streamDeck.setTitle(txt,context);
        }
    }

    keyPress(settings,context){
        let mode = parseInt(settings.combatTrackerMode);
        if (isNaN(mode)) mode = 0;
        
        if (mode < 2) {
            let onClick = settings.onClick;
            if (onClick == undefined) onClick = 0;
            let tokenId;
            let combat = game.combat;
            if (mode == 0) {
                if (combat != null && combat != undefined && combat.turns.length != 0){
                    let initiativeOrder = combat.turns;
                    let nr = settings.combatantNr - 1;
                    if (nr == undefined || nr < 1) nr = 0;
                    let combatantState = 1;
                    if (nr == combat.turn) combatantState = 2;
                    let combatant = initiativeOrder[nr]

                    if (combatant == undefined) return;
                    tokenId = combatant.tokenId;
                }
            }
            else if (mode == 1) 
                if (combat != null && combat != undefined && combat.started)
                    tokenId = combat.combatant.tokenId;
                
            let token = canvas.tokens.children[0].children.find(p => p.id == tokenId);
            if (token == undefined) return;
            if (onClick == 0)   //Do nothing
                return;
            else if (onClick == 1){ //select token
                token.control();
            }
            else if (onClick == 2){ //center on token
                let location = token.getCenter(token.x,token.y); 
                canvas.animatePan(location);
            }
            else if (onClick == 3){ //center on token and select
                let location = token.getCenter(token.x,token.y); 
                canvas.animatePan(location);
                token.control();
            }
            else if (onClick == 4){ //Open character sheet
                token.actor.sheet.render(true);
            }
            else {  //Open token config
                token.sheet._render(true);
            }
        }
        else if (mode == 2){
            let combat = game.combat;
            if (combat == null || combat == undefined) return;

            let ctFunction = settings.combatTrackerFunction;
            if (ctFunction == undefined) ctFunction == 0;

            if (ctFunction == 0){
                let src;
                let background;
                if (game.combat.started){
                    game.combat.endCombat();
                    src = "action/images/combattracker/startcombat.png";
                    background = "#000000";
                }
                else {
                    game.combat.startCombat();
                    src = "action/images/combattracker/stopcombat.png";
                    background = "#FF0000";
                }
                streamDeck.setIcon(context,src,background);
                return;
            }
            if (game.combat.started == false) return;

            if (ctFunction == 1) game.combat.nextTurn();
            else if (ctFunction == 2) game.combat.previousTurn();
            else if (ctFunction == 3) game.combat.nextRound();
            else if (ctFunction == 4) game.combat.previousRound();
        }
    }
}