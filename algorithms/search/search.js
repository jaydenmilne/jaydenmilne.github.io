"use strict";


// *****************************************************************************
// * Classes


class Frontier {
    constructor(evaluation_function) {
        this.evaluation_function = evaluation_function;

        // for fast existence checking
        this.node_map = new Map();
    }

    has(node) {
        return this.node_map.has(node.repr);
    }

    /**
     * Inserts the given node into the frontier
     * @param {Node} node 
     */
    insert(node) {
        let count = 1;
        if (this.node_map.has(node.repr)) {
            count = this.node_map.get(node.repr) + 1;
        }
        this.node_map.set(node.repr);
    }

    pop() {
        throw new Error("Implement me");
    }

    get empty() {
        return this.size == 0;
    }
}

class MinHeapFrontier extends Frontier {
    constructor(evaluation_function) {
        super(evaluation_function);
        this.heap = new MinHeap(evaluation_function, (node) => node.repr);
    }

    insert(node) {
        if (this.node_map.has(node.repr)) return;

        super.insert(node);
        this.heap.push(node);
    }

    pop() {
        let node = this.heap.pop();
        
        // determine if we need to delete
        let count = this.node_map.get(node.repr);
        --count;
        if (count == 0) {
            this.node_map.delete(node.repr);
        } else {
            this.node_map.set(node.repr, count);
        }

        return node;
    }

    get size() {
        return this.heap.size;
    }
}

class FifoFrontier extends Frontier {
    constructor() {
        super(null);
        this.linked_list = new SinglyLinkedList();
    }

    insert(child) {
        if (this.node_map.has(child.repr)) return;
        super.insert(child);
        // no need for evaluation function, just put it in
        this.linked_list.append(child);
    }

    pop() {
        let node = this.linked_list.pop();
        this.node_map.delete(node.repr);
        return node;
    }

    get size() {
        return this.node_map.size;
    }
}

class Node {
    constructor(parent, x, y, value, depth) {
        this.parent = parent;
        this.cell = {"x": x, "y": y};
        this.value = value;
        this.depth = depth;
    }

    get repr() {
        return `${this.cell.x}_${this.cell.y}`;
    }

    get is_start_or_goal() {
        return this.value == GRID_START || this.value == GRID_GOAL;
    }
}

class Problem {
    constructor(goal_test, grid, grid_info, root, actions_children) {
        this.goal_test = goal_test;
        this.grid = grid;
        this.grid_info = grid_info;
        this.root = root;
        this.actions_children = actions_children;
    }
}

class GraphProblem {
    /**
     * Represents a problem that is searched with a graph algorithm
     * @param {Problem} problem 
     * @param {Frontier} frontier 
     * @param {boolean} bfs_mode 
     */
    constructor(problem, frontier, bfs_mode) {
        this.goal_test = problem.goal_test;
        this.grid = problem.grid;
        this.grid_info = problem.grid_info;
        this.root = problem.root;
        this.actions_children = problem.actions_children;
        this.frontier = frontier;
        this.bfs_mode = bfs_mode;
    }
}

// *****************************************************************************
// * UI References

const run_button = document.getElementById("run-button");
const algorithm_select = document.getElementById("algorithm-select");
const heuristic_select = document.getElementById("heuristic-select");
const connected_8 = document.getElementById("connected-8-checkbox");
const results_length = document.getElementById("results-length");
const results_intermediate_states = document.getElementById("results-intermediate-states")
const results_max_frontier = document.getElementById("results-max-frontier")

run_button.addEventListener("click", run_click);

// *****************************************************************************
// * Search Algorithms

/**
 * Run Depth First Search (not depth limited) on the problem
 * @param {Problem} problem to run on 
 */
async function run_dfs(problem) {
    max_frontier_size = "N/A";
    return recursive_dls(problem.root, problem, -1);
}

/**
 * Run iterative deepening depth first search
 * @param {Problem} problem to run 
 */
async function run_ids(problem) {
    // alert("Iterative Deeping search can be very slow!\nYou have been warned.");
    let depth = 0;
    max_frontier_size = "N/A";
    while (depth < 5000) {
        let result = await recursive_dls(problem.root, problem, depth);
        if (result != "cutoff") return result;

        reset_grid(false, false);  // don't repaint grid

        depth++;
    }
    return "failure";
}

