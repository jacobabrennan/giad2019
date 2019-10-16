

//==============================================================================

//-- Dependencies --------------------------------
import {DIR} from '../shared/constants.mjs';
import Intelligence from '../game/intelligence.mjs';
import gameManager from '../game/game_manager.mjs';

//-- Project Constants ---------------------------

//------------------------------------------------
export default class ClientIPC extends Intelligence {
    constructor(socket) {
        super();
        // Save socket for later use
        this.socket = socket;
        // Handle client disconnects
        socket.on('end', function () { socket.destroy();});
        socket.on('close', function () { socket.destroy();});
        socket.on('error', function (error) { socket.destroy();});
        // Handle receiving of data
        socket.on('data', data => {
            this.messageReceive(data);
        });
        //
        gameManager.requestActor(this);
    }
    messageReceive(data) {
        console.log('AI - data received', data)
        const turnData = new Uint8Array(2);
        for(let index=0; index < turnData.length; index++) {
            turnData[index] = Math.floor(Math.random()*256);
        }
        // this.messageSend(turnData)
        this.command(0);
    }
    async messageSend(data) {
        await new Promise((resolve, reject) => {
            this.socket.write(data, () => {
                console.log('Message Sent')
                resolve();
            });
        });
    }
    async takeTurn() {
        console.log('AI Turn')
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
        // this.updateClient(perception);
        // this.AI.takeTurn(this.actor);
        // this.socket.messageSend("test", this.AI);
        // Wait for client to respond
        const playerResponsePromise = new Promise((resolve, reject) => {
            this.clientResponseResolver = resolve;
            // this.clientResponseRejector = reject;
                // The above may be useful in a future project, where clients
                // on the network can become disconnected.
        });
        // this.socket.messageSend(COMMAND.TURN, {});
        await this.messageSend("derpderpderpderpderpderpderpderpderpderpderpderp");
        return playerResponsePromise;
    }
    command(command, data) {
        console.log(' - AI command')
        // Cancel if not currently waiting for a response (not their turn)
        if(!this.clientResponseResolver) {
            return;
        }
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
