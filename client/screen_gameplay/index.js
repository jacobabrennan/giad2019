

//== Gameplay ==================================================================

//-- Dependencies --------------------------------
import {COMMAND, DIR} from '../../shared/constants.js';
import Driver from '../driver.js';
import Memory from './memory.js';
import Map from './map.js';
import Menu from './menu.js';

//==============================================================================

export default class ScreenGameplay extends Driver {
    constructor(client) {
        super(client);
        this.map = new Map(client);
        this.menu = new Menu(client);
    }
    
    //------------------------------------------------
    display(client) {
        this.map.display();
    }
    command(command, options) {
        //
        let block = super.command(command, options);
        if(block) { return block;}
        //
        switch(command) {
            case DIR.NORTH: case DIR.SOUTH:
            case DIR.EAST: case DIR.WEST:
            case DIR.NORTHEAST: case DIR.NORTHWEST:
            case DIR.SOUTHEAST: case DIR.SOUTHWEST:
            case DIR.WAIT:
                const commandData = {};
                if(options.shift) {
                    commandData.pull = true;
                }
                this.client.network.messageSend(command, commandData);
                break;
        }
    }
    messageReceive(code, data) {
        switch(code) {
            case COMMAND.SENSE:
                this.memory.sense(data);
                break;
            case COMMAND.TURN:
                this.focus(this.menu);
                this.client.display();
                break;
        }
    }
    
    //------------------------------------------------
    newGame(data) {
        this.client.skin.blank();
        this.memory = new Memory(data);
        this.client.focus(this);
        this.client.display();
        this.menu.display();
        this.headline('');
    }

    //------------------------------------------------
    headline(text) {
        this.client.skin.blankRect(0, 21, 42, 1);
        this.client.skin.drawText(0, 21, text);
    }
}