/**
 * Generic depth limited search helper function, for run_ids and run_dfs.
 * @param {Node} node Node to start this recursive search from
 * @param {Problem} problem problem we are working on
 * @param {Number} limit Depth limit. Set to -1 for no depth limit.
 */
async function recursive_dls(node, problem, limit) {
    /**
     * Section 3.4.4, figure 3.17
     */
    ++intermediate_states;
    if (problem.goal_test(node)){
        return node;
    }

    if (limit == 0) {
        return "cutoff";
    } else {
        await update_and_record(node, GRID_PATH);

        let cutoff_occured = false;

        let children = problem.actions_children(node, problem);
        for (let i = 0; i < children.length; ++i) {
            let child = children[i];
            let result = await recursive_dls(child, problem, limit-1);
            if (result == "cutoff") {
                cutoff_occured = true;
            } else if (result != "failure") {
                // found a path!
                return result;
            }
        };

        await update_and_record(node, GRID_EMPTY);

        if (cutoff_occured) {
            return "cutoff";
        } else {
            return "failure";
        }
    }

}

/**
 * Generic graph search algorithm, for BFS, A*, and more.
 * TODO: Async-ify this function
 * Figure 3.11 from Russell & Norvig
 * @param {GraphProblem} problem to solve 
 */
async function graph_search(problem) {
    let node = problem.root;

    if (problem.goal_test(node)) return node;

    let frontier = problem.frontier;
    let explored = new Set();
    frontier.insert(node);
    ++intermediate_states;

    while (true) {
        ++intermediate_states;
        
        if (frontier.empty) return "failure";

        max_frontier_size = Math.max(frontier.size, max_frontier_size);
        node = frontier.pop();
        explored.add(node.repr);
        await update_and_record(node, GRID_EXPLORED);

        if (!problem.bfs_mode && problem.goal_test(node)) return node;

        let children = problem.actions_children(node, problem);

        for (let i = 0; i < children.length; ++i) {
            let child = children[i];
            if (!frontier.has(child.repr) && !explored.has(child.repr)) {
                if (problem.bfs_mode && problem.goal_test(child)) return child;
                frontier.insert(child)
                await update_and_record(child, GRID_FRONTIER);
            }
        }
    }
}

async function run_bfs(problem) {
    let frontier = new FifoFrontier();
    let graph_problem = new GraphProblem(problem, frontier, true);

    let result = await graph_search(graph_problem);

    await draw_result(result);

    return result;
}

/**
 * Run Greedy Best-First Search (3.5.1)
 * @param {Problem} problem 
 */
async function run_gbfs(problem) {
    let h = get_heuristic();
    let frontier = new MinHeapFrontier(h);
    let graph_problem = new GraphProblem(problem, frontier, false);
    let result = await graph_search(graph_problem);

    await draw_result(result);
    return result;

}

async function run_astar(problem) {
    let h = get_heuristic();

    let f = (node) => {
        return node.depth + h(node);
    }

    let frontier = new MinHeapFrontier(f);
    let graph_problem = new GraphProblem(problem, frontier, false);
    let result = await graph_search(graph_problem);

    await draw_result(result);
    return result;

}

// *****************************************************************************
// * Helper Functions

/**
 * Given the result node, draws the path from that node to the start state, or
 * nothing if node == "failure"
 * @param {Node} node 
 */
async function draw_result(node) {
    if (node != "failure") {
        // color in the solution
        while (node != null) {
            await update_and_record(node, GRID_PATH);
            node = node.parent;
        }
    }
}

/**
 * Gets the currently selected heruistic in the dropdown
 */
function get_heuristic() {
    switch (heuristic_select.value) {
        case "md":
            return manhattan_distance;
        case "ed":
            return euclidian_distance;
        case "null":
            return (_) => 0;
    }
}

/**
 * Given the goal cell, retuns the manhattan distance
 * @param {Node} node 
 */
function manhattan_distance(node) {
    let goal = get_goal_cell();
    return Math.abs(node.cell.x - goal.x) + Math.abs(node.cell.y - goal.y);
}

/**
 * Given the goal cell, retuns the euclidian distance
 * @param {Node} node 
 */
