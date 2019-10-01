

//== Gameplay ==================================================================

//-- Dependencies --------------------------------
import {COMMAND, DIR} from '../../shared/constants.js';
import Driver from '../driver.js';
import Memory from './memory.js';
import Map from './map.js';
import Status from './status.js';

//==============================================================================

export default class ScreenGameplay extends Driver {
    constructor(client) {
        super(client);
        this.map = new Map(client);
        this.status = new Status(client);
    }
    
    //------------------------------------------------
    display(client) {
        this.map.display();
    }
    command(command, options) {
        switch(command) {
            case DIR.NORTH: case DIR.SOUTH:
            case DIR.EAST: case DIR.WEST:
            case DIR.NORTHEAST: case DIR.NORTHWEST:
            case DIR.SOUTHEAST: case DIR.SOUTHWEST:
            case DIR.WAIT:
                this.client.network.messageSend(command, {});
                break;
        }
    }
    messageReceive(code, data) {
        switch(code) {
            case COMMAND.SENSE:
                this.memory.sense(data);
                break;
            case COMMAND.TURN:
                this.client.display();
                break;
        }
    }
    
    //------------------------------------------------
    newGame(data) {
        this.client.skin.blank();
        this.memory = new Memory(data);
        this.client.focus(this.client.screenGameplay);
        this.client.display();
        this.status.display();
        this.headline('');
    }

    //------------------------------------------------
    headline(text) {
        this.client.skin.blankRect(0, 21, 42, 1);
        this.client.skin.drawText(0, 21, text);
    }
}
