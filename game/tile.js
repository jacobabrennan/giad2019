

//==============================================================================

//-- Dependencies --------------------------------

//------------------------------------------------
export default class Tile {
    constructor(model) {
        this.description = Math.random();
        if(model) {
            this.character = model.character;
            if(model.color     ) { this.color      = model.color     ;}
            if(model.background) { this.background = model.background;}
            this.dense  = model.dense  || false;
            this.opaque = model.opaque || false;
        }
    }
}

//-- Class properties ----------------------------
Tile.prototype.character = '#';
