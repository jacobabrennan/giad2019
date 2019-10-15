

//==============================================================================

//-- Dependencies --------------------------------
import {DIR, PERCEIVE} from '../shared/constants.mjs';
import Movable from './movable.mjs';
import map from './map.mjs';
import * as view from './view.mjs';


//==============================================================================

export default class Actor extends Movable {
    constructor() {
        super(...arguments);
        this.kinesthetics = {deltaX: 0, deltaY: 0};
    }

    //------------------------------------------------
    async takeTurn() {
        // Defer to intelligence; do default behavior if one doesn't exist
        if(this.intelligence) {
            await this.intelligence.takeTurn(this);
        } else{
            this.behavior();
        }
    }
    acceptIntelligence(intelligence) {
        this.intelligence = intelligence;
    }
    behavior() {}
    
    //-- Actions -------------------------------------
    wait() {
        return;
    }
    move() {
        const oldX = this.x;
        const oldY = this.y;
        const result = super.move(...arguments);
        this.kinesthetics.deltaX += this.x - oldX;
        this.kinesthetics.deltaY += this.y - oldY;
        return result;
    }
    walk(direction) {
        let deltaX = 0;
        let deltaY = 0;
        if(direction & DIR.NORTH) { deltaY++;}
        if(direction & DIR.SOUTH) { deltaY--;}
        if(direction & DIR.EAST ) { deltaX++;}
        if(direction & DIR.WEST ) { deltaX--;}
        return this.move(this.x+deltaX, this.y+deltaY);
    }
    pull(direction) {
        //
        const oldX = this.x;
        const oldY = this.y;
        //
        if(!this.walk(direction)) { return false;}
        //
        let deltaX = 0;
        let deltaY = 0;
        if(direction & DIR.NORTH) { deltaY++;}
        if(direction & DIR.SOUTH) { deltaY--;}
        if(direction & DIR.EAST ) { deltaX++;}
        if(direction & DIR.WEST ) { deltaX--;}
        const targetX = oldX - deltaX;
        const targetY = oldY - deltaY;
        //
        let pullTile = map.getTile(targetX, targetY);
        if(!(pullTile instanceof Movable)) { return false;}
        //
        return pullTile.move(oldX, oldY);
    }
    push(direction) {
        //
        const oldX = this.x;
        const oldY = this.y;
        //
        let deltaX = 0;
        let deltaY = 0;
        if(direction & DIR.NORTH) { deltaY++;}
        if(direction & DIR.SOUTH) { deltaY--;}
        if(direction & DIR.EAST ) { deltaX++;}
        if(direction & DIR.WEST ) { deltaX--;}
        const targetX = oldX + deltaX;
        const targetY = oldY + deltaY;
        //
        let pushTile = map.getTile(targetX, targetY);
        if(!(pushTile instanceof Movable)) { return false;}
        //
        let moved = pushTile.move(targetX+deltaX, targetY+deltaY);
        if(!moved) { return false;}
        //
        return this.walk(direction);
    }
    interact(direction) {
        //
        let deltaX = 0;
        let deltaY = 0;
        if(direction & DIR.NORTH) { deltaY++;}
        if(direction & DIR.SOUTH) { deltaY--;}
        if(direction & DIR.EAST ) { deltaX++;}
        if(direction & DIR.WEST ) { deltaX--;}
        const targetX = this.x + deltaX;
        const targetY = this.y + deltaY;
        //
        let interactTile = map.getTile(targetX, targetY);
        if(!(interactTile instanceof Movable)) { return false;}
        //
        return interactTile.interaction(this);
    }
    
    //------------------------------------------------
    perceive(theTile) {
        if(!theTile) { return PERCEIVE.AIR;}
        /* What can an actor perceive?
            Static: 1b
            Opaque: 1b
            color?: 6b, rgb(2b, 2b, 2b);
            'shape'/'form'?: 8b (ascii)
            'smell'?: 2b*4: Rot, Food, ?, ?,
            'size'?
            0b 0 0 (00,00,00) 00000000 (00,00,00,00) 00000000
            0b 0000 0000 0000 0000 0000 0000 0000 0000
        */
        let description = theTile.description; // 8b
        description |= theTile.shape;
        if(!(theTile instanceof Movable)) { description |= PERCEIVE.STATIC;}
        if(theTile.opaque) { description |= PERCEIVE.OPAQUE;}
        if(theTile.color) { description |= theTile.color << PERCEIVE.COLOR_SHIFT;}
        return description;
    }
    getKinesthetics(clear) {
        const kinesthetics = {
            deltaX: this.kinesthetics.deltaX,
            deltaY: this.kinesthetics.deltaY,
        };
        if(clear) {
            this.kinesthetics.deltaX = 0;
            this.kinesthetics.deltaY = 0;
        }
        return kinesthetics;
    }
    getSight() {
        /*  Returns actor's sight, determined by sightRadius, in the following
            format:
            {
                width: width of view grid, in tiles
                height: height of view grid, in tiles
                buffer: a Uint32Array of perception data
            }
        */
        // Determine visibility mask
        let theView = view.getViewGrid(
            this.x, this.y,
            this.sightRadius,
        );
        // Construct perception data from visibility mask
        let sight = {
            buffer: new Uint32Array(theView.width*theView.height),
            width: theView.width,
            height: theView.height,
        };
        for(let posY = 0; posY < theView.height; posY++) {
            for(let posX = 0; posX < theView.width; posX++) {
                // Skip tiles that are not visibility
                const compoundIndex = (posY*theView.width) + posX;
                const visible = theView.view[compoundIndex];
                if(!visible) { continue;}
                // Perceive tile at view location
                const worldX = (theView.x - Math.floor(theView.width /2)) + posX;
                const worldY = (theView.y - Math.floor(theView.height/2)) + posY;
                const theTile = map.getTile(worldX, worldY);
                const posPerception = this.perceive(theTile);
                // add tile perception to perception list
                sight.buffer[compoundIndex] = posPerception;
            }
        }
        // Return result
        return sight;
    }
}

//-- Class properties ----------------------------
Actor.prototype.shape = 'g'.charCodeAt(0) << PERCEIVE.SHAPE_SHIFT;
Actor.prototype.sightRadius = 10;
