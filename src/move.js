import * as MODULE from "../MaterialDeck.js";
import {streamDeck} from "../MaterialDeck.js";

export class Move{
    constructor(){
        this.active = false;
    }

    update(settings,context){
        let background;
        if (settings.background) background = settings.background;
        else background = '#000000';

        let url = '';
        if (settings.dir == 'center')  //center
            url = "modules/MaterialDeck/img/move/center.png";
        else if (settings.dir == 'up') //up
            url = "modules/MaterialDeck/img/move/up.png";
        else if (settings.dir == 'down') //down
            url = "modules/MaterialDeck/img/move/down.png";
        else if (settings.dir == 'right') //right
            url = "modules/MaterialDeck/img/move/right.png";
        else if (settings.dir == 'left') //left
            url = "modules/MaterialDeck/img/move/left.png";
        else if (settings.dir == 'upRight') 
            url = "modules/MaterialDeck/img/move/upright.png";
        else if (settings.dir == 'upLeft') 
            url = "modules/MaterialDeck/img/move/upleft.png";
        else if (settings.dir == 'downRight') 
            url = "modules/MaterialDeck/img/move/downright.png";
        else if (settings.dir == 'downLeft') 
            url = "modules/MaterialDeck/img/move/downleft.png";
        else if (settings.dir == 'zoomIn') 
            url = "modules/MaterialDeck/img/move/zoomin.png";
        else if (settings.dir ==  'zoomOut') 
            url = "modules/MaterialDeck/img/move/zoomout.png";
        streamDeck.setIcon(context,url,background);
    }
    keyPress(settings){
        if (canvas.scene == null) return;
        let dir = settings.dir;
        let mode = settings.mode;
        if (mode == undefined) mode = 'canvas';
        if (dir == undefined) dir = 'center';

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
                this.moveToken(MODULE.selectedTokenId,dir);
            else    
                this.moveCanvas(dir);
        }
    }

    async moveToken(tokenId,dir){
        if (tokenId == undefined) return;
        const token = canvas.tokens.children[0].children.find(p => p.id == tokenId);
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