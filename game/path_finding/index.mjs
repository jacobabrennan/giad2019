

/*== Path Finding: Documentation ===============================================

    Path Finding is a module for answering questions whose space can be
    represented as a graph with nodes and vertices. The classic example is
    finding the shortest path between to points in space by traversing through
    a series of nodes along weighted edges.

    The module exports several data structures and functions, each documented in
    their own file:

    PriorityQueue: A class representing a queue of items ordered by priority.
    aStar: A function for finding the optimal path between stand and end nodes.

*/


//== Path Finding: Implementation ==============================================

//-- Dependencies --------------------------------
import PriorityQueue from './priority_queue.mjs';
import aStar from './a_star.mjs';

//-- Collected Resources for Exporting -----------
export {PriorityQueue};
export {aStar};
