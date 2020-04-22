"use strict";
/**
 * This file handles
 * - Initializing the grid
 * - Parsing saved patterns in the URL and updating them
 * - Keeping the grid/canvas in sync
 */

const GRID_BACK_COLOR = '#292929';
const GRID_WALL_COLOR = 'white';
const GRID_GOAL_COLOR = '#FFDE03';
const GRID_START_COLOR = '#03DAC6';
const GRID_FRONTIER_COLOR = "#BB86FC";
const GRID_PATH_COLOR = "#CF6679";
const GRID_EXPLORED_COLOR = "#23036A";
const PAGE_BACKROUND_COLOR = "#121212";

const SAVE_WAIT_TEXT = "⏳ Waiting";
const SAVE_SAVED_TEXT = "✅ Saved";
const SAVE_OFF = "❌ Off"

const grid_size_dropdown = document.getElementById("cell-size-select");
const clear_button = document.getElementById("clear-button");
const fixed_cell_radio = document.getElementById("cell-type-fixed");
const fixed_grid_radio = document.getElementById("cell-type-fixed-grid");

const grid_size_box = document.getElementById("grid-size-box");
const reset_button = document.getElementById("reset-button");

const save_in_url_box = document.getElementById("save-url-checkbox");
const saved_span = document.getElementById("saved-span");

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
    enable_playback();
    disable_playback();
    init_canvas(canvas, ctx);
    clear_url();
});


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

/**
 * Get the current goal cell (to avoid hardcoding a cross-file global)
 */
function get_goal_cell() {
    return goal_cell;
}

const canvas = document.getElementById('grid');
const ctx = canvas.getContext('2d');

// disable right click context menu on the canvas
canvas.oncontextmenu = (event) => {
    event.preventDefault();
    return false;
};  

/**
 * Initialize the canvas element
 * @param {HTMLCanvasElement} c 
 * @param {RenderingContext} ctx 
 */
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

/**
 * Fill in the given scell
 * @param {Cell} cell 
 * @param {GRID_*} state 
 */
function paint_cell(cell, state) {
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
    
    ctx.fillStyle = color;

    ctx.fillRect(
        cell.x * grid_info.cell_size, 
        cell.y * grid_info.cell_size, 
        grid_info.cell_size, 
        grid_info.cell_size
    );
}

/**
 * God method that updates a cell in the grid, and paints it if needed
 * @param {Cell} cell to update 
 * @param {GRID_*} state to set it to
 * @param {boolean} paint if it should be painted in the grid 
 */
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

    if (paint) paint_cell(cell, state);
    
}

function getMousePos(evt) {
    // Pass in a MouseEvent or a Touch
    var rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
}

/**
 * Gets the logical cell in the grid from the given mouse event
 * @param {MouseEvent, TouchEvent} event 
 * @returns {Cell} the cell location
 */
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
    schedule_url_update();
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
            Navigator.vibrate(200);  // vibrate for 200ms
        }
    }, 1000)

    schedule_url_update();
}

function selection_end(event) {
    last_sample = null;
    down = false;
}

/**
 * Uses Bresenham's algorithm to draw a rasterized line between two points
 * https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm
 * @param {Cell} p1
 * @param {Cell} p2 
 */
function interpolate_between(p1, p2) {
    let x0 = p1.x;
    let y0 = p1.y;
    let x1 = p2.x;
    let y1 = p2.y;
    
    let dx = Math.abs(x0 - x1);
    let dy = -1 * Math.abs(y0 - y1);
    let sx = x0 < x1 ? 1 : -1;
    let sy = y0 < y1 ? 1 : -1;
    
    let err = dx + dy;

    while (true) {
        update_cell(new Cell(x0, y0), clearing ? GRID_EMPTY : GRID_WALL);
        if (x0 == x1 && y0 == y1) break;

        let e2 = 2 * err;
        if (e2 >= dy) {
            err += dy;
            x0 += sx;
        }

        if (e2 <= dx) {
            err += dx;
            y0 += sy;
        }
    }

}

