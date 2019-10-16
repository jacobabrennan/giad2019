

//==============================================================================

//-- Dependencies --------------------------------

//-- Project Constants ---------------------------

//------------------------------------------------
export default class ClientIPC {
    constructor(socket) {
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
    }
    messageReceive(data) {
        console.log('AI - data received', data)
        const turnData = new Uint8Array(2);
        for(let index=0; index < turnData.length; index++) {
            turnData[index] = Math.floor(Math.random()*256);
        }
        this.messageSend(turnData)
    }
    messageSend(data) {
        this.socket.write(data);
    }
}
