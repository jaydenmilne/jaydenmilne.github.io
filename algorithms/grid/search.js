"use strict";

const run_button = document.getElementById("run-button");
const algorithm_select = document.getElementById("algorithm-select");
const heuristic_select = document.getElementById("heuristic-select");
const connected_8 = document.getElementById("connected-8-checkbox");

run_button.addEventListener("click", run);
function recursive_dls(node, problem, limit) {
    /**
     * page 88
     */

    // Mark this one as being on the path
    if (problem.goal_test(node)){
        return node;
    }

    if (node.value != GRID_START)
        update_cell(node.cell, GRID_PATH);

    if (limit == 0) {
        return "cutoff";
    } else {
        let cutoff_occured = false;

        let children = problem.actions_children(node, problem);
        for (let i = 0; i < children.length; ++i) {
            let child = children[i];
            let result = recursive_dls(child, problem, limit-1);
            if (result == "cutoff") {
                cutoff_occured = true;
            } else if (result != "failure") {
                // found a path!
                return result;
            }
        };

        if (cutoff_occured) {
            return "cutoff";
        } else {
            update_cell(node.cell, GRID_EXPLORED);
            return "failure";
        }
    }

}

class Node {
    constructor(parent, x, y, value) {
        this.parent = parent;
        this.cell = {"x": x, "y": y};
        this.value = value;
    }
}

function evaluate_and_add(children, i, j, problem, node) {
    if (i < 0 || i >= problem.grid_info.cells_x) return;
    if (j < 0 || j >= problem.grid_info.cells_y) return;
    
    let value = problem.grid[j][i];
    
    if (value != GRID_EMPTY && value != GRID_GOAL) return;

    let child = new Node(node, i, j, value);

    if (value != GRID_START && value != GRID_GOAL)
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

function run_dfs(problem) {
    recursive_dls(problem.root, problem, -1);
}

function run_ids(problem) {
    let depth = 0;
    while (depth < 5000) {
        let result = recursive_dls(problem.root, problem, depth);
        if (result != "cutoff" || result != "failure") return;
        reset_grid()
        depth++;
    }
    console.log(depth)
    return "failure";
}

function run_bfs(problem) {

}

function run_astar(problem) {

}

function run() {
    if (start_cell == null || goal_cell == null) {
        alert("You must specify a start and goal cell. \n\n" +
              "Right click to place a start cell (purple), then right click " +
              "again somewhere else to place the goal cell (gold).");
        return;
    }

    reset_grid();
    let ac = connected_8.checked ? actions_children_8 : actions_children_4;
    let root = new Node(null, start_cell.x, start_cell.y, GRID_START);

    let problem = {
        "goal_test": (node) => {
            return node.value == GRID_GOAL;
        },
        "grid": grid,
        "grid_info": grid_info,
        "root": root,
        "actions_children": ac
    }

    switch (algorithm_select.value) {
        case "dfs":
            run_dfs(problem);
            break;
        case "ids":
            run_ids(problem);
            break;
        case "bfs":
            run_bfs(problem);
            break;
        case "a*":
            run_astar(problem);
            break;
        default:
            alert("unkown algorithm " + algorithm_select.value);
    }

}
