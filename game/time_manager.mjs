

/*== Time Manager: Documentation ===============================================
*/


//== Time Manager: Implementation ==============================================

//-- Dependencies --------------------------------
import {PriorityQueue} from './path_finding/index.mjs';
import gameManager from './game_manager.mjs';

//-- Time Management -----------------------------
export default {
    time: 0,
    running: false,
    async start() {
        // Don't allow duplicate time loops
        if(this.running) { return;}
        this.running = true;
        // Begin time loop, iterating over each actor and giving them a turn
        while(this.running) {
            const nextActor = this.nextActor();
            if(nextActor.nextTurn > this.time) {
                this.time = nextActor.nextTurn;
            }
            await nextActor.takeTurn();
            this.registerActor(nextActor);
        }
    },
    stop () {
        this.running = false;
    },

    //-- Adding and Removing Actors ------------------
    actors: new PriorityQueue(function (a,b) {
        const turnDifference = b.nextTurn - a.nextTurn;
        return Math.sign(turnDifference);
    }),
    registerActor(newActor) {
        /**
            This function adds an object of type actor to the actors queue
                The queue is a PriorityQueue which orders who will take
                turns.
            An actor should reregister itself after every turn, as they are
                removed in nextActor as part of the process of assigning
                the next turn.
            It does not return a value.
        **/
        newActor.nextTurn = this.time+1;
        this.actors.push(newActor);
    },
    cancelActor(oldActor) {
        /**
            This function removes an object from the actors queue. It will
                no longer be in line to recieve turns.
            It does not return a value.
        **/
        this.actors.remove(oldActor);
    },
    
    //-- Managing Turns ------------------------------
    nextActor() {
        /**
            This function finds the next actor in line to take their turn.
            An actor should reregister itself after every turn, as they
                are removed from the queue by this function.
            It returns an object of type actor if one is available, or
                undefined if there are no actors registered.
        **/
        return this.actors.pop();
    },
    registerEvent(eventFunction, delay) {
        var timeStamp = gameManager.currentTime() + delay;
        var newEvent = new EventActor(eventFunction, timeStamp);
        this.registerActor(newEvent);
    }
};

//-- Utilities -----------------------------------
class EventActor {
    constructor(eventFunction, timeStamp) {
        this.eventFunction = eventFunction;
        this.nextTurn = timeStamp;
        this.callbackStorage = undefined;
    }
    takeTurn(callback) {
        this.eventFunction();
        callback(false);
    }
    dispose() {}
}
