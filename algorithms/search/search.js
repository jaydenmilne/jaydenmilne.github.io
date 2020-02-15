"use strict";

const run_button = document.getElementById("run-button");
const algorithm_select = document.getElementById("algorithm-select");
const heuristic_select = document.getElementById("heuristic-select");
const connected_8 = document.getElementById("connected-8-checkbox");

run_button.addEventListener("click", run);

function not_start_or_goal(node) {
    return node.value != GRID_START && node.value != GRID_GOAL;
}

async function recursive_dls(node, problem, limit) {
    /**
     * Section 3.4.4, figure 3.17
     */

    if (problem.goal_test(node)){
        return node;
    }

    if (limit == 0) {
        return "cutoff";
    } else {
        if (not_start_or_goal(node))
            update_cell(node.cell, GRID_PATH);

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

        if (not_start_or_goal(node))
            update_cell(node.cell, GRID_EMPTY);
        if (cutoff_occured) {
            return "cutoff";
        } else {
            return "failure";
        }
    }

}

class Node {
    constructor(parent, x, y, value, depth) {
        this.parent = parent;
        this.cell = {"x": x, "y": y};
        this.value = value;
        this.depth = depth;
    }
}

function evaluate_and_add(children, i, j, problem, node, mark_frontier=false) {
    if (i < 0 || i >= problem.grid_info.cells_x) return;
    if (j < 0 || j >= problem.grid_info.cells_y) return;
    
    let value = problem.grid[j][i];
    
    if (value != GRID_EMPTY && value != GRID_GOAL) return;

    let child = new Node(node, i, j, value, node.depth + 1);

    if (value != GRID_START && value != GRID_GOAL && mark_frontier)
        update_cell(child.cell, GRID_FRONTIER);

    children.push(child)
}

function actions_children_4(node, problem) {
    let children = Array();
    let cell = node.cell
    evaluate_and_add(children, cell.x, cell.y + 1, problem, node); // down
    evaluate_and_add(children, cell.x + 1, cell.y, problem, node); // right
    evaluate_and_add(children, cell.x - 1, cell.y, problem, node); // left
    evaluate_and_add(children, cell.x, cell.y - 1, problem, node); // up

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

async function run_dfs(problem) {
    return recursive_dls(problem.root, problem, -1);
}

async function run_ids(problem) {
    let depth = 0;
    while (depth < 5000) {
        let result = await recursive_dls(problem.root, problem, depth);
        if (result != "cutoff") return result;
        reset_grid()
        depth++;
    }
    console.log(depth)
    return "failure";
}

async function run_bfs(problem) {

}

async function run_astar(problem) {

}

async function run() {
    if (start_cell == null || goal_cell == null) {
        alert("You must specify a start and goal cell. \n\n" +
              "Right click to place a start cell (purple), then right click " +
              "again somewhere else to place the goal cell (gold).");
        return;
    }

    reset_grid();
    let ac = connected_8.checked ? actions_children_8 : actions_children_4;
    let root = new Node(null, start_cell.x, start_cell.y, GRID_START, 0);

    let problem = {
        "goal_test": (node) => {
            return node.value == GRID_GOAL;
        },
        "grid": grid,
        "grid_info": grid_info,
        "root": root,
        "actions_children": ac
    }

    let result = null;
    let algo = null;
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
        case "a*":
            algo = run_astar;
            break;
        default:
            alert("unkown algorithm " + algorithm_select.value);
    }

    result = await algo(problem)

}
