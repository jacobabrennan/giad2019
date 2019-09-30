

//==============================================================================

//-- Dependencies --------------------------------

//-- Project constants ---------------------------
const FONT_SIZE = 16;
const TILE_SIZE = 16;
const GRID_WIDTH = 42;
const GRID_HEIGHT = 22;

//==============================================================================
export default {
    setup(configuration) {
        // Create drawing context
        const canvas = document.createElement('canvas');
        canvas.width = GRID_WIDTH * TILE_SIZE;
        canvas.height = GRID_HEIGHT * TILE_SIZE;
        this.context = canvas.getContext('2d');
        // Configure drawing context for crisp "pixel art" display
        this.context.imageSmoothingEnabled = false;
        this.context.font = ''+FONT_SIZE+'px press_start_kregular';
        // Blank canvas before display
        this.blank();
        // Add canvas to game container
        const container = configuration.container;
        container.tabIndex = 1;
        container.focus();
        container.appendChild(canvas);
    },
    
    //-- Drawing Functions ---------------------------
    blank() {
        this.context.fillStyle = '#000';
        this.context.fillRect(
            0, 0,
            this.context.canvas.width,
            this.context.canvas.height,
        );
    },
    drawText: function(x, y, text, color='#fff', background='#f00'){
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
    },
}
