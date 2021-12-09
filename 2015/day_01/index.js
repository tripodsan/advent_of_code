const { Grid } = require('../../utils.js');

const fs = require('fs');
const data = fs.readFileSync('./input.txt', 'utf-8')
  .trim()
  .split('');

// console.log(data);

function puzzle2() {
  let floor = 0;
  let cnt = 1;
  for (const d of data) {
    if (d === '(') {
      floor++;
    } else {
      floor--;
    }
    if (floor < 0) {
      break;
    }
    cnt++;
  }
  return cnt;
}

function puzzle1() {
  let floor = 0;
  for (const d of data) {
    if (d === '(') {
      floor++;
    } else {
      floor--;
    }
  }
  return floor;
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
