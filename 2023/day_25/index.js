import fs from 'fs';
import { Graph } from '../../Graph.js';


function parse() {
  const g = new Graph();
  fs.readFileSync('./input.txt', 'utf-8')
    .trim()
    .split('\n')
    .filter((line) => !!line)
    .forEach((line) => {
      if (!line.trim().startsWith('//') && !line.startsWith('strict')) {
        const nodes = line.split(/[\s}{;-]+/).filter((s) => !!s);
        const id0 = nodes.shift();
        const n0 = g.getOrAddNode(id0);
        for (const id1 of nodes) {
          const n1 = g.getOrAddNode(id1);
          g.addEdge(n0, n1, 1, 0);
        }
      }
    });
  return g;
}

function puzzle1() {
  const g0 = parse();
  const g1 = new Graph();
  // remove connected nodes
  g0.moveConnected(g0.nodes.values().next().value, g1);
  console.log(g0.nodes.size);
  console.log(g1.nodes.size);
  return g0.nodes.size * g1.nodes.size;
}


console.log('puzzle 1:', puzzle1());

