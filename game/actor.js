

//==============================================================================

//-- Dependencies --------------------------------
import {DIR} from '../shared/constants.js';
import Movable from './movable.js';
import map from './map.js';


//==============================================================================

export default class Actor extends Movable {
    
    //------------------------------------------------
    async takeTurn() {
        // Defer to intelligence, if one exists
        if(this.intelligence) {
            return await this.intelligence.takeTurn(this);
        }
        // Otherwise, do default behavior
        this.behavior();
    }
    acceptIntelligence(intelligence) {
        this.intelligence = intelligence;
    }
    behavior() {}
    
    //------------------------------------------------
    walk(direction) {
        let deltaX = 0;
        let deltaY = 0;
        if(direction & DIR.NORTH) { deltaY++;}
        if(direction & DIR.SOUTH) { deltaY--;}
        if(direction & DIR.EAST ) { deltaX++;}
        if(direction & DIR.WEST ) { deltaX--;}
        return this.move(this.x+deltaX, this.y+deltaY);
    }
    pull(direction) {
        //
        const oldX = this.x;
        const oldY = this.y;
        //
        if(!this.walk(direction)) { return false;}
        //
        let deltaX = 0;
        let deltaY = 0;
        if(direction & DIR.NORTH) { deltaY++;}
        if(direction & DIR.SOUTH) { deltaY--;}
        if(direction & DIR.EAST ) { deltaX++;}
        if(direction & DIR.WEST ) { deltaX--;}
        const targetX = oldX - deltaX;
        const targetY = oldY - deltaY;
        //
        let pullTile = map.getTile(targetX, targetY);
        if(!(pullTile instanceof Movable)) { return false;}
        //
        return pullTile.move(oldX, oldY);
    }
    push(direction) {
        //
        const oldX = this.x;
        const oldY = this.y;
        //
        let deltaX = 0;
        let deltaY = 0;
        if(direction & DIR.NORTH) { deltaY++;}
        if(direction & DIR.SOUTH) { deltaY--;}
        if(direction & DIR.EAST ) { deltaX++;}
        if(direction & DIR.WEST ) { deltaX--;}
        const targetX = oldX + deltaX;
        const targetY = oldY + deltaY;
        //
        let pushTile = map.getTile(targetX, targetY);
        if(!(pushTile instanceof Movable)) { return false;}
        //
        let moved = pushTile.move(targetX+deltaX, targetY+deltaY);
        if(!moved) { return false;}
        //
        return this.walk(direction);
    }
    
    //------------------------------------------------
    perceive(theTile) {
        return theTile.description;
    }
}

//-- Class properties ----------------------------
Actor.prototype.character = '@';
