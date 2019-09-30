

//== Gameplay ==================================================================

//-- Dependencies --------------------------------
import {COMMAND, DIR} from '../shared/constants.js';
import Driver from './driver.js';
import Memory from './memory.js';

//==============================================================================

export default class ScreenGameplay extends Driver {
    
    //------------------------------------------------
    display(client) {
        this.client.skin.blank();
        const viewRadius = 10;
        const viewOffsetX = 21+viewRadius;
        const viewOffsetY = viewRadius;
        for(let offsetY = -viewRadius; offsetY <= viewRadius; offsetY++) {
            const posY = this.memory.posY + offsetY;
            for(let offsetX = -viewRadius; offsetX <= viewRadius; offsetX++) {
                const posX = this.memory.posX + offsetX;
                const description = this.memory.describeCoord(posX, posY);
                if(!description) { continue;}
                this.client.skin.drawText(
                    viewOffsetX+offsetX,
                    viewOffsetY+offsetY,
                    description.character,
                    description.color,
                    description.background,
                );
                
            }
        }
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
        this.memory = new Memory(data);
        this.client.focus(this.client.screenGameplay);
        this.client.display();
    }
}
