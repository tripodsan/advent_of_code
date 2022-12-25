import fs from 'fs';
import '../../utils.js';

const TEST = false;

const data = fs.readFileSync(TEST ? './input_test.txt' : './input.txt', 'utf-8')
  .trim().split('\n');

const RE_BOT = /bot (\d+) gives low to (bot|output) (\d+) and high to (bot|output) (\d+)/
const RE_VAL = /value (\d+) goes to bot (\d+)/

function parse() {
  const bots = new Map();
  for (const line of data) {
    let m = line.match(RE_BOT);
    if (m) {
      const id = m[1];
      const bot = bots.getOrSet(id, { id, v:[] });
      bot.low = m[3];
      bot.low_t = m[2];
      bot.high = m[5];
      bot.high_t = m[4];
      continue;
    }
    m = line.match(RE_VAL);
    if (m) {
      const id = m[2];
      const v = parseInt(m[1]);
      const bot = bots.getOrSet(id, { id, v:[] });
      bot.v.push(v);
      bot.v.sort(((v0, v1) => v0 - v1));
      continue;
    }
    throw Error();
  }
  return bots;
}

function simulate(v0, v1) {
  const bots = parse();
  const outs = new Map();
  // console.log(bots);

  let modified;
  do {
    modified = false;
    for (const bot of bots.values()) {
      if (bot.v.length === 3) {
        throw Error();
      }
      if (bot.v.length !== 2) {
        continue;
      }
      if (bot.v[0] === v0 && bot.v[1] === v1) {
        return bot.id;
      }
      modified = true;
      if (bot.low_t === 'output') {
        outs.getOrSet(bot.low, []).push(bot.v[0]);
      } else {
        bots.get(bot.low).v.push(bot.v[0]);
        bots.get(bot.low).v.sort(((v0, v1) => v0 - v1));
      }
      if (bot.high_t === 'output') {
        outs.getOrSet(bot.high, []).push(bot.v[1]);
      } else {
        bots.get(bot.high).v.push(bot.v[1]);
        bots.get(bot.high).v.sort(((v0, v1) => v0 - v1));
      }
      bot.v = [];
    }
  } while (modified);
  return outs;
}

function puzzle1() {
  if (TEST) {
    return simulate(2, 5);
  } else {
    return simulate(17, 61);
  }
}

function puzzle2() {
  const outs = simulate(-1, -1);
  return outs.get('0')[0] * outs.get('1')[0] * outs.get('2')[0];
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
