

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
        this.gridTiles      = new Array(this.gridWidth*this.gridHeight);
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
        if(!this.tiles[tileId]) {
        }
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
        // Copy over description from model to... description
        description.character  = tileCoord.character;
        if(tileCoord.color     ) { description.color      = tileCoord.color     ;}
        if(tileCoord.background) { description.background = tileCoord.background;}
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
