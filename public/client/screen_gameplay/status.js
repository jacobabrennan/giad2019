

//==============================================================================

//-- Dependencies --------------------------------
import {COMMAND} from '/shared/constants.mjs';
import Driver from '../driver.js';
import {Options} from './menu.js';

//------------------------------------------------
export default class Status extends Driver {
    display() {
        let block = super.display();
        if(block) { return block;}
        //
        let I = 19
        this.client.skin.drawText(1, I--, 'Name :');
        this.client.skin.drawText(1, I--, 'Class:');
        this.client.skin.drawText(1, I--, 'Level:');
        I--;
        // this.client.skin.drawText(1, I--, 'Commands:');
        // this.client.skin.drawText(1, I--, 'Commands:');
        // this.client.skin.drawText(1, I--, 'Commands:');
        // this.client.skin.drawText(1, I--, 'Commands:');
        // this.client.skin.drawText(1, I--, 'Commands:');

        I = 10;
        this.client.skin.drawText(1, I--, 'Commands:');
        this.client.skin.drawCommand(2, I--, '?', 'Help');
        this.client.skin.drawCommand(2, I--, 'R', 'Rest');
        this.client.skin.drawCommand(2, I--, 'A', 'Attack');
        this.client.skin.drawCommand(2, I--, 'E', 'Equipment');
        this.client.skin.drawCommand(2, I--, 'V', 'Inventory');
        this.client.skin.drawCommand(2, I--, 'X', 'Examine');
        //                               123456789012345678901
        this.client.skin.drawText(1, 2, 'Arrows or NumberPad', '#00f');
        this.client.skin.drawText(1, 1, 'to Move, Attack', '#00f');
        this.client.skin.drawText(1, 0, 'or Search furniture', '#00f');
    }
    command(command, data) {
        //
        let block = super.command(command, data);
        if(block) { return block;}
        //
        switch(command) {
            case COMMAND.HELP:
                return true;
            case COMMAND.ATTACK:
                return true;
            case COMMAND.EQUIP:
                return true;
            case COMMAND.CAMP:
                return true;
            case COMMAND.USE:
                return true;
            case COMMAND.LOOK:
                this.focus(new Options(this.client, 'Examine What?:', {
                    'Goblin': 'GOBLIN_DATA',
                    'Hero': 'PLAYER_DATA',
                    'A Tree': 'FUCKING_TREE_YEAH',
                }));
                this.client.screenGameplay.menu.display();
                return true;
        }
    }
}

//------------------------------------------------

