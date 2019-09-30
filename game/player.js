

//==============================================================================

//-- Dependencies --------------------------------
import Intelligence from './intelligence.js';

//------------------------------------------------
export default class Player extends Intelligence {
    constructor(client) {
        super();
        // Attach client
        this.client = client;
    }
    async takeTurn() {
        console.log('Taking Turn')
        this.updateClient();
        const playerResponsePromise = new Promise((resolve, reject) => {
            this.clientResponseResolver = resolve;
            // this.clientResponseRejector = reject;
                // The above may be useful in a future project, where clients
                // on the network can become disconnected.
        });
        return playerResponsePromise;
    }
    updateClient() {
        setTimeout(() => this.command(), 100);
    }
    command() {
        // Cancel if not currently waiting for a response (not their turn)
        if(!this.clientResponseResolver) { return;}
        console.log(' - Command from client')
        // Pass the turn
        this.clientResponseResolver();
    }
}