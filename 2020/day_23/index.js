
const fs = require('fs');
const { kgv } = require('../utils.js');

const data = fs.readFileSync('./input.txt', 'utf-8')
  .trim()
  .split('')
  .map((s) => Number.parseInt(s))

console.log(data);

/*
The crab picks up the three cups that are immediately clockwise of the current cup. They are removed from the circle; cup spacing is adjusted as necessary to maintain the circle.
The crab selects a destination cup: the cup with a label equal to the current cup's label minus one. If this would select one of the cups that was just picked up, the crab will keep subtracting one until it finds a cup that wasn't just picked up. If at any point in this process the value goes below the lowest value on any cup's label, it wraps around to the highest value on any cup's label instead.
The crab places the cups it just picked up so that they are immediately clockwise of the destination cup. They keep the same order as when they were picked up.
The crab selects a new current cup: the cup which is immediately clockwise of the current cup.

 */
function rot(list) {
  list.push(list.shift());
}

function reset(cups, label) {
  const idx = cups.indexOf(label);
  if (idx > 0) {
    const left = cups.splice(0, idx);
    cups.push(...left);
  }
  rot(cups);
}

function run_old(cups, iter) {
  const max = cups.length + 1;
  let current = 0;
  const LEN = cups.length;
  const LEN3 = cups.length - 3;
  const LEN2 = cups.length - 2;
  for (let r = 0; r < iter; r++) {
    if (r % 1000 === 0) {
      console.log(r);
    }
    let c = cups[current];
    // console.log('cups', cups, current);
    let pick;
    const pickNr = (current + 1) % LEN;
    if (pickNr <= LEN3) {
      pick = cups.splice(pickNr, 3);
    } else if (pickNr === LEN2) {
      pick = cups.splice(pickNr, 2);
      pick.push(cups.shift());
    } else {
      pick = [cups.pop()];
      pick.push(cups.shift());
      pick.push(cups.shift());
    }
    // console.log('pick', pick);
    // console.log('cups', cups);
    let l = c;
    let dest = -1;
    while (dest < 0) {
      l = (l + max - 1) % max;
      dest = cups.indexOf(l);
    }
    // console.log('dest', dest, l);
    dest = (dest + 1) % LEN3;
    cups.splice(dest, 0, ...pick);
    current = (cups.indexOf(c) + 1) % LEN;
  }
  // console.log('cups', cups);
  return cups;
}

function run_old2(cups, iter) {
  const max = cups.length + 1;
  const LEN = cups.length;
  // double the array
  const arr = new Int32Array([...cups, ...cups]);
  for (let r = 0; r < iter; r++) {
    if (r % 1000 === 0) {
      console.log(r);
    }
    // console.log('cups', arr, current);
    const [c, p0, p1, p2] = arr;
    // console.log('pick', p0, p1, p2);
    // console.log('cups', cups);
    let l = c;
    let dest = -1;
    while (dest < 0) {
      l = (l + max - 1) % max;
      if (l !== p0 && l !== p1 && l !== p2) {
        dest = arr.indexOf(l, 4);
      }
    }
    // console.log('dest', dest, 'label', l);
    dest++;
    arr.copyWithin(0, 4, dest);
    let len = dest - 4;
    arr[len++] = p0;
    arr[len++] = p1;
    arr[len++] = p2;
    arr.copyWithin(len, dest, 4 + LEN);
    arr.copyWithin(LEN, 0, LEN);
  }
  // console.log('cups', cups);
  return arr;
}
function dump(c) {
  let p = c;
  do {
    process.stdout.write(`${p.v},`);
    p = p.n;
  } while (p !== c);
  process.stdout.write('\n');
}

function run(cups, iter) {
  const max = cups.length + 1;
  const lot = new Map();
  let cur;
  for (const v of cups) {
    if (!cur) {
      cur = {
        v,
      }
      cur.n = cur;
      cur.p = cur;
      lot.set(v, cur);
    } else {
      const elem = {
        v,
        n: cur,
        p: cur.p,
      }
      lot.set(v, elem);
      cur.p.n = elem;
      cur.p = elem;
    }
  }
  for (let r = 0; r < iter; r++) {
    // if (r % 1000 === 0) {
    //   console.log(r);
    // }
    // dump(cur);
    // detach pick
    const p0 = cur.n;
    const p1 = p0.n;
    const p2 = p1.n;
    cur.n = p2.n;
    p2.n.p = cur;
    // console.log('pick', p0.v, p1.v, p2.v);
    // dump(cur);
    let l = cur.v;
    let dest = null;
    while (!dest) {
      l = (l + max - 1) % max;
      if (l !== p0.v && l !== p1.v && l !== p2.v) {
        dest = lot.get(l);
      }
    }
    // console.log('dest', dest);
    // insert after dest
    dest.n.p = p2;
    p2.n = dest.n;
    dest.n = p0;
    p0.p = dest;
    // dump(cur);
    cur = cur.n;
  }
  // console.log('cups', cups);
  return lot.get(1);
}

function puzzle2() {
  let cups = [...data];
  for (let i = 10; i <= 1000000; i++) {
    cups.push(i);
  }
  cups = run(cups, 10000000);
  const p0 = cups.n;
  const p1 = p0.n;
  return p0.v * p1.v;
}

function puzzle1() {
  const cups = run([...data], 100);
  let ret = '';
  let p = cups.n;
  while (p !== cups) {
    ret += p.v;
    p = p.n;
  }
  return ret;
}



console.log('puzzle 1: ', puzzle1()); // 24987653
console.log('puzzle 2: ', puzzle2()); // 442938711161
