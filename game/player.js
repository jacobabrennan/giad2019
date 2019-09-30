

//==============================================================================

//-- Dependencies --------------------------------
import Intelligence from './intelligence.js';

//------------------------------------------------
export default class Player extends Intelligence {
    constructor(client) {
        // Attach client
        this.client = client;
    }
}