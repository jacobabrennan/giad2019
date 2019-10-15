

//==============================================================================

//-- Dependencies --------------------------------

//-- Project Constants ---------------------------
const HOST = 'localhost';
const PORT = '7231';
const ADDRESS = `ws://${HOST}:${PORT}`;

//------------------------------------------------
export default class Network {
    constructor(client, configuration) {
        this.client = client;
        this.socket = new WebSocket(ADDRESS);
        // Handle messages received from server
        this.socket.onmessage = eventMessage => {
            let message = JSON.parse(eventMessage.data)
            let messageCode = message.messageCode;
            let data = message.data;
            this.messageReceive(messageCode, data);
        };
    }
    messageReceive(messageCode, data) {
        this.client.messageReceive(messageCode, data);
    }
    messageSend(messageCode, data) {
        this.socket.send(JSON.stringify({
            messageCode: messageCode,
            data: data,
        }));
    }
}
