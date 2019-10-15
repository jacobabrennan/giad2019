

//==============================================================================

//-- Dependencies --------------------------------
import giadScenarioData from './giad_scenario.mjs';
import Actor from './actor.mjs';
import map from './map.mjs';
import Movable from './movable.mjs';
import time_manager from './time_manager.mjs';

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
        intelligence.attachActor(this.currentGame.hero);
        // Return new game
        return this.currentGame;
    },
    currentTime() {
        return this.currentGame.time;
    }
};

//------------------------------------------------
class Game {
    constructor(scenarioData) {
        this.time = 0;
        map.imprint(scenarioData);
        this.hero = new Actor();
        this.hero.move(1, 3);
        time_manager.registerActor(this.hero);
        //
        let herp = new Movable();
        herp.move(3, 1);
        //
        let derp = new Derper();
        derp.move(2, 4);
        time_manager.registerActor(derp);
    }
    async start() {
        time_manager.start();
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