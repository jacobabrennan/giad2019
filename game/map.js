

//==============================================================================

//-- Dependencies --------------------------------


//== Map =======================================================================

export default {

    //-- Population of Map from Data -------------------
    imprint() {
        this.gridTiles = [];
        this.gridContents = [];
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
    placeTile(x, y, tile) {
        const compoundIndex = this.indexFromCoords(x, y);
        this.gridTiles[compoundIndex] = tile;
    },
    placeContainable(x, y, containable) {
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
