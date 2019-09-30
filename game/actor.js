

//==============================================================================

//-- Dependencies --------------------------------

//------------------------------------------------
export default class Actor {
    async takeTurn() {
        console.log('Actor taking turn')
        // Defer to intelligence, if one exists
        if(this.intelligence) {
            console.log(' - Intelligence present')
            return await this.intelligence.takeTurn(this);
        }
        console.log(' - Intelligence absent')
        // Otherwise, do default behavior
        this.behavior();
    }
    behavior() {}
}

/*
    Game is ready for actor to take turn: actor.takeTurn()
    Actor defers to intelligence: player.takeTurn()
    Player sends updates to client, then waits for a response
Client updates
Client sends a command to player
    Player completes turn
*/