

//==============================================================================

//-- Dependencies --------------------------------
import Drawable from './drawable.js';

//------------------------------------------------
export default class Tile extends Drawable {
    constructor(model) {
        super();
        this.id = model.id;
        this.character = model.character;
        if(model.color     ) { this.color      = model.color     ;}
        if(model.background) { this.background = model.background;}
        this.dense  = model.dense  || false;
        this.opaque = model.opaque || false;
    }
}
