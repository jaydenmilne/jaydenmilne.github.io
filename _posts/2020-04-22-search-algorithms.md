---
layout: post
title:  "Search Algorithm Visualizer"
date:   2020-04-22 16:53
categories: algorithms
---

I've been working hard on a new search algorithm visualizer, check it out!

[jayd.ml/algorithms/search](https://jayd.ml/algorithms/search)

Using an HTML5 canvas and async/await, it implements:

- Random Walk 
- Depth First Search 
- Iterative Deepening 
- Breadth First Search 
- Greedy Best First Search 
- Recursive Best First Search 
- A*

Features include: 

- Variable playback speed / pausing / stepping 
- What you draw is saved in the URL so you can reload the page or share the link (Twitter  has a high URL length limit :) ) 
- Different heuristics 
- Variable grid/cell size 
- Kind of works on mobile 
- 8-connected search as well as 4-connected 
- You can update the grid in real-time while the algorithm searches ("adversarial search")

It was tricky working around JavaScript’s single threaded nature, async/await proved to be extremely useful in this project. 

See [About](https://jayd.ml/algorithms/search/about.html) for more info.