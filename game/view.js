

//== View Calculation ==========================================================
/**
 *  This is a javascript port of https://github.com/initrl/MRPAS-Python
 *  I suspect this code could be a lot shorter & cleaner
 */

//-- Dependencies --------------------------------
// import Actor from './actor.js';
// import gameManager from './game_manager.js';
import map from './map.js';


//== Basic Implementation ======================================================

class ViewGrid {
    constructor(x, y, range) {
        this.x = x;
        this.y = y;
        this.range = range;
        this.width = (range*2)+1;
        this.height = (range*2)+1;
        this.view = [];
        this.view.length = this.width * this.height;
        for(var viewI = 0; viewI < this.view.length; viewI++){
            this.view[viewI] = 0;
        }
    }
    setVisible(x, y) {
        var offsetX = (x-this.x)+this.range;
        var offsetY = (y-this.y)+this.range;
        var compoundIndex = offsetY*this.width + offsetX;
        this.view[compoundIndex] = true;
    }
    isVisible(x, y) {
        var offsetX = (x-this.x)+this.range;
        var offsetY = (y-this.y)+this.range;
        var compoundIndex = offsetY*this.width + offsetX;
        return this.view[compoundIndex];
    }
    isOpaque(x, y) {
        const testTile = map.getTile(x, y);
        if(!testTile) { return true;}
        if(testTile.opaque){ return true;}
        // const testContents = mapManager.getTileContents(x, y, this.levelId);
        // for(var cI = 0; cI < testContents.length; cI++){
        //     var indexedC = testContents[cI];
        //     if(indexedC && indexedC.opaque){ return true;}
        // }
        return false;
    }
}
const computeQuadrant = function (view, xPos, yPos, maxRadius, dx, dy){
    var startAngle = [];
    startAngle[99] = undefined;
    var endAngle = startAngle.slice(0);
    //octant: vertical edge:
    var iteration = 1;
    var done = false;
    var totalObstacles = 0;
    var obstaclesInLastLine = 0;
    var minAngle = 0.0;
    var x = 0.0;
    var y = yPos + dy;
    var wWidth = map.width;
    var wHeight = map.height;
    var slopesPerCell, halfSlopes, processedCell, minx, maxx, visible, 
        startSlope, endSlope, idx;
    //do while there are unblocked slopes left and the algo is within
    // the map's boundaries
    //scan progressive lines/columns from the PC outwards
    if((y < 0) || (y >= wHeight)){
        done = true;
    }
    while(!done){
        //process cells in the line
        slopesPerCell = 1.0 / (iteration + 1);
        halfSlopes = slopesPerCell * 0.5;
        processedCell = parseInt(minAngle / slopesPerCell, 10);
        minx = Math.max(0, xPos - iteration);
        maxx = Math.min(wWidth - 1, xPos + iteration);
        done = true;
        x = xPos + (processedCell * dx);
        while((x >= minx) && (x <= maxx)){
            visible = true;
            startSlope = processedCell * slopesPerCell;
            let centreSlope = startSlope + halfSlopes;
            let endSlope = startSlope + slopesPerCell;
            if((obstaclesInLastLine > 0) && (!view.isVisible(x, y))){
                idx = 0;
                while(visible && (idx < obstaclesInLastLine)){
                    if(!view.isOpaque(x, y)){
                        if((centreSlope > startAngle[idx]) && (centreSlope < endAngle[idx])){
                            visible = false;
                        }
                    } else if ((startSlope >= startAngle[idx]) && (endSlope <= endAngle[idx])){
                        visible = false;
                    }
                    if(
                        visible && ( (!view.isVisible(x, y-dy)) ||
                        (view.isOpaque(x, y-dy))) &&
                        ((x - dx >= 0) && (x - dx < wWidth) &&
                        ((!view.isVisible(x-dx, y-dy)) ||
                        (view.isOpaque(x-dx, y-dy))))
                    ){
                        visible = false;
                    }
                    idx += 1;
                }
            }
            if(visible){
                view.setVisible(x, y);
                done = false;
                //if the cell is opaque, block the adjacent slopes
                if(view.isOpaque(x, y)){
                    if(minAngle >= startSlope){
                        minAngle = endSlope;
                    } else{
                        startAngle[totalObstacles] = startSlope;
                        endAngle[totalObstacles] = endSlope;
                        totalObstacles += 1;
                    }
                }
            }
            processedCell += 1;
            x += dx;
        }
        if(iteration == maxRadius){
            done = true;
        }
        iteration += 1;
        obstaclesInLastLine = totalObstacles;
        y += dy;
        if((y < 0) || (y >= wHeight)){
            done = true;
        }
        if(minAngle == 1.0){
            done = true;
        }
    }
    //octant: horizontal edge
    iteration = 1; //iteration of the algo for this octant
    done = false;
    totalObstacles = 0;
    obstaclesInLastLine = 0;
    minAngle = 0.0;
    x = (xPos + dx); //the outer slope's coordinates (first processed line)
    y = 0;
    //do while there are unblocked slopes left and the algo is within the map's boundaries
    //scan progressive lines/columns from the PC outwards
    if((x < 0) || (x >= wWidth)) done = true;
    while(!done){
        //process cells in the line
        slopesPerCell = 1.0 / (iteration + 1);
        halfSlopes = slopesPerCell * 0.5;
        processedCell = parseInt(minAngle / slopesPerCell, 10);
        let miny = Math.max(0, yPos - iteration);
        let maxy = Math.min(wHeight - 1, yPos + iteration);
        done = true;
        y = yPos + (processedCell * dy);
        while((y >= miny) && (y <= maxy)){
            //calculate slopes per cell
            visible = true;
            startSlope = (processedCell * slopesPerCell);
            let centreSlope = startSlope + halfSlopes;
            let endSlope = startSlope + slopesPerCell;
            if((obstaclesInLastLine > 0) && (!view.isVisible(x, y))){
                idx = 0;
                while(visible && (idx < obstaclesInLastLine)){
                    if(!view.isOpaque(x, y)){
                        if((centreSlope > startAngle[idx]) && (centreSlope < endAngle[idx])){
                            visible = false;
                        }
                    } else if((startSlope >= startAngle[idx]) && (endSlope <= endAngle[idx])){
                        visible = false;
                    }  
                    if(
                        visible && (!view.isVisible(x-dx, y) || (view.isOpaque(x-dx, y))) &&
                        (
                            (y - dy >= 0) && (y - dy < wHeight) &&
                            ((!view.isVisible(x-dx, y-dy)) || (view.isOpaque(x-dx, y-dy)))
                        )
                    ){
                        visible = false;
                    }
                    idx += 1;
                }
            }
            if(visible){
                view.setVisible(x, y);
                done = false;
                //if the cell is opaque, block the adjacent slopes
                if(view.isOpaque(x, y)){
                    if(minAngle >= startSlope){
                        minAngle = endSlope;
                    } else{
                        startAngle[totalObstacles] = startSlope;
                        endAngle[totalObstacles] = endSlope;
                        totalObstacles += 1;
                    }
                }
            }
            processedCell += 1;
            y += dy;
        }
        if(iteration == maxRadius){
            done = true;
        }
        iteration += 1;
        obstaclesInLastLine = totalObstacles;
        x += dx;
        if((x < 0) || (x >= wWidth)){
            done = true;
        }
        if(minAngle == 1.0){
            done = true;
        }
    }
};
export const getViewGrid = function (x, y, visionRange){
    var newView = new ViewGrid(x, y, visionRange);
    newView.setVisible(x, y); //player can see themself
    //compute the 4 quadrants of the view
    computeQuadrant(newView, x, y, visionRange,  1,  1);
    computeQuadrant(newView, x, y, visionRange,  1, -1);
    computeQuadrant(newView, x, y, visionRange, -1,  1);
    computeQuadrant(newView, x, y, visionRange, -1, -1);
    return newView;
};

