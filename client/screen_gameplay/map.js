

//==============================================================================

//-- Dependencies --------------------------------
import Driver from "../driver.js";

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
}
