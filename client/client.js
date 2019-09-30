

//==============================================================================

//-- Dependencies --------------------------------
import Driver from './driver.js';
import Skin from './skin.js';
import Network from './network.js';
import KeyCapture from './key_capture.js';
import ScreenTitle from './screen_title.js';
import ScreenGameplay from './screen_gameplay.js';

//------------------------------------------------
export default class Client extends Driver {
    constructor(configuration) {
        super(null);
        // create subcomponents
        this.skin = new Skin(this, configuration);
        this.keyCapture = new KeyCapture(this, configuration);
        this.network = new Network(this, configuration);
        // create game screens
        this.screenTitle = new ScreenTitle(this);
        this.screenGameplay = new ScreenGameplay(this);
        // display title screen
        this.focus(this.screenTitle);
        this.display();
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