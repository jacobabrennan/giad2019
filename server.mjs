

//== Web Server, including websockets ==========================================

//-- Dependencies --------------------------------
import express from 'express';
import expressWs from 'express-ws';
import network from './game/network.mjs';

//-- Project Constants ---------------------------
const PORT = 7231;
const MESSAGE_LISTEN = `Server Started on port ${PORT}`;

//-- Create and Open server ----------------------
const server = express();
expressWs(server);
server.listen(PORT, function () {
    console.log(MESSAGE_LISTEN);
});

//-- Serve Client --------------------------------
server.use(express.static(`public`));
server.use('/shared', express.static(`shared`));
server.ws('/', function (socket, request) {
    network.newConnection(socket);
});