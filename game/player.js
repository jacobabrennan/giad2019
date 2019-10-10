

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
                //
                const worldX = (theView.x - Math.floor(theView.width /2)) + posX;
                const worldY = (theView.y - Math.floor(theView.height/2)) + posY;
                const theTile = map.getTile(worldX, worldY);
                const posPerception = this.actor.perceive(theTile);
                // add tile perception to perception list
                perception.coords.push({
                    x: worldX,
                    y: worldY,
                    description: posPerception,
                });
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
                // Attempt interaction
                if(!data.pull) {
                    if(this.actor.interact(command)) { break;}
                // Attempt regular move (no command to push/pull)
                    this.actor.walk(command);
                    break;
                }
                // Attempt to push
                if(this.actor.push(command)){ break;}
                // Attempt to pull
                this.actor.pull(command);
                break;
            case DIR.WAIT:
                this.actor.wait();
                break;
        }
        // Pass the turn
        gameManager.currentGame.time++;
        this.clientResponseResolver();
    }
}
