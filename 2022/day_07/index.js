import fs from 'fs';
import * as utils from '../../utils.js';

const data = fs.readFileSync('./input.txt', 'utf-8')
  .trim()
  .split('\n');


function parse(data) {
  const root = {
    children: {},
    size: 0,
  };
  let cwd = root;
  for (const line of data) {
    if (line.startsWith('$ cd ')) {
      const dir = line.split(/\s+/).pop();
      if (dir === '/') {
        cwd = root;
      } else if (dir === '..') {
        cwd = cwd.parent;
      } else {
        cwd = cwd.children[dir];
      }
    } else if (line === '$ ls') {
      // ....
    } else if (line.startsWith('dir ')) {
      const dir = line.split(/\s+/).pop();
      cwd.children[dir] = {
        size: 0,
        children: {},
        parent: cwd,
      };
    } else {
      const [size, name] = line.split(/\s+/);
      cwd.children[name] = parseInt(size, 10);
    }
  }
  return root;
}

function sum(dir, result = []) {
  let size = 0;
  for (const e of Object.values(dir.children)) {
    if (typeof e === 'object') {
      size += sum(e, result);
    } else {
      size += e;
    }
  }
  dir.size = size;
  result.push(dir.size);
  return size;
}

function puzzle1() {
  const tree = parse(data);
  const results = [];
  sum(tree, results);
  return results.filter((d) => d < 100000).reduce(((size, v) => v + size), 0);
}

function puzzle2() {
  const tree = parse(data);
  const results = [];
  sum(tree, results);
  results.sort((a0, a1) => a0 - a1);
  const total = tree.size;
  const max = 70000000;
  let free = max - total;
  const needed = 30000000 - free;
  // console.log(max, total, free, needed);
  for (const dir of results) {
    if (dir > needed) {
      return dir;
    }
  }
}


console.log('puzzle 1 : ', puzzle1());
console.log('puzzle 2 : ', puzzle2());
