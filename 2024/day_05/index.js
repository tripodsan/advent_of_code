import fs from 'fs';
import chalk from 'chalk-template';
import { Grid } from '../../Grid.js';
import { vec2 } from '../../vec2.js';

let [rules, updates] =  fs.readFileSync('./input.txt', 'utf-8').trim().split('\n\n');

rules = rules.split('\n').map((pair) => pair.split('|').map((s) => parseInt(s, 10)))
updates = updates.split('\n').map((pages) => pages.split(',').map((s) => parseInt(s, 10)))
console.log(rules, updates);


function valid_update(update) {
  for (const [r0, r1] of rules) {
    const idx0 = update.indexOf(r0);
    if (idx0 < 0) {
      continue;
    }
    const idx1 = update.indexOf(r1);
    if (idx1 < 0) {
      continue;
    }
    if (idx0 >= idx1) {
      return false;
    }
  }
  return true;
}

function puzzle1() {
  let sum = 0;
  for (const update of updates) {
    if (valid_update(update)) {
      console.log(update);
      sum += update[Math.floor(update.length / 2)];
    }
  }
  return sum;
}

function fix(update) {
  let fixed = false;
  while (!fixed) {
    fixed = true;
    for (const [r0, r1] of rules) {
      const idx0 = update.indexOf(r0);
      const idx1 = update.indexOf(r1);
      if (idx0 >= 0 && idx1 >= 0 && idx0 >= idx1) {
        const t = update[idx0];
        update[idx0] = update[idx1];
        update[idx1] = t;
        fixed = false;
      }
    }
  }
}

function puzzle2() {
  let sum = 0;
  for (const update of updates) {
    if (!valid_update(update)) {
      fix(update);
      sum += update[Math.floor(update.length / 2)];
    }
  }
  return sum;
}

console.log('puzzle 1: ', puzzle1()); //5166
console.log('puzzle 2: ', puzzle2());
