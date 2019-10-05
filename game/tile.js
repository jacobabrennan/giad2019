

//==============================================================================

//-- Dependencies --------------------------------
import {PERCEIVE} from "../shared/constants.js";

//------------------------------------------------
export default class Tile {
    constructor(model) {
        this.description = Math.floor(Math.random()*Math.pow(2,8));
        if(model) {
            this.character = model.character;
            if(model.color     ) { this.color      = model.color     ;}
            if(model.background) { this.background = model.background;}
            this.opaque = model.opaque || false;
        }
    }
}

//-- Class properties ----------------------------
Tile.prototype.shared = true;
Tile.prototype.shape = '#'.charCodeAt(0) << PERCEIVE.SHAPE_SHIFT;
Tile.prototype.background = '#222';
