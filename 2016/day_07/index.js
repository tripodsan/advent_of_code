import fs from 'fs';
import '../../utils.js';
import chalk from 'chalk-template';

const data = fs.readFileSync('./input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map((line) => line.trim().split(''));

function puzzle1() {
  let num = 0;
  for (const line of data) {
    let brackets = false;
    let tls = false;
    for (let i = 0; i < line.length - 3; i++) {
      const c0 = line[i];
      if (c0 === '[') {
        brackets = true;
        continue;
      }
      if (c0 === ']') {
        brackets = false;
        continue;
      }
      const c1 = line[i + 1];
      const c2 = line[i + 2];
      const c3 = line[i + 3];
      if (c0 !== c1 && c0 === c3 && c1 === c2) {
        if (brackets) {
          tls = false;
          break;
        }
        tls = true;
      }
    }
    if (tls) {
      num++;
    }
  }
  return num;
}

function puzzle2() {
  let num = 0;
  for (const line of data) {
    const aba = new Map();
    const bab = new Map();
    let brackets = false;
    for (let i = 0; i < line.length - 2; i++) {
      const c0 = line[i];
      if (c0 === '[') {
        brackets = true;
        continue;
      }
      if (c0 === ']') {
        brackets = false;
        continue;
      }
      const c1 = line[i + 1];
      const c2 = line[i + 2];
      if (c0 !== c1 && c0 === c2) {
        const k0 = `${c0}${c1}${c0}`;
        const k1 = `${c1}${c0}${c1}`;
        if (brackets) {
          bab.set(k0, i);
        } else {
          aba.set(k0, {
            rev: k1,
            idx: i,
          });
        }
      }
    }
    for (const [k0, v] of aba.entries()) {
      if (bab.has(v.rev)) {
        // const str = line.join('');
        // const idx0 = v.idx;
        // const idx1 = bab.get(v.rev);
        // if (idx0 < idx1) {
        //   console.log(chalk`${str.substring(0, idx0)}{yellow ${k0}}${str.substring(idx0 + 3, idx1)}{red ${v.rev}}${str.substring(idx1+3)}`);
        // } else {
        //   console.log(chalk`${str.substring(0, idx1)}{red ${v.rev}}${str.substring(idx1 + 3, idx0)}{yellow ${k0}}${str.substring(idx0+3)}`);
        // }
        num++;
        break;
      }
    }
  }
  return num;
}

console.log('puzzle 1: ', puzzle1()); // qoclwvah
console.log('puzzle 2: ', puzzle2()); // ryrgviuv
