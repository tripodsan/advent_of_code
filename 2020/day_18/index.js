
const fs = require('fs');
// const { kgv } = require('../../utils.js');

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s) => s.trim())
  .filter((s) => !!s)
  .map((s)=> s.split(/(\s+|[()])/g).map((ss) => ss.trim()).filter((ss) => !!ss));

// console.log(data);

const ops = {
  '+': (a, b) => (a + b),
  '*': (a, b) => (a * b),
}

function evaluate(a) {
  let s = 0;
  let op = '+';
  while (a.length) {
    const c = a.shift();
    if (c === ')') {
      break;
    }
    if (c === '+' || c === '*') {
      op = c
    } else {
      let d;
      if (c === '(') {
        d = evaluate(a);
      } else {
        d = Number.parseInt(c);
      }
      s = ops[op](s, d);
    }
  }
  return s;
}

function prod(a) {
  let p = sum(a);
  while (a[0] === '*') {
    a.shift();
    p *= sum(a);
  }
  return p;
}

function sum(a) {
  let d = term(a);
  while (a[0] === '+') {
    a.shift();
    d += term(a);
  }
  return d;
}

function term(a) {
  const c = a.shift();
  if (c === '(') {
    const p = prod(a);
    const d = a.shift();
    if (d !== ')') {
      throw new Error(`syntax error: ) expected. was ${d}`);
    }
    return p;
  } else {
    return Number.parseInt(c);
  }
}


function puzzle2() {
  let s = 0;
  for (const line of data) {
    const a = prod(Array.from(line));
    // console.log(a);
    s += a;
  }
  return s;
}

function puzzle1() {
  let s = 0;
  for (const line of data) {
    const a = evaluate(Array.from(line));
    // console.log(a);
    s += a;
  }
  return s;
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
