

//==============================================================================

//-- Dependencies --------------------------------
import {COMMAND, DIR} from '../shared/constants.js';
import Intelligence from './intelligence.js';
import map from './map.js';
import gameManager from './game_manager.js';


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
            time: gameManager.currentTime(),
            location: {
                x: this.actor.x,
                y: this.actor.y,
            },
            coords: [],
        };
        const viewRadius = 5;
        for(let posY = -viewRadius; posY <= viewRadius; posY++) {
            for(let posX = -viewRadius; posX <= viewRadius; posX++) {
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
                    if(!perception.newTiles) {
                        perception.newTiles = [];
                    }
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
        this.socket.messageSend(COMMAND.TURN, {});
        return playerResponsePromise;
    }
    updateClient(updates) {
        this.socket.messageSend(COMMAND.SENSE, updates);
    }
    command(command, data) {
        // Cancel if not currently waiting for a response (not their turn)
        if(!this.clientResponseResolver) { return;}
        // handle commands
        switch(command) {
            case DIR.NORTH: case DIR.SOUTH:
            case DIR.EAST: case DIR.WEST:
            case DIR.NORTHEAST: case DIR.NORTHWEST:
            case DIR.SOUTHEAST: case DIR.SOUTHWEST:
            case DIR.WAIT:
                this.actor.walk(command);
        }
        // Pass the turn
        gameManager.currentGame.time++;
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