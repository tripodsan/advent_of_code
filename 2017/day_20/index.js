const fs = require('fs');

let data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s) => s.trim())
  .filter((s) => !!s)
  .map((s) => s.split(/[^0-9-]+/)
    .map((d) => d.trim())
    .filter((d) => !!d)
    .map((d) => parseInt(d, 10))
  );

// console.log(data);

function init() {
  return data.map(([x, y, z, vx, vy, vz, ax, ay, az], i) => ({
    i,
    p: [x, y, z],
    v: [vx, vy, vz],
    a: [ax, ay, az],
  }))
}

function puzzle1() {
  const parts = init();
  while (true) {
    let best = -1;
    let dist = Number.MAX_SAFE_INTEGER;
    for (const p of parts) {
      const d = Math.abs(p.p[0]) + Math.abs(p.p[1]) + Math.abs(p.p[2]);
      if (d < dist) {
        best = p.i;
        dist = d;
      }
      p.p[0] += p.v[0];
      p.p[1] += p.v[1];
      p.p[2] += p.v[2];
      p.v[0] += p.a[0];
      p.v[1] += p.a[1];
      p.v[2] += p.a[2];
    }
    console.log(best, dist);
  }
}

function puzzle2() {
  const parts = init();
  let i = 0;
  while (true) {
    const ps = new Map();
    const remove = [];
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      p.v[0] += p.a[0];
      p.v[1] += p.a[1];
      p.v[2] += p.a[2];
      p.p[0] += p.v[0];
      p.p[1] += p.v[1];
      p.p[2] += p.v[2];
      const key = `${p.p}`;
      // console.log(i, key);
      if (ps.has(key)) {
        remove.push(ps.get(key))
        remove.push(i);
        ps.set(key, -1);
      } else {
        ps.set(key, i);
      }
    }
    let prev = parts.length;
    for (let i = remove.length - 1; i >= 0; i--) {
      if (remove[i] >= 0) {
        parts.splice(remove[i], 1);
      }
    }
    if (prev !== parts.length) {
      console.log('length', parts.length);
    }
    i++;
  }
}


// console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
