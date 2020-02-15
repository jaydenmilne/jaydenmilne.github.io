"use strict";
/**
 * The goal of this file is to abstract away all of the grid related functionality
 * so the algorithms can call abstract methods and not have to worry about the minutia 
 * of drawing.
 */

const GRID_BACK_COLOR = '#292929';
const GRID_WALL_COLOR = 'white';
const GRID_GOAL_COLOR = '#FFDE03';
const GRID_START_COLOR = '#BB86FC';
const GRID_FRONTIER_COLOR = "#03DAC6";
const GRID_PATH_COLOR = "#CF6679";
const GRID_EXPLORED_COLOR = "#000000";
const PAGE_BACKROUND_COLOR = "#121212";

const canvas = document.getElementById('grid');
const ctx = canvas.getContext('2d');

const grid_size_dropdown = document.getElementById("cell-size-select");
const clear_button       = document.getElementById("clear-button");
const fixed_cell_radio   = document.getElementById("cell-type-fixed");
const grid_size_box      = document.getElementById("grid-size-box");
const reset_button       = document.getElementById("reset-button");

class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

/* Mouse/Touch Event Tracking */
// used to keep track of if the mouse is down or not. Either a bool or a touch
// event ID
let down = false;
// used to interpolate between touch/mouse events
let last_sample = new Cell(-1,-1);

// used to keep track if we are clearing or setting walls
let clearing = false;

// used to keep track if we should place the goal on next right click
let place_goal = false;

clear_button.addEventListener("click", function() {
    init_canvas(canvas, ctx);
});

// disable right click context menu
canvas.oncontextmenu = (event) => {
    event.preventDefault();
    return false;
};  

// logical representation of the state of the grid.
let grid = [];
// {x, y} of the start cell
let start_cell = null;
// {x, y} of the end cell
let goal_cell = null;
// object with information on the size of the grid
let grid_info = null;

// grid values
const GRID_EMPTY = 0;
const GRID_WALL = 1;
const GRID_START = 2;
const GRID_GOAL = 3;
const GRID_PATH = 4;
const GRID_FRONTIER = 5;
const GRID_EXPLORED = 6;

function init_canvas(c, ctx) {
    c.width = c.clientWidth;
    c.height = c.clientHeight;

    // color in the entire background
    ctx.fillStyle = GRID_BACK_COLOR;
    ctx.fillRect(0,0,c.width, c.height);

    grid_info = {
        "cell_size": 0,
        "cells_x": 0,
        "cells_y": 0,
        "fixed_cell": true
    }
    // figure out the size of the grid
    if (fixed_cell_radio.checked) {
        // fixed cell sizes
        grid_info.cell_size = parseInt(grid_size_dropdown.value);
        grid_info.cells_x = Math.floor(c.width / grid_info.cell_size);
        grid_info.cells_y = Math.floor(c.height / grid_info.cell_size);
    } else {
        // parse the input
        let size = grid_size_box.value.split(",");
        grid_info.cells_x = parseInt(size[0]);
        grid_info.cells_y = parseInt(size[1]);
        grid_info.fixed_cell = false;

        // find the smaller dimension, we will make at least that dimension
        // is full
        // TODO: this is broken
        if (grid_info.cells_x > grid_info.cells_y) {
            grid_info.cell_size = Math.floor(c.width / grid_info.cells_x);
        } else {
            grid_info.cell_size = Math.floor(c.height / grid_info.cells_y);
        }
    }

    // color in the parts of the canvas that aren't part of the grid the
    // background color so that the user can tell where they can't draw
    ctx.fillStyle = PAGE_BACKROUND_COLOR;
    let cutoff_y = grid_info.cells_y * grid_info.cell_size;
    let cutoff_x = grid_info.cells_x * grid_info.cell_size;
    ctx.fillRect(0, cutoff_y, c.width, c.height - cutoff_y);
    ctx.fillRect(cutoff_x, 0, c.width - cutoff_x, c.height);

    // create the logical representation of the grid space
    grid = Array.from(Array(grid_info.cells_y), () => {
        let a = new Array(grid_info.cells_x)
        a.fill(0);
        return a;
    })

    start_cell = goal_cell = null;
}

