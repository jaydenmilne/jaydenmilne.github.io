function letr(num) {
    return String.fromCharCode(num + 97);
}

function write_matrix(matrix, old_matrix, tag) {
    results_div = document.getElementById("results");

    div = document.createElement('div');
    title = document.createElement('h4');
    title.innerText = tag;
    div.appendChild(title);

    table = document.createElement('table');

    header = document.createElement('tr');
    blank = document.createElement("th");
    blank.innerText = ' ';
    header.appendChild(blank);
    for (var i = 0; i < matrix.length; ++i) {
        head = document.createElement("th");
        head.innerText = letr(i);
        header.appendChild(head);
    }
    table.appendChild(header);

    for (var i = 0; i < matrix.length; ++i) {
        row = document.createElement('tr');
        lbl = document.createElement('td')
        lbl.innerText = letr(i);
        lbl.className = 'row-header';
        row.appendChild(lbl);

        mtrx_row = matrix[i];
        for (var j = 0; j < mtrx_row.length; ++j) {
            td = document.createElement("td")
            td.innerText = mtrx_row[j];

            if (matrix[i][j] != old_matrix[i][j])
                td.className = 'row-header';

            row.appendChild(td);
        }
        table.appendChild(row);
    }

    div.appendChild(table);
    results_div.appendChild(div);
}
function clear_results() {
    results_div = document.getElementById("results");
    var cNode = results_div.cloneNode(false);
    results_div.parentNode.replaceChild(cNode, results_div);
}
function do_warshall(matrix) {
    clear_results();
    write_matrix(matrix, matrix, "Initial Matrix:")
    var old_matrix = matrix.map(function(arr) {
        return arr.slice();
    });

    // Modified Warshall's that we did in class
    for (var piv = 0; piv < matrix.length; ++piv) {
        for (var rw = 0; rw < matrix.length; ++rw) {
            if (rw == piv)
                continue;
            // If rw ~ piv
            if (matrix[rw][piv] != '0') {
                for (var col = 0; col < matrix.length; ++col) {
                    if (col == piv)
                        continue;
                    if (matrix[piv][col] != '0')
                        matrix[rw][col] = '1';
                }
            }
            }
        write_matrix(matrix, old_matrix, "Pivot = " + letr(piv));
        old_matrix = matrix.map(function(arr) {
            return arr.slice();
        });
        }
    }
    /* "Traditional" Warshall's algorithm
    for (var i = 0; i < matrix.length; ++i) {
        for (var j = 0; j < matrix.length; ++j) {
            for (var k = 0; k < matrix.length; ++k) {
                if (matrix[i][k] != '0' && matrix[k][j] != '0') 
                    matrix[i][j] = '1';
                }
            write_matrix(matrix, "Pivot = " + letr(i));
        }
    }
    */

function oops(text) {
    alert("Oops: " + text);
    throw "crash";
}

function compute_matrix() {
    input = document.getElementById("matrix-input").value;
    input = input.split('\n');

    for (var i = 0; i < input.length; ++i) {
        row = input[i];
        // Should be string with same length as array legnth
        if (row.length != input.length) 
            oops("The array is malformed (a row's length does not match the array's height).");
        input[i] = row.split("");        
    }

    return input;
}

function do_algorithm() {
    matrix = compute_matrix();
        do_warshall(matrix);
}

document.getElementById("calculate-button").addEventListener("click", do_algorithm)