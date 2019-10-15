

//==============================================================================

//-- Dependencies --------------------------------
import {PERCEIVE} from "../shared/constants.mjs";

//------------------------------------------------
export default class Tile {
    constructor(model) {
        this.description = Math.floor(Math.random()*Math.pow(2,8));
        this.setColor(
            Math.floor(Math.random()*0b100),
            Math.floor(Math.random()*0b100),
            Math.floor(Math.random()*0b100),
        );
        if(model) {
            this.character = model.character;
            if(model.color     ) { this.color      = model.color     ;}
            if(model.background) { this.background = model.background;}
            this.opaque = model.opaque || false;
        }
    }
    setColor(colorR, colorG, colorB) {
        this.color = (
            (colorR&0b11) | 
            ((colorG&0b11) << 2) | 
            ((colorB&0b11) << 4)
        );
    }
}

//-- Class properties ----------------------------
Tile.prototype.shared = true;
Tile.prototype.shape = '#'.charCodeAt(0) << PERCEIVE.SHAPE_SHIFT;
Tile.prototype.background = '#222';
