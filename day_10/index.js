
const fs = require('fs');

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s)=>s.trim());

const asteroids = [];
data.forEach((line, y) => {
  line.split('').forEach((p, x) => {
    if (p === '#') {
      asteroids.push({x, y,})
    }
  });
});

function ggt(a, b) {
  if (a === b) {
    return a;
  }
  if (a > b) {
    return ggt(a - b, b);
  } else {
    return ggt(b - a, a);
  }
}

function simplify(a, b) {
  try {
    if (a === 0) {
      return [0, Math.sign(b)];
    }
    if (b === 0) {
      return [Math.sign(a), 0];
    }
    const d = ggt(Math.abs(a), Math.abs(b));
    return [a / d, b / d]
  } catch (e) {
    throw Error(`${a}/${b}: ${e}`);
  }
}

function slopeKey(dx, dy) {
  const s = simplify(dx, dy);
  return `${s[0]}/${s[1]}`;
}

function puzzle2(p0) {
  const map = {};
  asteroids.forEach((p1) => {
    if (p0 !== p1) {
      const dx = p1.x - p0.x;
      const dy = p1.y - p0.y;
      const key = slopeKey(dx, dy);
      let i = map[key];
      if (!i) {
        i = {
          a: Math.atan2(-dx, dy) + 2*Math.PI,
          asteroids: [],
        };
        map[key] = i;
      }
      p1.l = dx*dx + dy*dy;
      i.asteroids.push(p1);
    }
  });
  const plan = Object.values(map).sort((p0, p1) => p0.a - p1.a);
  plan.forEach((p) => {
    p.asteroids.sort((a0, a1) => a0.l - a1.l);
    // console.log(p.a, p.asteroids);
  });
  let idx = 1;
  let result = null;
  while (plan.length > 0) {
    const p = plan.shift();
    const a = p.asteroids.shift();
    if (idx === 200) {
      result = a;
    }
    // console.log(`${idx}: ${a.x} ${a.y}`);
    if (p.asteroids.length > 0) {
      plan.push(p);
    }
    idx++;
  }
  console.log('result 2: ', result.x*100 + result.y);
}

function puzzle1() {
  asteroids.forEach((p0) => {
    const keys = {};
    asteroids.forEach((p1) => {
      if (p0 !== p1) {
        const dx = p1.x - p0.x;
        const dy = p1.y - p0.y;
        keys[slopeKey(dx, dy)] = true;
      }
    });
    p0.score = Object.values(keys).length;
  });
  const sorted = Array.from(Object.values(asteroids)).sort((a0, a1) => a1.score - a0.score);
  console.log('result 1: ', sorted[0]);
  return sorted[0];
}

const station = puzzle1();
puzzle2(station);
