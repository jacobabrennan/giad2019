

//==============================================================================

//-- Dependencies --------------------------------
import Driver from './driver.js';
import Skin from './skin.js';
import KeyCapture from './key_capture.js';

//------------------------------------------------
export default class Client extends Driver {
    constructor(configuration) {
        super();
        // create and configure subcomponents
        this.skin = new Skin(configuration);
        this.keyCapture = new KeyCapture(configuration, this);
    }
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