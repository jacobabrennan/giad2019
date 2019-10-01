

//==============================================================================

//-- Dependencies --------------------------------

//-- Project constants ---------------------------
const FONT_SIZE = 16;
const TILE_SIZE = 16;
const GRID_WIDTH = 42;
const GRID_HEIGHT = 22;

//==============================================================================
export default class Skin {
    constructor(client, configuration) {
        // Create drawing context
        const canvas = document.createElement('canvas');
        canvas.width = GRID_WIDTH * TILE_SIZE;
        canvas.height = GRID_HEIGHT * TILE_SIZE;
        this.context = canvas.getContext('2d');
        // Configure drawing context for crisp "pixel art" display
        this.context.imageSmoothingEnabled = false;
        this.context.font = ''+FONT_SIZE+'px press_start_kregular';
        // Listen for window resize events
        window.addEventListener("resize", () => this.resize(), false);
        // Blank and center canvas before display
        this.container = configuration.container;
        this.resize();
        this.blank();
        // Add canvas to game container
        this.container.tabIndex = 1;
        this.container.focus();
        this.container.appendChild(canvas);
    }
    
    //-- Display Size Management (Resizing) ----------
    viewportSize() {
        /**
         * Returns the size of the viewport (the page's display area).
         */
        const doc  = document.documentElement;
        const body = document.getElementsByTagName('body')[0];
        const _x = window.innerWidth  || doc.clientWidth  || body.clientWidth;
        const _y = window.innerHeight || doc.clientHeight || body.clientHeight;
        return {width: _x, height: _y};
    }
    resize(){
        //
        const size = this.viewportSize();
        const monitorAspectRatio = size.width / size.height;
        const gameAspectRatio = GRID_WIDTH / GRID_HEIGHT;
        let modifiedWidth;
        let modifiedHeight;
        // Center Horizontally
        if(monitorAspectRatio >= gameAspectRatio) {
            modifiedHeight = size.height;
            modifiedWidth = gameAspectRatio * modifiedHeight;
            this.container.style.top = "0px";
            this.container.style.left = ""+Math.floor((size.width-modifiedWidth)/2)+"px";
        }
        // Center Vertically
        else {
            modifiedWidth = size.width;
            modifiedHeight = modifiedWidth / gameAspectRatio;
            this.container.style.top = ""+Math.floor((size.height-modifiedHeight)/2)+"px";
            this.container.style.left = "0px";
        }
        //
        this.container.style.width  = modifiedWidth +"px";
        this.container.style.height = modifiedHeight+"px";
    }
    
    //-- Drawing Functions ---------------------------
    blank() {
        this.context.fillStyle = '#000';
        this.context.fillRect(
            0, 0,
            this.context.canvas.width,
            this.context.canvas.height,
        );
    }
    blankRect(x, y, width, height) {
        // Transform from standard cartesian coordinates
        y = GRID_HEIGHT - y;
        // Determine fill cordinates and dimensions
        const fillX = x*TILE_SIZE;
        const fillY = ((y-height)*TILE_SIZE);
        const fillWidth = width * TILE_SIZE;
        const fillHeight = height * TILE_SIZE;
        // Fill background with background color
        this.context.fillStyle = "#000";
        this.context.fillRect(fillX, fillY, fillWidth, fillHeight);
    }
    drawText(x, y, text, color='#fff', background='#000') {
        // Transform from standard cartesian coordinates
        y = GRID_HEIGHT - y;
        // Determine fill cordinates and dimensions
        const fillX = x*TILE_SIZE;
        const fillY = ((y-1)*TILE_SIZE);
        const fillWidth = text.length * TILE_SIZE;
        const fillHeight = TILE_SIZE;
        // Fill background with background color
        this.context.fillStyle = background;
        this.context.fillRect(fillX, fillY, fillWidth, fillHeight);
        // Draw the string
        const fontScaleError = -FONT_SIZE/8;
            /* This is an off-by-one error positioning the font, which becomes
            off-by-two as the font is scaled to double height at 16px. */
        this.context.fillStyle = color;
        this.context.fillText(text, fillX, y*TILE_SIZE+fontScaleError);
    }
    drawCommand(x, y, key, text) {
        // Draw command key
        this.drawText(x, y, key, '#fc0');
        // Draw command description
        this.drawText(x+2, y, text);
    }
}
