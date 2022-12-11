import fs from 'fs';
import { Grid } from '../../utils.js';
import { vec2 } from '../../vec2.js';

const data = fs.readFileSync('./input.txt', 'utf-8')
  .trim()
  .split('\n').map((s) => s.trim());

// console.log(data);

const PFX_START = 'Starting items: ';
const PFX_OPS = 'Operation: new = old ';
const PFX_TEST = 'Test: divisible by ';
const PFX_TRUE = 'If true: throw to monkey ';
const PFX_FALSE = 'If false: throw to monkey ';

function parse(lines) {
  const ret = [];
  let mon;
  for (const line of lines) {
    if (line.startsWith('Monkey ')) {
      mon = {
        count: 0,
      };
      ret.push(mon);
    } else if (line.startsWith(PFX_START)) {
      mon.items = line.substring(PFX_START.length).split(/[, ]+/).map((s) => parseInt(s, 10));
    } else if (line.startsWith(PFX_OPS)) {
      const [ops, n] = line.substring(PFX_OPS.length).split(' ');
      const m = parseInt(n, 10);
      if (n === 'old') {
        mon.ops = (n) => n * n;
      } else if (ops === '*') {
        mon.ops = (n) => n * m;
      } else {
        mon.ops = (n) => n + m;
      }
    } else if (line.startsWith(PFX_TEST)) {
      mon.mod = parseInt(line.substring(PFX_TEST.length));
    } else if (line.startsWith(PFX_TRUE)) {
      mon.next_true = parseInt(line.substring(PFX_TRUE.length));
    } else if (line.startsWith(PFX_FALSE)) {
      mon.next_false = parseInt(line.substring(PFX_FALSE.length));
    }
  }
  // console.log(ret);
  return ret;
}

function calc(worry, rounds) {
  const mons = parse(data);
  const kgv = mons.reduce((p, mon) => p * mon.mod, 1);
  for (let n = 0; n < rounds; n += 1) {
    for (let i = 0; i < mons.length; i += 1) {
      const mon = mons[i];
      const items = mon.items;
      mon.count += items.length;
      mon.items = [];
      for (let item of items) {
        item = mon.ops(item);
        if (worry) {
          item = Math.floor(item / 3);
        }
        item %= kgv;
        if (item % mon.mod === 0) {
          mons[mon.next_true].items.push(item);
        } else {
          mons[mon.next_false].items.push(item);
        }
      }
    }
  }
  const counts = mons.map((mon) => mon.count).sort((c0, c1) => c1 - c0);
  return counts[0] * counts[1];
}

console.log('puzzle 1 : ', calc(true, 20)); // 57838
console.log('puzzle 2 : ', calc(false, 10000)); // 15050382231
