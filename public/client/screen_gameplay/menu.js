

//==============================================================================

//-- Dependencies --------------------------------
import {COMMAND} from '/shared/constants.mjs';
import Driver from '../driver.js';
import Status from './status.js';

//------------------------------------------------
export default class Menu extends Driver {
    display() {
        this.client.skin.blankRect(0, 0, 21, 21);
        // Show Status by default
        if(!this.currentFocus) {
            this.focus(new Status(this.client));
        }
        //
        let block = super.display();
        if(block) { return block;}
    }
}

//------------------------------------------------
export class Options extends Driver {
    constructor(client, instruction, options) {
        super(client);
        this.instruction = instruction;
        this.options = options;
    }
    display() {
        let block = super.display();
        if(block) { return block;}
        //

        this.client.skin.drawText(1, 19, this.instruction);
        this.client.skin.drawText(1, 18, 'Select One', '#00f');
        // 17 [
        // 16-4 (13)
        // 3 ]

        this.client.skin.drawText(1, 1, 'Space', '#fc0');
        this.client.skin.drawText(7, 1, 'Cancel');
        return true;
    }
}