

//==============================================================================

//-- Dependencies --------------------------------
import Actor from './actor.js';

//------------------------------------------------
export default {
    currentGame: undefined,
    requestGame(intelligence) {
        // Cancel if a game is already in progress
        if(this.currentGame) { return;}
        // Generate a new game
        this.currentGame = new Game();
        intelligence.attachActor(this.currentGame.hero);
        this.currentGame.start();
    }
};

//------------------------------------------------
class Game {
    constructor() {
        this.hero = new Actor();
    }
    async start() {
        console.log('Starting Game')
        while(true) {
            await this.hero.takeTurn();
        }
    }
}