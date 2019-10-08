

//==============================================================================

//-- Dependencies --------------------------------
import Tile from './tile.js';
import map from './map.js';
import {PERCEIVE} from '../shared/constants.js';

//------------------------------------------------
export default class Movable extends Tile {
    move(newX, newY) {
        // Fail if destination is invalid
        const destination = map.getTile(newX, newY);
        if(destination === undefined) { return false;}
        // Fail if destination is occupied
        if(destination){ return false;}
        // Place movable in new destination, and signal success
        if(!map.unplaceTile(this, this.x, this.y)) { return false;}
        if(!map.placeTile(this, newX, newY)) { return false;}
        this.x = newX;
        this.y = newY;
        return true;
    }
    interact() {}
}

//-- Class properties ----------------------------
Movable.prototype.shape = '*'.charCodeAt(0) << PERCEIVE.SHAPE_SHIFT;
Movable.prototype.x = null;
Movable.prototype.y = null;
