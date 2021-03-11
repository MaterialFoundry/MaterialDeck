import * as MODULE from "../MaterialDeck.js";
import {streamDeck} from "../MaterialDeck.js";

export class Move{
    constructor(){
        this.active = false;
    }

    update(settings,context){
        const background = settings.background ? settings.background : '#000000';
        const mode = settings.mode ? settings.mode : 'canvas';
        const type = settings.type ? settings.type : 'move';

        if ((MODULE.getPermission('MOVE','TOKEN') == false && mode == 'selectedToken') || (MODULE.getPermission('MOVE','CANVAS') == false && mode == 'canvas')) {
            streamDeck.noPermission(context);
            return;
        }

        let url = '';
        if (mode == 'canvas' || (mode == 'selectedToken' && type == 'move')){
            const dir = settings.dir ? settings.dir : 'center';
            if (dir == 'center')  //center
                url = "modules/MaterialDeck/img/move/center.png";
            else if (dir == 'up') //up
                url = "modules/MaterialDeck/img/move/up.png";
            else if (dir == 'down') //down
                url = "modules/MaterialDeck/img/move/down.png";
            else if (dir == 'right') //right
                url = "modules/MaterialDeck/img/move/right.png";
            else if (dir == 'left') //left
                url = "modules/MaterialDeck/img/move/left.png";
            else if (dir == 'upRight') 
                url = "modules/MaterialDeck/img/move/upright.png";
            else if (dir == 'upLeft') 
                url = "modules/MaterialDeck/img/move/upleft.png";
            else if (dir == 'downRight') 
                url = "modules/MaterialDeck/img/move/downright.png";
            else if (dir == 'downLeft') 
                url = "modules/MaterialDeck/img/move/downleft.png";
            else if (dir == 'zoomIn') 
                url = "modules/MaterialDeck/img/move/zoomin.png";
            else if (dir ==  'zoomOut') 
                url = "modules/MaterialDeck/img/move/zoomout.png";
        }
        else if (mode == 'selectedToken' && type == 'rotate'){
            const value = isNaN(parseInt(settings.rotValue)) ? 0 : parseInt(settings.rotValue);
            if (value >= 0) 
                url = "modules/MaterialDeck/img/move/rotatecw.png";
            else
                url = "modules/MaterialDeck/img/move/rotateccw.png";
        }
        streamDeck.setIcon(context,url,{background:background});
        streamDeck.setTitle('',context);
    }

    keyPress(settings){
        if (canvas.scene == null) return;
        if ((MODULE.getPermission('MOVE','TOKEN') == false && mode == 'selectedToken') || (MODULE.getPermission('MOVE','CANVAS') == false && mode == 'canvas')) {
            streamDeck.noPermission(context);
            return;
        }

        const dir = settings.dir ? settings.dir : 'center';
        const mode = settings.mode ? settings.mode : 'canvas';
        const type = settings.type ? settings.type : 'move';

        let token;
        if (mode == 'selectedToken') {
            const selection = settings.selection ? settings.selection : 'selected';
            const tokenIdentifier = settings.tokenName ? settings.tokenName : '';
    
            if (selection == 'selected') token = canvas.tokens.children[0].children.find(p => p.id == MODULE.selectedTokenId);
            else if (selection != 'selected' && tokenIdentifier == '') {}
            else if (selection == 'tokenName') token = canvas.tokens.children[0].children.find(p => p.name == tokenIdentifier);
            else if (selection == 'actorName') token = canvas.tokens.children[0].children.find(p => p.actor.name == tokenIdentifier);
            else if (selection == 'tokenId') token = canvas.tokens.children[0].children.find(p => p.id == tokenIdentifier);
            else if (selection == 'actorId') token = canvas.tokens.children[0].children.find(p => p.actor.id == tokenIdentifier);
            if (token == undefined) return;
        }

        if (type == 'move'){
            if (dir ==  'zoomIn') {//zoom in
                let viewPosition = canvas.scene._viewPosition;
                viewPosition.scale = viewPosition.scale*1.05;
                viewPosition.duration = 100;
                canvas.animatePan(viewPosition);
            }
            else if (dir == 'zoomOut') {//zoom out
                let viewPosition = canvas.scene._viewPosition;
                viewPosition.scale = viewPosition.scale*0.95;
                viewPosition.duration = 100;
                canvas.animatePan(viewPosition);
            }
            else {
                if (settings.mode == 'selectedToken')
                    this.moveToken(token,dir);
                else    
                    this.moveCanvas(dir);
            }
        }
        else if (type == 'rotate' && mode == 'selectedToken'){
            const rotType = settings.rot ? settings.rot : 'to';
            const value = isNaN(parseInt(settings.rotValue)) ? 0 : parseInt(settings.rotValue);

            let rotationVal;
            if (rotType == 'by') rotationVal = token.data.rotation + value;
            else if (rotType == 'to') rotationVal = value;
            
            token.update({rotation: rotationVal});
        }
    }

    async moveToken(token,dir){
        const gridSize = canvas.scene.data.grid;
        let x = token.x;
        let y = token.y;

        if (dir == 'up') y -= gridSize;
        else if (dir == 'down') y += gridSize;
        else if (dir == 'right') x += gridSize;
        else if (dir == 'left') x -= gridSize;
        else if (dir == 'upRight') {
            x += gridSize;
            y -= gridSize;
        }
        else if (dir == 'upLeft') {
            x -= gridSize;
            y -= gridSize;
        }
        else if (dir == 'downRight') {
            x += gridSize;
            y += gridSize;
        }
        else if (dir == 'downLeft') {
            x -= gridSize;
            y += gridSize;
        }
        else if (dir == 'center') {
            let location = token.getCenter(x,y); 
            canvas.animatePan(location);
        }
        if (game.user.isGM == false && (token.can(game.user,"control") == false || token.checkCollision(token.getCenter(x, y)))) return;
        token.update({x:x,y:y});
    };

    moveCanvas(dir){
        let viewPosition = canvas.scene._viewPosition;
        const gridSize = canvas.scene.data.grid;
        viewPosition.duration = 100;
        
        if (dir == 'up') viewPosition.y -= gridSize;
        else if (dir == 'down') viewPosition.y += gridSize;
        else if (dir == 'right') viewPosition.x += gridSize;
        else if (dir == 'left') viewPosition.x -= gridSize;
        else if (dir == 'upRight') {
            viewPosition.x += gridSize;
            viewPosition.y -= gridSize;
        }
        else if (dir == 'upLeft') {
            viewPosition.x -= gridSize;
            viewPosition.y -= gridSize;
        }
        else if (dir == 'downRight') {
            viewPosition.x += gridSize;
            viewPosition.y += gridSize;
        }
        else if (dir == 'downLeft') {
            viewPosition.x -= gridSize;
            viewPosition.y += gridSize;
        }
        else if (dir == 'center') {
            viewPosition.x = (canvas.dimensions.sceneWidth+window.innerWidth)/2;
            viewPosition.y = (canvas.dimensions.sceneHeight+window.innerHeight)/2;
        }
        canvas.animatePan(viewPosition);
    }
}