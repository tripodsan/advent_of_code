const fs = require('fs');

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s) => s.trim())
  .filter((s) => !!s)
  .map((s) => s.split(/[^0-9]+/).map((c) => parseInt(c.trim())));

// console.log(data);

const progs = new Array(data.length);
for (let i = 0; i < progs.length; i++) {
  progs[i] = [i];
}

const addPipe = (src, dst) => {
  if (progs[src].indexOf(dst) < 0) {
    progs[src].push(dst);
  }
}

data.forEach(([p, ...pipes]) => {
  pipes.forEach((q) => {
    addPipe(p, q);
    addPipe(q, p);
  });
});

function traverse(graph, p, group = []) {
  if (!graph[p]) {
    graph[p] = 1;
    group.push(p);
    for (const q of progs[p]) {
      traverse(graph, q, group);
    }
  }
  return group;
}

function puzzle1() {
  let zero = 0;
  for (let p = 0; p < progs.length; p++) {
    const g = new Array(progs.length).fill(0);
    traverse(g, p);
    zero += g[0];
  }
  return zero;
}

function puzzle2() {
  const g = new Array(progs.length).fill(0);
  let groups = 0;
  for (let p = 0; p < progs.length; p++) {
    const group = traverse(g, p);
    if (group.length) {
      groups++;
    }
  }
  return groups;
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
