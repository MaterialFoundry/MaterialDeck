import * as MODULE from "../MaterialDeck.js";

export class Move{
    constructor(){
        this.active = false;
    }

    keyPress(settings){
        if (canvas.scene == null) return;
        let dir = settings.dir;
        let mode = settings.mode;
        if (mode == undefined) mode = 0;
        if (dir == undefined) dir = 0;
        if (dir < 9){
            if (settings.mode == '1')
                this.moveToken(MODULE.selectedTokenId,dir);
            else    
                this.moveCanvas(dir);
        }
        else if (dir == 9) {//zoom in
            let viewPosition = canvas.scene._viewPosition;
            viewPosition.scale = viewPosition.scale*1.05;
            viewPosition.duration = 100;
            canvas.animatePan(viewPosition);
        }
        else if (dir == 10) {//zoom out
            let viewPosition = canvas.scene._viewPosition;
            viewPosition.scale = viewPosition.scale*0.95;
            viewPosition.duration = 100;
            canvas.animatePan(viewPosition);
        }
    }

    async moveToken(tokenId,dir){
        if (tokenId == undefined) return;
        const token = canvas.tokens.children[0].children.find(p => p.id == tokenId);
        const gridSize = canvas.scene.data.grid;
        let x = token.x;
        let y = token.y;

        if (dir == '1') y -= gridSize;
        else if (dir == '2') y += gridSize;
        else if (dir == '3') x += gridSize;
        else if (dir == '4') x -= gridSize;
        else if (dir == '5') {
            x += gridSize;
            y -= gridSize;
        }
        else if (dir == '6') {
            x -= gridSize;
            y -= gridSize;
        }
        else if (dir == '7') {
            x += gridSize;
            y += gridSize;
        }
        else if (dir == '8') {
            x -= gridSize;
            y += gridSize;
        }
        else if (dir == '0') {
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
        
        if (dir == '1') viewPosition.y -= gridSize;
        else if (dir == '2') viewPosition.y += gridSize;
        else if (dir == '3') viewPosition.x += gridSize;
        else if (dir == '4') viewPosition.x -= gridSize;
        else if (dir == '5') {
            viewPosition.x += gridSize;
            viewPosition.y -= gridSize;
        }
        else if (dir == '6') {
            viewPosition.x -= gridSize;
            viewPosition.y -= gridSize;
        }
        else if (dir == '7') {
            viewPosition.x += gridSize;
            viewPosition.y += gridSize;
        }
        else if (dir == '8') {
            viewPosition.x -= gridSize;
            viewPosition.y += gridSize;
        }
        else if (dir == '0') {
            viewPosition.x = (canvas.dimensions.sceneWidth+window.innerWidth)/2;
            viewPosition.y = (canvas.dimensions.sceneHeight+window.innerHeight)/2;
        }
        canvas.animatePan(viewPosition);
    }
}