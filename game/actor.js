

//==============================================================================

//-- Dependencies --------------------------------
import {DIR} from '../shared/constants.js';
import Movable from './movable.js';

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
        this.move(this.x+deltaX, this.y+deltaY);
    }
}

//-- Class properties ----------------------------
Actor.prototype.character = '@';
