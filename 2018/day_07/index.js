const { PriorityQueue } = require('../../utils.js');

const fs = require('fs');
const A = 'A'.charCodeAt(0) - 1;

// Step C must be finished before step A can begin.

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((c) => c.trim())
  .filter((c) => !!c)
  .map((c, idx) => c.split(/[^A-Z]+/).map((d) => d.trim()).filter((d) => !!d));


console.log(data);

function init() {
  const nodes = new Map();

  const getNode = (name) => {
    let node = nodes.get(name);
    if (!node) {
      node = {
        id: name,
        children: [],
        parents: new Set(),
      }
      nodes.set(name, node);
    }
    return node;
  }

  for (const [_, src, dst] of data) {
    getNode(src).children.push(dst);
    getNode(dst).parents.add(src);
  }
  return nodes;
}

function remove(nodes, id) {
  const node = nodes.get(id);
  nodes.delete(id);
  node.children.forEach((c) => {
    nodes.get(c).parents.delete(id)
  })
}

function puzzle1() {
  const nodes = init();
  console.log(nodes);

  let order = [];
  while (nodes.size) {
    // find the ones w/o root
    const roots = [];
    for (const node of nodes.values()) {
      if (node.parents.size === 0) {
        roots.push(node.id);
      }
    }
    roots.sort();
    console.log(roots);
    if (roots.length === 0) {
      throw Error();
    }
    const root = roots[0];
    order.push(root);
    remove(nodes, root);
  }
  return order.join('');
}

function puzzle2() {
  const nodes = init();

  let time = 0;
  const workers = new PriorityQueue();
  const maxWorkers = 5;
  while (nodes.size || workers.size) {
    if (workers.size) {
      // pass time
      const first = workers.first();
      const prio = workers.getPrio(first);
      time += prio;
      const done = [];
      for (const [item, p] of workers.entries()) {
        const newPrio = p - prio;
        workers.setPrio(item, newPrio);
        if (newPrio === 0) {
          done.push(item);
        }
      }

      // remove done items
      for (const item of done) {
        console.log(time, 'completed', item);
        workers.remove(item);
        remove(nodes, item);
      }
    }

    // find the ones w/o root
    const roots = [];
    for (const node of nodes.values()) {
      if (node.parents.size === 0) {
        roots.push(node.id);
      }
    }
    roots.sort();

    // if workers available that don't process the item
    for (const root of roots) {
      if (workers.size < maxWorkers && !workers.has(root)) {
        const duration = 60 + root.charCodeAt(0) - A;
        console.log(time, 'scheduling', root, duration);
        workers.add(root, duration);
      }
    }
  }

  return time;
}

console.log('puzzle 1:', puzzle1());
console.log('puzzle 2:', puzzle2());


