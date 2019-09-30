

//==============================================================================

//-- Dependencies --------------------------------

//------------------------------------------------
export const gameManager = {
    currentGame: undefined,
    requestGame(intelligence) {
        // Cancel if a game is already in progress
        if(this.currentGame) { return;}
        // Generate a new game
        this.currentGame = {};
    }
};
