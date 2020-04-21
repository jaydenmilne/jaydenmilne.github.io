"use strict";

class SingleLinkedListNode {
    constructor(next) {
        this.next = next;
    }
}

class SinglyLinkedList {
    constructor() {
        this.head = null;
        this.end = this.head;
        this.len = 0;
    }

    append(node) {
        if (this.head == null) {
            this.head = node;
            this.end = node;
        } else {
            this.end.next = node;
            this.end = node;
        }

        ++this.len;
    }

    pop() {
        if (this.head == null) {
            return null;
        }

        let ret = this.head;
        this.head = this.head.next;
        
        if (this.head == null) {
            // We removed the last link of the node
            this.end = null;
        }

        --this.len;
        return ret;
    }
}

/**
 * Min Heap Implentation, adapted from https://eloquentjavascript.net/1st_edition/appendix2.html
 * 
 * If JavaScript were a real language, I wouldn't need to include this, change my mind
 */
class MinHeap {
    /**
     * 
     * @param {Function} comparator function that takes an object and gives a score 
     * @param {function} identifier given an item in the heap, returns a unique representation
     */
    constructor(comparator, identifier) {
        this.comparator = comparator;
        this.identifier = identifier;
        this.content = [];
    }

    push(element) {
        // Add the new element to the end of the array.
        this.content.push(element);
        // Allow it to bubble up.
        this.bubble_up(this.content.length - 1);
    }

    pop() {
        // Store the first element so we can return it later.
        let result = this.content[0];
        // Get the element at the end of the array.
        let end = this.content.pop();
        // If there are any elements left, put the end element at the
        // start, and let it sink down.
        if (this.content.length > 0) {
            this.content[0] = end;
            this.sink_down(0);
        }
        return result;
    }

    /**
     * Gets the node, if it exists. Else returns null
     * @param {Node} node 
     */
    get(node) {
        let length = this.content.length;
        for (let i = 0; i < length; i++) {
            if (this.identifier(this.content[i]) == this.identifier(node)) return this.content[i];
        }
        return null;
    }

    has(node) {
        let result = this.get(node);
        return result != null;
    }

    remove(node) {
        let length = this.content.length;
        // To remove a value, we must search through the array to find
        // it.
        for (let i = 0; i < length; i++) {
            if (this.identifier(this.content[i]) != this.identifier(node)) continue;
            // When it is found, the process seen in 'pop' is repeated
            // to fill up the hole.
            let end = this.content.pop();
            // If the element we popped was the one we needed to remove,
            // we're done.
            if (i == length - 1) break;
            // Otherwise, we replace the removed element with the popped
            // one, and allow it to float up or sink down as appropriate.
            this.content[i] = end;
            this.bubble_up(i);
            this.sink_down(i);
            break;
        }
    }
    
    get size() {
        return this.content.length;
    }

    bubble_up(n) {
        // Fetch the element that has to be moved.
        let element = this.content[n], score = this.comparator(element);
        // When at 0, an element can not go up any further.
        while (n > 0) {
            // Compute the parent element's index, and fetch it.
            let parent_n = Math.floor((n + 1) / 2) - 1,
            parent = this.content[parent_n];
            // If the parent has a lesser score, things are in order and we
            // are done.
            if (score >= this.comparator(parent))
            break;

            // Otherwise, swap the parent with the current element and
            // continue.
            this.content[parent_n] = element;
            this.content[n] = parent;
            n = parent_n;
        }
    }

    sink_down(n) {
        // Look up the target element and its score.
        let length = this.content.length,
        element = this.content[n],
        elem_score = this.comparator(element);

        while(true) {
            // Compute the indices of the child elements.
            let child2N = (n + 1) * 2, child1N = child2N - 1;
            // This is used to store the new position of the element,
            // if any.
            let swap = null;
            // If the first child exists (is inside the array)...
            let child1Score = 0;
            if (child1N < length) {
                // Look it up and compute its score.
                let child1 = this.content[child1N];
                child1Score = this.comparator(child1);
                // If the score is less than our element's, we need to swap.
                if (child1Score < elem_score)
                swap = child1N;
            }
            // Do the same checks for the other child.
            if (child2N < length) {
                let child2 = this.content[child2N];
                let child2Score = this.comparator(child2);
                if (child2Score < (swap == null ? elem_score : child1Score))
                swap = child2N;
            }

            // No need to swap further, we are done.
            if (swap == null) break;

            // Otherwise, swap and continue.
            this.content[n] = this.content[swap];
            this.content[swap] = element;
            n = swap;
        }
    }
    
}