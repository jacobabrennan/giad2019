

//==============================================================================

//-- Dependencies --------------------------------
import {COMMAND, DIR} from '../shared/constants.mjs';
import Player from './player.mjs';
import gameManager from './game_manager.mjs';
import map from './map.mjs';

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
        socket.on('message', message => {
            message = JSON.parse(message);
            this.messageReceive(message.messageCode, message.data);
        });
    }
    messageReceive(messageCode, data) {
        switch(messageCode) {
            case COMMAND.NEWGAME:
                this.player = new Player(this);
                let gameNew = gameManager.requestGame(this.player);
                if(!gameNew) {
                    throw "Game in progress";
                }
                let gameData = {
                    width: map.width,
                    height: map.height,
                };
                this.messageSend(COMMAND.NEWGAME, gameData);
                gameNew.start();
                break;
            case DIR.NORTH: case DIR.SOUTH:
            case DIR.EAST: case DIR.WEST:
            case DIR.NORTHEAST: case DIR.NORTHWEST:
            case DIR.SOUTHEAST: case DIR.SOUTHWEST:
            case DIR.WAIT:
                this.player.command(messageCode, data);
                break;
        }
    }
    messageSend(messageCode, data) {
        this.socket.send(JSON.stringify({
            messageCode: messageCode,
            data: data,
        }));
    }
}
