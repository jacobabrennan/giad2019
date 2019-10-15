

//==============================================================================

//-- Dependencies --------------------------------
import Driver from "../driver.js";
import { PERCEIVE } from "../../shared/constants.js";

//------------------------------------------------
export default class Map extends Driver {
    display() {
        this.client.skin.blankRect(21, 0, 21, 21);
        const viewRadius = 10;
        const viewOffsetX = 21+viewRadius;
        const viewOffsetY = viewRadius;
        const gameplay = this.client.screenGameplay;
        for(let offsetY = -viewRadius; offsetY <= viewRadius; offsetY++) {
            const posY = gameplay.memory.posY + offsetY;
            for(let offsetX = -viewRadius; offsetX <= viewRadius; offsetX++) {
                const posX = gameplay.memory.posX + offsetX;
                const description = gameplay.memory.describeCoord(posX, posY);
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
    async drawTest(data) {
        let sight = data.perception.sight;
        sight = data.sightSum;
        this.client.skin.blankRect(0, 0, sight.width, sight.height);
        // const viewRadius = Math.floor(sight.width/2);
        // const viewOffsetX = viewRadius;
        // const viewOffsetY = viewRadius;
        function heat2Color(heat) {
            if(heat < 4) {
                return (heat << 4);
            }
            if(heat < 7) {
                return heat-3;
            }
            if(heat < 10) {
                heat -= 6;
                return 3 | (heat<<2);
            }
            if(heat < 13) {
                heat -= 9;
                return 3 | (3 << 2) | (heat << 4);
            }
            return 3 | (3 << 4);
        }
        for(let offsetY = -10; offsetY <= 10; offsetY++) {
            const posSightY = offsetY - sight.y;
            for(let offsetX = -10; offsetX <= 10; offsetX++) {
                const posSightX = offsetX - sight.x;
                const indexSight = posSightY*sight.width + posSightX;
                let tile = sight.buffer[indexSight];
                if(!tile) { continue;}
                tile = heat2Color(Math.floor(tile));
                tile = tile << PERCEIVE.COLOR_SHIFT;
                tile |= '#'.charCodeAt() << PERCEIVE.SHAPE_SHIFT;
                const description = describePerception(tile);//sight.buffer[indexSight]);
                this.client.skin.drawText(
                    offsetX+10,
                    offsetY+10,
                    description.character,
                    description.color,
                    description.background,
                );
            }
        }
    }
}

function describePerception(description) {
    if(!description) { return;}
    //
    const verbose = {}
    const character_code = (description&PERCEIVE.SHAPE) >> PERCEIVE.SHAPE_SHIFT;
    verbose.character = String.fromCharCode(character_code);
    // Copy over verbose from model to... verbose
    let colorFull = (description & PERCEIVE.COLOR) >> PERCEIVE.COLOR_SHIFT;
    let colorR = (colorFull     ) & 0b11;
    let colorG = (colorFull >> 2) & 0b11;
    let colorB = (colorFull >> 4) & 0b11;
    colorR = Math.floor(colorR*255/3);
    colorG = Math.floor(colorG*255/3);
    colorB = Math.floor(colorB*255/3);
    verbose.color = `rgb(${colorR},${colorG},${colorB})`;
    verbose.background = '#333';
    //
    return verbose;
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}