

//== AI Utilities =============================================================

//-- Dependencies --------------------------------
import map from './map.mjs';
import {aStar} from './path_finding/index.mjs';


//== getPath: simple two-point Path Finding ====================================

//-- Main Function -------------------------------
export function getPath(tileStart, tileEnd) {
    /**
     * Calculates and returns an optimal path between tileStart and tileEnd,
     * taking obstacles into account. Path is returned as an Array of {x, y}
     * coordinates, not including tileStart and ending with tileEnd.
     */
    // Prepare Start node
    let coordStart = {
        x: tileStart.x, 
        y: tileStart.y,
    };
    // Create node cache for getNeighbors parameter.
    // This prevents duplicate nodes being generated on node expansion.
    let neighborCache = {coordStart: coordStart};
    // Find optimal path, if any
    let path = aStar(
        coordStart,
        distanceHeuristic.bind(tileEnd),
        getNeighbors.bind(neighborCache),
    );
    // Remove start coordinates from path
    if(path) { path.shift();}
    // Return path (or failure)
    return path;
}

//-- Utilities -----------------------------------
function distanceHeuristic(coord) {
    let deltaX = Math.abs(this.x - coord.x);
    let deltaY = Math.abs(this.y - coord.y);
    let cost = Math.max(deltaX, deltaY);
    return cost;
}
function getNeighbors(coord) {
    let neighborCoords = [];
    let neighborCosts = [];
    // If the node is dense, don't expand it.
    /* Implementation Note: A more obvious choice might be to skip any node
        that is dense (in the next, double loop, section). That approach
        prevents the end tile from ever appearing in an expansion, and paths
        are never found as a result. */
    if(map.getTile(coord.x, coord.y) !== null) {
        if(coord !== this.coordStart) {
            return [neighborCoords, neighborCosts];
        }
    }
    // Expand node by adding all adjacent nodes
    for(let deltaY = -1; deltaY <= 1; deltaY++) {
        for(let deltaX = -1; deltaX <= 1; deltaX++) {
            if(!deltaX && !deltaY) { continue;}
            let newX = coord.x+deltaX;
            let newY = coord.y+deltaY;
            // Retreive node from cache
            let neighborKey = `(${newX},${newY})`;
            let newCoord = this[neighborKey];
            // Generate new node and place in cache, as needed
            if(newCoord === undefined) {
                newCoord = {x: newX, y: newY};
                this[neighborKey] = newCoord;
            }
            // Add node and edge weight to lists
            neighborCoords.push(newCoord);
            neighborCosts.push(1);
        }
    }
    // Return list of nodes and edge weights
    return [neighborCoords, neighborCosts];
}