const getView = function (x, y, range){
    /**
        This function constructs a grid (an array with indexes ordered by
            width and height) where each coordinate index references
            either a tile in view at that position, or null. The grid
            includes all coordinates within the supplied range, including
            the center, giving dimensions of (range+1+range)^2.
        It returns said grid.
     **/
    // Check each tile within range for visibilty.
    var rangeGrid = [];
    var visibilityGrid = getViewGrid(x, y, range);
    for(var posY = y-range; posY <= y+range; posY++){
        for(var posX = x-range; posX <= x+range; posX++){
            var gridVisibility = visibilityGrid.isVisible(posX, posY);
            if(!gridVisibility){
                rangeGrid.push(null);
            } else{
                const tileInView = map.getTile(posX, posY);
                rangeGrid.push(tileInView.id);
            }
        }
    }
    // Return the finished view grid.
    return rangeGrid;
};


//===== Extend Actor =========================================================//

// Actor.prototype.checkView = function (containable){
//     var viewContents = this.getViewContents();
//     if(viewContents.indexOf(containable) == -1){ return false;}
//     else{ return true;}
// };
// Actor.prototype.getViewContents = function (){
//     // Check for cached view (deletes at start of every turn).
//     if(this.turnViewData) {
//         if(this.turnViewData.timeStamp === gameManager.currentTime()) {
//             return this.turnViewData;
//         }
//     }
//     // Compile an array of the contents of all coordinates in view.
//     var viewContents = [];
//     this.viewRange = 10;
//     var range = this.viewRange;
//     var visibilityGrid = getViewGrid(this.x, this.y, range);
//     for(var posY = this.y-range; posY <= this.y+range; posY++){
//         for(var posX = this.x-range; posX <= this.x+range; posX++){
//             var gridVisibility = visibilityGrid.isVisible(posX, posY);
//             if(!gridVisibility){ continue;}
//             var tContents = currentLevel.getTileContents(posX, posY);
//             if(!tContents){ continue;}
//             for(var contentI = 0; contentI < tContents.length; contentI++){
//                 var indexedContent = tContents[contentI];
//                 viewContents.push(indexedContent);
//             }
//         }
//     }
//     // Cache and Return turn view data.
//     viewContents.timeStamp = gameManager.currentTime();
//     this.turnViewData = viewContents;
//     return viewContents;
// };
