

//==============================================================================

//-- Dependencies --------------------------------

//------------------------------------------------
export default {
    newConnection(remoteClient) {
        return new Client(remoteClient);
    }
}

//------------------------------------------------
class Client {
    constructor(socket) {
        this.socket = socket;
    }
    messageReceive(messageCode, data) {}
    sendMessage(messageCode, data) {
        this.socket.messageReceive(messageCode, data);
    }
}