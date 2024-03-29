import fs from 'fs';
import '../../utils.js';

const TEST = false;

const data = fs.readFileSync(TEST ? './input_test.txt' : './input.txt', 'utf-8')
  .trim()
  .split('\n');

function parse() {
  const d = [];
  for (const line of data) {
    // Sprinkles: capacity 5, durability -1, flavor 0, texture 0, calories 5
    const w = line.split(/[: ,]+/);
    const ingredient = {
      name: w.shift(),
      props: [],
    }
    while (w.length) {
      const name = w.shift();
      const amount = parseInt(w.shift());
      ingredient.props.push(amount);
    }
    d.push(ingredient);
  }
  return d;
}

function *counter(max, digits) {
  if (digits === 2) {
    for (let i = 0; i <= max; i++) {
      yield [i, max - i];
    }
    return;
  }
  for (let i = 0; i <= max; i++) {
    for (const d of counter(max - i, digits - 1)) {
      yield [i, ...d];
    }
  }
}

function solve(limitCalories) {
  const d = parse();
  let best = 0;
  for (const amounts of counter(100, d.length)) {
    const scores = [0, 0, 0, 0, 0];
    for (let j = 0; j < d.length; j++) {
      for (let i = 0; i < 5; i++) {
        scores[i] = scores[i] + d[j].props[i] * amounts[j];
      }
    }
    const cal = scores.pop();
    if (limitCalories && cal !== 500) {
      continue;
    }
    const score = scores.reduce((s, e) => s * Math.max(0, e), 1);
    if (score > best) {
      best = score;
      // console.log(amounts, scores);
    }
  }
  return best;
}

function puzzle1() {
  return solve();
}

function puzzle2() {
  return solve(true);
}

console.log('puzzle 1: ', puzzle1()); // 13882464
console.log('puzzle 2: ', puzzle2()); // 11171160
