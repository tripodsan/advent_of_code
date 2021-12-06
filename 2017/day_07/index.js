const fs = require('fs');
// ugml (68) -> gyxo, ebii, jptl
let data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s) => s.trim())
  .filter((s) => !!s)
  .map((s) => s.split(/\W+/).filter((c) => !!c));

function makeTree() {
  const nodes = new Map();
  data.forEach((line) => {
    const [ name, w, ...leaves] = line;
    const ownWeight = parseInt(w);
    const node = {
      name,
      weight: ownWeight,
      ownWeight,
      leaves,
      children: [],
      parent: null,
    }
    nodes.set(name, node);
  });
  for (const node of nodes.values()){
    node.leaves.forEach((name) => {
      const child = nodes.get(name);
      child.parent = node;
      node.children.push(child);
    })
  }
  for (const node of nodes.values()) {
    if (!node.parent) {
      return node;
    }
  }
  return null;
}

function puzzle1() {
  const tree = makeTree();
  return tree.name;
}

function puzzle2() {
  const tree = makeTree();
  let error = 0;
  function calc(node) {
    if (node.children.length) {
      const count = new Map();
      for (const child of node.children) {
        const w = calc(child);
        node.weight += w;
        count.set(w, (count.get(w) ?? 0) + 1);
      }
      if (count.size > 1) {
        let wrong = 0;
        let good = 0;
        for (const [w, c] of count.entries()) {
          if (c === 1) {
            wrong = w;
          } else {
            good = w;
          }
        }
        const delta = good - wrong;
        for (const child of node.children) {
          if (child.weight === wrong) {
            const expected = child.ownWeight + delta;
            console.log(`${child.name} is ${child.ownWeight} but should be ${delta} -> ${expected} (parent is ${child.parent?.name})`);
            if (!error) {
              error = expected;
            }
          }
        }
      }
    }
    return node.weight;
  }

  calc(tree);
  return error;
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
