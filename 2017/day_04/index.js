const fs = require('fs');
const { permute } = require('../../utils.js');

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s) => s.trim())
  .filter((s) => !!s)
  .map((s) => s.split(/\s+/));

function puzzle2() {
  return data.reduce((sum, words) => {
    const dict = new Set();
    for (const word of words) {
      if (dict.has(word)) {
        return sum;
      }
      permute(word.split(''))
        .forEach((perm) => dict.add(perm.join('')));
    }
    return sum + 1;
  }, 0)
}

function puzzle1() {
  return data.reduce((sum, words) => {
    const dict = new Set();
    for (const word of words) {
      if (dict.has(word)) {
        return sum;
      }
      dict.add(word);
    }
    return sum + 1;
  }, 0)
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
