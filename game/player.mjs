

//==============================================================================

//-- Dependencies --------------------------------
import {COMMAND, DIR} from '../shared/constants.mjs';
import Intelligence from './intelligence.mjs';
import gameManager from './game_manager.mjs';
// import AI from '../ai/index.mjs';


//==============================================================================

export default class Player extends Intelligence {
    constructor(socket) {
        super();
        // Attach socket
        this.socket = socket;
        // this.AI = new AI();
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
        };
        // Calculate tiles in view
        perception.sight = this.actor.getSight();
        // Get perception from each visible tile
        // Send perception to client
        this.updateClient(perception);
        // this.AI.takeTurn(this.actor);
        // this.socket.messageSend("test", this.AI);
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
        let resolver = this.clientResponseResolver;
        this.clientResponseResolver = null;
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
        resolver();
    }
}
