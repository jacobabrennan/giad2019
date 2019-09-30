

//==============================================================================

//-- Dependencies --------------------------------
import skin from './skin.js';
import keyCapture from './key_capture.js';

//------------------------------------------------
export default {
    skin: skin,
    keyCapture: keyCapture,
    setup(configuration) {
        // Configure subcomponents
        skin.setup(configuration);
        keyCapture.setup(configuration, this);
    },
    command(command, options) {
        console.log(options.key, command);
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