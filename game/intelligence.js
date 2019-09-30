

//==============================================================================

//-- Dependencies --------------------------------

//------------------------------------------------
export default class Intelligence {
    attachActor(actor) {
        this.actor = actor;
        this.actor.intelligence = this;
    }
    command(command) {}
    takeTurn(actor) {}
}
