

//==============================================================================

//-- Dependencies --------------------------------
import giadScenarioData from '../giad_scenario.js';
import Actor from './actor.js';
import Map from './map.js';

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
        this.currentGame.start();
    }
};

//------------------------------------------------
class Game {
    constructor(scenarioData) {
        Map.imprint(scenarioData);
        this.hero = new Actor();
    }
    async start() {
        console.log('Starting Game')
        while(true) {
            await this.hero.takeTurn();
        }
    }
}