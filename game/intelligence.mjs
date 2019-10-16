

//==============================================================================

//-- Dependencies --------------------------------

//------------------------------------------------
export default class Intelligence {
    attachActor(actor) {
        this.actor = actor;
        this.actor.acceptIntelligence(this);
    }
    command(command) {}
    async takeTurn(actor) {}
}
