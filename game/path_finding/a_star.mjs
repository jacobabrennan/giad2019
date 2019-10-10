

/*== A* Path Finding: Documentation ============================================

    --------------------------------------------------
    Background:

    A* is an algorithm for efficiently finding the lowest cost path on a graph
    from specified start and end vertices.

    --------------------------------------------------
    Interface:

    The module exports one function, aStar, used for path finding on a graph.
    
    The function returns an array of graph nodes, in order representings a path
    from the specified start node to an end node. An end node is not supplied as
    an argument, but rather determined implicitely as any node satisfying:
        costHeuristic(node) <= 0

    The aStar function accepts four arguments, as follows:
        nodeStart: the node at which to start the search
        costHeuristic(node): an admissible function which returns the lowest
            possible cost to travel from the supplied node to an end node.
        getNeighbors(node): a function which returns an array. The first element
            of this array is an array of nodes adjacent to the supplied node.
            The second element of the array is the associated costs of moving
            from this node to each adjacent node. For example:
                getNeighbors = (node1) => [ [node2, node3], [7, 4] ]
        options: An optional object specifying any of the following values:
            maxCost: No nodes with a cost higher than this will be expanded.
            maxDepth: The search will stop after expanding this many nodes.
*/


//== A* Path Finding: Implementation ===========================================

//-- Dependencies --------------------------------
import PriorityQueue from './priority_queue.mjs';

//-- A* Algorithm --------------------------------
export default function aStar(nodeStart, costHeuristic, getNeighbors, options) {
    // Get configuration from options
    options = options || {};
    const maxDepth = options.maxDepth || 0;
    const maxCost = options.maxCost || 0;
    // Create functions f and g, including cache for g, and comparator for queue
    let costRunningCache = new WeakMap();
    costRunningCache.set(nodeStart, 0);
    function costRunning(node) { return costRunningCache.get(node);}
    function costTotal(node) { return costRunning(node)+costHeuristic(node);}
    function comparator(N1, N2) {
        return Math.sign(costTotal(N2) - costTotal(N1));
    }
    // Initialize open and closed node lists, and graph edge links:
    // Open and closed nodes represent nodes that have been expanded / searched
    // edgeLinks represents the lowest cost parent (value) linked to child (key)
    const nodesOpen = new PriorityQueue(comparator);
    nodesOpen.push(nodeStart);
    const nodesClosed = new Set();
    const edgeLinks = new WeakMap();
    // Expand nodes until a goal node is reached: costHeuristic(node) <= 0
    let nodesExpanded = 0;
    let nodeGoal;
    while(nodesOpen.length) {
        // Select the lowest cost open node
        let nodeCurrent = nodesOpen.pop();
        nodesClosed.add(nodeCurrent);
        // Check if this node is a goal node
        if(costHeuristic(nodeCurrent) <= 0) {
            nodeGoal = nodeCurrent;
            break;
        }
        // Fail if the number of nodes expanded has reached a specified maximum
        nodesExpanded++;
        if(maxDepth && nodesExpanded >= maxDepth) {
            return undefined;
        }
        // Generate neighboring nodes from nodeCurrent node
        const neighbors = getNeighbors(nodeCurrent);
        const nodesNeighbor = neighbors[0];
        const costsTraversal = neighbors[1];
        // Add each neighbor node to open nodes, and cache running cost per node
        for(let index = 0; index < nodesNeighbor.length; index++) {
            let nodeNeighbor = nodesNeighbor[index];
            let costTraverse = costsTraversal[index];
            // Skip nodes that have already been visited at lower running cost
            if(nodesClosed.has(nodeNeighbor)) { continue;}
            // Skip nodes that are open, but at a lower running cost
            let costNeighbor = costRunning(nodeCurrent) + costTraverse;
            let costOld = costRunning(nodeNeighbor);
            if(costOld !== undefined && costNeighbor >= costOld) { continue;}
            // Skip nodes that are too costly
            if(maxCost && costNeighbor > maxCost) { continue;}
            // Store running cost and path to neighbor node from current node
            costRunningCache.set(nodeNeighbor, costNeighbor);
            edgeLinks.set(nodeNeighbor, nodeCurrent);
            // Add neighbor to open nodes
            if(!nodesOpen.contains(nodeNeighbor)) {
                nodesOpen.push(nodeNeighbor)
            }
        }
    }
    // Handle case where goal was unreachable, even after expanding all nodes
    if(!nodeGoal) { return null;}
    // Generate path by iterating over hash map from goal back to start
    const total_path = [];
    do {
        total_path.unshift(nodeGoal);
        nodeGoal = edgeLinks.get(nodeGoal);
    }
    while(nodeGoal)
    // Return generated path
    return total_path;
}
