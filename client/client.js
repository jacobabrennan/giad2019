

//==============================================================================

//-- Dependencies --------------------------------
import skin from './skin.js';

//------------------------------------------------
export default {
    skin: skin,
    setup(configuration) {
        // Configure subcomponents
        skin.setup(configuration);
    }
};


/*
Client
    Collects Keyboard Input
    Displays Output
        Via Map
        Via info box
        Via Menu System
        Via Status Screen
*/