function selection_move(event) {
    if (down !== false) {
        let cell = get_cell_from_selection(event);
        interpolate_between(last_sample, cell);
        last_sample = cell;
        schedule_url_update();
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

function reset_grid(paint=true, toggle_grid=true) {
    /**
     * Reset the non-wall values
     */
    if (toggle_grid) {  // otherwise IDS breaks
        enable_playback();
        disable_playback();    
    }
    
    let whitelist = [GRID_WALL, GRID_GOAL, GRID_START];

    for (let j = 0; j < grid_info.cells_y; ++j) {
        for (let i = 0; i < grid_info.cells_x; ++i) {
            if (!whitelist.includes(grid[j][i])) {
                update_cell(new Cell(i, j), GRID_EMPTY, paint);
            }
        }
    }
}

// *****************************************************************************
// * URL Handling (saving state in URL)


// Cache the setTimeout value used for delaying the URL update so we can 
// cancel it
let update_timeout = null;


function clear_url() {
    // using the history API doesn't work when loading from file:///
    window.location.hash = "";
}

/**
 * Meant to be run on page load. Attempt to parse the URL, and init the canvas/grid
 */
function decode_url() {
    // check if there are params
    let hash = window.location.hash.substring(1);
    let params = new URLSearchParams(hash);

    if (params.has('sz')) {
        // if there is a fixed size, there may be something to load
        let size = params.get('sz');
        size = size.replace('-', ',');

        // change the application state by changing the UI, what could go wrong?
        grid_size_box.value = size;
        fixed_cell_radio.checked = false;
        fixed_grid_radio.checked = true;

        init_canvas(canvas, ctx);

        if (params.has('g')) {
            let goal = params.get('g').split('-');
            goal = new Cell(parseInt(goal[0]), parseInt(goal[1]));
            update_cell(goal, GRID_GOAL, true);
        }
    
        if (params.has('s')) {
            let start = params.get('s').split('-');
            start = new Cell(parseInt(start[0]), parseInt(start[1]));
            update_cell(start, GRID_START, true);
        }

        if (params.has('w')) {
            let runs = params.get('w').split('-');
            for (let i = 0; i < runs.length; ++i) {
                let run = runs[i].split('.');
                for (let j = 0; j < parseInt(run[2]); ++j) {
                    update_cell(new Cell(parseInt(run[0]) + j, parseInt(run[1])), GRID_WALL, true);
                }
            }
        }
    } else {
        // init the canvas with the defaults
        init_canvas(canvas, ctx);
    }

    saved_span.innerText = SAVE_SAVED_TEXT;
}


/**
 * Makes the URL reflect the current state of the grid
 */
function update_url() {
    let params = new URLSearchParams();

    // Set fixed things
    params.set("sz", `${grid_info.cells_x}-${grid_info.cells_y}`);

    if (goal_cell != null) {
        params.set("g", `${goal_cell.x}-${goal_cell.y}`)
    }

    if (start_cell != null) {
        params.set("s", `${start_cell.x}-${start_cell.y}`)
    }

    let cells = "";
    let x, y;

    for (y = 0; y < grid_info.cells_y; ++y) {
        let row_start = null;
        for (x = 0; x < grid_info.cells_x; ++x) {
            let v = grid[y][x];
            if (v == GRID_WALL && row_start == null) {
                row_start = new Cell(x, y);
            } else if (v != GRID_WALL && row_start != null) {
                let run_len = x - row_start.x;
                cells += `${row_start.x}.${row_start.y}.${run_len}-`
                row_start = null;
            }
        }
        if (row_start != null) {
            let run_len = x - row_start.x;
            cells += `${row_start.x}.${row_start.y}.${run_len}-`
        }

    }

    params.set("w", cells);   
    window.location.hash = params.toString()
}

/**
 * Schedule a URL update after the user interacts with the grid
 */
function schedule_url_update() {
    if (!save_in_url_box.checked) return;

    saved_span.innerText = SAVE_WAIT_TEXT;
    
    function update() {
        clearTimeout(update_timeout);
        update_url();
        saved_span.innerText = SAVE_SAVED_TEXT;
    }

    if (update_timeout == null) {
        update_timeout = setTimeout(update, 2000);
    } else {
        clearTimeout(update_timeout);
        update_timeout = setTimeout(update, 2000);
    }
}

save_in_url_box.addEventListener("change", e => {
    if (event.target.checked) {
        update_url();
        saved_span.innerText = SAVE_SAVED_TEXT;
    } else {
        clearTimeout(update_timeout);
        saved_span.innerText = SAVE_OFF;
    }
})

reset_button.addEventListener("click", reset_grid);

decode_url();