function euclidian_distance(node) {
    let goal = get_goal_cell()
    return Math.sqrt(Math.pow(node.cell.x - goal.x, 2) + Math.pow(node.cell.y - goal.y, 2));
}

/**
 * Updates the node and pauses if needed.
 * @param {Node} node 
 * @param {GRID_*} state 
 * @param {*} category unused for now
 */
async function update_and_record(node, state, category) {
    if (node.is_start_or_goal) return;

    //record(node.cell, state, category);
    update_cell(node.cell, state, true);

    await playback_wait();

    return;
}

async function evaluate_and_add(children, i, j, problem, node, mark_frontier) {
    if (i < 0 || i >= problem.grid_info.cells_x) return;
    if (j < 0 || j >= problem.grid_info.cells_y) return;
    
    let value = problem.grid[j][i];
    
    if (value == GRID_WALL || value == GRID_START || value == GRID_PATH) return;

    let child = new Node(node, i, j, value, node.depth + 1);

    if (value != GRID_START && value != GRID_GOAL && mark_frontier) {
       await update_and_record(child, GRID_FRONTIER);
    }

    children.push(child)
}

function actions_children_4(node, problem, mark_frontier=false) {
    let children = Array();
    let cell = node.cell
    evaluate_and_add(children, cell.x, cell.y + 1, problem, node, mark_frontier); // down
    evaluate_and_add(children, cell.x + 1, cell.y, problem, node, mark_frontier); // right
    evaluate_and_add(children, cell.x - 1, cell.y, problem, node, mark_frontier); // left
    evaluate_and_add(children, cell.x, cell.y - 1, problem, node, mark_frontier); // up

    return children;
}

function actions_children_8(node, problem) {
    /**
     * Generate the child successor nodes from the parent
     */

    let children = Array();
    let cell = node.cell;

    evaluate_and_add(children, cell.x - 1, cell.y - 1, problem, node);
    evaluate_and_add(children, cell.x - 1, cell.y, problem, node);
    evaluate_and_add(children, cell.x - 1, cell.y + 1, problem, node);
    evaluate_and_add(children, cell.x, cell.y - 1, problem, node);
    evaluate_and_add(children, cell.x, cell.y + 1, problem, node);
    evaluate_and_add(children, cell.x + 1, cell.y - 1, problem, node);
    evaluate_and_add(children, cell.x + 1, cell.y, problem, node);
    evaluate_and_add(children, cell.x + 1, cell.y + 1, problem, node);

    return children;
}

function run_click() {
    setTimeout(run, 10);
}

let intermediate_states = 0;
let max_frontier_size = 0;

async function run() {
    if (start_cell == null || goal_cell == null) {
        alert("You must specify a start and goal cell. \n\n" +
              "Right click (or tap and hold) to place a start cell (teal), " +
              "then right click (or tap and hold) again somewhere else to " +
              "place the goal cell (gold).");
        return;
    }

    reset_grid();

    let ac = connected_8.checked ? actions_children_8 : actions_children_4;
    let root = new Node(null, start_cell.x, start_cell.y, GRID_START, 0);

    let problem = new Problem(
        (node) => {
            return node.value == GRID_GOAL;
        }, grid, grid_info, root, ac)

    let result = null;
    let algo = null;
    console.log(`Starting algorithm ${algorithm_select.value}...`)

    switch (algorithm_select.value) {
        case "dfs":
            algo = run_dfs;
            break;
        case "ids":
            algo = run_ids;
            break;
        case "bfs":
            algo = run_bfs;
            break;
        case "gbfs":
            algo = run_gbfs;
            break;
        case "a*":
            algo = run_astar;
            break;
        default:
            alert("unkown algorithm " + algorithm_select.value);
    }
    // enable the buttons
    enable_playback();
    intermediate_states = 0;
    max_frontier_size = -1;

    result = await algo(problem);

    console.log(`\tDone!`);
    // disable the buttons
    disable_playback();


    // Update info box
    if (result == "failure") {
        results_length.innerText = "No Solution";
        results_intermediate_states.innerText = "No Solution";
        results_max_frontier.innerText = "No Solution";
        return;
    }

    results_length.innerText = result.depth;
    results_intermediate_states.innerText = intermediate_states;
    results_max_frontier.innerText = max_frontier_size;

}
