

//== Gameplay ==================================================================

//-- Dependencies --------------------------------
import {COMMAND, DIR} from '../shared/constants.js';
import Driver from './driver.js';


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
                console.log(command, options);
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


//==============================================================================

class Memory {
    constructor(data) {
        this.gridWidth = data.width;
        this.gridHeight = data.height;
        this.posX = 0;
        this.posY = 0;
        this.tiles = {};
        this.movers = {};
        this.gridTiles = new Array(this.gridWidth*this.gridHeight);
        this.gridContents = new Array(this.gridWidth*this.gridHeight);
    }
    sense(data) {
        // Set current location
        if(data.location) {
            this.posX = data.location.x;
            this.posY = data.location.y;
        }
        // Memorize any newly sensed tiles
        if(data.newTiles) {
            for(let indexTile = 0; indexTile < data.newTiles.length; indexTile++) {
                this.memorizeTile(data.newTiles[indexTile]);
            }
        }
        // Put sensed tile coordinates into tiles grid
        for(let indexCoord = 0; indexCoord < data.coords.length; indexCoord++) {
            const indexedCoord = data.coords[indexCoord];
            const compoundIndex = this.indexFromCoords(indexedCoord.x, indexedCoord.y);
            this.gridTiles[compoundIndex] = indexedCoord.tileId;
        }
        //
    }
    memorizeTile(tileNew) {
        let tileMemory = this.tiles[tileNew.id];
        if(!tileMemory) {
            tileMemory = {id: tileNew.id};
            this.tiles[tileMemory.id] = tileMemory;
        }
        if(tileNew.character ) { tileMemory.character  = tileNew.character ;}
        if(tileNew.color     ) { tileMemory.color      = tileNew.color     ;}
        if(tileNew.background) { tileMemory.background = tileNew.background;}
        if(tileNew.dense     ) { tileMemory.dense      = tileNew.dense     ;}
        if(tileNew.opaque    ) { tileMemory.opaque     = tileNew.opaque    ;}
    }
    rememberTile(tileId) {
        return this.tiles[tileId];
    }
    describeCoord(x, y) {
        const tileId = this.gridTiles[this.indexFromCoords(x, y)];
        if(!tileId) { return;}
        const tileCoord = this.rememberTile(tileId);
        const description = {}
        //
        description.character  = tileCoord.character;
        if(tileCoord.color     ) { description.color      = tileCoord.color     ;}
        if(tileCoord.background) { description.background = tileCoord.background;}
        if(tileCoord.dense     ) { description.dense      = tileCoord.dense     ;}
        if(tileCoord.opaque    ) { description.opaque     = tileCoord.opaque    ;}
        //
        return description;
    }

    //-- Utilities -----------------------------------
    indexFromCoords(x, y) {
        // Handle coordinates out of bounds
        if(x >= this.gridWidth  || x < 0) { return -1;}
        if(y >= this.gridHeight || y < 0) { return -1;}
        // calculate compound index
        return (y*this.gridWidth + x);
    }
}
