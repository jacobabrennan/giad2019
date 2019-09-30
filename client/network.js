

//==============================================================================

//-- Dependencies --------------------------------
import networkExternal from '../game/network.js';

//------------------------------------------------
export default class Network {
    constructor(client, configuration) {
        this.client = client;
        this.socket = networkExternal.newConnection(this);
    }
    messageReceive(messageCode, data) {
        this.client.messageReceive(messageCode, data);
    }
    messageSend(messageCode, data) {
        this.socket.messageReceive(messageCode, data);
    }
}
