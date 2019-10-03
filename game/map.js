

//==============================================================================

//-- Dependencies --------------------------------
import Tile from './tile.js';
import Movable from './movable.js';
import Actor from './actor.js';


//== Map =======================================================================

export default {

    //-- Population of Map from Data -------------------
    /* Scenario Data structure: {
        width: integer,
        height: integer,
        tileTypes: {
            tileId(integer): {},
            ...
        },
        gridTiles: [tileId(integer), ...],
    }
    */
    // chunk() {
        
    // }
    imprint(scenarioData) {
        // Set basic values
        this.width  = scenarioData.width ;
        this.height = scenarioData.height;
        // Setup nested structures
        this.gridContents = new Array(this.width*this.height);
        this.tileTypes = new Array(256);
        // Populate tile types
        Object.keys(scenarioData.tileTypes).forEach(tileId => {
            const tileData = scenarioData.tileTypes[tileId];
            const tileNew = new Tile(tileData);
            this.tileTypes[tileId] = tileNew;
        });
        // Populate tile grid
        for(let posY = 0; posY < this.height; posY++) {
            for(let posX = 0; posX < this.width; posX++) {
                const compoundIndex = this.indexFromCoords(posX, posY);
                const tileId = scenarioData.gridTiles[compoundIndex];
                if(tileId === 0) {
                    continue;
                }
                const indexedTile = this.tileTypes[tileId];
                this.placeTile(indexedTile, posX, posY);
            }
        }
    },

    //-- Placement and Retrieval ---------------------
    getTile(x, y) {
        // Returns:
            // tile at coordinates: the tile
            // coordinates invalid: undefined
            // nothing at coordinates: null
        const compoundIndex = this.indexFromCoords(x, y);
        if(compoundIndex === -1) { return undefined;}
        let theTile = this.gridContents[compoundIndex];
        if(theTile === undefined) {
            theTile = this.tileTypes[0];
        }
        return theTile;
    },
    placeTile(theTile, x, y) {
        // Calculate grid index, and current head of list, if present
        const compoundIndex = this.indexFromCoords(x, y);
        // Attempt to place containable at head of list
        this.gridContents[compoundIndex] = theTile;
        return true;
    },
    unplaceTile(containable) {
        const compoundIndex = this.indexFromCoords(containable.x, containable.y);
        // Handle case of containable at head of list
        let currentHead = this.gridContents[compoundIndex];
        if(currentHead === containable) {
            this.gridContents[compoundIndex] = undefined;
        }
        return true;
    },
    swapTiles(x1, y1, x2, y2) {
        const tile1 = this.getTile(x1, y1);
        const tile2 = this.getTile(x2, y2);
        this.placeTile(tile1, x2, y2);
        this.placeTile(tile2, x1, y1);
        return true;
    },
    indexFromCoords(x, y) {
        // Handle coordinates out of bounds
        if(x >= this.width  || x < 0) { return -1;}
        if(y >= this.height || y < 0) { return -1;}
        // calculate compound index
        return (y*this.width + x);
    }
}


//==============================================================================

// class Chunk
