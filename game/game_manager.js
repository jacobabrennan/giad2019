

//==============================================================================

//-- Dependencies --------------------------------
import giadScenarioData from '../giad_scenario.js';
import Actor from './actor.js';
import map from './map.js';

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
        map.placeContainable(this.hero, 1, 3);
    }
    async start() {
        console.log('Starting Game');
        while(true) {
            await this.hero.takeTurn();
        }
    }
}