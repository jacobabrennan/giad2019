

//==============================================================================

//-- Dependencies --------------------------------
import networkExternal from '../game/network.js';

//------------------------------------------------
export default class Network {
    constructor(client, configuration) {
        this.socket = networkExternal.newConnection(this);
    }
    messageReceive(messageCode, data) {}
    messageSend(messageCode, data) {
        this.socket.messageReceive(messageCode, data);
    }
}
