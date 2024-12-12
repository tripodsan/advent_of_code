import fs from 'fs';
import chalk from 'chalk-template';
import { Grid } from '../../Grid.js';
import { vec2 } from '../../vec2.js';
import { pairs } from '../../utils.js';

function parse() {
  const grid = new Grid(2).init(fs.readFileSync('./input.txt', 'utf-8'),
    (x, y, c) => c);
  return grid;
}

const DIRS = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

function solve() {
  const grid = parse();
  // grid.dump()
  let score = 0;
  const plots = [];
  for (const v of grid.scan()) {
    const cell = grid.get(v);
    if (cell.visited) {
      continue;
    }
    const plant = cell.c;

    const edges = [
      new Map(), // right
      new Map(), // bottom
      new Map(), // left
      new Map(), // top
    ];
    const plot = {
      plant,
      edges,
      area: 0,
      peri: 0,
    };
    plots.push(plot);

    const addEdge = (dir, v) => {
      const d = v[dir % 2]; //dimension that needs to be the same for an edge
      let verts = edges[dir].get(d);
      if (!verts) {
        verts = [];
        edges[dir].set(d, verts);
      }
      verts.push(v[(dir + 1) % 2]);
    }


    const traverse = (c) => {
      c.visited = true;
      plot.area += 1;
      for (let i = 0; i < 4; i += 1) {
        const v = vec2.add([], c.v, DIRS[i]);
        const n = grid.get(v);
        if (n?.c !== plant) {
          plot.peri += 1;
          addEdge(i, v);
        } else if (!n.visited) {
          traverse(n);
        }
      }
    }
    traverse(cell);
    // console.log(plant, area, peri);
    score += plot.area * plot.peri;
  }
  return {
    score,
    plots,
  };
}

function puzzle1() {
  return solve().score;
}

function puzzle2() {
  const { plots } = solve();
  let score = 0;
  for (const plot of plots) {
    // collapse edges
    let numEdges = 0;
    for (const edges of plot.edges) {
      for (const edge of edges.values()) {
        // sort the vertices
        edge.sort((a, b) => a - b);
        // count the gaps
        let p = edge[0];
        numEdges += 1;
        for (let i = 1; i < edge.length; i++) {
          let n = edge[i];
          if (n !== p + 1) {
            numEdges += 1;
          }
          p = n;
        }
      }
    }
    // console.log(plot.plant, plot.edges, numEdges);
    score += plot.area * numEdges;
  }
  return score;
}

console.log('puzzle 1: ', puzzle1()); // 1473620
console.log('puzzle 2: ', puzzle2()); //  902620
