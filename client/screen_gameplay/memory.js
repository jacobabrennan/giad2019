

//==============================================================================

//-- Dependencies --------------------------------


//==============================================================================

export default class Memory {
    constructor(data) {
        this.currentTime = 0;
        this.gridWidth = data.width;
        this.gridHeight = data.height;
        this.posX = 0;
        this.posY = 0;
        this.tiles = {};
        this.movers = {};
        this.gridTiles      = new Array(this.gridWidth*this.gridHeight);
        this.gridContents   = new Array(this.gridWidth*this.gridHeight);
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
        // Memorize any newly sensed tiles
        if(data.newTiles) {
            for(let indexTile = 0; indexTile < data.newTiles.length; indexTile++) {
                this.memorizeTile(data.newTiles[indexTile]);
            }
        }
        // Put sensed tile coordinates into tiles grid
        for(let indexCoord = 0; indexCoord < data.coords.length; indexCoord++) {
            const indexedCoord = data.coords[indexCoord];
            const compoundIndex = this.indexFromCoords(indexedCoord.x, indexedCoord.y);
            this.gridTiles[compoundIndex] = indexedCoord.tileId;
            this.gridTimestamps[compoundIndex] = data.time;
            //
            this.gridContents[compoundIndex] = undefined;
            if(!indexedCoord.movers){ continue;}
            for(let indexM = indexedCoord.movers.length-1; indexM >= 0; indexM--) {
                const indexedMover = indexedCoord.movers[indexM];
                indexedMover.nextMover = this.gridContents[compoundIndex];
                this.gridContents[compoundIndex] = indexedMover;
            }
        }
    }
    memorizeTile(tileNew) {
        let tileMemory = this.tiles[tileNew.id];
        if(!tileMemory) {
            tileMemory = {id: tileNew.id};
            this.tiles[tileMemory.id] = tileMemory;
        }
        if(tileNew.character ) { tileMemory.character  = tileNew.character ;}
        if(tileNew.color     ) { tileMemory.color      = tileNew.color     ;}
        if(tileNew.background) { tileMemory.background = tileNew.background;}
        if(tileNew.dense     ) { tileMemory.dense      = tileNew.dense     ;}
        if(tileNew.opaque    ) { tileMemory.opaque     = tileNew.opaque    ;}
    }
    
    //-- Recall --------------------------------------
    rememberTile(tileId) {
        return this.tiles[tileId];
    }
    describeCoord(x, y) {
        const compoundIndex = this.indexFromCoords(x, y);
        const tileId = this.gridTiles[compoundIndex];
        if(!tileId) { return;}
        const tileCoord = this.rememberTile(tileId);
        const description = {}
        // Display old memories as dimmed
        if(this.currentTime > this.gridTimestamps[compoundIndex]) {
            description.character = tileCoord.character;
            description.color = '#222';
            return description;
        }
        // Look for color, character, and background from contents first
        let model = this.gridContents[compoundIndex];
        if(model) {
            description.character  = model.character;
            if(model.color) { description.color = model.color;}
            if(model.background) {
                description.background = model.background;
            } else if(tileCoord.background){
                description.background = tileCoord.background;
            }
        }
        // Otherwise, get from tile
        if(!model) { model = tileCoord;}
        // Copy over description from model to... description
        description.character  = model.character;
        if(model.color     ) { description.color      = model.color     ;}
        if(model.background) { description.background = model.background;}
        //
        return description;
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
