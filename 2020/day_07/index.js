
const fs = require('fs');

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s)=> s.trim())
  .map((s)=> s.split(''))

data.push([]);

function process(validate) {
  let wasEmpty = true;
  let sum = 0;
  let check = {};
  let numPersons = 0;
  for (let line of data) {
    if (line.length === 0) {
      if (!wasEmpty) {
        const num = validate
          ? Object.entries(check).filter(([k,v]) => (v === numPersons)).length
          : Object.entries(check).length;
        sum += num;
      }
      wasEmpty = true;
    } else {
      if (wasEmpty) {
        check = {};
        numPersons = 0;
        wasEmpty = false;
      }
      line.forEach((q) => {
        check[q] = q in check ? check[q] + 1 : 1;
      });
      numPersons++;
    }
  }
  return sum;
}

function puzzle2() {
  return process(true);
}

function puzzle1() {
  return process();
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
