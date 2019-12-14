const fs = require('fs');
const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n');

function loadMap() {
  const map = {};
  data.forEach((s) => {
    if (!s) {
      return;
    }
    const segs = s.split(new RegExp('[^A-Z0-9]+'));
    let tups = [];
    for (let i = 0; i < segs.length; i += 2) {
      tups.push({
        n: segs[i + 1], // name
        a: +segs[i],    // amount needed
      })
    }
    const output = tups.pop();
    map[output.n] = {
      a: 0,          // amount in inventory
      y: output.a,   // yield per batch
      m: tups,       // materials needed
    };
  });
  return map;
}

function produce(map, prod, min) {
  // num batches
  const n = Math.ceil(min / prod.y);
  if (!prod.m) {
    throw Error('no more ore!');
  }
  prod.m.forEach((mat) => {
    consume(map, mat.n, mat.a * n);
  });
  prod.a += prod.y * n;
}

function consume(map, name, amount) {
  const prod = map[name];
  if (amount > prod.a) {
    produce(map, prod, amount - prod.a);
  }
  prod.a -= amount;
}

function puzzle2() {
  let map = loadMap();
  map['ORE'] = {
    a: 1000000000000,
    y: 1,
  };
  let fuel = 0;
  // 4366186

  let done = false;
  let n = 1000000;
  while (!done) {
    try {
      while (!done) {
        // save amounts
        Object.values(map).forEach((m) => m.sv = m.a);
        consume(map, 'FUEL', n);
        console.log('ore left: ', map.ORE.a);
        fuel += n;
      }
    } catch (e) {
      console.log(e.message);
      if (n === 1) {
        done = true;
      } else {
        // restore amounts
        Object.values(map).forEach((m) => m.a = m.sv);
        n /= 10;
      }
    }
  }
  console.log('result 2: ', fuel);
}

function puzzle1() {
  const map = loadMap();
  map['ORE'] = {
    a: Number.MAX_SAFE_INTEGER,
    y: 1,
  };
  // console.log(JSON.stringify(map, null, 2));
  consume(map, 'FUEL', 1);
  console.log('result 1: ', Number.MAX_SAFE_INTEGER - map.ORE.a);
}

puzzle1();
puzzle2();
