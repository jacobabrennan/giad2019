

//==============================================================================

//-- Dependencies --------------------------------
import giadScenarioData from './giad_scenario.mjs';
import Actor from './actor.mjs';
import map from './map.mjs';
import Movable from './movable.mjs';
import timeManager from './time_manager.mjs';

import Intelligence from './intelligence.mjs';

//------------------------------------------------
export default {
    currentGame: undefined,
    requestGame(intelligence, scenarioData) {
        // Cancel if a game is already in progress
        if(this.currentGame) { return;}
        // Provide a default scenario for GiaD time constraints
        if(!scenarioData) {
            scenarioData = giadScenarioData;
        }
        // Generate a new game
        this.currentGame = new Game(scenarioData);
        this.requestActor(intelligence);
        // Return new game
        return this.currentGame;
    },
    currentTime() {
        return timeManager.time;
    },
    requestActor(intelligence) {
        return this.currentGame.requestActor(intelligence);
    }
};

//------------------------------------------------
class Game {
    constructor(scenarioData) {
        map.imprint(scenarioData);
        //
        let herp = new Movable();
        herp.move(3, 1);
        //
        // let derp = new Derper();
        // derp.move(2, 4);
        // timeManager.registerActor(derp);
    }
    async start() {
        timeManager.start();
    }
    requestActor(intelligence) {
        let actor = new Actor();
        actor.move(1,1);
        intelligence.attachActor(actor);
        timeManager.registerActor(actor);
    }
}

class Derper extends Actor {
    constructor() {
        super();
        let herp = new Intelligence();
        herp.attachActor(this);
        herp.direction = 1;
        herp.takeTurn = async function(anActor) {
            let success = anActor.walk(this.direction);
            if(!success || Math.random() < 1/7) {
                this.direction = Math.floor(Math.random()*16);
            }
            if(!success) {
                return await this.takeTurn(anActor);
            }
        };
    }
}