function update_cell(cell, state, paint=true) {
    // don't update a grid cell that doesn't exist
    if (cell.x >= grid_info.cells_x || cell.y >= grid_info.cells_y) return;


    // there can only be one start or end cell
    if (state == GRID_START) {
        if (start_cell) update_cell(start_cell, GRID_EMPTY);
        start_cell = cell;
    }

    if (state == GRID_GOAL) {
        if (goal_cell) update_cell(goal_cell, GRID_EMPTY);
        goal_cell = cell;
    }

    // update the logical cell x, y to the new state and re-draw the cell
    grid[cell.y][cell.x] = state;


    let color = GRID_BACK_COLOR;
    switch (state) {
        case GRID_EMPTY:
            break;
        case GRID_START:
            color = GRID_START_COLOR;
            break;
        case GRID_GOAL:
            color = GRID_GOAL_COLOR;
            break;
        case GRID_WALL:
            color = GRID_WALL_COLOR;
            break;
        case GRID_FRONTIER:
            color = GRID_FRONTIER_COLOR;
            break;
        case GRID_PATH:
            color = GRID_PATH_COLOR;
            break;
        case GRID_EXPLORED:
            color = GRID_EXPLORED_COLOR;
            break;
        default:
            alert("unkown state " + state); 
    }
    
    if (paint) {
        ctx.fillStyle = color;

        ctx.fillRect(
            cell.x * grid_info.cell_size, 
            cell.y * grid_info.cell_size, 
            grid_info.cell_size, 
            grid_info.cell_size
        );
    }
}

function getMousePos(evt) {
    // Pass in a MouseEvent or a Touch
    var rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
}

function get_cell_from_selection(event) {
    // Pass in a MouseEvent or a Touch
    var pos = getMousePos(event);

    let x = Math.floor(pos.x / grid_info.cell_size);
    let y = Math.floor(pos.y / grid_info.cell_size);

    if (x == undefined || y == undefined) alert("oops!");

    return new Cell(x,y);
}

function mousedown_begin(event) {
    let state = GRID_EMPTY;
    let cell = get_cell_from_selection(event);
    last_sample = cell;
    if (event.button != 0) {
        // right or middle click. place start or goal state
        down = false;

        state = place_goal ? GRID_GOAL : GRID_START;
        place_goal = !place_goal;

    } else {
        down = true;

        // decide if we are setting or clearing a cell
        if (grid[cell.y][cell.x] != GRID_EMPTY) {
            clearing = true;
            state = GRID_EMPTY;
        } else {
            clearing = false;
            state = GRID_WALL;
        }
    }

    // update the current cell
    update_cell(cell, state);
}

function touch_begin(event) {
    event.preventDefault();
    // we only care about the first touch
    let touch = event.targetTouches.item(0);
    let cell = get_cell_from_selection(touch);
    let state = GRID_EMPTY;
    down = touch.identifier;
    last_sample = cell;

    // decide if we are setting or clearing a cell
    if (grid[cell.y][cell.x] != GRID_EMPTY) {
        clearing = true;
        state = GRID_EMPTY;
    } else {
        clearing = false;
        state = GRID_WALL;
    }

    // update the current cell
    update_cell(cell, state);

    // set a timeout for 1 second to see if they are pressing and holding.
    // if the touch event is still going 1s later and hasn't move, place a goal
    // or end cell
    setTimeout(() => {
        if (down !== false && last_sample.x == cell.x && last_sample.y == cell.y) {
            // selection hasn't moved. 
            // right or middle click. place start or goal state
            down = false;

            state = place_goal ? GRID_GOAL : GRID_START;
            place_goal = !place_goal;
            update_cell(cell, state);
            
        }
    }, 1000)
}

function selection_end(event) {
    down = false;
}

function selection_move(event) {
    if (down !== false) {
        let cell = get_cell_from_selection(event);
        last_sample = cell;
        update_cell(cell, clearing ? GRID_EMPTY : GRID_WALL);
    }
}

// Register mouse events 
canvas.addEventListener('mousedown', mousedown_begin);
canvas.addEventListener('mouseup', selection_end);
canvas.addEventListener('mousemove', selection_move);
canvas.addEventListener('mouseleave', selection_end);

// Register touch events. 
// Arrow functions massage the TouchEvent a little and forward to mouse event
canvas.addEventListener('touchstart', touch_begin);

canvas.addEventListener('touchmove', (event) => {
    event.preventDefault();

    if (down === false) return;
    let touch = event.changedTouches.item(down);
    
    if (!touch) return;

    selection_move(touch);
});

canvas.addEventListener('touchend', selection_end);
canvas.addEventListener('touchcancel', selection_end);

function reset_grid() {
    /**
     * Reset the non-wall values
     */
    let whitelist = [GRID_WALL, GRID_GOAL, GRID_START];

    for (let j = 0; j < grid_info.cells_y; ++j) {
        for (let i = 0; i < grid_info.cells_x; ++i) {
            if (!whitelist.includes(grid[j][i])) {
                update_cell(new Cell(i, j), GRID_EMPTY);
            }
        }
    }
}

reset_button.addEventListener("click", reset_grid);

init_canvas(canvas, ctx);
