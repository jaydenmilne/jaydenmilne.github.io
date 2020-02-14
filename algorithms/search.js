function dfs(graph) {

}

function Node(node, parent) {
    return {node:node, parent:parent};
}

function frontier_contains_node(frontier, node) {
    frontier.forEach( item => {
        if (item.node == node) return true;
    })
    return false;
}

function bfs(graph, start, goal) {
    if (start == goal) return {node: start};

    expanded = new Array();
    
    frontier = new Array();
    frontier.unshift(Node(start, null));

    explored = new Set();

    while (true) {
        if (frontier.length == 0) alert("Your graph cannot be solved!");
        node = frontier.pop()
        explored.add(node.node);

        if ()
        graph[node.node].forEach( edge, weight => {
            if (!frontier_contains_node(frontier, edge) && !(edge in explored)) {

            }
        })
    }
}

function add_element(edges, a, b, weight) {
    if (a in edges) {
        edges[a][b] = weight;
    } else {
        edges[a] = new Map();
        edges[a][b] = weight;
    }
}

function parse_input() {
    let input = document.getElementById("edges-input").value;
    input = input.split(';');  // tuples are seperated by ;
    let undirected = document.getElementById("edges-input").value;

    edges = new Map();

    input.forEach( tuple => {
        tuple = tuple.replace(/[\(\)\ \n]/g, '');  // strip out spaces and parens
        tuple = tuple.split(',');  // tuple contents split by ,

        weight = (tuple.length == 2) ? 1 : parseFloat(tuple[2])
        add_element(edges, tuple[0], tuple[1], weight);

        if (undirected) add_element(edges, tuple[1], tuple[0], weight);

    })

    let graph = {
        edges: edges,
        heur: 42
    }

    return graph;
}


/* ----------- ACTUAL SEARCH RELATED CODE ----------- */


function clear_results() {
    results_div = document.getElementById("results");
    var cNode = results_div.cloneNode(false);
    results_div.parentNode.replaceChild(cNode, results_div);
}

function do_search() {
    clear_results();
    graph = parse_input();
}


document.getElementById("calculate-button").addEventListener("click", do_search)
heuristic_div = document.getElementById("heuristic")

rads = document.forms.search.algorithm

// register on change handlers for radio buttons
for (let i = 0; i < rads.length; ++i) {
    rads[i].addEventListener('change', change => {
        if (change.target.id == 'greedy_radio' || change.target.id == 'astar_radio' ) {
            heuristic_div.style["display"] = "block";
        } else {
            heuristic_div.style["display"] = "none";            
        }
    })
}