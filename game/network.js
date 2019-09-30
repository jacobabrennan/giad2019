

//==============================================================================

//-- Dependencies --------------------------------
import {COMMAND, DIR} from '../shared/constants.js';
import Player from './player.js';
import gameManager from './game_manager.js';
import map from './map.js';

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
    messageReceive(messageCode, data) {
        switch(messageCode) {
            case COMMAND.NEWGAME:
                this.player = new Player(this);
                let gameNew = gameManager.requestGame(this.player);
                let gameData = {
                    width: map.width,
                    height: map.height,
                };
                this.player.socket.messageSend(COMMAND.NEWGAME, gameData);
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
        this.socket.messageReceive(messageCode, data);
    }
}
