require('../../utils.js');
const fs = require('fs');

const A = 'a'.charCodeAt(0);

let data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s) => s.trim())
  .filter((s) => !!s)
  .map((s) =>
    s.split('-')
      .map((c) => c.trim())
      .filter((c) => !!c)
  );

// console.log(data);

function traverse(nodes, node, path, paths, twice) {
  let num = 0;
  path = `${path}${node.id},`;
  for (const name of node.children) {
    if (name === 'end') {
      paths.add(path);
      num++;
    } else {
      const child = nodes.get(name);
      if (child.n < child.max) {
        child.n++;
        num += traverse(nodes, child, path, paths, twice)
        if (!twice && child.max === 1) {
          child.max++;
          num += traverse(nodes, child, path, paths, 1);
          child.max--;
        }
        child.n--;
      }
    }
  }
  return num;
}

function init() {
  const nodes = new Map();
  const getNode = (name) => {
    let node = nodes.get(name);
    if (!node) {
      node = {
        id: name,
        children: [],
        n: 0,
        max: name.charCodeAt(0) >= A ? 1 : Number.MAX_SAFE_INTEGER,
      }
      nodes.set(name, node);
    }
    return node;
  }
  for (let [src, dst] of data) {
    if (src === 'end' || dst === 'start') {
      [dst, src] = [src, dst];
    }
    const node = getNode(src);
    node.children.push(dst);
    if (src !== 'start' && dst !== 'end') {
      getNode(dst).children.push(src);
    }
  }
  return nodes;
}

function puzzle1() {
  const nodes = init();
  // console.log(nodes);
  return traverse(nodes, nodes.get('start'), '', new Set(), 2);
}

function puzzle2() {
  const nodes = init();
  // console.log(nodes);
  const paths = new Set();
  traverse(nodes, nodes.get('start'), '', paths, 0);
  return paths.size;
}


console.log('puzzle 1:', puzzle1()); // 3576
console.log('puzzle 2:', puzzle2()); // 84271
