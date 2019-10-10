

//==============================================================================

//-- Dependencies --------------------------------
import {DIR, PERCEIVE} from '../shared/constants.js';
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
    
    //-- Actions -------------------------------------
    wait() {
        return;
    }
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
    interact(direction) {
        //
        let deltaX = 0;
        let deltaY = 0;
        if(direction & DIR.NORTH) { deltaY++;}
        if(direction & DIR.SOUTH) { deltaY--;}
        if(direction & DIR.EAST ) { deltaX++;}
        if(direction & DIR.WEST ) { deltaX--;}
        const targetX = this.x + deltaX;
        const targetY = this.y + deltaY;
        //
        let interactTile = map.getTile(targetX, targetY);
        if(!(interactTile instanceof Movable)) { return false;}
        //
        return interactTile.interaction(this);
    }
    
    //------------------------------------------------
    perceive(theTile) {
        if(!theTile) { return PERCEIVE.AIR;}
        /* What can an actor perceive?
            Movable: 1b
            Opaque: 1b
            color?: 6b, rgb(2b, 2b, 2b);
            'shape'/'form'?: 8b (ascii)
            'smell'?: 2b*4: Rot, Food, ?, ?,
            'size'?
            0b 0 0 (00,00,00) 00000000 (00,00,00,00) 00000000
            0b 0000 0000 0000 0000 0000 0000 0000 0000
        */
        let description = theTile.description; // 8b
        description |= theTile.shape;
        if(theTile instanceof Movable) { description |= PERCEIVE.MOVABLE;}
        if(theTile.opaque) { description |= PERCEIVE.OPAQUE;}
        if(theTile.color) { description |= theTile.color << PERCEIVE.COLOR_SHIFT;}
        return description;
    }
}

//-- Class properties ----------------------------
Actor.prototype.shape = '@'.charCodeAt(0) << PERCEIVE.SHAPE_SHIFT;
