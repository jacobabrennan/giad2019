

/*== Priority Queue: Documentation =============================================

    --------------------------------------------------
    Background:

    A priority queue is a data structure used to keep items sorted by priority.
    As items are added to the queue, they are placed in order based on a sorting
    function. The highest priority item can be popped from the queue at any time
    without disrupting the order of the queue.
    
    --------------------------------------------------
    Interface:

    This module exports one class, the PriorityQueue. The PriorityQueue
    constructor takes one argument, a comparator function used to sort items
    added to the queue. The comparator must be a function of two arguments, P1
    and P2, and must return one of three values:
         0: P1 and P2 have equal priority
        +1: P1 has greater priority
        -1: P2 has greater priority
    
    PriorityQueue instances have five methods and one property that function as
    expected from similarly named array methods / properties:
        length: The number of items in the queue
        push(newItem): Adds newItem to the queue
        pop(): Removes and returns the item with the greatest priority
        remove(item): Removes and returns item, without breaking sort order
        peek(): Returns the item with the greatest priority, without removing it
        contains(testItem): Returns true if item is in queue, false otherwise
*/


//== Priority Queue: Implementation ============================================

//-- Project Constants ---------------------------
const PRIVATE_SIFTDOWN = Symbol();
const PRIVATE_BUBBLEUP = Symbol();

//-- Class Definition & Constructor --------------
export default class PriorityQueue {
    constructor(comparator) {
        this.compare = comparator;
        this.storage = [];
    }
    
    //-- Adding and Removing Items -------------------
    push(item) {
        // Add item to the end of the storage array
        this.storage.push(item);
        // Bubble up the item into it's proper sort order
        this[PRIVATE_BUBBLEUP](this.storage.length-1);
    }
    pop() {
        // Handle very simple heaps by shifting
        if(this.storage.length <= 2) {
            return this.storage.shift();
        }
        // Get top of heap, return it at end of function
        const nodeNext = this.storage[0];
        // Place last item in storage onto top of heap, reorder with sift down
        const nodeCurrent = this.storage.pop();
        this.storage[0] = nodeCurrent;
        this[PRIVATE_SIFTDOWN](0);
        // Return the original top of the heap
        return nodeNext;
    }
    remove(item) {
        // Find index of item in storage
        const indexItem = this.storage.indexOf(item);
        if(indexItem === -1) { return undefined;}
        // Remove it from the queue, preserving priority order
        this[PRIVATE_BUBBLEUP](indexItem, true);
        return this.pop();
    }
    
    //-- Membership and Emptiness testing ------------
    get length() {
        return this.storage.length;
    }
    peek() {
        return this.storage[0];
    }
    contains(testItem) {
        if(this.storage.indexOf(testItem) !== -1) {
            return true;
        }
        return false;
    }
    
    //-- Priority Maintenance ------------------------
    [PRIVATE_SIFTDOWN](indexCurrent) {
        // Swap nodes down the heap until sort order is valid
        let indexNext;
        const indexLast = this.storage.length-1;
        let index1st = indexCurrent*2 +1;
        let index2nd = index1st+1;
        while(index1st <= indexLast) {
            indexNext = index1st;
            // Only check second child if one exists
            if(index2nd <= indexLast) {
                let childOrder = this.compare(
                    this.storage[index1st],
                    this.storage[index2nd],
                );
                if(childOrder < 0) {
                    indexNext = index2nd;
                }
            }
            // Stop sifting if item has reached proper place
            let nodeNext = this.storage[indexNext];
            let nodeCurrent = this.storage[indexCurrent];
            if(this.compare(nodeNext, nodeCurrent) < 0) { break;}
            // Otherwise perform a swap
            this.storage[indexNext] = nodeCurrent;
            this.storage[indexCurrent] = nodeNext;
            indexCurrent = indexNext;
            index1st = indexCurrent*2 +1;
            index2nd = index1st+1;
        }
    }
    [PRIVATE_BUBBLEUP](indexCurrent, forceUp) {
        // Iteratively swap item with parent until it reaches proper sort order
        while(indexCurrent > 0) {
            const indexParent = Math.floor((indexCurrent-1)/2);
            const nodeCurrent = this.storage[indexCurrent]
            const nodeParent = this.storage[indexParent]
            if(!forceUp) {
                const order = this.compare(nodeParent, nodeCurrent);
                if(order >= 0) { break;}
            }
            this.storage[indexCurrent] = nodeParent;
            this.storage[indexParent] = nodeCurrent;
            indexCurrent = indexParent;
        }
    }
}
