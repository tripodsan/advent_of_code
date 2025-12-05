import fs from 'fs';
import chalk from 'chalk-template';

const ranges = [];
const ingredients = [];
fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s)=> s.trim())
  .filter((s) => !!s)
  .forEach((s) => {
    let [l, h] = s.split('-').map((d) => Number.parseInt(d, 10));
    if (!h) {
      ingredients.push(l);
    } else {
      // merge in range
      for (let i = 0; i < ranges.length; i += 1) {
        const r = ranges[i];
        if (h >= r[0] - 1 && l <= r[1] + 1) {
          ranges.splice(i--, 1);
          l = Math.min(l, r[0]);
          h = Math.max(h, r[1]);
        }
      }
      ranges.push([l, h]);
    }
  });

// console.log(ranges);
// console.log(ingredients);

function puzzle1() {
  let count = 0;
  for (const i of ingredients) {
    for (const [l,h] of ranges) {
      if (i >= l && i <= h) {
        count += 1;
        break;
      }
    }
  }
  return count;
}

function puzzle2() {
  return ranges.reduce((acc, r) => acc + r[1] - r[0] + 1, 0);
}

console.log('puzzle 1: ', puzzle1()); // 726
console.log('puzzle 2: ', puzzle2()); // 354226555270043
