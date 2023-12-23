import fs from 'fs';
import { Grid } from '../../Grid.js';
import { Heap } from 'heap-js';
import { vec2 } from '../../vec2.js';
import { HSVtoRGB } from '../../utils.js';
import chalk from 'chalk';

const DIRS = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
]
const CHAR_MAP = {
  '>': [DIRS[0]],
  'v': [DIRS[1]],
  '<': [DIRS[2]],
  '^': [DIRS[3]],
  '.': DIRS,
  '#': [],
}

function parse() {
  const grid = new Grid(2).init(fs.readFileSync('./input.txt', 'utf-8'),
    (x, y, c) => ({
      c,
      dirs: CHAR_MAP[c],
    }));
  for (let x = 0; x <= grid.max[0]; x++) {
    if (grid.get([x, 0]).c === '.') {
      grid.start = [x, 0];
    }
    if (grid.get([x, grid.max[1]]).c === '.') {
      grid.end = [x, grid.max[1]];
    }
  }
  return grid;
}

class Graph {
  nodes = new Map();
  edges = [];

  addEdge(n0, n1, weight, dir, data = {}) {
    const e = {
      idx: this.edges.length,
      n0,
      n1,
      dir,
      weight,
      ...data,
    };
    const ep = {
      ...e,
      n0: e.n1,
      n1: e.n0,
    }
    if (dir >= 0) {
      n0.out.push(e);
      n1.in.push(e);
    }
    if (dir <= 0) {
      n0.in.push(ep);
      n1.out.push(ep);
    }
    this.edges.push(e);
    // console.log(`adding edge ${e.idx}: ${n0.id.v} -> ${n1.id.v}: ${weight}`);
    return e;
  }

  addNode(id, data = {}) {
    const n = {
      id,
      out: [],
      in: [],
    };
    this.nodes.set(id, n);
    return n;
  }

  longestPath(start, end) {
    const paths = [];

    // brute force all possible paths
    function visit(n0, edges = [], nodes = [], cost = 0) {
      for (const edge of n0.out) {
        const { n1, weight } = edge;
        if (!nodes.includes(n1)) {
          const next = [...edges, edge];
          const total = cost + weight - 1;
          if (n1 === end) {
            paths.push({
              edges: next,
              cost: total,
            });
          } else {
            visit(n1,next, [...nodes, n1], total);
          }
        }
      }
    }
    visit(start);

    let longest = null;
    let max_cost = 0;
    for (const { edges, cost} of paths) {
      // console.log(edges.map(({idx}) => idx).join(), cost);
      if (cost > max_cost) {
        max_cost = cost;
        longest = edges;
      }
    }
    return longest;
  }
}

function get_graph(grid, startPos, endPos, direction = 1) {
  const g = new Graph();
  const start = g.addNode(grid.get(startPos));
  const end = g.addNode(grid.get(endPos));
  g.start = start;
  g.end = end;
  // edges to build
  const segs = [{
    n0: start, // start node
    c: start.id, // current cell
    p: [start.id], // remember the path for debugging
    prev: null,
  }];
  while (segs.length) {
    const s = segs.shift();
    for (const dir of s.c.dirs) {
      const v = vec2.add([0,0], s.c.v, dir);
      const n = grid.get(v);
      if (n && n.c !== '#' && n !== s.prev) {
        s.prev = s.c;
        s.p.push(n);
        if (s.c.dirs.length === 1) {
          // was on slope, terminate the segment
          let n1 = g.nodes.get(n);
          let newNode = false;
          if (!n1) {
            newNode = true;
            n1 = g.addNode(n);
          }
          const e = g.addEdge(s.n0, n1, s.p.length, direction,{ p: s.p });
          s.edge = e;

          if (newNode) {
            // get next segments
            for (const dp of n.dirs) {
              const vp = vec2.add([0,0], n.v, dp);
              const np = grid.get(vp);
              if (np.dirs.length === 1 && np.dirs[0] === dp) {
                vec2.add(vp, vp, dp);
                const npp = grid.get(vp);
                const ns = {
                  n0: n1,
                  c: npp,
                  p: [n, np, npp],
                  prev: np,
                };
                segs.push(ns);
                np.segment = ns;
                npp.segment = ns;
              }
            }
          }
        } else {
          // continue segment
          s.c = n;
          if (n === end.id) {
            const e = g.addEdge(s.n0, end, s.p.length, direction, { p: s.p });
            s.edge = e;
          } else {
            n.segment = s;
            segs.push(s);
          }
        }
        break; // there is only 1 next path
      }
    }
  }

  // for (const n of g.nodes.values()) {
  //   console.log(`${n.id.v}: out=${n.out.map(({idx}) => idx).join()}, in=${n.out.map(({idx}) => idx).join()}`);
  // }
  //
  // grid.dump(null, (c) => {
  //   if (c.segment) {
  //     const symbols = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  //     let idx = c.segment.edge.idx;
  //     const col = HSVtoRGB(c.segment.edge.idx / g.edges.length,1, 1);
  //     return chalk.rgb(col.r, col.b, col.g)(symbols[idx % 62]);
  //   } else {
  //     return c.c;
  //   }
  // });

  return g;
}

function get_longest_path(g) {
  const edges = g.longestPath(g.start, g.end);
  let path = [];
  for (const edge of edges) {
    path.push(...edge.p);
    path.pop(); // remove last
  }
  return path;
}

function puzzle1() {
  // the path is composed of segments, separated by slopes
  // 1. get all segments and create a directed graph
  // 2. find the longest path within that graph
  const grid = parse();
  const g = get_graph(grid, grid.start, grid.end);
  const path = get_longest_path(g);
  // dump(grid, path);
  return path.length;
}

function puzzle2() {
  const grid = parse();
  const g = get_graph(grid, grid.start, grid.end, 0);
  const path = get_longest_path(g);
  // dump(grid, path);
  return path.length;
}

console.log('puzzle 1:', puzzle1());
console.log('puzzle 2:', puzzle2());

