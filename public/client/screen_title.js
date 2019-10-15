

//== Title =====================================================================

//-- Dependencies --------------------------------
import {COMMAND} from '/shared/constants.mjs';
import Driver from './driver.js';

//------------------------------------------------
export default class ScreenTitle extends Driver {
    display(client) {
        this.client.skin.drawText(4, 11, "Title Screen", "yellow", "brown");
        this.client.skin.drawCommand(4, 9, 'A', 'Start');
    }
    command(command, options) {
        switch(options.key.toUpperCase()) {
            case 'A':
                this.client.network.messageSend(COMMAND.NEWGAME, {});
                return true;
        }
    }
    messageReceive(messageCode, data) {
        switch(messageCode) {
            case COMMAND.NEWGAME:
                this.client.screenGameplay.newGame(data);
                return true;
        }
    }
}
