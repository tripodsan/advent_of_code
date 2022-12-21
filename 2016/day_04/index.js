import { Grid } from '../../utils.js';
import fs from 'fs';

const data = fs.readFileSync('./input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map((line) => line.trim().split(/[-\[\]]+/));

// console.log(data);

function decrypt() {
  const ret = [];
  for (const line of data) {
    line.pop();
    const check = line.pop();
    const id = parseInt(line.pop(), 10);
    const hist = new Map();
    const decrypted = [];
    for (const word of line) {
      for (const l of word.split('')) {
        const p = hist.get(l) || 0;
        hist.set(l, p + 1);
        decrypted.push((l.charCodeAt(0)-97 + id) % 26 + 97);
      }
      decrypted.push(32);
    }
    const top5 = [...hist.entries()]
      .sort((e0, e1) => {
        const c = e1[1] - e0[1];
        if (c) {
          return c;
        }
        return e0[0].localeCompare(e1[0]);
      })
      .splice(0, 5)
      .map((e) => e[0])
      .join('');
    // console.log(hist, top5, check);
    if (top5 === check) {
      const msg = String.fromCharCode(...decrypted).trim();
      // console.log(msg, id);
      ret.push({
        id,
        msg,
      });
    }
  }
  return ret;
}

const decrypted = decrypt();


function puzzle2() {
  return decrypted.find((e) => e.msg === 'northpole object storage').id;
}

function puzzle1() {
  return decrypted.reduce((sum, { id }) => sum + id, 0);
}

console.log('puzzle 1: ', puzzle1());  // 982
console.log('puzzle 2: ', puzzle2());
