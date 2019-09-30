

//== Gameplay ==================================================================

//-- Dependencies --------------------------------
import {COMMAND} from '../shared/constants.js';
import Driver from './driver.js';

//------------------------------------------------
export default class ScreenGameplay extends Driver {
    display(client) {
        this.client.skin.drawText(4, 11, "Gameplay Screen", "yellow", "brown");
    }
    command(command, options) {
        console.log(command, options);
        /*
        switch(options.key.toUpperCase()) {
            case 'A':
                this.client.network.messageSend(COMMAND.NEWGAME, {});
                break;
        }*/
    }
    messageReceive(code, data) {
        switch(code) {
            case COMMAND.SENSE:
                console.log('Updates', data)
                break;
        }
    }
}
