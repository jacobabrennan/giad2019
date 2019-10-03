

//==============================================================================

//-- Dependencies --------------------------------
import {COMMAND, DIR} from '../shared/constants.js';
import Intelligence from './intelligence.js';
import map from './map.js';
import gameManager from './game_manager.js';
import * as view from './view.js';


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
        // Calculate tiles in view
        let theView = view.getViewGrid(this.actor.x, this.actor.y, 10);
        // Get perception from each visible tile
        for(let posY = 0; posY < theView.height; posY++) {
            for(let posX = 0; posX < theView.width; posX++) {
                // determine visibility of each tile
                const compoundIndex = (posY*theView.width) + posX;
                const visible = theView.view[compoundIndex];
                if(!visible) { continue;}
                // determine if tile is known
                const posPerception = this.perceiveCoords(
                    (theView.x - Math.floor(theView.width /2)) + posX,
                    (theView.y - Math.floor(theView.height/2)) + posY,
                );
                if(!posPerception) { continue;}
                // add tile perception to perception list
                perception.coords.push({
                    x: posPerception.x,
                    y: posPerception.y,
                    tileId: posPerception.tileId,
                });
                // add any newly perceived tile types
                if(posPerception.tile) {
                    if(!perception.newTiles) {
                        perception.newTiles = [];
                    }
                    perception.newTiles.push(posPerception.tile);
                }
            }
        }
        // Send perception to client
        this.updateClient(perception);
        // Wait for client to respond
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
                // Attempt regular move (no command to push/pull)
                if(!data.pull) {
                    this.actor.walk(command);
                    break;
                }
                // Attempt to push
                if(this.actor.push(command)){ break;}
                // Attempt to pull
                this.actor.pull(command);
                break;
        }
        // Pass the turn
        gameManager.currentGame.time++;
        this.clientResponseResolver();
    }
    
    //-- Knowledge Cache -----------------------------
    perceiveCoords(x, y) {
        // Cancel if coords are outside bounds
        let posTile = map.getTile(x, y);
        if(!posTile) { return;}
        //
        let perception = {
            x: x, y: y, tileId: this.actor.perceive(posTile),
        };
        // Perceive tile
        const newTile = this.perceiveTile(posTile);
        if(newTile) { perception.tile = newTile;}
        // Return perception
        return perception;
    }
    perceiveTile(tile) {
        // Cancel if tile is already known
        let tileId = this.actor.perceive(tile);
        const tileMemory = this.knowledge.tiles[tileId];
        if(tileMemory) { return;}
        // Compile perception of tile
        const perception = {
            id: tileId,
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
        const perception = {
            character: mover.character,
        };
        if(mover.color) { perception.color = mover.color;}
        if(mover.background) { perception.background = mover.background;}
        return perception;
    }
}
