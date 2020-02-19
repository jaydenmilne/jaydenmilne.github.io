"use strict";

class SinglyLinkedList {
    constructor() {
        this.head = null;
        this.end = this.head;
        this.len = 0;
    }

    append(rec_link) {
        if (this.head == null) {
            this.head = rec_link;
            this.end = rec_link;
        } else {
            this.end.next = rec_link;
            this.end = rec_link;
        }

        ++this.len;
    }
}
