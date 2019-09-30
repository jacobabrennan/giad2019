

//==============================================================================

//-- Dependencies --------------------------------
import Tile from './tile.js';


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
    imprint(scenarioData) {
        // Set basic values
        this.width  = scenarioData.width ;
        this.height = scenarioData.height;
        // Setup nested structures
        this.gridTiles = [];
        this.gridContents = [];
        this.tileTypes = {};
        // Populate tile types
        Object.keys(scenarioData.tileTypes).forEach(tileId => {
            const tileData = scenarioData.tileTypes[tileId];
            const tileNew = new Tile(tileId, tileData);
            this.tileTypes[tileId] = tileNew;
        });
        // Populate tile grid
        for(let posY = 0; posY < this.height; posY++) {
            for(let posX = 0; posX < this.width; posX++) {
                const compoundIndex = this.indexFromCoords(posX, posY);
                const tileId = scenarioData.gridTiles[compoundIndex];
                const indexedTile = this.tileTypes[tileId];
                this.placeTile(indexedTile, posX, posY);
            }
        }
    },

    //-- Placement and Retrieval ---------------------
    getTile(x, y) {
        const compoundIndex = this.indexFromCoords(x, y);
        return this.gridTiles[compoundIndex];
    },
    getContents(x, y) {
        // Calculate grid index and Prepare contents array
        const contents = [];
        const compoundIndex = this.indexFromCoords(x, y);
        // Convert linked list into array
        let containableCurrent = this.gridContents[compoundIndex];
        while(containableCurrent) {
            contents.push(containableCurrent);
            containableCurrent = containableCurrent.mapNextContainable;
        }
        // Return contents array
        return contents;
    },
    placeTile(tile, x, y) {
        const compoundIndex = this.indexFromCoords(x, y);
        this.gridTiles[compoundIndex] = tile;
    },
    placeContainable(containable, x, y) {
        // Calculate grid index, and current head of list, if present
        const compoundIndex = this.indexFromCoords(x, y);
        let containableCurrent = this.gridContents[compoundIndex];
        // Remove containable from previous position
        if(containable.x !== undefined && containable.y !== undefined) {
            this.unplaceContainable(containable);
        }
        // Place containable at head of list
        this.gridContents[compoundIndex] = containable;
        containable.mapNextContainable = containableCurrent;
        // Update containable's coordinates
        containable.x = x;
        containable.y = y;
    },
    unplaceContainable(containable) {
        const compoundIndex = this.indexFromCoords(x, y);
        let currentHead = this.gridContents[compoundIndex];
        // Handle case where nothing exists here (clear list on containable)
        if(!currentHead) {
            containable.mapNextContainable = undefined;
            return;
        }
        // Handle case of containable at head of list
        if(currentHead === containable) {
            this.gridContents[compoundIndex] = containable.mapNextContainable;
            containable.mapNextContainable = undefined;
            return;
        }
        // Handle case of containable further in linked list
        while(currentHead) {
            if(currentHead.mapNextContainable === containable) {
                currentHead.mapNextContainable = containable.mapNextContainable;
                containable.mapNextContainable = undefined;
                return;
            }
            currentHead = mapNextContainable;
        }
        // If execution gets here, containable was not in list
    },
    indexFromCoords(x, y) {
        // Handle coordinates out of bounds
        if(x >= this.width || x < 0) { return -1;}
        if(y >= this.width || y < 0) { return -1;}
        // calculate compound index
        return (y*this.width + x);
    }
}
