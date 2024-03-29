

//==============================================================================

//-- Dependencies --------------------------------
import {PERCEIVE} from '/shared/constants.mjs';


//==============================================================================

export default class Memory {
    constructor(data) {
        this.currentTime = 0;
        this.gridWidth = data.width;
        this.gridHeight = data.height;
        this.posX = 0;
        this.posY = 0;
        this.gridTiles      = new Uint32Array(this.gridWidth*this.gridHeight);
        this.gridTimestamps = new Array(this.gridWidth*this.gridHeight);
    }
    
    //-- Memorization --------------------------------
    sense(data) {
        // Set current time
        this.currentTime = data.time;
        // Set current location
        if(data.location) {
            this.posX = data.location.x;
            this.posY = data.location.y;
        }
        // Put sensed tile coordinates into tiles grid
        const gridOffsetX = -Math.floor(data.sight.width /2);
        const gridOffsetY = -Math.floor(data.sight.height/2);
        for(let posY = 0; posY < data.sight.height; posY++) {
            for(let posX = 0; posX < data.sight.width; posX++) {
                let compoundIndex = (posY*data.sight.width)+posX;
                const indexedPerception = data.sight.buffer[compoundIndex];
                if(!indexedPerception) { continue;}
                compoundIndex = this.indexFromCoords(
                    data.location.x + gridOffsetX + posX,
                    data.location.y + gridOffsetY + posY,
                );
                if(compoundIndex === -1) { continue;}
                this.gridTiles[compoundIndex] = indexedPerception;
                this.gridTimestamps[compoundIndex] = data.time;
            }
        }
    }
    /*memorizeTile(tileNew) {
        let tileMemory = this.tiles[tileNew.id];
        if(!tileMemory) {
            tileMemory = {id: tileNew.id};
            this.tiles[tileMemory.id] = tileMemory;
        }
        if(tileNew.character ) { tileMemory.character  = tileNew.character ;}
        if(tileNew.color     ) { tileMemory.color      = tileNew.color     ;}
        if(tileNew.background) { tileMemory.background = tileNew.background;}
        if(tileNew.opaque    ) { tileMemory.opaque     = tileNew.opaque    ;}
    }*/
    
    //-- Recall --------------------------------------
    /*rememberTile(tileId) {
        if(!this.tiles[tileId]) {
        }
        return this.tiles[tileId];
    }*/
    describeCoord(x, y) {
        const compoundIndex = this.indexFromCoords(x, y);
        if(compoundIndex === -1){ return undefined;}
        //
        const description = this.gridTiles[compoundIndex];
        if(!description) { return;}
        //
        const verbose = {}
        const character_code = (description&PERCEIVE.SHAPE) >> PERCEIVE.SHAPE_SHIFT;
        verbose.character = String.fromCharCode(character_code);
        // Display old memories as dimmed
        if(this.currentTime > this.gridTimestamps[compoundIndex]) {
            verbose.color = '#222';
            return verbose;
        }
        // Copy over verbose from model to... verbose
        let colorFull = (description & PERCEIVE.COLOR) >> PERCEIVE.COLOR_SHIFT;
        let colorR = (colorFull     ) & 0b11;
        let colorG = (colorFull >> 2) & 0b11;
        let colorB = (colorFull >> 4) & 0b11;
        colorR = Math.floor(colorR*255/3);
        colorG = Math.floor(colorG*255/3);
        colorB = Math.floor(colorB*255/3);
        verbose.color = `rgb(${colorR},${colorG},${colorB})`;
        verbose.background = '#333';
        //
        return verbose;
    }

    //-- Utilities -----------------------------------
    indexFromCoords(x, y) {
        // Handle coordinates out of bounds
        if(x >= this.gridWidth  || x < 0) { return -1;}
        if(y >= this.gridHeight || y < 0) { return -1;}
        // calculate compound index
        return (y*this.gridWidth + x);
    }
}
