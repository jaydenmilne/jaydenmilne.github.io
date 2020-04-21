"use strict";

const play_button = document.getElementById("play-button");
const step_button = document.getElementById("step-button");
const playback_speed = document.getElementById("playback-speed");

const RECORD_RESET = 0;
const RECORD_FRONTIER = 1;
const RECORD_PATH = 2;

// How often, when blocking as little as possible, to wait 1ms to allow the page
// event loop to catch up (not block the browser)
const BREAK_INTERVAL = 100;

let playing = false;
let next_to_draw = null;
let timeout = null;
let seed = Math.random();

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

let dumb_counter = 0;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Function to block the progress of the algorithms the desired amount of time.
 * Used to freeze them in their tracks while we progress.
 */
async function playback_wait() {
    if (playing) {
        let interval = get_next_interval();

        if (interval == -1) {
            ++dumb_counter;
    
            if (dumb_counter < BREAK_INTERVAL) {
                return;
            }
            interval = 1;
            dumb_counter = 0;
        }
        let current_seed = seed;
        await sleep(interval);
        if (seed != current_seed) throw new Error("Murdering this instantiation of search with deliberate error (╯°□°）╯︵ ┻━┻");

        return;
    } else {
        // we need to either wait for the play button to be pressed and resume
        // playing, or we need to wait for the step button
        
        await new Promise( (resolve, reject) => {
            play_button.addEventListener('click', e => {
                if (current_seed == seed) resolve();
            }, {once: true});
            step_button.addEventListener('click', e => {
                if (current_seed == seed) resolve();
            }, {once: true});
        })
    }

}

function reset(node) {
    let clone = node.cloneNode();
    node.parentNode.replaceChild(clone, node);
}

function disable_playback() {
    playing = false;
    step_button.disabled = true;
    play_button.disabled = true;

    // remove event listeners from play/step buttons to prevent and unfulfilled
    // promises from resuming
    seed = Math.random();

    play_button.addEventListener('click', play_pause_button);
}

function enable_playback() {
    playing = true;
    step_button.disabled = false;
    play_button.disabled = false;
}

function play_pause_button() {
    playing = !playing;
}


// link into these buttons since they can affect playback

// playback buttons
play_button.addEventListener("click", play_pause_button);
