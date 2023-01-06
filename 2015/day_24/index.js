import fs from 'fs';
import '../../utils.js';

const TEST = false;

const data = fs.readFileSync(TEST ? './input_test.txt' : './input.txt', 'utf-8')
  .trim().split('\n').map((d) => parseInt(d, 10));

const SUM = data.sum();

// console.log(SUM, SUM / 3);

function fill(amount, packages, used, qe, result) {
  const cs = [...packages];
  const c = cs.pop();
  const d = amount - c;
  if (d === 0) {
    result.push({ list: [...used, c], qe: qe * c });
  }
  if (cs.length) {
    fill(amount, cs, used, qe, result);
    if (d > 0) {
      fill(d, cs, [...used, c], qe * c, result);
    }
  }
  return result;
}

function find(amount, packages) {
  const cs = [...packages];
  const c = cs.pop();
  const d = amount - c;
  if (d === 0) {
    return true;
  }
  if (cs.length) {
    if (find(amount, cs)) {
      return true;
    }
    if (d > 0) {
      if (find(d, cs)) {
        return true;
      }
    }
  }
  return false;
}


function puzzle1() {
  // fill passenger compartment first
  const c0 = fill(SUM / 3, data, [], 1, []);
  c0.sort((c0, c1) => {
    const c = c0.list.length - c1.list.length;
    if (c) {
      return c;
    }
    return c0.qe - c1.qe;
  })
  if (TEST) {
    console.log(c0);
  }

  // for all the configs, check if the rest can be distributed to the sides
  for (const { list, qe } of c0) {
    if (find(SUM / 3, list)) {
      return qe;
    }
  }
}

function puzzle2() {
  // fill passenger compartment first
  const c0 = fill(SUM / 4, data, [], 1, []);
  c0.sort((c0, c1) => {
    const c = c0.list.length - c1.list.length;
    if (c) {
      return c;
    }
    return c0.qe - c1.qe;
  })
  if (TEST) {
    console.log(c0);
  }

  // for all the configs, check if the rest can be distributed to the sides and the trunk
  for (const { list, qe } of c0) {
    const c1 = fill(SUM / 4, list, [], 1, []);
    for (const { list: trunk } of c1) {
      if (find(SUM / 4, trunk)) {
        return qe;
      }
    }
  }

}

console.log('puzzle 1: ', puzzle1()); // 11266889531
console.log('puzzle 2: ', puzzle2()); // 77387711
