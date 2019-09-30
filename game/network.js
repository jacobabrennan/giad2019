

//==============================================================================

//-- Dependencies --------------------------------
import {COMMAND} from '../shared/constants.js';
import Player from './player.js';
import gameManager from './game_manager.js';

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
                this.player.socket.messageSend(COMMAND.NEWGAME, {});
                gameNew.start();
                break;
        }
    }
    messageSend(messageCode, data) {
        this.socket.messageReceive(messageCode, data);
    }
}
