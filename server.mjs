

//== Game Server: Web and IPC Clients ==========================================

//-- Dependencies --------------------------------
import net from 'net';
import express from 'express';
import expressWs from 'express-ws';
import network from './game/network.mjs';
import ClientIPC from './ipc_client/index.mjs';

//-- Project Constants ---------------------------
const PORT_WEB = 7231;
const PORT_IPC = '7232';
const HOST_IPC = 'localhost';
const MESSAGE_LISTEN = `Server Started on port ${PORT_WEB}`;


//== Web Server ================================================================

//-- Create and Open server ----------------------
const server = express();
expressWs(server);
server.listen(PORT_WEB, function () {
    console.log(MESSAGE_LISTEN);
});

//-- Serve Client --------------------------------
server.use(express.static(`public`));
server.use('/shared', express.static(`shared`));
server.ws('/', function (socket, request) {
    network.newConnection(socket);
});


//== IPC Server ================================================================

//-- Create and Open server ----------------------
let serverIpc = net.createServer(handleConnection);
serverIpc.listen(PORT_IPC, HOST_IPC);

//-- Connection Handler --------------------------
function handleConnection(socket) {
    new ClientIPC(socket);
};
