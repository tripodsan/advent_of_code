
const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf-8');
const data = input.split('\n').map((s)=>s.trim());

const map = {};

function getPlanet(name) {
  let p = map[name];
  if (!p) {
    p = {
      children: [],
      depth: 0,
    };
    map[name] = p;
  }
  return p;
}

data.forEach((code) => {
  const [pn, qn] = code.split(')');
  const p = getPlanet(pn);
  const q = getPlanet(qn);
  p.children.push(q);
  q.parent = p;
});

function init(p, d) {
  p.depth = d;
  p.children.forEach((c) => {
    init(c, d + 1);
  })
}
init(map.COM, 0);

function count(p) {
  return p.children.reduce((s, c) => (s + count(c)), p.depth);
}

function puzzle2() {
  let o = map.YOU.parent;
  let tx = 0;
  while (o) {
    o.tx = tx++;
    o = o.parent;
  }
  tx = 0;
  o = map.SAN.parent;
  while (!o.tx) {
    tx++;
    o = o.parent;
  }
  console.log('result 2: ', tx + o.tx);
}

function puzzle1() {
  console.log('result 1: ', count(map.COM));
}

puzzle1();
puzzle2();
