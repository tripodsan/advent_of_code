import fs from 'fs';
import '../../utils.js';

const data = fs.readFileSync('./input.txt', 'utf-8')
  .trim()
  .split('\n');

const TAPE = {
  children: 3,
  cats: 7,
  samoyeds: 2,
  pomeranians: 3,
  akitas: 0,
  vizslas: 0,
  goldfish: 5,
  trees: 3,
  cars: 2,
  perfumes: 1,
};

const FN = {
  children: (a, b) => a === b,
  cats: (a, b) => a > b,
  samoyeds: (a, b) => a === b,
  pomeranians: (a, b) => a < b,
  akitas: (a, b) => a === b,
  vizslas: (a, b) => a === b,
  goldfish: (a, b) => a < b,
  trees: (a, b) => a > b,
  cars: (a, b) => a === b,
  perfumes: (a, b) => a === b,
};

function parse() {
  const aunts = [];
  for (const line of data) {
    // Sue 1: cars: 9, akitas: 3, goldfish: 0
    const w = line.split(/[: ,]+/);
    const aunt = {
      name: w.splice(0, 2).join(' '),
      props: {},
    }
    while (w.length) {
      const name = w.shift();
      const amount = parseInt(w.shift());
      aunt.props[name] = amount;
    }
    aunts.push(aunt);
  }
  return aunts;
}


function puzzle1() {
  let d = parse();
  // filter out the aunts that have non matching props
  const props = Object.entries(TAPE);
  d = d.filter((a) => {
    for (const [k, v] of props) {
      if (k in a.props && a.props[k] !== v) {
        return false;
      }
    }
    return true;
  });
  if (d.length > 1) {
    throw Error(d);
  }
  return d[0].name;
}

function puzzle2() {
  let d = parse();
  // filter out the aunts that have non matching props
  const props = Object.entries(TAPE);
  d = d.filter((a) => {
    for (const [k, v] of props) {
      if (k in a.props && !FN[k](a.props[k], v)) {
        return false;
      }
    }
    return true;
  });
  if (d.length > 1) {
    throw Error(d);
  }
  return d[0].name;

}

console.log('puzzle 1: ', puzzle1()); // Sue 373
console.log('puzzle 2: ', puzzle2()); // Sue 260
