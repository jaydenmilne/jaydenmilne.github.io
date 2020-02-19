"use strict";

const play_button = document.getElementById("play-button");
const stop_button = document.getElementById("stop-button");
const step_button = document.getElementById("step-button");
const playback_speed = document.getElementById("playback-speed");

const RECORD_RESET = 0;
const RECORD_FRONTIER = 1;
const RECORD_PATH = 2;

let playing = false;
let next_to_draw = null;
let timeout = null;

class RecLink {
    constructor(cell, state, category) {
        this.cell = cell;
        this.state = state;
        this.category = category;
        this.next = null;
    }
}

let history = null;

function reset_recording() {
    play_button.disabled = true;
    step_button.disabled = true;
    stop_button.disabled = true;
    playing = false;
    
    history = new SinglyLinkedList()
    history.append(new RecLink(RECORD_RESET, RECORD_RESET, RECORD_RESET));
}

function record(cell, state, category) {
    history.append(new RecLink(cell, state, category));
}

function record_reset() {
    // link in this special node so that we know we have to reset the state
    // of the grid
    history.append(new RecLink(RECORD_RESET, RECORD_RESET, RECORD_RESET));
}

function get_next_interval() {
    // gets the next interval from the slider in ms
    switch (parseInt(playback_speed.value)) {
        case 0:
            return -1; // as fast as possible, blocking
        case 1:
            return 0;  // batches of 10 with 0ms timeout
        case 2:
            return 1;
        case 3:
            return 10;
        case 4: 
            return 100;
        case 5:
            return 1000;
        default:
            alert("oops");
    }
}

function draw_next() {
    // returns true if there is more to draw
    if (!next_to_draw) {
        // done
        playing = false;
        next_to_draw = null;
        return false;
    } else if (next_to_draw.cell == RECORD_RESET) {
        reset_grid(true);
    } else {
        paint_cell(next_to_draw.cell, next_to_draw.state);
    }
    next_to_draw = next_to_draw.next;
    return true;
}

function draw() {
    // draw the next character and set a timeout. If playing == false, abort
    if (playing) {
        let timeout = get_next_interval();
        let count = -1;
        if (timeout == 0) {
            // batch with minimum timeout mode
            count = 1000;
        }
        // if the timeout is zero, draw them as fast as possible since we just
        // want to display the result
        while ((timeout == -1 || timeout == 0) && playing && count != 0) {
            if (!draw_next()) playing = false;
            timeout = get_next_interval();
            --count;
        }

        if (timeout != -1) {
            draw_next();
            timeout = setTimeout(draw, timeout);
        }
    }
}

function play_pause_button() {
    playing = !playing;

    if (playing) {
        if (!next_to_draw) {
            next_to_draw = history.head;
            reset_grid(true);
        }
        // draw the current square
        draw();
    } else {
        playing = false;
    }
}

function stop() {
    playing = false;
    next_to_draw = null;
    reset_grid();
}

function end_recording() {
    play_button.disabled = false;
    step_button.disabled = false;
    stop_button.disabled = false;
    playing = false;
}

// link into these buttons since they can affect playback
document.getElementById("clear-button").addEventListener("click", reset_recording)
document.getElementById("reset-button").addEventListener("click", reset_recording)

// playback buttons
play_button.addEventListener("click", play_pause_button);
step_button.addEventListener("click", draw_next);
stop_button.addEventListener("click", stop);
