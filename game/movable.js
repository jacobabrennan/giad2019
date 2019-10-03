

//==============================================================================

//-- Dependencies --------------------------------
import Tile from './tile.js';
import map from './map.js';

//------------------------------------------------
export default class Movable extends Tile {
    move(newX, newY) {
        // Fail if destination is invalid
        const destination = map.getTile(newX, newY);
        if(!destination) { return false;}
        // Fail if destination is dense
        if(destination.dense){ return false;}
        // Place movable in new destination, and signal success
        if(!map.unplaceTile(this)) { return false;}
        if(!map.placeTile(this, newX, newY)) { return false;}
        this.x = newX;
        this.y = newY;
        return true;
    }
}

//-- Class properties ----------------------------
Movable.prototype.character = '*';
Movable.prototype.dense = true;
Movable.prototype.x = null;
Movable.prototype.y = null;
