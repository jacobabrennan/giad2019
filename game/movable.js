

//==============================================================================

//-- Dependencies --------------------------------
import Drawable from './drawable.js';
import map from './map.js';

//------------------------------------------------
export default class Movable extends Drawable {
    move(newX, newY) {
        // Fail if destination doesn't exists
        const destination = map.getTile(newX, newY);
        if(!destination) { return false;}
        // Fail if destination is dense
        if(destination.dense){ return false;}
        // Fail if destination contains another Movable
        const contents = map.getContents(newX, newY);
        for(let indexContent=0; indexContent < contents.length; indexContent++) {
            const indexedContent = contents[indexContent];
            if(indexedContent instanceof Movable) { return false;}
        }
        // Place movable in new destination, and signal success
        map.placeContainable(this, newX, newY);
        return true;
    }
}

//-- Class properties ----------------------------
Movable.prototype.character = '#';
