

//==============================================================================

//-- Dependencies --------------------------------
import {COMMAND} from '../shared/constants.js';
import Intelligence from './intelligence.js';
import map from './map.js';


//==============================================================================

export default class Player extends Intelligence {
    constructor(socket) {
        super();
        // Attach socket
        this.socket = socket;
        // Initialize knowledge cache
        this.knowledge = {
            tiles: {},
            movables: {},
        };
    }
    
    //-- Turn Taking ---------------------------------
    async takeTurn() {
        // Compile updates package (like view) for client
        const perception = {
            coords: [],
            newTiles: [],
        };
        for(let posY = -2; posY <= 2; posY++) {
            for(let posX = -2; posX <= 2; posX++) {
                const posPerception = this.perceiveCoords(
                    this.actor.x+posX,
                    this.actor.y+posY,
                );
                if(!posPerception) { continue;}
                perception.coords.push({
                    x: posPerception.x,
                    y: posPerception.y,
                    tileId: posPerception.tileId,
                });
                if(posPerception.tile) {
                    perception.newTiles.push(posPerception.tile);
                }
            }
        }
        //
        this.updateClient(perception);
        const playerResponsePromise = new Promise((resolve, reject) => {
            this.clientResponseResolver = resolve;
            // this.clientResponseRejector = reject;
                // The above may be useful in a future project, where clients
                // on the network can become disconnected.
        });
        return playerResponsePromise;
    }
    updateClient(updates) {
        this.socket.messageSend(COMMAND.SENSE, updates);
    }
    command() {
        // Cancel if not currently waiting for a response (not their turn)
        if(!this.clientResponseResolver) { return;}
        // Pass the turn
        this.clientResponseResolver();
    }
    
    //-- Knowledge Cache -----------------------------
    perceiveCoords(x, y) {
        // Cancel if coords are outside bounds
        const posTile = map.getTile(x, y);
        if(!posTile) { return;}
        //
        let perception = {
            x: x, y: y, tileId: posTile.id,
        };
        // Perceive tile
        const newTile = this.perceiveTile(posTile);
        if(newTile) { perception.tile = newTile;}
        // Perceive contents
        // Return perception
        return perception;
    }
    perceiveTile(tile) {
        // Cancel if tile is already known
        const tileMemory = this.knowledge.tiles[tile.id];
        if(tileMemory) { return;}
        // Compile perception of tile
        const perception = {
            id: tile.id,
            character: tile.character,
            color: tile.color,
            background: tile.background,
            solid: tile.solid,
            opaque: tile.opaque,
        };
        // Store perception in memory
        this.knowledge.tiles[perception.id] = perception;
        // Return perception
        return perception;
    }
    perceiveMover(mover) {
        return;
    }
}