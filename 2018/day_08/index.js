const { PriorityQueue } = require('../../utils.js');

const fs = require('fs');


/*

A header, which is always exactly two numbers:
The quantity of child nodes.
The quantity of metadata entries.
Zero or more child nodes (as specified in the header).
One or more metadata entries (as specified in the header).

 */

function init() {
  return fs.readFileSync('./input.txt', 'utf-8')
    .trim()
    .split(/\s+/)
    .map((c) => parseInt(c, 10));
}

function read(data) {
  let s = 0;
  let nc = data.shift();
  let nm = data.shift();
  while (nc--) {
    s += read(data);
  }
  while (nm--) {
    s += data.shift();
  }
  return s;
}

function read2(data) {
  let nc = data.shift();
  let nm = data.shift();
  const cn = [];
  for (let i = 0; i < nc; i++) {
    cn.push(read2(data));
  }
  let s = 0;
  if (nc) {
    while (nm--) {
      s += cn[data.shift() - 1] ?? 0;
    }
  } else {
    while (nm--) {
      s += data.shift();
    }
  }
  return s;
}

function puzzle1() {
  return read(init());
}

function puzzle2() {
  return read2(init());
}

console.log('puzzle 1:', puzzle1());
console.log('puzzle 2:', puzzle2());


